# Fakebook — CLAUDE.md (root)

Facebook-clone, NestJS microservices monorepo + Next.js client. One folder per service, **no root tooling** (no root `package.json`, no compose). Each service is started independently with its own `npm run start:dev`. Backing infra (Neo4j, MongoDB, Redis, Kafka) is **external** — provisioned via Docker or cloud per-environment, never by this repo. Per-service detail lives in each folder's `CLAUDE.md`.

This file documents the two cross-service flows. Each hop names the service, transport, and port so it stands alone.

## Components (as referenced below)
- **client** — Next.js, browser. Socket.IO client → `localhost:4000/notification`.
- **api-gateway** — HTTP `:3000`, prefix `/api`. The only HTTP entry point.
- **user-service** — gRPC server (`localhost:5000`), Neo4j. Source of truth for users + friend graph.
- **image-service** — Kafka consumer, Cloudinary.
- **notification-service** — Kafka consumer, MongoDB.
- **ws-service** — TCP microservice `:3002` (inbound events) + Socket.IO `:4000` (push to browser). HTTP `:3001` is unused for routes.

---

## Flow 1 — Friend request → notification → real-time push

1. **client** → `POST /api/user/send-friend-request/:id` (body `{ friendId }`, JWT cookie). → **api-gateway** (`JwtGuard`).
2. **api-gateway** → gRPC `SendFriendRequest({ senderId, receiverId })` → **user-service**.
3. **user-service** → Neo4j: create `SENT_FRIEND_REQUEST` relationship. Then emits **Kafka** topic `create-notification` with `FriendRequestEvent { sender, receiver, type: 'FRIEND_REQUEST' }`.
4. **notification-service** `@EventPattern('create-notification')` (Kafka, group `notification-consumer`) → resolves sender name/avatar from its **local Mongo user replica** → saves a `Notification` doc → emits **TCP** event `create-notification` with `NotificationEvent { sender, receiver, senderName, senderAvatar, type, content, createdAt }` → **ws-service** (`:3002`).
5. **ws-service** `@EventPattern('create-notification')` → `socket.to(receiver).emit('new-notification', payload)` on Socket.IO `:4000` namespace `notification`.
6. **client** (joined room = its own `userId` via the `join` message) receives `new-notification`.

> Accept is the same path: gateway `accept-friend-request` → gRPC `AcceptFriendRequest` → user-service sets `acceptedTime` on the relationship and emits `create-notification` with `FriendAcceptEvent { type: 'FRIEND_ACCEPT' }`. Decline removes the relationship and emits nothing.

---

## Flow 2 — Image upload → Cloudinary → writeback → real-time push

1. **client** → `POST /api/user/image/:id` (multipart field `image`, JWT cookie). → **api-gateway**.
2. **api-gateway** → buffer to base64 → **Kafka** producer → topic `image-upload` with `{ file, userId, type }` (`type` = `avatar` | `cover`; GZIP, `acks: 1`).
3. **image-service** Kafka consumer (group `image-upload-group`, topic `image-upload`; topic auto-created with 3 partitions / RF 2 if missing) → uploads buffer to **Cloudinary** → strips `CLOUDINARY_HOST` prefix from the secure URL → gRPC `UpdateUserImage({ userId, updateUserImageDto: { url, type } })` → **user-service**.
4. **user-service** → Neo4j `SET u.<type> = url` → emits **TCP** event `image-ready` `{ userId, imageUrl, type }` → **ws-service** (`:3002`). (If `type === 'avatar'` it *also* emits a Kafka `update_user` event — see gotcha.)
5. **ws-service** `@EventPattern('image-ready')` → `socket.to(userId).emit('image-ready', { imageUrl, type })`.
6. **client** receives `image-ready`.

> **image-service never emits `image-ready`.** It only uploads and writes back via gRPC; `image-ready` originates from user-service.

---

## Cross-cutting gotchas
- **Avatar-update event name mismatch:** user-service emits Kafka topic `update_user` (underscore) on avatar change, but notification-service consumes `update-user` (hyphen). Avatar changes therefore **never** update notification-service's user replica. Friend-request notifications then show a stale avatar.
- **CORS vs dev port:** api-gateway allows CORS origin `http://localhost` (port 80), but the client in dev runs on `next dev` (`:3000`). Browser → gateway calls are blocked until a reverse proxy fronts the client on `:80`.
- **Kafka brokers** are read from `KAFKA_BROKER_1` / `KAFKA_BROKER_2` (user/image services) but hardcoded `localhost:9092` / `localhost:9093` in api-gateway and the microservice bootstraps. Keep both in sync.

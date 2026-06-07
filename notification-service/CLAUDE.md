# notification-service — CLAUDE.md

**Purpose:** Persists notifications in MongoDB and relays them to ws-service for real-time push. Maintains a **local read-replica of users** (CQRS) so it can enrich notifications without calling user-service synchronously — which is why it has no gRPC dependency.

## Runtime
- Transport: Kafka consumer microservice (brokers `localhost:9092`/`localhost:9093`), group `notification-consumer`.
- Start: `npm run start:dev`.

## Data store
- **MongoDB** (Mongoose, `MONGODB_URI`).
- `Notification` doc: `{ sender, receiver, type, content }` (+ timestamps).
- `User` replica doc: `{ userId (unique), fullName, avatar }` — fed by Kafka events, used to resolve sender name/avatar.

## Env vars (required)
- `MONGODB_URI`.
- `WS_SERVICE_HOST`, `WS_SERVICE_PORT` — TCP target for ws-service (`:3002`).

## Inbound contracts
Kafka events:
- `@EventPattern('create-notification')` `{ sender, receiver, type }` → builds content, saves doc, relays to ws.
- `@EventPattern('create-user')` `{ userId, fullName, avatar }` → inserts user replica.
- `@EventPattern('update-user')` `{ userId, fullName?, avatar? }` → updates user replica.

Request/response:
- `@MessagePattern('get-notifications')` `{ receiver, limit, skip }` → paginated list.

## Outbound calls
- **TCP** (`WS_SERVICE`) → ws-service: emits `create-notification` with `NotificationEvent { sender, receiver, senderName, senderAvatar, type, content, createdAt }`.

`getContent(type)` maps `FRIEND_REQUEST` → "has sent you friend request.", `FRIEND_ACCEPT` → "has accepted your friend request."

## Key files
- `src/notification/notification.controller.ts` — Kafka `create-notification` + `get-notifications` handlers.
- `src/notification/notification.service.ts` — persist + enrich + relay to ws.
- `src/notification/notification.schema.ts` — Mongoose `Notification`.
- `src/notification/notification.event.ts` — `NotificationEvent` (TCP payload to ws).
- `src/user/user.controller.ts` — `create-user` / `update-user` consumers.
- `src/user/user.service.ts` — `findByIds`, `createUser`, `updateUser` on the replica.
- `src/user/user.schema.ts` — Mongoose `User` replica.

## Gotchas
- The user data here is a **replica**, eventually consistent via Kafka — never the source of truth (that's user-service / Neo4j).
- Avatar updates **do not** propagate: user-service emits `update_user` (underscore) on avatar change but this service listens for `update-user` (hyphen). Replica avatars go stale after the first set.
- `create-notification` is reused as both the inbound Kafka event (from user-service) and the outbound TCP event (to ws-service) — same name, different transports.
- If a sender isn't yet in the replica (event ordering), enrichment fails — `create` returns a "User not found" failure.

# user-service — CLAUDE.md

**Purpose:** Source of truth for users and the friend graph. gRPC server backed by Neo4j; publishes domain events to notification-service (Kafka) and ws-service (TCP).

## Runtime
- Transport: gRPC microservice server, package `user`, proto `proto/user.proto`.
- Port: NestJS gRPC default (`localhost:5000`).
- Start: `npm run start:dev`.

## Data store
- **Neo4j** (`neo4j-driver`).
- `USER` node: `{ id (uuid), username, password (argon2 hash), fullName, gender, avatar, cover, createdDate, updatedDate }`.
- `SENT_FRIEND_REQUEST` relationship `(sender)-[:SENT_FRIEND_REQUEST { acceptedTime }]->(receiver)`. `acceptedTime` null = pending, set = friends.

## Env vars (required)
- `NEO4J_HOST`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
- `DEFAULT_AVATAR_URL`, `DEFAULT_COVER_URL` — defaults on user creation.
- `WS_SERVICE_HOST`, `WS_SERVICE_PORT` — TCP target for ws-service (`:3002`).
- `KAFKA_BROKER_1`, `KAFKA_BROKER_2` — notification-service Kafka brokers.

## Inbound contracts (gRPC `UserService`, all implemented)
- `CreateUser(CreateUserDto)` — hashes password (argon2), emits `create-user`.
- `Login(LoginDto)` — verifies password.
- `FindAllUsers(Empty)` / `FindOneUser({ id })`.
- `UpdateUser({ userId, updateUserDto })` — emits `update-user` when `fullName` changes.
- `UpdateUserImage({ userId, { url, type } })` — sets `avatar`/`cover`; emits `image-ready` (+ avatar event).
- `GetFriendSuggestions({ userId })`.
- `SendFriendRequest`, `AcceptFriendRequest`, `DeclineFriendRequest` (`{ senderId, receiverId }`).

## Outbound calls
- **Kafka** (`NOTIFICATION_SERVICE`) → notification-service:
  - `create-user` `{ userId, fullName, avatar }` (on create).
  - `update-user` `{ userId, fullName, avatar }` (on profile name update).
  - `create-notification` — `FriendRequestEvent` / `FriendAcceptEvent` `{ sender, receiver, type }`.
- **TCP** (`WS_SERVICE`) → ws-service:
  - `image-ready` `{ userId, imageUrl, type }` (on image update).

## Key files
- `src/user/user.controller.ts` — gRPC handlers (`@UserServiceControllerMethods()`), one per RPC.
- `src/user/user.service.ts` — all Cypher queries + event emits.
- `src/user/user.module.ts` — registers `WS_SERVICE` (TCP) and `NOTIFICATION_SERVICE` (Kafka) clients.
- `src/user/notification.event.ts` — `CreateUserEvent`, `UpdateUserEvent`, `FriendRequestEvent`, `FriendAcceptEvent`.
- `src/user/response.format.ts` — `formattedResponse(status, message?, data?)` envelope used by every method.
- `proto/user.proto` — contract; `npm run proto:gen` to regenerate.

## Gotchas
- **Avatar event-name bug:** `updateImage` emits Kafka `update_user` (underscore) when `type === 'avatar'`, but notification-service listens for `update-user` (hyphen). Avatar changes never reach the notification user replica.
- Friend-request notifications flow via **Kafka** to notification-service (which then relays to ws over TCP) — user-service does *not* push notifications to ws directly. Only `image-ready` goes straight to ws over TCP.
- `password` is stored on the node and returned by raw `MATCH` queries; `create` deletes it before returning, but other read paths may not — don't leak it.

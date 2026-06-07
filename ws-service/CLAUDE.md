# ws-service — CLAUDE.md

**Purpose:** Real-time fan-out to browsers. Receives domain events from user-service and notification-service over TCP, then pushes them to the right client via Socket.IO rooms.

## Runtime
- Transport: hybrid NestJS app:
  - **TCP microservice** on `localhost:3002` — receives inbound events (`@EventPattern`).
  - **Socket.IO** WebSocket gateway on `:4000`, namespace `notification`, CORS origin `http://localhost`.
  - HTTP app listens on `:3001` (no routes — incidental).
- Start: `npm run start:dev`.

## Data store
- None. Stateless; room membership lives in Socket.IO memory.

## Env vars (required)
- None. All ports/hosts hardcoded.

## Inbound contracts
TCP events (`@EventPattern`):
- `image-ready` `{ userId, imageUrl, type }` → push to room `userId`.
- `create-notification` `NotificationEvent { sender, receiver, senderName, senderAvatar, type, content, createdAt }` → push to room `receiver`.

Socket.IO (from browser):
- `@SubscribeMessage('join')` — payload `userId`; joins the socket to room `userId`. **Clients must emit `join` before they can receive anything.**

## Outbound (Socket.IO emits to client)
- `image-ready` → `{ imageUrl, type }` to room `userId`.
- `new-notification` → full notification payload to room `receiver`.

## Key files
- `src/main.ts` — boots HTTP (`:3001`) + TCP microservice (`:3002`).
- `src/notification/notification.controller.ts` — TCP `@EventPattern` handlers.
- `src/notification/notification.gateway.ts` — `@WebSocketGateway(4000)`, `join` handler, room emits.
- `src/notification/notification.interface.ts` — `INotification`, `IUserImage`.

## Gotchas
- Two distinct planes: **TCP `:3002`** is how other services reach it (that's the `WS_SERVICE_PORT` they configure); **`:4000`** is the browser-facing Socket.IO port. `:3001` HTTP is effectively unused.
- Rooms are keyed by `userId`. A client that never sends `join` silently receives no events.
- Socket.IO CORS allows only `http://localhost` — a browser on another origin (e.g. `:3000`) won't connect.

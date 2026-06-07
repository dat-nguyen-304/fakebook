# api-gateway — CLAUDE.md

**Purpose:** The only HTTP entry point. Authenticates requests (JWT in cookies, sessions in Redis), then fans out to backend services over gRPC and Kafka.

## Runtime
- Transport: HTTP server (NestJS), global prefix `/api`.
- Port: `3000`.
- CORS: origin `http://localhost` (port 80), `credentials: true`. Body limit 10mb.
- Start: `npm run start:dev`.

## Data store
- None directly. Redis (`localhost:6379`, hardcoded) holds refresh-token sessions.

## Env vars (required)
- `JWT_SECRET` — access-token signing.
- `JWT_REFRESH_SECRET` — refresh-token signing.
- (Redis host/port and the gRPC target are hardcoded `localhost`; Kafka brokers hardcoded `localhost:9092`/`localhost:9093`.)

## Inbound contracts (HTTP routes)
Auth (`/api/auth`, public):
- `POST /signup` — register.
- `POST /signin` — login, sets token cookies.
- `POST /refresh` — rotate tokens.
- `POST /logout` — clear session.

User (`/api/user`, all behind `JwtGuard`):
- `GET /` — all users.
- `GET /me` — current user (from JWT).
- `PATCH /:id` — update profile fields.
- `POST /image/:id` — multipart field `image`, body `type` (`avatar`|`cover`). Async upload.
- `GET /friend-suggestions/:id`.
- `POST /send-friend-request/:id` — body `{ friendId }`.
- `POST /accept-friend-request/:id` — body `{ friendId }`.
- `POST /decline-friend-request/:id` — body `{ friendId }`.

## Outbound calls
- gRPC → **user-service** (`user` package, all `UserService` RPCs). Auth uses `CreateUser`/`Login`; user routes use the rest.
- Kafka producer → topic `image-upload` (`{ file, userId, type }`, base64, GZIP) consumed by **image-service**.

## Key files
- `src/main.ts` — bootstrap, CORS, cookie-parser, global interceptor/filter.
- `src/auth/auth.controller.ts` / `auth.service.ts` — signup/signin/refresh/logout.
- `src/auth/token.service.ts` — JWT sign/verify (reads `JWT_SECRET`, `JWT_REFRESH_SECRET`).
- `src/auth/redis.service.ts` — session store (`localhost:6379`).
- `src/auth/strategy/`, `src/auth/guard/` — Passport JWT strategy + `JwtGuard`.
- `src/user/user.service.ts` — gRPC client wrapper to user-service.
- `src/user/kafka.service.ts` — Kafka producer (`sendImageUploadMessage`).
- `src/handlers/` — `response.interceptor.ts` (uniform envelope), `http-exception.filter.ts`.
- `src/decorators/` — `@GetUser()` extracts the JWT payload.
- `proto/user.proto` — gRPC contract; regenerate types with `npm run proto:gen`.

## Gotchas
- CORS origin is port 80, not the `next dev` `:3000` — calls from plain dev are blocked until a proxy fronts the client.
- gRPC target for user-service is the NestJS default (`localhost:5000`), not configurable here.
- Image upload returns immediately; the actual avatar/cover change arrives later via the WebSocket `image-ready` event (see root flow 2).

# image-service — CLAUDE.md

**Purpose:** Consumes image-upload jobs from Kafka, uploads to Cloudinary, and writes the resulting URL back to user-service over gRPC. Headless — no HTTP, no inbound RPC.

## Runtime
- Transport: Kafka consumer microservice (bootstrap brokers `localhost:9092`/`localhost:9093`).
- Consumer: group `image-upload-group`, topic `image-upload`.
- Start: `npm run start:dev`.

## Data store
- None. Stateless. External media store is **Cloudinary**.

## Env vars (required)
- `KAFKA_BROKER_1`, `KAFKA_BROKER_2` — used by `KafkaService` (admin + consumer).
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary auth.
- `CLOUDINARY_HOST` — prefix stripped from the returned secure URL so only the path is stored.

## Inbound contracts (Kafka)
- Topic `image-upload`, message `{ file (base64), userId, type }` (`type` = `avatar` | `cover`).
- On startup, `KafkaAdminService` creates `image-upload` if missing (3 partitions, replication factor 2).

## Outbound calls
- gRPC → **user-service** `UpdateUserImage({ userId, updateUserImageDto: { url, type } })`.

Per message: base64 → Buffer → Cloudinary upload → strip `CLOUDINARY_HOST` from `secure_url` → gRPC writeback.

## Key files
- `src/main.ts` — Kafka microservice bootstrap.
- `src/kafka/kafka.service.ts` — consumer (`image-upload`) + the `eachMessage` handler (upload + writeback); also a producer (`sendMessage`).
- `src/kafka/kafka-admin.service.ts` — topic existence check / creation.
- `src/cloudinary/cloudinary.service.ts` — Cloudinary config + `uploadImage`.
- `src/image/image.service.ts` — gRPC client to user-service (`updateUserImage`).
- `proto/user.proto` — only `UpdateUserImage` is used; `npm run proto:gen` to regenerate.

## Gotchas
- This service does **not** emit `image-ready`. After the gRPC writeback, **user-service** emits `image-ready` to ws-service. Don't look here for the WebSocket push.
- Errors in `eachMessage` are caught and logged only — a failed upload is silently dropped (no retry, no dead-letter).
- Bootstrap brokers in `main.ts` are hardcoded `localhost:9092/9093`, while `KafkaService` reads `KAFKA_BROKER_1/2` from env — keep them consistent.

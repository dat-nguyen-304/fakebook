# Fakebook

A Facebook-inspired social network built as a microservices learning project, targeting a best-practice Kubernetes deployment. Built with NestJS (backend services) and Next.js (frontend).

## Architecture

```
Browser
  │  HTTP (cookie auth)          Socket.IO :4000/notification
  ▼                              ▲
api-gateway :3000 ──gRPC──► user-service :5000 ──TCP──► ws-service :3002/:4000
  │                │               │
  │ Kafka          │ Kafka          │ TCP
  ▼                ▼               │
image-service  notification-service ◄─────────────────────────┘
```

### Services

| Service | Purpose | Port | Stack |
|---|---|---|---|
| **client** | Next.js web frontend | 80 (dev) | Next.js 14, React Query, Zustand, Socket.IO client |
| **api-gateway** | Only HTTP entry point. Auth (JWT + Redis sessions), routes to backend services | 3000 | NestJS, Passport JWT, Redis |
| **user-service** | Source of truth for users and friend graph | 5000 (gRPC) | NestJS, Neo4j, gRPC server |
| **image-service** | Consumes image upload jobs, uploads to Cloudinary, writes URL back | — (Kafka consumer) | NestJS, Kafka, Cloudinary |
| **notification-service** | Persists notifications, maintains user read-replica, relays to ws-service | — (Kafka consumer) | NestJS, Kafka, MongoDB |
| **ws-service** | Real-time push to browsers via Socket.IO | 3001 (HTTP), 3002 (TCP), 4000 (WS) | NestJS, Socket.IO |

### Key flows

**Friend request → notification → real-time push:**
`client → POST /api/user/send-friend-request → api-gateway → gRPC → user-service → Kafka (create-notification) → notification-service → TCP → ws-service → Socket.IO → client`

**Image upload → Cloudinary → real-time push:**
`client → POST /api/user/image/:id → api-gateway → Kafka (image-upload) → image-service → Cloudinary → gRPC (UpdateUserImage) → user-service → TCP (image-ready) → ws-service → Socket.IO → client`

---

## Prerequisites

- Node.js 18+
- Neo4j
- MongoDB
- Redis
- Kafka (two brokers: `localhost:9092`, `localhost:9093`)
- Cloudinary account

Each service is started independently — there is no root `package.json` or Docker Compose.

---

## Environment variables

### api-gateway

```env
JWT_SECRET=
JWT_REFRESH_SECRET=
```

### user-service

```env
NEO4J_HOST=
NEO4J_USERNAME=
NEO4J_PASSWORD=
DEFAULT_AVATAR_URL=
DEFAULT_COVER_URL=
WS_SERVICE_HOST=localhost
WS_SERVICE_PORT=3002
KAFKA_BROKER_1=localhost:9092
KAFKA_BROKER_2=localhost:9093
```

### image-service

```env
KAFKA_BROKER_1=localhost:9092
KAFKA_BROKER_2=localhost:9093
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_HOST=
```

### notification-service

```env
MONGODB_URI=
WS_SERVICE_HOST=localhost
WS_SERVICE_PORT=3002
```

### client

```env
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:3000
```

---

## Running in development

Each service watches for file changes. Start them in separate terminals:

```bash
# 1. User service (start first — others depend on it via gRPC)
cd user-service && npm install && npm run start:dev

# 2. WebSocket service
cd ws-service && npm install && npm run start:dev

# 3. API gateway
cd api-gateway && npm install && npm run start:dev

# 4. Image service
cd image-service && npm install && npm run start:dev

# 5. Notification service
cd notification-service && npm install && npm run start:dev

# 6. Client (runs on port 80 — may need sudo or a proxy)
cd client && npm install && npm run dev
```

> The client dev server (`npm run dev`) runs on port **80** and requires a reverse proxy in front of it so that `api-gateway` CORS (also pinned to `:80`) and `ws-service` Socket.IO (also pinned to `http://localhost`) work correctly.

---

## Building for production

All NestJS services share the same build command:

```bash
# For each backend service (api-gateway, user-service, image-service, notification-service, ws-service):
npm run build        # compiles TypeScript → dist/
npm run start:prod   # runs node dist/main
```

```bash
# Client:
npm run build   # Next.js production build
npm run start   # starts on port 80
```

---

## Testing

All services use Jest. Run from inside the service directory:

```bash
npm run test          # unit tests (watch off)
npm run test:watch    # unit tests in watch mode
npm run test:cov      # unit tests with coverage report
npm run test:e2e      # end-to-end tests
```

---

## Linting & formatting

```bash
npm run lint      # ESLint (auto-fix)
npm run format    # Prettier (backend services)

# Client only:
npm run prettier       # check formatting
npm run prettier:fix   # auto-fix formatting
```

---

## Proto regeneration

Three services share a copy of `user.proto` (`api-gateway`, `user-service`, `image-service`). After editing the proto, regenerate TypeScript types in each:

```bash
npm run proto:gen
```

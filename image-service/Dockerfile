# =============================================================================
# image-service — multi-stage build. Same shape as user-service.
# Per-service specifics:
#   - HAS proto/ (gRPC client to user-service) → entry is dist/src/main.js,
#     proto/user.proto must be present at /app/proto/user.proto.
#   - NO inbound port: it is a Kafka consumer (group image-upload-group). It
#     dials OUT to Kafka to listen, nobody connects IN → no EXPOSE.
# =============================================================================

# ---- Stage 1: install all dependencies -------------------------------------
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: compile TypeScript → dist/ -----------------------------------
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Stage 3: lean runtime image -------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# app.module.ts loads join(__dirname, '../../proto/user.proto') → /app/proto/...
COPY --from=builder /app/dist ./dist
COPY proto ./proto

USER node
CMD ["node", "dist/src/main.js"]

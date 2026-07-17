# =============================================================================
# api-gateway — multi-stage build. Same shape as user-service.
# Per-service specifics:
#   - HAS proto/ (gRPC client to user-service) → entry is dist/src/main.js,
#     and proto/user.proto must be present at /app/proto/user.proto.
#   - HTTP entrypoint on port 3000 (prefix /api).
# =============================================================================

# ---- Stage 1: install all dependencies (incl. dev, to compile) -------------
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

# Production-only dependencies (drops typescript, @nestjs/cli, jest, ...).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Compiled output + the .proto source loaded at runtime by the gRPC client
# modules (join(__dirname, '../../../proto/user.proto') → /app/proto/user.proto).
COPY --from=builder /app/dist ./dist
COPY proto ./proto

USER node
EXPOSE 3000
CMD ["node", "dist/src/main.js"]

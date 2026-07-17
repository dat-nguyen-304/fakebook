# =============================================================================
# ws-service — multi-stage build. NO proto/ folder, so:
#   - entry is dist/main.js (NOT dist/src/main.js).
#   - no proto file to copy.
# Ports (this is the only service that accepts inbound connections on several):
#   - 3001  HTTP (Nest app.listen)
#   - 3002  TCP microservice (inbound events from user/notification services)
#   - 4000  Socket.IO server pushing to browsers (namespace /notification)
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

COPY --from=builder /app/dist ./dist
# NOTE: no `COPY proto` — this service has no proto/ folder.

USER node
EXPOSE 3001 3002 4000
# NOTE: entry is dist/main.js (no src/ prefix) because there is no proto/ dir.
CMD ["node", "dist/main.js"]

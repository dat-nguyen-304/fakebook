# =============================================================================
# notification-service — multi-stage build. Same shape as user-service, with
# two IMPORTANT differences because it has NO proto/ folder:
#   - Source lives only under src/, so tsc drops the folder prefix →
#     entry is dist/main.js (NOT dist/src/main.js).
#   - No proto file to copy.
#   - NO inbound port: Kafka consumer (group notification-consumer) → no EXPOSE.
#     (It also emits TCP to ws-service, but as a client — it opens that.)
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
# NOTE: entry is dist/main.js (no src/ prefix) because there is no proto/ dir.
CMD ["node", "dist/main.js"]

# =============================================================================
# client — Next.js 14 (App Router), multi-stage build using "standalone" output.
#
# Unlike the NestJS services, we do NOT run `node dist/...`. Next builds its own
# production server; with output:'standalone' (set in next.config.js) it emits a
# minimal server.js plus only the node_modules it actually traced. The runtime
# stage then needs NO `npm ci` at all — that is what keeps the image small.
# =============================================================================

# ---- Stage 1: install all dependencies -------------------------------------
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: build the Next.js app ----------------------------------------
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# IMPORTANT: NEXT_PUBLIC_* variables are inlined into the client JS bundle at
# BUILD time, not read at runtime. So they must be present here, during
# `next build`. Passed in via --build-arg; changing them later means rebuilding.
ARG NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:3000/api
ARG NEXT_PUBLIC_IMAGE_HOST=https://res.cloudinary.com/fakebook-2025
ENV NEXT_PUBLIC_BACKEND_BASE_URL=$NEXT_PUBLIC_BACKEND_BASE_URL
ENV NEXT_PUBLIC_IMAGE_HOST=$NEXT_PUBLIC_IMAGE_HOST

RUN npm run build

# ---- Stage 3: minimal runtime image ----------------------------------------
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# The standalone server reads PORT and HOSTNAME. 0.0.0.0 = listen on all
# interfaces (required inside a container; the default localhost is unreachable
# from outside the container).
ENV PORT=3005
ENV HOSTNAME=0.0.0.0

# Static assets Next does NOT bundle into standalone — must be copied explicitly:
#   public/         → images, icons served as-is
#   .next/static/   → hashed JS/CSS chunks
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
# The standalone server itself: server.js + traced node_modules + .next server
# files. Copied to /app root, so /app/server.js becomes the entrypoint.
COPY --from=builder /app/.next/standalone ./

USER node
EXPOSE 3005
CMD ["node", "server.js"]

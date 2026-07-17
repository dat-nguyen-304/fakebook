# =============================================================================
# user-service — multi-stage Docker build
#
# Three stages:
#   1. deps    — install ALL deps (incl. dev) so we can compile TypeScript.
#   2. builder — run `nest build` → produces dist/.
#   3. runner  — tiny final image: prod-only node_modules + dist + proto.
#
# Why multi-stage? The final image must NOT contain the TypeScript compiler,
# dev dependencies, or source .ts files. We build in a fat stage and copy only
# the runtime artifacts into a lean stage. `docker build` throws away the
# intermediate stages — only the last one becomes the published image.
# =============================================================================

# ---- Stage 1: install all dependencies -------------------------------------
# node:20-slim = Debian (glibc). Chosen over Alpine (musl) because `argon2` is a
# native C++ addon: on glibc it downloads a prebuilt binary, so we avoid having
# to install python3/make/g++ just to compile it.
FROM node:20-slim AS deps
WORKDIR /app

# Copy ONLY the manifests first. This is the key Docker caching trick: this layer
# is invalidated only when package.json / lock changes — not on every code edit.
# So `npm ci` (the slow step) is cached across rebuilds when deps are unchanged.
COPY package.json package-lock.json ./

# `npm ci` = clean, reproducible install straight from the lockfile (unlike
# `npm install` which may mutate it). Installs dev deps too — needed to compile.
RUN npm ci

# ---- Stage 2: compile TypeScript -------------------------------------------
FROM node:20-slim AS builder
WORKDIR /app

# Reuse the node_modules we already installed in the deps stage.
COPY --from=deps /app/node_modules ./node_modules
# Now bring in the source. (.dockerignore keeps node_modules/dist/.env out.)
COPY . .

# nest build → outputs to dist/. Because proto/ lives OUTSIDE src/, tsc keeps the
# folder structure, so the entrypoint lands at dist/src/main.js (NOT dist/main.js).
RUN npm run build

# ---- Stage 3: minimal runtime image ----------------------------------------
FROM node:20-slim AS runner
WORKDIR /app

# Run as an unprivileged user, not root. node:20-slim ships a built-in `node`
# user (uid 1000) — a container escape then can't act as root on the host.
ENV NODE_ENV=production

# Install ONLY production dependencies (drops typescript, @nestjs/cli, jest, ...).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the compiled JS from the builder stage.
COPY --from=builder /app/dist ./dist

# Copy the .proto SOURCE file. main.ts loads it at runtime from
# join(__dirname, '../../proto/user.proto') → resolves to /app/proto/user.proto.
# nest build does NOT copy .proto (it's not TypeScript), so we must do it here.
COPY proto ./proto

# Drop root privileges for the running process.
USER node

# gRPC server listens on 5000 (see main.ts / user-service CLAUDE.md).
# EXPOSE is documentation only; it doesn't publish the port.
EXPOSE 5000

# Real entrypoint is dist/src/main.js (the package.json "start:prod" script says
# `node dist/main` which is WRONG for this layout — we use the correct path).
CMD ["node", "dist/src/main.js"]

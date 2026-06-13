#!/usr/bin/env bash
# Start all fakebook services in dev mode.
# Usage: ./dev.sh [--infra-only]
#
# Requires: npm, Node.js. Infra must be running (docker compose up -d).

set -e

SERVICES=(user-service api-gateway image-service notification-service ws-service client)
PIDS=()

cleanup() {
  echo ""
  echo "Stopping all services..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait
  echo "Done."
}
trap cleanup SIGINT SIGTERM

if [[ "$1" == "--infra-only" ]]; then
  docker compose up -d
  echo "Infrastructure started."
  exit 0
fi

# Ensure infra is up
docker compose up -d
echo "Infrastructure ready."
echo ""

# Start each service in the background, prefix logs with service name
for svc in "${SERVICES[@]}"; do
  if [[ ! -d "$svc" ]]; then
    echo "WARNING: directory '$svc' not found, skipping."
    continue
  fi
  echo "Starting $svc..."
  (cd "$svc" && npm run start:dev 2>&1 | sed "s/^/[$svc] /") &
  PIDS+=($!)
done

echo ""
echo "All services started. Press Ctrl+C to stop."
wait

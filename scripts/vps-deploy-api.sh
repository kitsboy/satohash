#!/usr/bin/env bash
# Deploy Satohash API stack on the VPS (run ON the VPS as deploy user).
# Kimi orchestration host — not Umbrel, not M4.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing .env — copy .env.vps.example and fill secrets on the server."
  exit 1
fi

echo "→ Building & starting satohash-api + redis"
docker compose -f docker-compose.vps.yml up -d --build

echo "→ Waiting for health"
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:3001/health" >/dev/null; then
    echo "OK  GET /health"
    curl -sS "http://127.0.0.1:3001/api/public/status" | head -c 400
    echo
    echo "Next: point DNS api.satohash.io → this host; TLS via Caddy/nginx."
    exit 0
  fi
  sleep 2
done

echo "FAIL: health not ready — docker compose -f docker-compose.vps.yml logs"
exit 1

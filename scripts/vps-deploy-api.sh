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

export GIT_SHA=$(git rev-parse --short HEAD)
echo "→ Building & starting satohash-api + redis (GIT_SHA=$GIT_SHA)"
docker compose -f docker-compose.vps.yml up -d --build

echo "→ Waiting for health"
container=$(docker compose -f docker-compose.vps.yml ps -q satohash-api 2>/dev/null || true)
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:3001/health" >/dev/null; then
    hs=""
    if [[ -n "$container" ]]; then
      hs=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$container" 2>/dev/null || true)
    fi
    # Prefer GET /health 200. If a healthcheck exists, wait out the 60s loop for healthy.
    if [[ -z "$hs" || "$hs" == "healthy" || $i -eq 30 ]]; then
      echo "OK  GET /health"
      if [[ "$hs" == "healthy" ]]; then
        echo "OK  docker health=$hs"
      elif [[ -n "$hs" ]]; then
        echo "WARN docker health=$hs after 60s — preferring /health 200"
      fi
      curl -sS "http://127.0.0.1:3001/api/public/status" | head -c 400
      echo
      echo "Next: point DNS api.satohash.io → this host; TLS via Caddy/nginx."
      exit 0
    fi
  fi
  sleep 2
done

echo "FAIL: health not ready — docker compose -f docker-compose.vps.yml logs"
exit 1

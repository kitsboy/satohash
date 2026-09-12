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
      # BOOT-CHAIN SMOKE (t_ae0b0175): the opentimestamps proof chain must be
      # running on the vendored fetch transport (no deprecated request stack).
      # Self-contained read-only probe — the guard script lives only in the
      # build stage, so this checks the RUNNING image directly. A broken chain
      # (or the request stack coming back) fails the deploy.
      if docker exec "$container" sh -c 'node -e "require(\"opentimestamps\")" && exit 0 || exit 1' \
         && ! docker exec "$container" sh -c '[ -d node_modules/request -o -d node_modules/request-promise ]'; then
        echo "OK  boot-chain smoke (opentimestamps loads; no request stack inside the image)"
      else
        echo "FAIL boot-chain smoke — opentimestamps/request chain broken inside the image"
        docker logs "$container" 2>&1 | tail -20
        exit 1
      fi
      if [[ "$hs" == "healthy" ]]; then
        echo "OK  docker health=$hs"
      elif [[ -n "$hs" ]]; then
        echo "WARN docker health=$hs after 60s — preferring /health 200"
      fi
      # docker image prune of dangling satohash-api is a separate ops step
      running=$(docker inspect --format='{{.Image}}' "$container" 2>/dev/null || true)
      docker image prune -f >/dev/null 2>&1 || true
      # do not docker rmi "$running" — prune only drops dangling images, never the in-use digest
      # optionally: docker images satohash-satohash-api --filter dangling=true
      curl -sS "http://127.0.0.1:3001/api/public/status" | head -c 400
      echo
      echo "→ Reloading Caddy (best-effort, non-fatal)"
      caddy_unit=""
      if command -v systemctl >/dev/null 2>&1; then
        if systemctl cat caddy.service >/dev/null 2>&1; then
          caddy_unit="caddy.service"
        elif systemctl cat caddy >/dev/null 2>&1; then
          caddy_unit="caddy"
        else
          caddy_file=$(ls /etc/systemd/system/*caddy* 2>/dev/null | head -n 1 || true)
          if [[ -n "${caddy_file:-}" && -f "$caddy_file" ]]; then
            caddy_unit=$(basename "$caddy_file")
          else
            caddy_unit=$(systemctl list-units --type=service --all 2>/dev/null | grep -i caddy | awk '{print $1}' | head -n 1 || true)
          fi
        fi
      fi
      if [[ -n "${caddy_unit:-}" ]]; then
        if systemctl reload "$caddy_unit" >/dev/null 2>&1; then
          echo "OK  systemctl reload $caddy_unit"
        elif command -v caddy >/dev/null 2>&1 && [[ -f /etc/caddy/Caddyfile ]]; then
          caddy reload --config /etc/caddy/Caddyfile >/dev/null 2>&1 && echo "OK  caddy reload --config /etc/caddy/Caddyfile" || echo "WARN caddy reload failed (non-fatal)"
        else
          echo "WARN systemctl reload $caddy_unit failed (non-fatal)"
        fi
      elif command -v caddy >/dev/null 2>&1 && [[ -f /etc/caddy/Caddyfile ]]; then
        caddy reload --config /etc/caddy/Caddyfile >/dev/null 2>&1 && echo "OK  caddy reload --config /etc/caddy/Caddyfile" || echo "WARN caddy reload failed (non-fatal)"
      else
        echo "SKIP caddy unit not found"
      fi
      echo "Next: point DNS api.satohash.io → this host; TLS via Caddy/nginx."
      exit 0
    fi
  fi
  sleep 2
done

echo "FAIL: health not ready — docker compose -f docker-compose.vps.yml logs"
exit 1

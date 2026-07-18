#!/usr/bin/env bash
# Local API smoke against Express (dev or docker). Does not deploy a VPS.
# Usage:
#   npm run server   # terminal 1
#   ./scripts/api-local-smoke.sh   # terminal 2
#   BASE=http://127.0.0.1:3001 ./scripts/api-local-smoke.sh

set -euo pipefail
BASE="${BASE:-http://127.0.0.1:3001}"
CURL=(curl -sS --connect-timeout 3 --max-time 8)

echo "→ Smoke testing API at $BASE"

code=$("${CURL[@]}" -o /tmp/satohash-health.json -w "%{http_code}" "$BASE/health" || true)
if [[ "$code" != "200" ]]; then
  echo "FAIL: GET /health → HTTP $code (is the server running? npm run server)"
  exit 1
fi
echo "OK  GET /health ($code)"
head -c 200 /tmp/satohash-health.json; echo

# Deep health can hang if Redis/OTS deps are slow — best-effort only
deep=$("${CURL[@]}" -o /tmp/satohash-health-deep.json -w "%{http_code}" "$BASE/health?deep=true" || true)
if [[ "$deep" == "200" ]]; then
  echo "OK  GET /health?deep=true ($deep)"
  head -c 300 /tmp/satohash-health-deep.json; echo
else
  echo "WARN GET /health?deep=true → HTTP ${deep:-timeout} (optional; Redis/OTS may be unavailable)"
fi

# Stamp endpoint should exist (may 400/402 without body/payment — not 404)
stamp=$("${CURL[@]}" -o /tmp/satohash-stamp.json -w "%{http_code}" \
  -X POST "$BASE/api/stamp" \
  -H 'Content-Type: application/json' \
  -d '{}' || true)
if [[ "$stamp" == "404" || "$stamp" == "000" || -z "$stamp" ]]; then
  echo "FAIL: POST /api/stamp → ${stamp:-unreachable} (route missing or server down)"
  exit 1
fi
echo "OK  POST /api/stamp reachable (HTTP $stamp — empty body / paywall expected)"

echo ""
echo "Local API smoke passed. VPS deploy still requires provider + DNS per docs/DEPLOY-SERVER.md"

#!/usr/bin/env bash
# MVP smoke: health + metrics + free stamp against live API
set -euo pipefail
API="${API_BASE:-https://api.satohash.io}"
HASH="$(openssl rand -hex 32)"

echo "== health =="
curl -sS "$API/health" | head -c 400
echo

echo "== metrics =="
curl -sS "$API/metrics.json" | head -c 280
echo

echo "== stamp =="
RESP=$(curl -sS -X POST "$API/api/stamp" \
  -H 'Content-Type: application/json' \
  -H 'X-Satohash-Client: mvp-smoke' \
  -d "{\"hash\":\"$HASH\",\"filename\":\"mvp-smoke.txt\"}")
echo "$RESP" | head -c 500
echo

echo "$RESP" | grep -qE '"hash"|ots|proof|id' || {
  echo "FAIL: unexpected stamp response" >&2
  exit 1
}
echo "OK mvp-smoke ($HASH)"

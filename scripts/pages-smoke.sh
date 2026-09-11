#!/usr/bin/env bash
# Production SPA smoke after Cloudflare Pages deploy.
# Fail closed on HTML-as-JS, missing stamp/verify shells, and /p/<hash> Function card.
set -euo pipefail

UA='Mozilla/5.0 (compatible; Satohash-Smoke/1.0)'
BASE='https://satohash.io'
HASH='e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
# Edge can briefly serve the previous index after wrangler returns.
sleep "${SMOKE_SLEEP:-20}"

fetch() {
  curl -fsS -A "$UA" -m 25 "$@"
}

echo "== homepage JS is JS (not SPA HTML poison) =="
INDEX=""
BODY=""
for i in 1 2 3 4 5 6 7 8; do
  HTML=$(fetch "${BASE}/?nocache=${RANDOM}${i}" || true)
  INDEX=$(printf '%s' "$HTML" | grep -oE 'b/index-[^"]+\.js' | head -1 || true)
  if [ -z "$INDEX" ]; then
    echo "attempt $i: no index script in HTML yet"
    sleep 8
    continue
  fi
  if ! curl -fsS -A "$UA" -m 25 -r 0-160 "${BASE}/${INDEX}?nocache=${RANDOM}${i}" -o /tmp/main-head.bin; then
    echo "attempt $i: JS fetch failed for ${INDEX}"
    sleep 8
    continue
  fi
  BODY=$(cat /tmp/main-head.bin)
  echo "attempt $i: ref=${INDEX} head=$(echo "$BODY" | tr '\n' ' ' | cut -c1-100)"
  if echo "$BODY" | grep -qiE '<!doctype|<html'; then
    echo "attempt $i: HTML-as-JS (stale edge) — retrying"
    sleep 10
    continue
  fi
  if echo "$BODY" | grep -qE '^(import |const |var |function |/)'; then
    echo "Production main JS ok (${INDEX})"
    break
  fi
  echo "attempt $i: unexpected JS head — retrying"
  sleep 8
  INDEX=""
done
if [ -z "$INDEX" ] || echo "$BODY" | grep -qiE '<!doctype|<html'; then
  echo "::error::Production main JS still HTML or missing after retries — edge poison / SPA fallback"
  echo "last_ref=${INDEX:-none}"
  echo "last_head=${BODY:-empty}"
  exit 1
fi

echo "== OG is JPEG (iMessage) =="
# A single cache-busted read can catch a CF edge variant: on 2026-09-11 the first read of the
# settled homepage came back without the JPEG hero marker while the next two were fine (see
# t_2e23ea8a). Retry a few times instead of turning an inconsistency into a red gate — still
# fail closed if the marker never shows.
HOME_HTML=""
for i in 1 2 3; do
  HOME_HTML=$(fetch "${BASE}/?nocache=${RANDOM}${i}")
  if echo "$HOME_HTML" | grep -q 'media/video/01-stamp-hero.jpg'; then
    break
  fi
  echo "attempt $i: homepage is missing the JPEG hero marker — retrying"
  HOME_HTML=""
  sleep 5
done
if [ -z "$HOME_HTML" ]; then
  echo "::error::Homepage OG image is not the JPEG hero"
  exit 1
fi
echo "$HOME_HTML" | grep -q 'og-image.svg' && {
  echo "::error::Homepage still references og-image.svg"
  exit 1
}

echo "== www =="
curl -fsS -A "$UA" -m 25 -o /dev/null "https://www.satohash.io/" || {
  echo "::error::www.satohash.io did not return 200"
  exit 1
}

echo "== /stamp shell =="
STAMP=$(fetch "${BASE}/stamp?nocache=${RANDOM}")
echo "$STAMP" | grep -qE 'file-input|stamp-dropzone|Notarize|root' || {
  echo "::error::/stamp HTML missing app shell"
  exit 1
}

echo "== homepage and /stamp share the same /b/index-*.js (no mixed-chunk poison) =="
entry_js() {
  printf '%s' "$1" | grep -oE 'b/index-[^"[:space:]]+\.js' | head -1
}
# A Cloudflare Pages rollout flips / and /stamp independently, so ONE read can honestly
# catch the old entry chunk on one path and the new one on the other. That is what failed
# Deploy run 34645366777 ("mixed-chunk poison: homepage /b/index-D9wvmZw-.js !=
# /stamp /b/index-BCtq2UCL.js") while the served content was fine. Wait for the rollout to
# settle (both paths agreeing) instead of failing on the first mismatch — still fail closed
# if they never agree, because that is the real HTML-as-JS/mixed-build poison we guard.
HOME_JS=""
STAMP_JS=""
MIXED_ATTEMPTS="${SMOKE_MIXED_ATTEMPTS:-12}"
for i in $(seq 1 "$MIXED_ATTEMPTS"); do
  HOME_HTML=$(fetch "${BASE}/?nocache=${RANDOM}${i}")
  STAMP=$(fetch "${BASE}/stamp?nocache=${RANDOM}${i}")
  HOME_JS=$(entry_js "$HOME_HTML")
  STAMP_JS=$(entry_js "$STAMP")
  if [ -z "$HOME_JS" ] || [ -z "$STAMP_JS" ]; then
    echo "attempt $i: missing /b/index-*.js (homepage=${HOME_JS:-none} /stamp=${STAMP_JS:-none})"
    sleep 8
    continue
  fi
  if [ "$HOME_JS" = "$STAMP_JS" ]; then
    echo "Same entry chunk: /${HOME_JS} (attempt $i)"
    break
  fi
  echo "attempt $i: rollout still in flight — homepage /${HOME_JS} != /stamp /${STAMP_JS}"
  sleep 10
done
if [ -z "$HOME_JS" ] || [ -z "$STAMP_JS" ]; then
  echo "::error::missing /b/index-*.js (homepage=${HOME_JS:-none} /stamp=${STAMP_JS:-none})"
  exit 1
fi
if [ "$HOME_JS" != "$STAMP_JS" ]; then
  echo "::error::mixed-chunk poison: homepage /${HOME_JS} != /stamp /${STAMP_JS} (still split after ${MIXED_ATTEMPTS} attempts)"
  exit 1
fi

echo "== /verify shell =="
curl -fsS -A "$UA" -m 25 -o /dev/null "${BASE}/verify?nocache=${RANDOM}" || {
  echo "::error::/verify did not return 200"
  exit 1
}

echo "== /p/<hash> Function card (fail closed) =="
CARD=""
for i in 1 2 3 4 5; do
  CARD=$(fetch "${BASE}/p/${HASH}?nocache=${RANDOM}${i}" || true)
  if echo "$CARD" | grep -qiE 'Zero-JS proof card|Confirmed on Bitcoin|Pending is not confirmed|Interactive verify'; then
    if echo "$CARD" | grep -q 'id="root"' && ! echo "$CARD" | grep -qi 'zero-JS'; then
      echo "attempt $i: SPA shell on /p/ — retrying"
      sleep 6
      continue
    fi
    echo "Proof card ok"
    break
  fi
  echo "attempt $i: /p/ not a proof card yet"
  sleep 6
  CARD=""
done
if [ -z "$CARD" ]; then
  echo "::error::/p/${HASH} is not the zero-JS Function card"
  exit 1
fi
echo "$CARD" | grep -q '01-stamp-hero.jpg' || echo "::warning::proof card OG JPEG missing (non-fatal)"

echo "== /p/<hash> JPEG OG (iMessage) =="
echo "$CARD" | grep -q '01-stamp-hero.jpg' || {
  echo "::error::/p/${HASH} HTML missing 01-stamp-hero.jpg"
  exit 1
}
echo "$CARD" | grep -q 'og/stamp.png' && {
  echo "::error::/p/${HASH} still references og/stamp.png"
  exit 1
}

echo "== GSC verification HTML (200, no pretty-URL 308) =="
GSC_CODE=$(curl -sS -o /tmp/gsc-body.txt -w '%{http_code}' -A "$UA" -m 25 "${BASE}/googlef508c6fb64de60ff.html" || true)
GSC_BODY=$(cat /tmp/gsc-body.txt 2>/dev/null || true)
if [ "$GSC_CODE" != "200" ]; then
  echo "::error::GSC file returned ${GSC_CODE:-empty} (need 200 at .html, not Pages 308)"
  exit 1
fi
echo "$GSC_BODY" | grep -q 'google-site-verification: googlef508c6fb64de60ff.html' || {
  echo "::error::GSC file 200 but token missing"
  echo "body=${GSC_BODY:0:120}"
  exit 1
}
echo "$GSC_BODY" | grep -qiE '<!doctype|<html' && {
  echo "::error::GSC file served SPA HTML instead of the token"
  exit 1
}
echo "GSC verification file ok"

echo "== API still free (informational) =="
READY=$(fetch "https://api.satohash.io/api/public/readiness" || true)
if echo "$READY" | grep -q '"require_lightning":true'; then
  echo "::warning::API reports REQUIRE_LIGHTNING=true — stamps are no longer free"
else
  echo "Paywall still free_open (or readiness missing the flag)"
fi

# Retry-After is set on 429 (stampRateLimit in server/routes/stamps.js).
# Do not probe production for 429 — curl -sI of a fake path is useless, and
# hammering POST /api/stamp would trip the live limiter. Skip live 429 checks.

echo "== live API POST /api/stamp (HTTP 200, reuse OK) =="
STAMP_CODE=$(curl -sS -o /tmp/satohash-stamp-live.json -w '%{http_code}' -A "$UA" -m 25 \
  -X POST "https://api.satohash.io/api/stamp" \
  -H 'Content-Type: application/json' \
  -H 'X-Satohash-Client: pages-smoke' \
  -d "{\"hash\":\"${HASH}\",\"filename\":\"pages-smoke.txt\"}" || true)
if [ "$STAMP_CODE" != "200" ]; then
  echo "::error::POST /api/stamp returned ${STAMP_CODE:-empty} (need 200; reuse of empty SHA-256 is OK)"
  echo "body=$(head -c 300 /tmp/satohash-stamp-live.json 2>/dev/null || true)"
  exit 1
fi
echo "POST /api/stamp 200 (reuse OK)"

echo "== live GET /metrics.json (200 JSON, paywall off) =="
METRICS_CODE=$(curl -sS -o /tmp/satohash-metrics-live.json -w '%{http_code}' -A "$UA" -m 25 \
  "https://api.satohash.io/metrics.json" || true)
if [ "$METRICS_CODE" != "200" ]; then
  echo "::error::GET /metrics.json returned ${METRICS_CODE:-empty} (need 200)"
  exit 1
fi
node -e '
  const fs = require("fs");
  let j;
  try {
    j = JSON.parse(fs.readFileSync("/tmp/satohash-metrics-live.json", "utf8"));
  } catch (e) {
    console.error("::error::GET /metrics.json is not JSON:", e.message);
    process.exit(1);
  }
  if (j && j.raw && j.raw.requireLightning === true) {
    console.error("::error::raw.requireLightning is true — paywall must stay off");
    process.exit(1);
  }
'
echo "GET /metrics.json 200 JSON (raw.requireLightning !== true)"

echo "== live GET /health (200) =="
HEALTH_CODE=$(curl -sS -o /tmp/satohash-health-live.json -w '%{http_code}' -A "$UA" -m 25 \
  "https://api.satohash.io/health" || true)
if [ "$HEALTH_CODE" != "200" ]; then
  echo "::error::GET /health returned ${HEALTH_CODE:-empty} (need 200)"
  exit 1
fi
echo "GET /health 200"

echo "pages-smoke ok"

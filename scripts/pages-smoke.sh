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
HOME_HTML=$(fetch "${BASE}/?nocache=${RANDOM}")
echo "$HOME_HTML" | grep -q 'media/video/01-stamp-hero.jpg' || {
  echo "::error::Homepage OG image is not the JPEG hero"
  exit 1
}
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

echo "pages-smoke ok"

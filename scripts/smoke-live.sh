#!/usr/bin/env bash
# Live smoke — API health, metrics, OG JPEG. No secrets.
# Usage: ./scripts/smoke-live.sh
set -euo pipefail

UA='Mozilla/5.0 (compatible; Satohash-Smoke/1.0)'
fail() { echo "FAIL: $*" >&2; exit 1; }

check_200() {
  local url="$1"
  local out="$2"
  local code
  code=$(curl -sS -A "$UA" -m 25 -o "$out" -w "%{http_code}" "$url" || true)
  if [[ "$code" != "200" ]]; then
    fail "$url → HTTP ${code:-unreachable}"
  fi
  echo "OK  $url ($code)"
}

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

check_200 "https://api.satohash.io/health" "$tmp/health.json"
health_cc=$(curl -sI -A "$UA" -m 25 "https://api.satohash.io/health" | tr -d '\r' || true)
if ! echo "$health_cc" | grep -qiE '^cache-control:.*no-store'; then
  fail "https://api.satohash.io/health missing Cache-Control no-store"
fi
echo "OK  https://api.satohash.io/health Cache-Control no-store"
check_200 "https://api.satohash.io/metrics.json" "$tmp/metrics.json"
check_200 "https://satohash.io/og/home.jpg" "$tmp/home.jpg"
check_200 "https://satohash.io/og/stamp.jpg" "$tmp/stamp.jpg"
check_200 "https://satohash.io/og/verify.jpg" "$tmp/verify.jpg"
check_200 "https://satohash.io/og/watch.jpg" "$tmp/watch.jpg"
check_200 "https://satohash.io/og/how-satohash-works.jpg" "$tmp/how-satohash-works.jpg"

node -e '
const fs = require("fs");
function readJson(path, label) {
  try {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  } catch (e) {
    console.error("FAIL: " + label + " is not JSON: " + e.message);
    process.exit(1);
  }
}
const health = readJson(process.argv[1], "/health");
const metrics = readJson(process.argv[2], "/metrics.json");
const gitSha = health && health.gitSha != null ? health.gitSha : "";
const rl = metrics && metrics.raw ? metrics.raw.requireLightning : undefined;
console.log("gitSha=" + gitSha);
console.log("requireLightning=" + String(rl));
if (rl !== false) {
  console.error("FAIL: requireLightning must be false (got " + String(rl) + ")");
  process.exit(1);
}
' "$tmp/health.json" "$tmp/metrics.json"

echo "smoke-live ok"

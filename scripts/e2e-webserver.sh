#!/usr/bin/env bash
# Reuse Vite dist when present so Playwright does not rebuild twice.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -d dist ]; then
  exec npx vite preview --host 127.0.0.1 --port 3001 --strictPort
fi
exec npm run production

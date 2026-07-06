#!/bin/bash
# Satohash deploy script
# Usage:
#   ./deploy.sh              # Cloudflare Pages (static frontend)
#   DEPLOY_TARGET=umbrel ./deploy.sh   # Umbrel Node/PM2 (full stack)
#
# Prerequisites:
#   npm ci && npm run build
#   Cloudflare: wrangler CLI + CLOUDFLARE_API_TOKEN
#   Umbrel: git pull on server, then systemctl restart satohash

set -euo pipefail

DEPLOY_TARGET="${DEPLOY_TARGET:-cloudflare}"
PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "$0")" && pwd)}"
CF_PROJECT="${CF_PROJECT:-satohash}"

cd "$PROJECT_DIR"

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building..."
npm run build

if [ "$DEPLOY_TARGET" = "umbrel" ]; then
  echo "🚀 Umbrel deploy — restart service on server:"
  echo "   cd /home/umbrel/satohash && git pull && npm ci && npm run production"
  echo "   sudo systemctl restart satohash"
  exit 0
fi

echo "📤 Deploying to Cloudflare Pages ($CF_PROJECT)..."
if ! command -v wrangler >/dev/null 2>&1; then
  echo "❌ wrangler CLI not found. Install: npm i -g wrangler"
  exit 1
fi
wrangler pages deploy ./dist --project-name="$CF_PROJECT"

echo "✅ Deployed to Cloudflare Pages!"
echo "   Note: API runs separately on Express (port 3001). See docs/DEPLOY-PLAYBOOK.md"
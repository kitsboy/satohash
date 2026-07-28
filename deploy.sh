#!/bin/bash
# Satohash — Cloudflare Pages deploy (static SPA only)
#
# Usage (from M3 Terminal.app):
#   cd ~/projects/satohash
#   ./deploy.sh
#
# Requires: CLOUDFLARE_API_TOKEN (env or wrangler login)
# Project:  satohash
# Domains:  satohash.io, satohash.giveabit.io

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "$0")" && pwd)}"
CF_PROJECT="${CF_PROJECT:-satohash}"

cd "$PROJECT_DIR"

echo "📦 Installing dependencies..."
npm ci

# Public SPA env (no secrets). CF Pages has no /api/* — always target THOR API.
export VITE_API_URL="${VITE_API_URL:-https://api.satohash.io}"
export VITE_MVP_MODE="${VITE_MVP_MODE:-true}"
export VITE_APP_NAME="${VITE_APP_NAME:-Satohash}"
export VITE_MEMPOOL_API_URL="${VITE_MEMPOOL_API_URL:-https://mempool.space/api}"

echo "🔨 Building (VITE_API_URL=$VITE_API_URL)..."
npm run build

echo "🔍 Verifying Landing bundle..."
npm run build:verify

echo "📤 Deploying to Cloudflare Pages ($CF_PROJECT)..."
# Functions live in ./functions (metrics.json proxy). dist must not ship static metrics.json.
npx wrangler pages deploy ./dist --project-name="$CF_PROJECT"

echo "✅ Deployed to Cloudflare Pages!"
echo "   Live: https://satohash.io"
echo "   Rollback: Cloudflare Dashboard → Pages → satohash → Deployments"
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

echo "🔨 Building..."
npm run build

echo "🔍 Verifying Landing bundle..."
npm run build:verify

echo "📤 Deploying to Cloudflare Pages ($CF_PROJECT)..."
npx wrangler pages deploy ./dist --project-name="$CF_PROJECT"

echo "✅ Deployed to Cloudflare Pages!"
echo "   Live: https://satohash.io"
echo "   Rollback: Cloudflare Dashboard → Pages → satohash → Deployments"
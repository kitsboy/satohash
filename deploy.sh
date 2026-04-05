#!/bin/bash
# Run this on: Umbrel terminal (umbrel@umbrel:~$)
# Purpose: Deploy satohash.giveabit.io to Cloudflare Pages
# Risk: safe

set -e

echo "🚀 Deploying satohash.giveabit.io..."
cd /data/.openclaw/workspace/satohash

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building..."
npm run build

echo "📤 Deploying to Cloudflare Pages..."
wrangler pages deploy ./dist --project-name=satohash

echo "✅ Deployed!"

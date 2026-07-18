# Satohash — Standard Operating Procedure (SOP)

Updated: 2026-07-16

## Architecture
Dual-server: Express API (port 3001) + Vite dev server (port 3000, proxies /api and /socket.io to 3001)
Stack: React 18 + Vite 6 + Tailwind CSS 4 (frontend), Express 5 + better-sqlite3 + Redis (backend)

## Quick Start
npm install
cp .env.example .env
npm run dev          Frontend + API backend (concurrent)

## Build
npm run build        Vite production build

## Test
npm test             Vitest (73 unit tests, 22% coverage threshold)
npm run test:e2e     Playwright e2e

## Deploy
Frontend auto-deploys from GitHub main to Cloudflare Pages (satohash)
API server: deploy per docs/DEPLOY-SERVER.md (requires Express hosting)

## Agent Protocol
1. Read GROK-SESSION-PROTOCOL.md
2. Read .ai_docs/project-summary.md and current-status.md
3. Work on the project
4. Update .ai_docs/current-status.md and docs/KIMI-HANDOFF.md
5. Push to origin main

## Known Constraints
- 28 missing i18n keys in non-EN locales (pre-existing)
- API server not deployed — frontend works standalone for stamp/verify
- Government template IDs may need stub demo wiring


# Current Status — Satohash

**Version:** Build 107 (v4.1.0-ELITE)
**Last Updated:** 2026-07-18
**Domain:** satohash.giveabit.io
**Build:** Vite 6 production build
**Git:** `0e08263` (main, synced)

## Recent Milestones
- Build 103–107 — i18n 28 keys; government templates wired; api:smoke; 77 tests; .ai_docs kebab layer
- Build 100 — /templates crash fix (specialSections.features)
- Builds 98-99 — Desktop nav v2 (centered grid, no LeftRailNav)
- Builds 86-95 — Static-edge wave 2 complete (200/200 items)

## Known Issues
- Cloudflare Pages deploy of latest main may be stale — wrangler not authenticated; CF token not in local env; GitHub Deploy needs secrets
- API server not on public VPS (`api.satohash.io`) — MVP gate; local smoke OK via `npm run api:smoke`

## Next Steps
- Cam: `wrangler login` or add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` → deploy frontend
- Cam: provision VPS + DNS for api.satohash.io per docs/DEPLOY-SERVER.md
- After API live: `VITE_API_URL=https://api.satohash.io npm run build && ./deploy.sh`

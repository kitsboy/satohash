# Current Status — Satohash

**Version:** Build 108 (v4.1.0-ELITE)
**Last Updated:** 2026-07-20
**Domain:** satohash.giveabit.io / satohash.io
**Build:** Vite 6 production build
**Git:** `b9b50e6` (main, synced)

## Recent Milestones
- 2026-07-20 — GitHub Actions secrets configured: `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` (values never in repo/chat). Deploy workflow unblocked.
- Build 103–108 — i18n 28 keys; government templates wired; api:smoke; 77 tests; .ai_docs kebab layer
- Build 100 — /templates crash fix (specialSections.features)
- Builds 98-99 — Desktop nav v2 (centered grid, no LeftRailNav)
- Builds 86-95 — Static-edge wave 2 complete (200/200 items)

## Known Issues
- Confirm latest Pages deploy after secrets (watch Actions → Deploy)
- API server not on public VPS (`api.satohash.io`) — MVP gate; local smoke OK via `npm run api:smoke`

## Next Steps
- Verify production deploy green after CF secrets
- Cam: provision VPS + DNS for api.satohash.io per docs/DEPLOY-SERVER.md
- After API live: `VITE_API_URL=https://api.satohash.io npm run build && ./deploy.sh`

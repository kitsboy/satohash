# Current Status — Satohash

**Version:** Build 105 (v4.1.0-ELITE)
**Last Updated:** 2026-07-18
**Domain:** satohash.giveabit.io
**Build:** Vite 6 production build

## Recent Milestones
- Build 105 — i18n 28 missing keys filled; government templates wired; api:smoke; 77 unit tests
- Build 100 — Production fix: /templates crash on government specialSections missing features
- Builds 98-99 — Desktop nav overhaul: replaced sidebar LeftRailNav with centered 3-column grid
- Builds 86-95 — Static-edge wave 2 (SE-101-200): lazy i18n, Widgets v3, Comparison mobile/print, ChainOfCustody export
- Builds 1-85 — Static-edge wave 1: OTS, government suite, MotoPass integration, diligence packs
- 200/200 static-edge session items complete

## Known Issues
- API server not yet deployed to public VPS (api.satohash.io) — MVP gate; local smoke ready via `npm run api:smoke`
- Full VPS provision (provider + DNS + secrets) still needs human account action

## Next Steps
- Provision VPS and deploy Express API per docs/DEPLOY-SERVER.md
- Rebuild frontend with `VITE_API_URL=https://api.satohash.io` after API live
- Integrate timestamping API with other Give A Bit projects (Katoa, MotoPass, etc.)

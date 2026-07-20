# Current Status — Satohash

**Version:** Build 111+ (v4.1.0-ELITE) — bump on next commit
**Last Updated:** 2026-07-20
**Domain:** satohash.io / satohash.giveabit.io
**API (target):** https://api.satohash.io (VPS package ready; DNS/host pending Kimi)

## Recent Milestones
- Family free-tier API keys + `/api/public/status` + VPS docker package + satohash-client
- CF GitHub secrets + local wrangler deploy Build 111 live
- Static-edge complete; government templates; i18n; 77 unit tests

## Architecture (current truth)
- **Static:** Cloudflare Pages
- **API:** VPS Docker (not Umbrel, not M4)
- **Orchestration:** Kimi on VPS
- **Money:** LNbits/LND on VPS
- **Proof create:** public OTS calendars
- **Proof verify independence:** optional pruned bitcoind RPC

## Next Steps
- Kimi: bring up api.satohash.io on VPS
- Family apps: thin clients (agents shipping in parallel)
- HQ: heartbeat poll /health + /api/public/status

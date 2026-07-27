# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Sovereignty Ascension)  
**Last Updated:** 2026-07-27 (goodbye — stamp plane + Kimi wallet request)  
**Frontend:** https://satohash.io · https://satohash.giveabit.io  
**API:** https://api.satohash.io ✅ LIVE  
**Git tip:** see `LATEST-UPDATE.md` (SPA API URL fix + wallet request docs)

## Planes
- Proof API: THOR Docker + Caddy TLS  
- SPA: Cloudflare Pages → **must** call `https://api.satohash.io`  
- Family free stamp: `REQUIRE_LIGHTNING=false` (or family keys) until paywall  
- Code M3 · Ops Kimi/THOR · HQ glass https://hq.giveabit.io  

## This session (done)
- [x] Stamp deep-link + verify lifecycle (prior + this)  
- [x] Root cause: bake/runtime `VITE_API_URL` / host fallback  
- [x] Honest UX + honest metrics (no fake uptime)  
- [x] `docs/LEARN-STAMP-FAMILY.md` + suite docs  
- [x] Sherpa Grok prompt (sibling repo)  
- [x] **Kimi request: L1+L2 wallets** → `docs/KIMI-REQUEST-BITCOIN-WALLETS.md`  
- [x] **Kimi (THOR):** M4 Hermes Desktop live, watchdog installed (auto-recovery), memory 77%, swap doubled to 4GB

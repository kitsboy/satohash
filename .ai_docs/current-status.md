# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Sovereignty Ascension)  
**Last Updated:** 2026-07-28 (metrics proxy + AI notary + Nostr harden)  
**Frontend:** https://satohash.io · CF Pages Function proxies `/metrics.json`  
**API:** https://api.satohash.io ✅ LIVE (THOR) — **HQ metrics SoT**  
**Analytics:** ✅ Umami analytics.giveabit.io  
**HQ:** https://hq.giveabit.io 🟢 satohash green  
**Git tip:** see `LATEST-UPDATE.md`

## Planes
- Proof API: THOR Docker + Caddy TLS  
- SPA: Cloudflare Pages → **must** call `https://api.satohash.io`  
- Metrics: HQ → API; SPA `/metrics.json` → CF Function proxy (not stale static)  
- Family free stamp: `REQUIRE_LIGHTNING=false` until paywall  
- Code M3 · Ops Kimi/THOR · two-machine process: `docs/OPS-TWO-MACHINE.md`  

## This session (done)
- [x] Stamp deep-link + verify lifecycle (prior + this)  
- [x] Root cause: bake/runtime `VITE_API_URL` / host fallback  
- [x] Honest UX + honest metrics (no fake uptime)  
- [x] `docs/LEARN-STAMP-FAMILY.md` + suite docs  
- [x] Sherpa Grok prompt (sibling repo)  
- [x] **Kimi request: L1+L2 wallets** → `docs/KIMI-REQUEST-BITCOIN-WALLETS.md`  
- [x] **Kimi (THOR):** M4 Hermes Desktop live, watchdog installed (auto-recovery), memory 77%, swap doubled to 4GB

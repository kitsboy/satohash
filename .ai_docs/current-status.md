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

## Next (ordered)
1. **Kimi:** Docker rebuild → live `client_id` + `raw.directory`  
2. **Kimi:** LNbits `satohash` + on-chain bc1 + LUD-16; keys HQ Vault; public handback  
3. **Grok:** after handback, publish L1/L2 on Landing / constants / QR  
4. **Grok Sherpa:** `docs/GROK-PROMPT-STAMP-HANDOFF.md`  
5. Family clients: same deep-link contract  

## Agent entrypoints
| File | Who |
|------|-----|
| `docs/KIMI-HANDOFF.md` | Session log (top = latest) |
| `docs/KIMI-REQUEST-BITCOIN-WALLETS.md` | **Kimi — L1+L2 treasury** |
| `docs/KIMI-REQUEST-SATOHASH.md` | Stamp upgrade + wallet section |
| `docs/LEARN-STAMP-FAMILY.md` | Stamp suite lessons |
| `docs/FAMILY-API.md` | Deep-link + headers |
| `docs/HQ-FEED.md` | Metrics for HQ |
| `docs/KIMI-VPS-RUNBOOK.md` | VPS ops |
| `docs/OTS-DEEP-LEARN.md` | OTS protocol |
| `.ai_docs/current-status.md` | This file |

# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Sovereignty Ascension)  
**Last Updated:** 2026-07-27 (stamp family learn + SPA API URL fix)  
**Frontend:** https://satohash.io · https://satohash.giveabit.io — `/stamp?hash=&ref=` + host→API fallback  
**API:** https://api.satohash.io ✅ LIVE  
**Git tip:** `cee9227` / `6b23812` — production API URL fix shipped  

## Planes
- Proof API on VPS Docker + Caddy TLS  
- SPA on Cloudflare Pages (**must** use `VITE_API_URL=https://api.satohash.io`)  
- Family free tier + public open stamp (`REQUIRE_LIGHTNING=false` until paywall)  
- Code M3 · Orchestration Kimi/THOR  

## Critical learn (2026-07-27)
- CF Pages has **no** `/api/*` — without baked/runtime API URL, stamps fall to browser OTS **without durable id**  
- Canonical handoff: `/stamp?hash=<64hex>&ref=<productId>`  
- Honest UX: pending ≠ confirmed; require real stamp `id`  
- Metrics: DB-only; no fake uptime/growth; HQ polls API origin  
- Full write-up: `docs/LEARN-STAMP-FAMILY.md`  
- Sherpa Grok prompt: sibling repo `docs/GROK-PROMPT-STAMP-HANDOFF.md`  

## Live (smoke)
- `GET /health` 200  
- `GET /metrics.json` → `gab.product-metrics.v1`, `raw.demo: false`  
- `POST /api/stamp` returns real UUID `id`  
- Live `client_id` may still be null until **THOR Docker rebuild**  

## Next (ordered)
1. **CF GHA Deploy** this SPA push (verify bundle has api.satohash.io as API base)  
2. **Kimi THOR:** rebuild `satohash-api` → live `client_id` + `raw.directory`  
3. **Kimi THOR:** Satohash Bitcoin L1+L2 wallet — see `docs/KIMI-REQUEST-BITCOIN-WALLETS.md`  
   - LNbits wallet `satohash` · on-chain bc1 · LUD-16/LNURL-pay  
   - Keys → HQ Vault only · public handback → Grok publishes on site  
4. **Grok Sherpa:** audit all stamp URLs + redeploy sc-bundle (see Sherpa prompt)  
5. Smoke family path end-to-end from sherpacarta.org  
6. Remaining clients: motopass, tadbuy, openstrata, camtaylor, lindala (same deep-link contract)  

## Agent entrypoints
| File | Who |
|------|-----|
| `docs/LEARN-STAMP-FAMILY.md` | **Any LLM — stamp handoff lessons** |
| `docs/FAMILY-API.md` | Family deep-link + headers |
| `docs/HQ-FEED.md` | Metrics for HQ |
| `docs/KIMI-VPS-RUNBOOK.md` | Kimi VPS |
| `docs/KIMI-HANDOFF.md` | Session log (top = latest) |
| `docs/OTS-DEEP-LEARN.md` | OTS protocol |
| `.ai_docs/current-status.md` | **Self-evolving status** |

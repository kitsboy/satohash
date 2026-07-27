# MASTER-BRAIN ingest — Satohash / suite proof plane

**For Kimi:** After reading `docs/KIMI-VPS-RUNBOOK.md`, merge the following into MASTER-BRAIN.md / Kanban / ecosystem notes on the **VPS/THOR vault**.  
**Do not invent new rules** — only record operational truth.  
**Never paste secret values into MASTER-BRAIN.**

---

## Paste block (structured)

```markdown
### Satohash proof plane (2026-07-27 — stamp family handoff learn)

**Role:** Shared OpenTimestamps backbone for all Give A Bit products.
**Version:** **5.0.0-ELITE**
**Frontend:** https://satohash.io · https://satohash.giveabit.io · CF Pages `satohash`
**API:** https://api.satohash.io · THOR Docker + Caddy TLS
**Metrics:** `GET /metrics.json` — `gab.product-metrics.v1` · HQ prefers API origin over SPA mirror
**Repo:** kitsboy/satohash · code M3 · ops Kimi/THOR

**CRITICAL LESSON (2026-07-27):**
- CF Pages has no `/api/*`. SPA must use `VITE_API_URL=https://api.satohash.io` (GHA + runtime host fallback).
- Without that, stamps fall back to browser OTS with **no durable id** → Cam “not fully working”.
- Canonical family deep-link: `/stamp?hash=<64hex>&ref=<productId>`
- Home `/?hash=&ref=` redirects to `/stamp`
- Honest UX: pending ≠ confirmed; require real API stamp `id`
- Metrics: real DB only; `raw.demo: false` when stamps exist; never invent uptime/growth curves
- Attribution: `X-Satohash-Client` / `ref` → `timestamps.client_id` → HQ segments

**Deep-link contract:**
https://satohash.io/stamp?hash=<64hex>&ref=sherpacarta|motopass|katoa|…

**Family free tier:**
- Server: FAMILY_API_KEYS, REQUIRE_LIGHTNING=false (or true + paywall)
- Client: X-Satohash-Client (+ optional X-Satohash-Key)

**Endpoints (public):**
- GET /health, /metrics.json, /api/public/status|stats|directory|network|version
- POST /api/stamp · GET /api/stamps/:id · GET /api/stamps/:hash/by-hash · /api/stamps/recent

**Kanban:**
- [x] SPA deep-link + verify lifecycle
- [x] SPA production API URL fix (VITE_API_URL + host fallback)
- [x] Metrics code: client segments + directory (repo)
- [ ] THOR Docker rebuild so live stores client_id + raw.directory
- [ ] Sherpa/other family: audit all stamp URLs still use /stamp?hash=&ref=
- [ ] Dual-host smoke + family free confirmed

**Docs learn:** satohash/docs/LEARN-STAMP-FAMILY.md · Sherpa prompt: sherpacarta/docs/GROK-PROMPT-STAMP-HANDOFF.md
**Orchestration:** Kimi THOR. Coding: Grok M3.

**Bitcoin treasury request (Kimi — open):**
- LNbits wallet `satohash` · public on-chain bc1 · LUD-16/LNURL-pay
- Keys only in HQ Vault (hq.giveabit.io)
- Handback public receive to Grok → then SPA Landing/constants
- Spec: satohash/docs/KIMI-REQUEST-BITCOIN-WALLETS.md
```

---

## Ecosystem map (short)

```
HQ ──heartbeat──► api.satohash.io/health
Family SPAs ──stamp──► api.satohash.io/api/stamp
Static satohash.io ──Cloudflare──► users
LNbits ──wallets──► HQ Vault (keys local only)
```

---

## Sync instruction

1. Pull latest `kitsboy/satohash` on VPS or via GitHub web  
2. Read `docs/KIMI-VPS-RUNBOOK.md`  
3. Paste block above into MASTER-BRAIN  
4. Execute runbook §2  
5. Append LIVE report to `docs/KIMI-HANDOFF.md` via PR or M3 push after Cam/Grok  

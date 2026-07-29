# MASTER-BRAIN ingest — Satohash / suite proof plane

**For Kimi:** After reading `docs/ops-runbook.md` / `docs/KIMI-VPS-RUNBOOK.md`, merge the following into MASTER-BRAIN.md / Kanban / ecosystem notes on the **VPS/THOR vault**.  
**Do not invent new rules** — only record operational truth.  
**Never paste secret values into MASTER-BRAIN.**

---

## Paste block (structured)

```markdown
### Satohash proof plane (2026-07-29 — explainer + SPA reliability)

**Role:** Shared OpenTimestamps backbone for all Give A Bit products.
**Version:** **5.0.0-ELITE**
**Frontend:** https://satohash.io · www · https://satohash.giveabit.io · CF Pages `satohash`
**API:** https://api.satohash.io · THOR Docker + Caddy TLS
**Metrics:** `GET /metrics.json` — `gab.product-metrics.v1` · HQ prefers API origin
**Repo:** kitsboy/satohash · code M3 · ops Kimi/THOR
**Agent entry:** AGENTS.md · status .ai_docs/current-status.md · deploy docs/deploy.md

**SPA reliability (2026-07-28/29):**
- Hashed bundles under `/b/*` (not `/assets/*`) — avoids apex HTML-as-JS poison
- Do NOT force Content-Type + multi-year immutable on JS (SPA fallback can poison edge)
- If desync: purge Cloudflare zone **satohash.io** (not giveabit)
- Eager routes: Landing, /watch, /docs/executive-summary
- Prefer single deploy path (GH Actions Deploy workflow)

**Product story:**
- Free stamps today (`REQUIRE_LIGHTNING=false`)
- Fingerprint only → OpenTimestamps calendars → Bitcoin
- Later paywall: Lightning fee **to us**; same OTS/Bitcoin proofs
- Landing: #free-and-fees · #verify-ots
- Exec summary: /docs/executive-summary (charts + formal brief)
- Explainer: /watch · media public/media/video/
  - vo-complete.mp3 (~80s) drives slide clock
  - satohash-explainer-music.mp3 under VO
  - satohash-explainer-with-vo.mp4 downloadable mix

**CRITICAL LESSON (2026-07-27 — still true):**
- CF Pages has no `/api/*`. SPA must use VITE_API_URL=https://api.satohash.io
- Family deep-link: /stamp?hash=<64hex>&ref=<productId>
- Honest UX: pending ≠ confirmed; require real API stamp id

**Family free tier:**
- Server: FAMILY_API_KEYS, REQUIRE_LIGHTNING=false (or true + paywall)
- Client: X-Satohash-Client (+ optional X-Satohash-Key)

**Endpoints (public):**
- GET /health, /metrics.json, /api/public/status|stats|directory|network|version|readiness
- POST /api/stamp · GET /api/stamps/:id · verify/upgrade surfaces

**Code layout (post-cleanup):**
- server/index.js thin bootstrap · server/routes/* domain modules
- src/components/{layout,stamps,ui,shared,dashboard,forms,marketing}/
- docs: deploy.md, architecture.md, handoff-log.md, marketing/, archive/

**Kanban:**
- [x] SPA deep-link + verify lifecycle
- [x] SPA production API URL
- [x] Edge poison mitigation (/b/*, eager marketing routes)
- [x] Landing free/fees + exec summary + /watch explainer+VO
- [x] Docs consolidation + route/component structure
- [ ] THOR: IBD finish → bitcoind health source
- [ ] THOR: client_id + directory live on metrics if gap remains
- [ ] Optional homepage CTA → /watch
- [ ] Wallets/paywall when Cam flips

**Orchestration:** Kimi THOR. Coding: Grok M3.
```

---

## Ecosystem map (short)

```
HQ ──heartbeat──► api.satohash.io/health
Family SPAs ──stamp──► api.satohash.io/api/stamp
Static satohash.io ──Cloudflare──► users
/watch ──media──► public/media/video/* (VO+music+frames)
LNbits ──wallets──► HQ Vault (keys local only) [when enabled]
```

---

## Sync instruction

1. Pull latest `kitsboy/satohash`  
2. Read `docs/ops-runbook.md` + paste block above into MASTER-BRAIN  
3. Execute VPS runbook as needed  
4. Append LIVE report to `docs/handoff-log.md` / `docs/KIMI-HANDOFF.md`  

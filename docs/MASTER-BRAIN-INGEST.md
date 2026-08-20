# MASTER-BRAIN ingest — Satohash / suite proof plane

**For Kimi:** After reading `docs/ops-runbook.md` / `docs/KIMI-VPS-RUNBOOK.md`, merge the following into MASTER-BRAIN.md / Kanban / ecosystem notes on the **VPS/THOR vault**.  
**Do not invent new rules** — only record operational truth.  
**Never paste secret values into MASTER-BRAIN.**

---

## Paste block (2026-08-17 — family header + RAM)

```markdown
### Satohash family attribution (OPEN — Kimi)

/network tiles for motopass / sherpacarta / katoa are 0.
Each family app POST /api/stamp MUST send X-Satohash-Client: <id>.
Prefer packages/satohash-client. Deep-link fallback /stamp?hash=&ref=.
Do not change /api/* paths. REQUIRE_LIGHTNING=false.
bitcoind: daily free -h + systemctl is-active bitcoind (OOM 2026-07-28).
```

---

## Paste block (2026-08-17 — API metrics last10 LIVE)

```markdown
### Satohash API image + /network (2026-08-17 — Kimi rebuild, Grok verified)

**API:** THOR Docker `satohash-satohash-api-1` rebuilt from GitHub `main`.
**metrics.json raw:** last10=10 · familyClients=list · requireLightning=false.
**SPA /network:** calendars 3/3 · bitcoind at tip · family tiles live.
**Paywall:** REQUIRE_LIGHTNING=false — do not flip.
**Paths:** do not change live /api/*.
**Rebuild recipe:** bash scripts/vps-deploy-api.sh (THOR checkout).
**Cam/CF:** do not log into Cloudflare unless HTML-as-JS — docs/CLOUDFLARE-PAGES.md.
```

---

## Paste block (2026-08-10 — IBD COMPLETE)

```markdown
### Satohash own-node bitcoin — IBD COMPLETE (2026-08-10 — Kimi confirm)

**bitcoind:** Bitcoin Core v28.1, pruned 10GB, datadir /root/.bitcoin.
Systemd override unit /etc/systemd/system/bitcoind.service (Debian package unit points at /var/lib/bitcoin — WRONG datadir), ENABLED.
RPC 0.0.0.0:8332; API via bridge 172.19.0.1.
**History:** OOM 2026-07-28 → dead ~6d @ 508,207 → restored 2026-08-04 → IBD finished ~2026-08-08.
**Now (authoritative):** blocks at tip (e.g. 961,960/961,960); verification ~100%; initialblockdownload=false;
source=bitcoind; API height matches tip; local mempool live; deep health green. mempool.space fallback NOT in path.
**Suite:** satohash + katoa fees + tadbuy/motopass tickers + stranded stats can use local node.
**Paywall:** REQUIRE_LIGHTNING=false — free stamps ON.
**Health surface:** /api/public/readiness → .planes.bitcoin_node
```

---

## Paste block (2026-08-04 — historical: bitcoind restored mid-IBD)

```markdown
### Satohash own-node bitcoin restored (2026-08-04 — Kimi truth sweep) — HISTORICAL

**bitcoind:** Bitcoin Core v28.1, pruned 10GB, datadir /root/.bitcoin.
**Then:** source=bitcoind live; status=syncing; IBD ~20% @ ~508k; ETA ~4 days.
**Superseded:** IBD completed ~2026-08-08 — see 2026-08-10 paste block above.
```

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
  - satohash-explainer-with-vo2.mp4 (~84s) primary — Kimi/Pippa VO + dance bed
  - satohash-explainer-with-vo.mp4 (~10s) teaser toggle
  - Hash mark top-left on close · cache-bust `?v=kimi-noir-20260819`

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
- [x] THOR: IBD finish → bitcoind at tip · source bitcoind (2026-08-08/10)
- [x] THOR: client_id + directory live on metrics
- [x] Homepage CTA → /watch (~84s Kimi/Pippa cut; 10s teaser toggle)
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

# MASTER-BRAIN ingest — Satohash / suite proof plane

**For Kimi:** After reading `docs/KIMI-VPS-RUNBOOK.md`, merge the following into MASTER-BRAIN.md / Kanban / ecosystem notes on the **VPS/THOR vault**.  
**Do not invent new rules** — only record operational truth.  
**Never paste secret values into MASTER-BRAIN.**

---

## Paste block (structured)

```markdown
### Satohash proof plane (2026-07-20 — v5 Sovereignty Ascension)

**Role:** Shared OpenTimestamps backbone for all Give A Bit products.
**Version:** **5.0.0-ELITE** (Sovereignty Ascension)
**Frontend:** https://satohash.io · Cloudflare Pages project `satohash`
**API target:** https://api.satohash.io · VPS Docker (`docker-compose.vps.yml`)
**API status:** LIVE — health 200 ✅, TLS via Let's Encrypt (auto), v5 API deployed
**Metrics:** `GET /metrics.json` — `gab.product-metrics.v1` live from API origin
**Repo:** kitsboy/satohash · code on M3; orchestration on VPS (Kimi)

**Planes:**
- Proof create → public OTS calendars (alice/bob/finney)
- Proof verify independence → optional VPS pruned bitcoind (`BITCOIN_RPC_URL`)
- Settlement → VPS LND + LNbits (not used for OTS hash)
- Identity → giveabit.io NIP-05 (kimi@giveabit.io …)

**Family free tier:**
- Server env: FAMILY_API_KEYS (comma-separated)
- Client header: X-Satohash-Key + X-Satohash-Client: <project>
- Public without key: 402 if REQUIRE_LIGHTNING≠false

**v5 new public endpoints:**
- `GET /api/public/stats` — 24h stats + calendar health
- `GET /api/public/network` — Bitcoin network data (mempool.space)
- `GET /api/public/uptime|calendar-status|version|did|bitcoin|lightning`
- `GET /api/stamps/recent` — recent stamps (public)
- `GET /api/stamps/:hash/by-hash` — lookup by hash
- `GET /api/openapi.json` — OpenAPI 3.0.3 spec
- `GET /api/events/stamps`, `GET /api/events/bitcoin` — SSE streams
- `POST /api/stamps/batch`, `POST /api/stamp/multihash|webcapture|cosign|ethereum`
- `POST /api/verify/json`, `POST /api/webhooks/register`

**Existing endpoints:**
- `GET /health` — liveness (deep with `?deep=true`)
- `GET /api/public/status` — HQ heartbeat
- `GET /metrics.json` — `gab.product-metrics.v1` product metrics
- `GET /metrics` — Prometheus (admin-only)
- `POST /api/stamp` — create OTS stamp
- `GET /api/stamps/:id` — retrieve stamp

**Infrastructure:**
- Docker stack: `satohash-api` (Node 20 Alpine, pm2) + `redis:7-alpine`
- Caddy reverse proxy: HTTPS auto, `api.satohash.io → 127.0.0.1:3001`
- LNbits: CORS proxy via Caddy `:5103 → :5102`, Tailscale serve `:5101 → :5103`
- Secrets: `.env` file on VPS only — FAMILY_API_KEYS, ADMIN_KEY, JWT_SECRET, SNAPPER_KEY

**Clients shipped on main:**
motopass, katoa, giveabit, stranded, sherpacarta, tadbuy, openstrata, camtaylor, lindala
HQ: health bar + proof-plane card + live metrics via `/metrics.json`

**Kanban:**
- [x] VPS: docker up satohash-api (v5 rebuilt)
- [x] DNS+TLS api.satohash.io
- [x] v5 API deployed on THOR (git pull + rebuild)
- [x] FAMILY_API_KEYS set (vault only)
- [x] Health 200 public
- [x] /metrics.json live (gab.product-metrics.v1)
- [x] LNbits CORS proxy configured (Caddy :5103)
- [x] SPA deployed with VITE_API_URL (Grok M3)
- [x] All thin clients shipped (tadbuy, openstrata, camtaylor, lindala complete)
- [ ] DNS fully propagated (Cloudflare A+AAAA set)
- [ ] HQ green when browser DNS resolves
- [ ] BITCOIN_RPC on THOR (optional)

**Retired:** Umbrel as home stack; M4 as coding machine.
**Orchestration:** Kimi on VPS/THOR. Coding: Grok on M3.
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

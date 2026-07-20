# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Sovereignty Ascension)  
**Last Updated:** 2026-07-20  
**Frontend:** https://satohash.io  
**API:** https://api.satohash.io ✅ LIVE (THOR)

## Planes
- Proof API on VPS Docker + Caddy TLS  
- SPA on Cloudflare Pages (`VITE_API_URL=https://api.satohash.io`)  
- Family free tier + public open stamp (`REQUIRE_LIGHTNING=false` until paywall)  
- Code M3 · Orchestration Kimi/THOR  

## v5 highlights (Grok — 2026-07-20)
- Public: `/api/public/stats|uptime|calendar-status|network|version|did|bitcoin|lightning`  
- Stamps: list, recent, by-hash, batch, multihash, webcapture, cosign, proof-package, ots, chains, ipfs  
- SSE: `/api/events/stamps`, `/api/events/bitcoin`  
- OpenAPI stub, admin keys, webhooks register, eth sepolia stub, 12h pending prune  
- SPA routes: network, proof-of-existence, batch verify, live feed, community, AI hub, widget, wizard  
- CLI package `packages/satohash-cli`, client helpers expanded  

## API Deployment (2026-07-20) ✅ COMPLETE
- Docker stack running: `satohash-api` + `redis:7-alpine` — rebuilt with v5
- Health: 200 ✅ — uptime verified
- Deep health: DB, Redis, OTS calendars, Nostr — all green
- Family free tier: enabled (`REQUIRE_LIGHTNING=false`)
- DNS: A + AAAA records configured in Cloudflare
- TLS: Let's Encrypt certificate via Caddy (expires Oct 18)
- Caddy: reverse proxy `api.satohash.io:443` → `127.0.0.1:3001`
- `.env` secrets: FAMILY_API_KEYS, ADMIN_KEY, JWT_SECRET, SNAPPER_KEY — stored on VPS only
- v5 endpoints confirmed: `/api/public/stats`, `/api/openapi.json`, `/api/public/network`, `/api/public/version`, `/api/stamps/recent` — all 200 ✅

## HQ Metrics Integration (2026-07-20) ✅ COMPLETE
- `GET /metrics.json` live at `api.satohash.io/metrics.json` — `gab.product-metrics.v1` schema
- Queries real DB counts (stamps_total, pending, confirmed, 24h)
- Fills demo time series until real stamp history accumulates
- `raw.demo: false` when stamps exist in DB
- CORS allows `https://hq.giveabit.io` (via `CORS_ORIGIN` env)

## LNbits CORS (2026-07-20) ✅ CONFIGURED
- Caddy CORS proxy: `127.0.0.1:5103` → LNbits `127.0.0.1:5102`
- Tailscale serve updated: `:5101` → Caddy `:5103`
- CORS headers: `Access-Control-Allow-Origin: *`, methods, headers, max-age
- HQ origins (`https://hq.giveabit.io`, `https://giveabit-hq.pages.dev`) allowed

## Known issues
- Nostr relay publishing errors (non-critical — some relays may be down)
- No pruned bitcoind (`BITCOIN_RPC_URL` not set — optional)
- Ethereum sepolia stub — not live
- `finney.calendar.eternitywall.com` calendar unreachable (alice+bob OK)

## Next (ordered)
1. ~~Kimi: runbook §2 complete~~ ✅ **DONE**
2. ~~DNS: A + AAAA records~~ ✅ **DONE**
3. ~~v5 API container rebuilt on THOR~~ ✅ **DONE**
4. ~~/metrics.json live~~ ✅ **DONE**
5. ~~LNbits CORS configured~~ ✅ **DONE**
6. **M3: SPA deploy (`./deploy.sh`) to expose v5 pages**
7. **HQ: consume `/api/public/stats`, `/api/public/network`, `/api/stamps/recent`**
8. **Nova: cron `thor-node.json` from bitcoind/lnd**
9. Smoke family stamp (motopass)
10. Remaining clients: tadbuy, openstrata, camtaylor, lindala

## Agent entrypoints
| File | Who |
|------|-----|
| `docs/KIMI-VPS-RUNBOOK.md` | Kimi VPS |
| `docs/KIMI-HANDOFF.md` | Session log (top entry = latest) |
| `docs/FAMILY-API.md` | API contract |
| `docs/MASTER-BRAIN-INGEST.md` | Vault paste |
| `CHANGELOG-v5.md` | v5 changelog |
| `.ai_docs/current-status.md` | **Any LLM — self-evolving (update me)** |
| `.ai_docs/*` | Quick context |

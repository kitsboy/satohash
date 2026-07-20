# Current Status — Satohash

**Version:** v4.1.0-ELITE (Build 113 area; bump each commit)  
**Last Updated:** 2026-07-20  
**Frontend:** https://satohash.io · https://satohash.giveabit.io  
**API:** https://api.satohash.io ✅ **LIVE — HTTPS public**

## Truth
- **Code:** M3 Grok · GitHub kitsboy/satohash  
- **Orchestration:** Kimi on **VPS** (not Umbrel, not M4 app coding)  
- **Static:** Cloudflare Pages (secrets in GH Actions)  
- **API:** Docker on VPS ✅ **PUBLIC** — Caddy + Let's Encrypt HTTPS
- **Money:** LNbits/LND on VPS  
- **OTS create:** public calendars  
- **Node:** optional pruned bitcoind for verify  

## API Deployment (2026-07-20) ✅ COMPLETE
- Docker stack running: `satohash-api` + `redis:7-alpine`
- Health: 200 ✅ — uptime verified
- Deep health: DB, Redis, OTS calendars, Nostr — all green
- Family free tier: enabled (`REQUIRE_LIGHTNING=false`)
- DNS: A + AAAA records configured in Cloudflare
- TLS: Let's Encrypt certificate via Caddy (expires Oct 18)
- Caddy: reverse proxy `api.satohash.io:443` → `127.0.0.1:3001`
- Family stamp: smoke tested and passed
- `.env` secrets: generated and stored on VPS only

## Known issues
- Nostr relay publishing errors (non-critical — some relays may be down)
- No pruned bitcoind (`BITCOIN_RPC_URL` not set — optional)
- `cross_chain_bridges` table not created (Ethereum bridge mock — non-critical)

## Next (ordered)
1. ~~Kimi: runbook §2 complete~~ ✅ **DONE**
2. ~~DNS: A + AAAA records~~ ✅ **DONE**
3. **M3: `VITE_API_URL=https://api.satohash.io` build + deploy frontend**
4. Smoke family stamp (motopass)
5. Remaining clients: tadbuy, openstrata, camtaylor, lindala

## Agent entrypoints
| File | Who |
|------|-----|
| `docs/KIMI-VPS-RUNBOOK.md` | Kimi VPS |
| `docs/KIMI-HANDOFF.md` | Session log |
| `docs/FAMILY-API.md` | API contract |
| `docs/MASTER-BRAIN-INGEST.md` | Vault paste |
| `.ai_docs/*` | Any LLM quick context |

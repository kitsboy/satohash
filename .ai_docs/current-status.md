# Current Status — Satohash

**Version:** v4.1.0-ELITE (Build 113 area; bump each commit)  
**Last Updated:** 2026-07-20  
**Frontend:** https://satohash.io · https://satohash.giveabit.io  
**API target:** https://api.satohash.io (**DEPLOYED — DNS needed for public access**)

## Truth
- **Code:** M3 Grok · GitHub kitsboy/satohash  
- **Orchestration:** Kimi on **VPS** (not Umbrel, not M4 app coding)  
- **Static:** Cloudflare Pages (secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in GH Actions)  
- **API:** Docker on VPS ✅ **LIVE** at localhost:3001 — Caddy reverse proxy configured  
- **Money:** LNbits/LND on VPS  
- **OTS create:** public calendars  
- **Node:** optional pruned bitcoind for verify  

## API Deployment (2026-07-20)
- Docker stack running: `satohash-api` (built from Dockerfile.api) + `redis:7-alpine`
- Health: 200 ✅ — uptime ~700s, version 4.1.0-ELITE
- Deep health: DB healthy, Redis healthy, OTS calendars connected, Nostr relay connected
- Family free tier: enabled (`REQUIRE_LIGHTNING=false`)
- Family API key: generated and configured
- JWT secret: regenerated to 32 bytes (was 16)
- Caddy: reverse proxy `api.satohash.io:80` → `127.0.0.1:3001`
- Smoked: stamp creation + lookup via family key — both pass

## DNS needed for public access
**Cloudflare dashboard → satohash.io → DNS → Add records:**
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | api | `169.58.32.160` | DNS only |
| AAAA | api | `2a02:c207:2344:6772::1` | DNS only |

After DNS propagates, Caddy auto-provisions HTTPS (Let's Encrypt). Remove `:80` from Caddyfile after TLS works.

## Known issues
- CF API token is Pages-only (no DNS edit) — DNS setup needs dashboard
- `api.satohash.io` not public until DNS is configured
- Nostr relay publishing errors (expected — some relays may be down)
- Ethereum bridge mock provider — `cross_chain_bridges` table not created
- SPA `VITE_API_URL` still points at production API only after rebuild post-DNS

## Next (ordered)
1. ~~Kimi: `docs/KIMI-VPS-RUNBOOK.md` §2 complete~~ ✅ **DONE**
2. DNS: add A + AAAA records in Cloudflare dashboard
3. M3: `VITE_API_URL=https://api.satohash.io` build + deploy frontend
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

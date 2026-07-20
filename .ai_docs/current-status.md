# Current Status — Satohash

**Version:** v4.1.0-ELITE (Build 113 area; bump each commit)  
**Last Updated:** 2026-07-20  
**Frontend:** https://satohash.io · https://satohash.giveabit.io  
**API target:** https://api.satohash.io (**VPS package ready — host bring-up = Kimi**)

## Truth
- **Code:** M3 Grok · GitHub kitsboy/satohash  
- **Orchestration:** Kimi on **VPS** (not Umbrel, not M4 app coding)  
- **Static:** Cloudflare Pages (secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` in GH Actions)  
- **API:** Docker on VPS (`docker-compose.vps.yml`)  
- **Money:** LNbits/LND on VPS  
- **OTS create:** public calendars  
- **Node:** optional pruned bitcoind for verify  

## Recent milestones
- Family free tier + `/api/public/status` + satohash-client package  
- Suite thin clients: motopass, katoa, giveabit, stranded, sherpacarta  
- HQ proof-plane heartbeat UI  
- CF secrets + local wrangler deploy when Actions queued  
- Operator bible: `docs/KIMI-VPS-RUNBOOK.md` + `docs/MASTER-BRAIN-INGEST.md`

## Known issues
- `api.satohash.io` not public until Kimi runs VPS runbook  
- GitHub Actions may queue during GH outages — use `./deploy.sh` for SPA  
- SPA `VITE_API_URL` still points at production API only after rebuild post-DNS  

## Next (ordered)
1. Kimi: `docs/KIMI-VPS-RUNBOOK.md` §2 complete  
2. M3: `VITE_API_URL=https://api.satohash.io` build + deploy  
3. Smoke family stamp (motopass)  
4. Remaining clients: tadbuy, openstrata, camtaylor, lindala  

## Agent entrypoints
| File | Who |
|------|-----|
| `docs/KIMI-VPS-RUNBOOK.md` | Kimi VPS |
| `docs/KIMI-HANDOFF.md` | Session log |
| `docs/FAMILY-API.md` | API contract |
| `docs/MASTER-BRAIN-INGEST.md` | Vault paste |
| `.ai_docs/*` | Any LLM quick context |

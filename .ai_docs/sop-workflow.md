# Satohash — SOP / Workflow

**Updated:** 2026-07-20

## Architecture
- **Dev:** Express API `:3001` + Vite `:3000` (`npm run dev`)  
- **Prod SPA:** Cloudflare Pages (`./deploy.sh` or Actions Deploy)  
- **Prod API:** VPS Docker (`docker-compose.vps.yml`) → `api.satohash.io`  

## Quick start (M3)
```bash
npm install
cp .env.example .env
npm run dev
npm test
npm run api:smoke   # needs npm run server
```

## Deploy SPA
```bash
# Prefer auto: push main (needs CF secrets + healthy Actions)
git push origin main
# Backup if Actions queued:
./deploy.sh   # wrangler login once on M3
```

## Deploy API (VPS / Kimi)
```bash
# On VPS — see docs/KIMI-VPS-RUNBOOK.md
cp .env.vps.example .env   # fill secrets on server
bash scripts/vps-deploy-api.sh
```

## Family stamp
- Server: `FAMILY_API_KEYS`  
- Client: `X-Satohash-Key` + `X-Satohash-Client`  
- Contract: `docs/FAMILY-API.md`  

## Agent protocol
1. Read `AGENTS.md`  
2. Read `.ai_docs/current-status.md` + `docs/KIMI-VPS-RUNBOOK.md` if ops  
3. Work; never commit secrets  
4. Update `.ai_docs/current-status.md` + top of `docs/KIMI-HANDOFF.md`  
5. Push `origin main`  

## Constraints
- API public only after VPS DNS+TLS  
- Deep health may degrade without Redis/calendars  
- OTS create does not require LND  

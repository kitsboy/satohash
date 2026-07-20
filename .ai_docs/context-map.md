# Context Map — Satohash

**Updated:** 2026-07-20

```
satohash/
  src/                 SPA (stamp, vault, templates, i18n)
  server/              Express API (stamp, health, family key, public status)
  packages/satohash-client/   Shared thin client for family apps
  docs/
    KIMI-VPS-RUNBOOK.md      ★ Kimi operator bible
    MASTER-BRAIN-INGEST.md   ★ Vault paste block
    FAMILY-API.md
    DEPLOY-SERVER.md
    KIMI-HANDOFF.md
  docker-compose.vps.yml
  Dockerfile.api
  scripts/vps-deploy-api.sh
  scripts/api-local-smoke.sh
  .ai_docs/            Agent knowledge layer
  deploy.sh            Cloudflare Pages SPA
```

## External
- CF Pages project: `satohash`  
- GH Actions: Deploy on push main  
- VPS: Kimi + docker + optional bitcoind/LND/LNbits  

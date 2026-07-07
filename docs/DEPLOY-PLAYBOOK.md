<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 4.1.0-ELITE (Build 57) · **Updated:** 2026-07-07
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# SATOHASH ELITE DEPLOY PLAYBOOK

## Quick Reference

| Site | Source | Port | Deploy |
|------|--------|------|--------|
| **Satohash Elite** | `/home/umbrel/satohash/` | 3001 | `cd /home/umbrel/satohash && git pull && npm run production && sudo systemctl restart satohash` |
| **TadBuy** | `/home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tadbuy/` | 3002 | `cd /home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tadbuy && npm run build && sudo systemctl restart tadbuy` |
| **Stranded** | `/home/umbrel/giveabit-dashboard/sites/tools-giveabit-io/stranded/` | 3003 | `cd /home/umbrel/giveabit-dashboard/sites/tools-giveabit-io/stranded/ && git pull && npm run build && sudo systemctl restart stranded` |

## Service Commands
`sudo systemctl status satohash tadbuy stranded` — Check all
`sudo systemctl restart satohash` — Restart Satohash
`sudo journalctl -u satohash -f` — Live logs

## Deploy Workflow (M3 → GitHub → Production)

```bash
# Local: lint, test, build
npm run lint && npm test && npm run build

# Commit & push
git add -A && git commit -m "feat: your change"
git push origin main

# Deploy (pick one):
./deploy.sh                              # Cloudflare Pages (static SPA)
DEPLOY_TARGET=umbrel ./deploy.sh         # prints Umbrel restart commands
cd /home/umbrel/satohash && git pull && npm ci && npm run production && sudo systemctl restart satohash
```

CI (`.github/workflows/ci.yml`) runs lint, unit tests, build, and E2E on every push to `main`.

## Known Issues
- **TadBuy**: Build takes ~6 minutes
- **Elite Architecture**: Requires Node 20+ for Sentry performance tracing.
- **Dual deploy**: Cloudflare Pages serves static SPA; Express API must run separately (Umbrel/Docker).

---
© 2026 Satahash Institutional Division


























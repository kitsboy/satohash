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

## Known Issues
- **Satohash**: Hard refresh on `/developers` = 404 (SPA limitation - use Nginx try_files)
- **TadBuy**: Build takes ~6 minutes
- **Elite Architecture**: Requires Node 20+ for Sentry performance tracing.

---
© 2026 Satahash Institutional Division

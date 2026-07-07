<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 4.1.0-ELITE (Build 41) · **Updated:** 2026-07-07
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash Rollback Procedure

## Quick Rollback (Umbrel / PM2)

```bash
cd /home/umbrel/satohash
git log --oneline -5                    # find last good SHA
git checkout <SHA>
npm ci && npm run production
sudo systemctl restart satohash
curl -f http://localhost:3001/health?deep=true
```

## Cloudflare Pages Rollback

1. Open Cloudflare Dashboard → Pages → satohash → Deployments
2. Find the last successful deployment
3. Click **Rollback to this deployment**

Or via CLI:

```bash
wrangler pages deployment list --project-name=satohash
# Note deployment ID, then promote previous
```

## Docker Rollback

```bash
docker compose down
git checkout <SHA>
docker compose build --no-cache
docker compose up -d
docker compose ps
```

## Verify After Rollback

```bash
curl -f https://satohash.giveabit.io/health?deep=true
npm run test:e2e   # optional smoke
```

*Last updated: auto-synced by `npm run docs:sync`*









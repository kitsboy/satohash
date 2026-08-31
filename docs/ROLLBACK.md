<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 279) · **Updated:** 2026-08-31
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash Rollback Procedure

## Cloudflare Pages (production)

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **satohash**
2. **Deployments** tab
3. Find the last good deployment
4. Click **Rollback to this deployment**

Or via CLI (after `wrangler login` or `CLOUDFLARE_API_TOKEN`):

```bash
wrangler pages deployment list --project-name=satohash
```

## Verify after rollback

```bash
curl -sf https://satohash.io/ -o /dev/null && echo "Site up"
```

Open https://satohash.io/ and hard-refresh (**Cmd+Shift+R**).

*Last updated: 2026-07-07*

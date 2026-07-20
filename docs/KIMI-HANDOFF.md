## VPS — api.satohash.io LIVE — 2026-07-20

**Done:**
- Docker stack built & running on THOR: `satohash-api` (Dockerfile.api with better-sqlite3 Alpine fix) + `redis:7-alpine`
- `.env` secrets: JWT_SECRET regenerated to 32 bytes, FAMILY_API_KEYS + ADMIN_KEY + SNAPPER_KEY all configured
- Git: `Dockerfile.api` fix + `Caddyfile` committed and pushed to `kitsboy/satohash` (3904db1, c089791)
- Remote switched from HTTPS to SSH

**Results:**
- Health: 200 (direct + via Caddy)
- Public status: 200 — returns `stamps_stored: 2`
- Family stamp: ✅ Created via `X-Satohash-Key`
- Deep health: DB healthy, Redis healthy, OTS calendars connected, Nostr connected

**DNS + TLS (FINAL):**
- A record: `api.satohash.io` → `169.58.32.160` ✅ Cam added via Cloudflare dashboard
- AAAA record: `api.satohash.io` → `2a02:c207:2344:6772::1` ✅ Cam added via Cloudflare dashboard
- UFW ports 80+443 opened
- Caddy: Let's Encrypt TLS 1.3 cert issued ✅ — subject `CN=api.satohash.io`, expires Oct 18
- Tailscale Funnel turned off (was on port 443)
- Caddy reverse proxy `api.satohash.io:443` → `127.0.0.1:3001`

**FAMILY_API_KEYS:** configured (value not recorded — stored in VPS `.env` only)
**BITCOIN_RPC:** not configured (optional)
**TLS:** ✅ Let's Encrypt (expires 2026-10-18)

**Next:**
- M3 rebuild SPA with `VITE_API_URL=https://api.satohash.io`
- Smoke family stamp from motopass VerifyPage
- HQ should show Satohash API green
- Remaining thin clients: tadbuy, openstrata, camtaylor, lindala

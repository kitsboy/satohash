## M3 — SPA rebuild + smoke + suite clients — 2026-07-20 (Grok)

**Do not duplicate VPS work** — THOR API already LIVE (Kimi).

**Done on M3:**
- Confirmed public API via `169.58.32.160` + Host: health 200, public/status 200, metrics.json 200
- Open stamp smoke: POST `/api/stamp` → id `823f1cd8-…` status pending (M3 client `m3-smoke`)
- GET `/api/stamps/:id` 200
- SPA: `.env.production` with `VITE_API_URL=https://api.satohash.io` (gitignored) + `./deploy.sh`
- Live satohash.io bundle contains `api.satohash.io` (index-Dy-ChjPp.js)
- Thin clients complete: motopass, katoa, giveabit, stranded, sherpacarta, camtaylor, lindala, **tadbuy**, **openstrata**

**DNS note (M3):** Cloudflare/1.1.1.1 resolves `api.satohash.io` → `169.58.32.160`. Local Tailscale MagicDNS (`100.100.100.100`) may still fail hostname — use public DNS or wait for MagicDNS; **not a VPS bug**.

**Still optional:**
- HQ green when browser DNS resolves (refresh HQ)
- Motopass UI stamp in browser once DNS works for Cam
- BITCOIN_RPC optional on THOR

**Kimi:** no further Caddy/system work needed unless MagicDNS split-horizon desired. Do **not** re-do docker/TLS.

---

## VPS — api.satohash.io LIVE — 2026-07-20

**Done:**
- Docker stack built & running on THOR: `satohash-api` (Dockerfile.api with better-sqlite3 Alpine fix) + `redis:7-alpine`
- `.env` secrets: JWT_SECRET regenerated to 32 bytes, FAMILY_API_KEYS + ADMIN_KEY + SNAPPER_KEY all configured
- Git: `Dockerfile.api` fix + `Caddyfile` committed and pushed to `kitsboy/satohash` (3904db1, c089791)
- Remote switched from HTTPS to SSH

**Results:**
- Health: 200 (direct + via Caddy)
- Public status: 200 — returns `stamps_stored: 2+`
- Family stamp: ✅ Created via `X-Satohash-Key`
- Deep health: DB healthy, Redis healthy, OTS calendars connected, Nostr connected
- `GET /metrics.json` — gab.product-metrics.v1 ✅

**DNS + TLS (FINAL):**
- A record: `api.satohash.io` → `169.58.32.160` ✅
- AAAA record: `api.satohash.io` → `2a02:c207:2344:6772::1` ✅
- UFW ports 80+443 opened
- Caddy: Let's Encrypt TLS 1.3 cert issued ✅ — expires Oct 18
- Tailscale Funnel turned off (was on port 443)
- Caddy reverse proxy `api.satohash.io:443` → `127.0.0.1:3001`

**FAMILY_API_KEYS:** configured (value not recorded — stored in VPS `.env` only)
**BITCOIN_RPC:** not configured (optional)
**TLS:** ✅ Let's Encrypt (expires 2026-10-18)

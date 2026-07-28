<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 5.0.0-ELITE (Build 152) · **Updated:** 2026-07-28
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash API Server Deploy Guide

> **Status:** 🟢 **Packaged for VPS** — `docker-compose.vps.yml` + `scripts/vps-deploy-api.sh` + family free tier (`FAMILY_API_KEYS`). Public DNS/`api.satohash.io` still needs host bring-up by Kimi/VPS.  
> **Purpose:** Deploy `server/` (Express API) for suite stamp/verify  
> **Frontend stays:** Cloudflare Pages → https://satohash.io (unchanged)  
> **See also:** `docs/FAMILY-API.md`

---

## Architecture (target)

```
User browser
    │
    ├─► satohash.io          Cloudflare Pages (static SPA)     [LIVE TODAY]
    │
    └─► api.satohash.io      VPS (Express + SQLite)            [NOT DEPLOYED]
              │
              ├─ POST /api/stamp
              ├─ POST /api/verify
              ├─ GET  /api/stamps/:id
              ├─ GET  /api/history
              └─ upgrade daemon (pending → confirmed)

Bitcoin full node (optional, later)
    └─► your node — NOT required for MVP (public OTS calendars suffice)
```

| Layer | Host | Cost (est.) |
|-------|------|-------------|
| Static frontend | Cloudflare Pages | $0–20/mo |
| API server | VPS (see below) | $6–24/mo |
| Bitcoin node | Same VPS or home | $0 marginal if you already own it |
| Domain `api.satohash.io` | Cloudflare DNS | $0 (DNS only) |

---

## Provider comparison (Give A Bit multi-site)

You will likely run **one VPS** for several project APIs while **static sites stay on Cloudflare**.

| Provider | Best for | Monthly (2 vCPU / 4 GB) | Pros | Cons |
|----------|----------|-------------------------|------|------|
| **DigitalOcean** ⭐ | Simple multi-app VPS | ~$24 | Easy UI, Docker, backups, predictable bill | Slightly pricier than Hetzner |
| **Hetzner** ⭐ | Best value EU/US | ~$8–15 | Cheap, fast, great for Docker Compose stack | Support less hand-holdy |
| **Linode (Akamai)** | DO alternative | ~$24 | Solid, similar to DO | Less brand recognition |
| **AWS Lightsail** | If you already use AWS | ~$20 | IAM, integrates with AWS ecosystem | Confusing if you don't know AWS |
| **AWS EC2 (full)** | Enterprise scale | $50+ | Infinite scale, load balancers | Overkill, complex billing, slow to learn |

### Recommendation

| Situation | Pick |
|-----------|------|
| **You want easy + docs + one VPS for many sites** | **DigitalOcean** — $24/mo droplet, Docker Compose, Caddy reverse proxy |
| **You want lowest cost** | **Hetzner** CX22 or CPX21 (~$8–15/mo) |
| **You want AWS** | **Lightsail** only (not full EC2) unless you have a specific AWS need |

**Do not move static sites (satohash.io, giveabit.io) to the VPS.** Keep them on Cloudflare Pages — free CDN, automatic HTTPS, zero server babysitting.

### Multi-site on one VPS (future)

```yaml
# Example layout — /opt/giveabit/docker-compose.yml (not created yet)
services:
  caddy:          # HTTPS reverse proxy — ports 80/443
  satohash-api:   # :3001 → api.satohash.io
  # tadbuy-api:   # :3002 → api.tadbuy.io (Supabase may cover most of TadBuy)
  # motopass-api: # :3003 → ...
```

Caddy auto-provisions Let's Encrypt certs per subdomain.

---

## MVP API scope (deploy only this first)

| Endpoint | MVP? | Notes |
|----------|------|-------|
| `POST /api/stamp` | ✅ Required | Core product |
| `POST /api/verify` | ✅ Required | Core product |
| `GET /api/stamps/:id` | ✅ Required | Share links `/verify/:id` |
| `GET /api/stamps/:id?download=true` | ✅ Required | `.ots` download |
| `GET /api/history` | ✅ Nice | Vault sync; has localStorage fallback |
| `GET /health` | ✅ Required | DeepHealthBanner, monitoring |
| Upgrade daemon | ✅ Required | `pending` → `confirmed` |
| Forum, Lightning, admin, mesh | ❌ Defer | Hide or disable in MVP |

**Bitcoin node:** skip for MVP. Set `OTS_CALENDARS` to public alice/bob/finney (already in `.env.example`).

---

## Local smoke (before any VPS)

Run Express locally and verify core routes exist:

```bash
npm run server          # terminal 1 — http://127.0.0.1:3001
npm run api:smoke       # terminal 2 — GET /health + POST /api/stamp reachable
```

- [x] Smoke script checked in: `scripts/api-local-smoke.sh` (`npm run api:smoke`)
- [ ] Local `npm run server` returns healthy on your machine
- [ ] VPS still required for public `api.satohash.io` (no credentials in this repo)

## Pre-flight checklist

Update status as you go (`[ ]` → `[x]`).

### Account & server

- [ ] Choose provider (DO / Hetzner / Lightsail)
- [ ] Create VPS — **Ubuntu 24.04 LTS**, 2 vCPU, 4 GB RAM, 80 GB disk
- [ ] SSH key added (no password login)
- [ ] Firewall: allow 22 (SSH), 80, 443 only
- [ ] Create DNS record `api.satohash.io` → VPS IP (Cloudflare: **DNS only**, grey cloud OK for origin TLS via Caddy)

### Secrets (generate locally, never commit)

```bash
openssl rand -hex 32          # ADMIN_KEY
openssl rand -base64 48       # JWT_SECRET
openssl rand -hex 32          # SNAPPER_KEY
```

- [ ] `.env` file on server from `.env.example` (production values)
- [ ] `CORS_ORIGIN=https://satohash.io,https://satohash.giveabit.io`
- [ ] `REQUIRE_LIGHTNING=false`
- [ ] `NODE_ENV=production`

### Deploy method (pick one)

| Method | Complexity | Notes |
|--------|------------|-------|
| **Docker** (recommended) | Medium | Use repo `Dockerfile`; portable, matches prod |
| **PM2 + git pull** | Low | `ecosystem.config.cjs` already exists |
| **Docker Compose + Caddy** | Medium-high | Best for multi-site VPS |

### Frontend connection (after API is live)

Rebuild static site with API URL baked in:

```bash
cd ~/projects/satohash
VITE_API_URL=https://api.satohash.io npm run build
./deploy.sh
```

- [ ] `VITE_API_URL` set at build time
- [ ] CORS on API allows satohash.io origin
- [ ] Smoke: `curl https://api.satohash.io/health?deep=true`

### MVP UX (frontend — done in Build 85+)

- [x] `VITE_MVP_MODE` — `/stamp`, `/verify`, `/vault` public without `/access`
- [x] `DeepHealthBanner` — silent until `VITE_API_URL` is set
- [x] Landing `proofCount` — shows `—` until API returns real count
- [ ] Rebuild frontend with `VITE_API_URL=https://api.satohash.io` after API live

---

## Deploy procedure (Docker — reference)

**Do not run until checklist above is ready.**

```bash
# On VPS (first time)
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER

# Clone (or rsync from M3)
git clone https://github.com/kitsboy/satohash.git /opt/satohash
cd /opt/satohash
cp .env.example .env   # edit with real secrets

# Build & run
docker build -t satohash-api .
docker run -d \
  --name satohash-api \
  --restart unless-stopped \
  -p 127.0.0.1:3001:3001 \
  -v satohash-data:/app/data \
  --env-file .env \
  satohash-api
```

Put **Caddy** or **nginx** in front on 443 → `127.0.0.1:3001`.

---

## Deploy procedure (PM2 — reference)

```bash
cd /opt/satohash
npm ci --omit=dev
npm run build          # builds dist/ (API serves SPA fallback if needed)
pm2 start ecosystem.config.cjs --env production
pm2 save && pm2 startup
```

---

## Bitcoin node (optional — when yours is ready)

| Question | Answer |
|----------|--------|
| Needed for MVP? | **No** |
| What it adds later | Self-sovereign verification, no trust in public calendars |
| Extra setup time | **1–2 days** after node is synced |
| How to connect | Point `bitcoind` RPC in env; configure OTS to use local calendars — details TBD when node is ready |

---

## Rollback

| Layer | Action |
|-------|--------|
| API bad deploy | `docker stop satohash-api && docker run ... previous image` or `pm2 restart` previous git SHA |
| DNS | Remove or repoint `api.satohash.io` — frontend still works (degraded mode) |
| Frontend | Cloudflare Pages → Rollback deployment (see `docs/ROLLBACK.md`) |

---

## Security baseline

- SSH keys only; fail2ban optional
- Secrets in `.env` on server only — not in GitHub
- API bound to `127.0.0.1` behind reverse proxy (not public :3001)
- Cloudflare WAF optional on `api.satohash.io`
- SQLite backups: cron `cp /app/data/*.db /backups/` daily
- Rate limits already in `server/` — keep enabled

---

## Cost snapshot (one VPS, multiple APIs)

| Item | Monthly |
|------|---------|
| Hetzner CX22 | ~$8 |
| DigitalOcean 4GB | ~$24 |
| Backups addon | ~$2–5 |
| Cloudflare (frontends) | $0 |
| **Realistic total** | **~$10–30/mo** for whole Give A Bit API footprint |

---

## Evolution log

| Date | Build | Change | Status |
|------|-------|--------|--------|
| 2026-07-07 | 85+ | Frontend MVP prep — see `docs/MVP-READINESS.md` | 🟡 API gate |
| 2026-07-07 | 84 | Initial planning doc — no server provisioned | 📋 Planning |
| | | API DNS `api.satohash.io` | Not created |
| | | VPS | Not provisioned |
| | | MVP stamp/verify on production | Blocked on API deploy |

*Grok/Kimi: append a row here each time deploy state changes.*

---

## Related docs

- `docs/DEPLOY-PLAYBOOK.md` — Cloudflare static frontend (live today)
- `docs/ROLLBACK.md` — Cloudflare rollback
- `docs/FINANCIALS.md` — cost lines marked optional/not in use
- `.env.example` — all API env vars

---
© 2026 Satohash · Give A Bit

# Kimi VPS Runbook — Satohash Proof Plane

**Audience:** Kimi (VPS orchestrator) and any LLM/agent operating the Give A Bit stack  
**Code home:** M3 `~/projects/satohash` → GitHub `kitsboy/satohash`  
**Orchestration home:** **THOR VPS** (not Umbrel, not M4)  
**Vault:** **THOR Obsidian / MASTER-BRAIN** — not M4 Obsidian. GitHub handoffs are pulled on THOR.  
**Updated:** 2026-08-29  

This is the **executable** handoff. Copy relevant bullets into MASTER-BRAIN / Kanban after sync.

### Open requests (read full specs)

| Spec | Action |
|------|--------|
| `docs/KIMI-REQUEST-BITCOIN-WALLETS.md` | LNbits wallet **`satohash`**, public on-chain + LUD-16, keys → HQ Vault, public handback to Grok |
| `docs/KIMI-REQUEST-SATOHASH.md` | Stamp plane status + Docker rebuild for `client_id` / metrics directory |
| `docs/LEARN-STAMP-FAMILY.md` | Why SPA must call `api.satohash.io` (not CF same-origin) |
| `docs/KIMI-HANDOFF.md` | Top entry = latest Grok session |

---

## 0. Truth table (do not unlearn)

| Layer | Where | Notes |
|-------|--------|--------|
| Product code | M3 + GitHub | Grok edits here; Kimi does **not** develop app trees |
| Static sites | Cloudflare Pages | e.g. satohash.io |
| Satohash API | **VPS Docker** | Target: `https://api.satohash.io` |
| Bitcoin pruned node | VPS | Optional verify independence (`BITCOIN_RPC_URL`) |
| LND + LNbits | VPS | Settlement / wallets — **not** OTS hashing |
| Public OTS calendars | Internet | Create aggregated timestamps |
| HQ control panel | `kitsboy/HQ` | Ops glass; LNbits + future API heartbeat |
| Namespace / NIP-05 | giveabit.io | `kimi@giveabit.io` etc. |
| Secrets | VPS env + password manager + GH Actions secrets | **Never** git, chat, or MASTER-BRAIN values |

---

## 1. What M3 already shipped (pull this)

Repo: **https://github.com/kitsboy/satohash** branch `main`

| Path | Purpose |
|------|---------|
| `docker-compose.vps.yml` | API + Redis |
| `Dockerfile.api` | API-only image |
| `.env.vps.example` | Env template (copy on VPS → `.env`) |
| `scripts/vps-deploy-api.sh` | One-shot bring-up |
| `docs/FAMILY-API.md` | Free-tier + client contract |
| `packages/satohash-client/` | Shared JS client for family apps |
| `server/middleware.js` | `FAMILY_API_KEYS` + `X-Satohash-Key` |
| `GET /health` | Liveness |
| `GET /metrics.json` | HQ SoT — includes `raw.last10` + `raw.familyClients` (**live 2026-08-17**) |

**Done (2026-08-17):** API image rebuilt from `main`. Live `metrics.json` has `raw.last10` and `raw.familyClients`. Do not change `/api/*` paths. Keep `REQUIRE_LIGHTNING=false`. Future rebuild: `bash scripts/vps-deploy-api.sh`.
| `GET /api/public/status` | HQ / suite heartbeat (no secrets) |
| `POST /api/stamp` | Create OTS (family key or paywall or open) |

**Frontend live:** https://satohash.io (Build ~111+; local wrangler deploy when Actions queued)  
**CF secrets (names only):** `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` on `kitsboy/satohash` Actions  

**Family thin clients (already on main):**

| Repo | Client id header | Notes |
|------|------------------|--------|
| motopass | `motopass` | VerifyPage API stamp + fallback deep link |
| katoa | `katoa` | Settings → Timestamp with Satohash |
| giveabit | `giveabit` | `src/lib/satohash.js` |
| stranded | `stranded` | `lib/satohash.ts` |
| sherpacarta | `sherpacarta` | `src/lib/satohash.js` |
| HQ | n/a | Health bar → `/health`; proof-plane card |

---

## 2. YOUR job on VPS (ordered — do all)

### 2.1 Prerequisites on VPS
- [ ] Docker + Docker Compose plugin installed  
- [ ] Git access to `kitsboy/satohash` (PAT or deploy key — **store on VPS only**)  
- [ ] Ports 80/443 free for reverse proxy; 3001 only on localhost if possible  
- [ ] Cloudflare DNS access for `api.satohash.io`  

### 2.2 Pull and env
```bash
# Suggested path — adjust to your VPS layout
cd /opt/giveabit   # or wherever suite lives
git clone https://github.com/kitsboy/satohash.git   # first time
cd satohash
git fetch origin && git checkout main && git pull origin main

cp .env.vps.example .env
# Edit .env on server only:
#   FAMILY_API_KEYS=$(openssl rand -hex 24)
#   ADMIN_KEY=...
#   JWT_SECRET=...   # ≥32 chars
#   REQUIRE_LIGHTNING=false   # open stamp for family MVP; flip later for public paywall
#   CORS_ORIGIN=https://satohash.io,https://giveabit.io,... (see example)
#   PUBLIC_API_URL=https://api.satohash.io
# Optional:
#   BITCOIN_RPC_URL=... BITCOIN_RPC_AUTH=...   # pruned node
```

### 2.3 Start stack
```bash
bash scripts/vps-deploy-api.sh
# or: docker compose -f docker-compose.vps.yml up -d --build
curl -sf http://127.0.0.1:3001/health
curl -sf http://127.0.0.1:3001/api/public/status
```

### 2.4 DNS + TLS
- [ ] Cloudflare DNS: `api.satohash.io` **A/AAAA** → VPS public IP  
- [ ] Prefer **DNS only** (grey cloud) if origin TLS via Caddy/nginx  
- [ ] Caddy/nginx reverse proxy: `https://api.satohash.io` → `127.0.0.1:3001`  
- [ ] Confirm: `curl -sf https://api.satohash.io/health`  
- [ ] Confirm: `curl -sf https://api.satohash.io/api/public/status`  

### 2.5 Family key distribution (private vault only)
- [ ] Store `FAMILY_API_KEYS` value in VPS secret store / password manager  
- [ ] Tell Cam (or set CI) **names only** when done — never paste key into GitHub issues/chat  
- [ ] When SPA rebuilds need free stamp: set `VITE_SATOHASH_KEY` in **private** build env (Cloudflare Pages env / local `.env` gitignored)  
- [ ] Client header: `X-Satohash-Key` + `X-Satohash-Client: <project>`  

### 2.6 Optional Bitcoin node wire
- [ ] If pruned bitcoind on same VPS, set `BITCOIN_RPC_URL` (+ auth)  
- [ ] Re-check `GET /health?deep=true` → `details.bitcoin`  

### 2.7 Report back (MASTER-BRAIN + handoff)
Append to **this repo** `docs/KIMI-HANDOFF.md` (or Cam’s sync channel):

```markdown
## VPS — api.satohash.io LIVE — YYYY-MM-DD
- Health: 200
- Public status: 200
- FAMILY_API_KEYS: configured (value not recorded)
- BITCOIN_RPC: yes/no
- TLS: yes
- Reverse proxy: caddy/nginx
```

Update MASTER-BRAIN Kanban: **Satohash API = LIVE**.

---

## 3. After API is live — M3 / Grok next (not blocking VPS)

1. Rebuild satohash SPA: `VITE_API_URL=https://api.satohash.io npm run build && ./deploy.sh`  
2. Smoke family stamp from motopass VerifyPage  
3. HQ should show Satohash API green  
4. Thin clients for tadbuy, openstrata, camtaylor, lindala (copy package)  

---

## 4. Data transfer rules (Kimi ↔ Grok ↔ Cam)

| Allowed in git / MASTER-BRAIN | Never store there |
|------------------------------|-------------------|
| Status, SHAs, URLs, checklists | API tokens, family keys, JWT, LND macaroons, CF tokens |
| “Secrets configured: yes” | Actual secret strings |
| Architecture diagrams | SSH private keys |
| Agent NIP-05 handles | Nostr nsec |

**Sync path:** GitHub `docs/KIMI-HANDOFF.md` + this runbook → Kimi pulls into **THOR VPS Obsidian / MASTER-BRAIN** (not M4).  
**No full chat logs** — structured bullets only.

---

## 5. Smoke commands (copy-paste)

```bash
# Local on VPS
curl -sS http://127.0.0.1:3001/health | head
curl -sS http://127.0.0.1:3001/api/public/status | head

# Public
curl -sS https://api.satohash.io/health
curl -sS https://api.satohash.io/api/public/status

# Family stamp (replace KEY; hash is dummy 64 hex of zeros for reachability only — may 400/402)
curl -sS -X POST https://api.satohash.io/api/stamp \
  -H 'Content-Type: application/json' \
  -H 'X-Satohash-Client: kimi-smoke' \
  -H "X-Satohash-Key: $FAMILY_KEY" \
  -d '{"hash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","filename":"smoke.txt"}'
```

---

## 6. Failure guide

| Symptom | Check |
|---------|--------|
| Actions forever Queued | GitHub outage; use M3 `./deploy.sh` for SPA |
| 402 on stamp | Need `X-Satohash-Key` or `REQUIRE_LIGHTNING=false` |
| CORS errors from apps | `CORS_ORIGIN` must list app origins; headers include `X-Satohash-*` |
| Health unhealthy deep | Redis/OTS calendars; deep is best-effort |
| better-sqlite3 native | Rebuild in Docker image (Dockerfile.api already npm ci on alpine) |

---

## 7. Related docs (read order for any LLM)

1. This file — `docs/KIMI-VPS-RUNBOOK.md`  
2. `docs/FAMILY-API.md`  
3. `docs/DEPLOY-SERVER.md`  
4. `docs/KIMI-HANDOFF.md` (latest session first)  
5. `.ai_docs/current-status.md`  
6. `.ai_docs/ecosystem-links.md`  
7. `docs/MASTER-BRAIN-INGEST.md` — paste block for vault  

---

*Safe Harbour · Give A Bit · Proof plane = Satohash · Orchestration = VPS Kimi*

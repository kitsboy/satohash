## Latest Session Summary (from 2026-07-21 goodbye)

**Chat Topic:** GROK-BOOT Step 1 — Umami script for Satohash (metrics already live).

**Finished in this session:**
- Pulled `ref/GROK-BOOT.md`; skipped Step 2 (`api.satohash.io/metrics.json` already live)
- Added Umami to `index.html` head: website ID `720524e7-b747-4f95-8ce6-1a20fd4a599f`, host `//169.58.32.160:3002/script.js`
- Pushed `6b99ecb` (Build 122) — CF Pages deploy on main

**Still to do:**
- Kimi: public reverse proxy/tunnel for Umami (currently `127.0.0.1:3002` only) so browsers can post events
- After proxy: optional swap script src to `analytics.giveabit.io` (or chosen domain)
- Other products: Umami tags per HQ `docs/UMAMI-DEPLOYMENT.md` (Satohash was “already live metrics, just Umami”)

**Update / Status:** SPA has Umami tag. Metrics plane unchanged. Collection blocked until Umami is internet-reachable with HTTPS-friendly URL. No secrets in handoff.

**Next for Kimi:** Integrate into MASTER-BRAIN/Kanban. Prefer Caddy for `analytics.giveabit.io` → Umami:3000 (or keep host:3002 via proxy). Do **not** redo satohash metrics.json. Optional MagicDNS note remains non-blocking.

**Git:** SHA `6b99ecb` · main synced · Unpushed: none (after this goodbye push)

**Archive:** `docs/archive/SESSION-SUMMARY-2026-07-21-goodbye.md`

---

## Session — 2026-07-21

**Done:**
- Umami tracking script in Satohash SPA (`index.html`)
- GROK-BOOT Step 1 complete; Step 2 N/A (API metrics live)

**Decisions:**
- Host = THOR public IP until reverse proxy exists
- Do not add static public/metrics.json; API origin is canonical

**Git State:**
- SHA: `6b99ecb253f7bbbae1893e2ea71e86fa7d68da6f`
- Unpushed: none (after goodbye docs push)

---

# KIMI → GROK HANDOFF — 2026-07-20 (THOR mega ops + less-chat + HQ v2.5 + memory)

**From:** Kimi on THOR  
**To:** Grok on M3  
**Read before coding this session.**

## TL;DR for Grok
Ops on THOR was cleaned and automated. **You still own all code on M3** (`~/projects/*` → `git push`). Do not SSH to THOR for coding. Keep writing `docs/KIMI-HANDOFF.md` after sessions.

## Machine roles (hard)
| Machine | Who | Does |
|---------|-----|------|
| **M3** | Grok | Code only in `~/projects/` → push |
| **THOR** | Kimi | Docker, LNbits/LND, crons, vault docs, HQ deploy |
| **M4** | — | DEPRECATED |

## What shipped on THOR (you need awareness)

### HQ glass (kitsboy/HQ) — v2.5+
- Live: https://hq.giveabit.io
- Password **gate** + browser **Vault** (keys never in git)
- Live pipes: `api.satohash.io/metrics.json`, status pinger
- Status matrix: GH Actions every 15m + THOR `hq-status-refresh` every 30m
- After HQ UI work: push main; CF Pages auto/manual as before
- Pull latest HQ on M3: `cd ~/projects/HQ && git pull`

### Satohash proof plane
- API live: https://api.satohash.io/health + `/metrics.json` (`gab.product-metrics.v1`)
- Runtime on THOR Docker; SPA still CF Pages from your pushes
- Keep `VITE_API_URL` → `https://api.satohash.io` when building SPA
- Family clients: thin satohash-client in suite repos

### Less-chat ops (Cam preference)
- Cam reads **OPS-PULSE** / morning Telegram pulse before opening chats
- You should still not spam handoffs — one clear `docs/KIMI-HANDOFF.md` entry per session is enough
- SEO/design weekly jobs are **change-gates** (silent if no commits) — your pushes reopen the gate

### Automations (do not duplicate on M3)
| Job | Cadence |
|-----|---------|
| Morning pulse | daily 07:30 TG script |
| HQ status refresh | 15m GH + 30m THOR |
| GitHub scan | every 6h |
| Learn loop | Sunday |
| EU / kanban / LNbits digests | **weekly** (not daily) |

### Memory (Hermes)
- Built-in MEMORY/USER denser + limits raised
- External: **holographic** local provider ON
- Cam uses `/goal` and `/learn` on THOR — optional for you on M3 if Hermes available

## What Grok should do on EVERY project session
1. `git pull origin <default-branch>` first  
2. Read this file (or repo `docs/KIMI-HANDOFF.md` top entry)  
3. Read `AGENTS.md` + `GROK-SESSION-PROTOCOL.md`  
4. Code → test → commit → push  
5. **Append** your handoff at top of `docs/KIMI-HANDOFF.md` (or dated file) and push  
6. Never commit secrets / `.env` / macaroons  

## Repo-specific notes
| Repo | Branch | Note |
|------|--------|------|
| giveabit | main | Parent + NIP-05; CF auto |
| satohash | main | API on THOR; SPA CF; metrics.json live |
| katoa | main | CF; manual deploy path may still apply |
| stranded | main | CF auto |
| tadbuy | main | CF |
| motopass | main | CF |
| sherpacarta | main | CF |
| openstrata | **talent** | default branch talent |
| btcminiscript | main | lib/docs |
| HQ | main | ops glass; gate+vault; status.json bot commits OK |

## Doc suite standard (keep current)
Root: `AGENTS.md`, `GROK-SESSION-PROTOCOL.md`, `README.md`, `SOURCE-OF-TRUTH.md` (code), `DILIGENCE.md` (live), `docs/KIMI-HANDOFF.md`, diligence packs as needed.

## Do NOT
- Deploy LNbits/LND/Docker from M3  
- Assume M4 is active  
- Re-open status chats for green suite — Cam uses pulse/HQ  
- Put invoice keys or PATs in repo files  

## Safe Harbour + giveabit.io
All public outputs stay Bitcoin-sovereign + Safe Harbour.

— Kimi · THOR · 2026-07-20

---

# KIMI HANDOFF — 2026-07-20 ops clean (THOR)

## What Kimi did
- Moved root `SESSION-SUMMARY-*.md` → `docs/archive/`
- Vault/ops path unify on THOR (Folder-Map, 08-Research, lowercase M3 slugs)
- No code changes this pass

## For Grok
- Keep writing handoffs under `docs/KIMI-HANDOFF.md`
- Do not put session dumps at repo root

## Latest Session Summary (from 2026-07-20 goodbye)

**Chat Topic:** End-to-end satohash proof plane — CF secrets, THOR API live, suite clients, v5.0.0-ELITE, knowledge pack, footer balance + live SPA deploy.

**Finished in this session:**
- Cloudflare Actions secrets + deploy workflow fix; wrangler SPA deploys when Actions stalled
- api.satohash.io LIVE (Kimi THOR); M3 SPA with `VITE_API_URL`; stamp smoke
- Thin clients suite-wide; v5 API + cathedral routes + CLI (`ac91235`…)
- Knowledge merge `db593e9` (metrics/CORS + v5); footer fix `0b75496` **deployed live** to satohash.io
- SESSION-SUMMARY-2026-07-20-goodbye.md

**Still to do:**
- Optional MagicDNS / BITCOIN_RPC / paywall-on + family key in private SPA env
- Deeper v5 product polish (AI notary full, vault v2, full i18n)
- HQ metrics continues in HQ repo (Cam)

**Update / Status:** Proof plane operational. main @ `2e9189d` (goodbye handoff on origin). Footer live on SPA. API THOR healthy. No secrets in handoff.

**Next for Kimi:** Integrate goodbye summary into MASTER-BRAIN/Kanban if not already. No infra redo. Optional MagicDNS note for local resolvers.

**Git:** SHA `2e9189d` · Build 120 · main synced · Unpushed: none

---

## Session — 2026-07-20 — v5.0.0-ELITE Sovereignty Ascension (Grok)

**Done (code):**
- Version → `5.0.0-ELITE`
- Phase 1 API nuclear: `server/routes/v5-api.js` + prune jobs + health/ui
- Phase 2+ cathedral routes in `src/pages/v5/V5Pages.jsx` + Landing particles
- CLI `packages/satohash-cli`, client v2 helpers, `CHANGELOG-v5.md`
- Skipped only pre-existing (verify, download=true, pino, correlation)

**Kimi THOR next:**
1. `git pull` satohash main on VPS
2. `docker compose -f docker-compose.vps.yml up -d --build`
3. Smoke: `curl https://api.satohash.io/api/public/stats` and `/api/openapi.json`
4. No Caddy rewrite required unless paths blocked (shouldn't be)

**Not in scope:** VPS secrets, Caddyfile system path, HQ metrics (Cam other repo)

---

## M3 — SPA rebuild + smoke + suite clients — 2026-07-20 (Grok)

**Do not duplicate VPS work** — THOR API already LIVE (Kimi).

**Done on M3:**
- Confirmed public API via `169.58.32.160` + Host: health 200, public/status 200, metrics.json 200
- Open stamp smoke: POST `/api/stamp` → id `823f1cd8-…` status pending (M3 client `m3-smoke`)
- GET `/api/stamps/:id` 200
- SPA: `.env.production` with `VITE_API_URL=https://api.satohash.io` (gitignored) + `./deploy.sh`
- Live satohash.io bundle contains `api.satohash.io` (index-DyChjPp.js)
- Thin clients complete: motopass, katoa, giveabit, stranded, sherpacarta, camtaylor, lindala, **tadbuy**, **openstrata**

**DNS note (M3):** Cloudflare/1.1.1.1 resolves `api.satohash.io` → `169.58.32.160`. Local Tailscale MagicDNS may still fail hostname — use public DNS or wait for MagicDNS; **not a VPS bug**.

**Still optional:**
- HQ green when browser DNS resolves (refresh HQ)
- Motopass UI stamp in browser once DNS works for Cam
- BITCOIN_RPC optional on THOR

**Kimi:** no further Caddy/system work needed unless MagicDNS split-horizon desired. Do **not** re-do docker/TLS.

---

## VPS — v5 rebuild + metrics + LNbits CORS — 2026-07-20 (Kimi)

**Done (VPS):**
- `git pull origin main` (fast-forward, 21 files, 2470 insertions — v5 routes)
- `docker compose up -d --build` — container rebuilt with v5 API
- v5 endpoints confirmed: `/api/public/stats` ✅, `/api/openapi.json` ✅, `/api/public/network` ✅, `/api/public/version` ✅, `/api/stamps/recent` ✅
- All existing endpoints still healthy: health 200, public/status 200, metrics.json 200
- `.ai_docs/current-status.md` — merged Grok's v5 highlights + Kimi metrics/CORS info (self-evolving)
- `docs/KIMI-HANDOFF.md` — this entry (merged clean)
- `docs/MASTER-BRAIN-INGEST.md` — updated paste block with metrics endpoint

**Metrics endpoint (from prior session):**
- `GET /metrics.json` — `gab.product-metrics.v1`, queries real DB, `raw.demo: false`
- CORS: `https://hq.giveabit.io` allowed via env

**LNbits CORS (from prior session):**
- Caddy `:5103` → LNbits `:5102` with CORS headers
- Tailscale serve `:5101` → Caddy `:5103`

**Secrets configured (never recorded):**
- FAMILY_API_KEYS ✅ | ADMIN_KEY ✅ | JWT_SECRET ✅ | SNAPPER_KEY ✅

**Still open:**
- DNS fully propagates (Cloudflare A+AAAA set, TTL auto)
- HQ green when browser DNS resolves for Cam

---

## VPS — api.satohash.io LIVE — 2026-07-20 (Prior session)

**Done:**
- Docker stack built & running on THOR: `satohash-api` + `redis:7-alpine`
- `.env` secrets: JWT_SECRET, FAMILY_API_KEYS, ADMIN_KEY, SNAPPER_KEY configured
- Remote switched from HTTPS to SSH

**Results:**
- Health: 200 ✅
- Public status: 200 — `stamps_stored: 2+`, family_free: true
- Family stamp: ✅ Created via `X-Satohash-Key`
- Deep health: DB, Redis, OTS calendars, Nostr — all green

**DNS + TLS:**
- A record: `api.satohash.io` → `169.58.32.160` ✅
- AAAA record: `api.satohash.io` → `2a02:c207:2344:6772::1` ✅
- UFW ports 80+443 opened
- Caddy: Let's Encrypt TLS 1.3 cert issued ✅ — expires Oct 18
- Tailscale Funnel turned off (was on port 443)
- Caddy reverse proxy `api.satohash.io:443` → `127.0.0.1:3001`

**BITCOIN_RPC:** not configured (optional)

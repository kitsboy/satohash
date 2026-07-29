## Session — 2026-07-29 (Grok) — EXPLAINER VO + DOCS CLOSEOUT /goodbye

**From:** Grok · **Status:** Prod SPA + explainer complete · free stamps · handoffs updated

### Done
- `/watch` explainer: graphics + `satohash-explainer-music.mp3` + **`vo-complete.mp3` (~80s)** VO-driven slides
- Eager `/watch` + executive-summary (no lazy chunk desync)
- Landing free/fees + exec summary charts + formal brief + nav mobile drawer
- Docs: AGENTS, deploy, architecture, handoff-log, MASTER-BRAIN-INGEST, current-status, LATEST-UPDATE
- Server routes split + components folders (prior in same mega-thread)

### Paths for Kimi
- Media: `public/media/video/` (VO, music, frames, `satohash-explainer-with-vo.mp4`)
- Player: https://satohash.io/watch
- MASTER-BRAIN paste: `docs/MASTER-BRAIN-INGEST.md`
- Status: `.ai_docs/current-status.md`

### Kimi open
- IBD → bitcoind · metrics client_id · optional homepage CTA → /watch · wallets when Cam flips

### Standing
REQUIRE_LIGHTNING=false · no secrets · HQ metrics API SoT · purge apex satohash.io if HTML-as-JS returns

---

## Session — 2026-07-28 (Grok) — PRODUCTION CLOSEOUT BOW

**From:** Grok · **Status:** Almost full prod · free stamps · bow-tied

### Done this closeout (M3)
- **www.satohash.io** added to Cloudflare Pages project `satohash` via API → **HTTP 200** (was 522)
- CORS example updated for www + hq + suite hosts (Kimi: merge into live THOR `.env` CORS_ORIGIN)
- `docs/PROD-CLOSEOUT.md` written
- API stamp smoke + readiness still green; bitcoin still mempool until IBD done (expected)

### Answers to Kimi Q1–Q6 (binding defaults)
1. **www** — Grok fixed CF Pages domain attach. You: no THOR action. Confirm curl www=200 from THOR.
2. **IBD** — Let run overnight; report next session when `source: bitcoind`. No email cron required.
3. **Backup** — **(a) local only** for now. Off-site when Cam provides target.
4. **ANTHROPIC** — No. Local ML only until Cam OOB key.
5. **AI when paid** — Hard default: **soft rate-limit later if needed; stay public until Cam says gate**. Do **not** auto-gate AI on REQUIRE_LIGHTNING=true without Cam yes.
6. **CORS** — Add if missing: `https://www.satohash.io`, `https://www.satohash.giveabit.io`, `https://hq.giveabit.io`, `https://giveabit-hq.pages.dev`, `https://www.giveabit.io`. No others required.

### Standing orders (unchanged)
REQUIRE_LIGHTNING=false · HQ metrics API only · no secrets in handoffs · bitcoind a+b · SQLite backup keep

### Cam optional
HQ Vault invoice paste · free-vs-paid (default free) · Claude key later

---

## Session — 2026-07-28 (Grok) — flip-ready paywall/node + AI ML + damus + nav

**From:** Grok · **Kimi paste:** `docs/KIMI-POWER-PROMPT-REBUILD-2026-07-28.md`

### Code shipped (main)
- Paywall: free default; when REQUIRE_LIGHTNING=true issues LNbits invoices (family keys still free)
- `GET /api/public/readiness` — full flip checklist
- Bitcoin RPC lib + health/public bitcoin own-node path
- LNbits wallet/invoice helpers; lightning balance live when env set
- AI: local embeddings + fraud ML + semantic search; /api/ai/embed, /api/ai/fraud
- Nostr: kind 1 + 1063, damus retries, more relays
- Nav: pill center rail, fuller hover chrome
- CF Functions: /metrics.json + /api/metrics proxy (SPA domain)

### Cam intent
- Keep free stamps now
- Everything ready to turn on (node, LN, paywall) at a moment’s notice
- Deeper AI running (local ML now; Claude if key)

### Kimi
Rebuild + wire BITCOIN_RPC + LNBITS env (still REQUIRE_LIGHTNING=false). Full paste prompt in docs/KIMI-POWER-PROMPT-REBUILD-2026-07-28.md

---

## POWER BRIEF — Kimi ops (2026-07-28) — v5.0.0 full rebuild: AI, Nostr, paywall-ready

**From:** Grok on M3 → `15eb4d7` feat: flip-ready paywall/node/LN, local AI ML, damus Nostr, nav pill  
**To:** Next Kimi or Grok session  
**Cam intent:** Full operational readiness — AI notary, Bitcoin node prep, LNbits paywall flip-ready, Nostr multi-relay. **No secrets in git.**

### Status: ✅ ALL PASS (2026-07-28 18:22 UTC)

| Check | Result |
|-------|--------|
| `GET /health` | 200 — `version` **`5.0.0-ELITE`** |
| `GET /api/public/readiness` | 200 — paywall `free_open`, ready_to_enable `True`, LNbits `configured=True` |
| `POST /api/ai/embed` | 200 — dim=64, model=`satohash-local-bow-v1` |
| `POST /api/ai/fraud` | 200 — risk=`medium`, score=0.5161, model=`satohash-fraud-ml-v1` |
| `GET /api/ai/search` | 200 — count=2 |
| `GET /api/nostr/health` | 6/7 relays ok; damus.io relay-side rejection |
| `GET /api/public/bitcoin` | mempool.space fallback (height 959,998) — no bitcoind on THOR |
| `GET /api/public/lightning` | configured=true, lnbits=true, ready_for_paywall=true, 21 sats |
| `GET /metrics.json` | ✅ `gab.product-metrics.v1`, `productId: satohash`, health green |
| HQ card | 🟢 GREEN — unchanged, still live feed |

### Env configured on THOR (.env updated — values not shown)
- `LNBITS_URL` + `LNBITS_INVOICE_KEY` — Satohash wallet paywall-ready ✅
- `STAMP_PRICE_SATS=21` ✅
- `REQUIRE_LIGHTNING=false` (free stamps) ✅
- `NOSTR_RELAYS` — multi-relay configured ✅
- `NOSTR_SECRET_KEY` — persistent, backed up off-box ✅
- `BITCOIN_RPC_URL` + auth — wired (bitcoind IBD in progress) ✅

### Bitcoin node — PRUNED BITCOIND IBD IN PROGRESS ✅
- **Installed:** Bitcoin Core v28.1 on THOR
- **Config:** Pruned 10GB, dbcache=500MB (tuned for 8GB RAM)
- **Swap:** Increased to **8GB** (was 6GB) to prevent OOM during IBD
- **IBD status:** Blocks ~138k/960k (14%) · Headers 100% · bitcoind PID running
- **Endpoint:** `/api/public/bitcoin` shows `mempool.space` until IBD completes; `readiness` shows `bitcoin_node.configured=True, status=unhealthy` (expected during IBD)
- **API env:** BITCOIN_RPC_URL + auth wired (never committed)
- **Fallback:** mempool.space until IBD done; acceptable permanent fallback policy
- **Backups:** Daily cron at 06:00 UTC → `/root/satohash/backups/` (7-day retention)
- **NOSTR_SECRET_KEY:** Backed up to THOR ops vault (not git)

### Lightning / Paywall
- LNbits Satohash wallet — invoice key on API env (paywall flip-ready).
- Paywall **NOT enabled** (`REQUIRE_LIGHTNING=false`). Ready to flip with `REQUIRE_LIGHTNING=true`.
- Stamp price: 21 sats (configurable via `STAMP_PRICE_SATS`).
- Cam still needs to paste same invoice key into HQ Vault for Money tab display (browser-only, needs vault password).

### What's left for Grok
- damus.io relay: relay-side rejection (anti-spam), not our code. Confirmed in Nostr logs.
- SPA `satohash.io/metrics.json` — confirm intent (keep as CF Function proxy or static mirror?)
- Any ANTHROPIC_API_KEY for deeper LLM notary? (local embed/fraud works without it)
- Bitcoin node: want Kimi to set up pruned bitcoind on THOR? Or mempool.space fallback is fine?

### Git state
- HEAD: `15eb4d7` — feat: flip-ready paywall/node/LN, local AI ML, damus Nostr, nav pill
- Handoff updated: this file + `HQ/docs/KIMI-HANDOFF.md`

### Do this now (ordered)
1. **API rebuild on THOR**
   ```bash
   cd ~/projects/satohash   # or your THOR path
   git pull origin main
   docker compose -f docker-compose.vps.yml up -d --build
   ```
2. **Smoke after rebuild**
   ```bash
   curl -sS https://api.satohash.io/health | jq .
   curl -sS https://api.satohash.io/api/public/version | jq .
   curl -sS https://api.satohash.io/metrics.json | jq '{schema,productId,health,updatedAt}'
   curl -sS -X POST https://api.satohash.io/api/stamp -H 'Content-Type: application/json' \
     -H 'X-Satohash-Client: kimi-smoke' -d '{"hash":"'"$(openssl rand -hex 32)"'","filename":"kimi-smoke.txt"}' | jq .
   ```
   Expect health version **5.0.0-ELITE** (not 4.1.0).
3. **HQ metrics (hq.giveabit.io)**
   - Satohash feed **must** be `https://api.satohash.io/metrics.json` (not satohash.io SPA mirror, not localhost).
   - In HQ `projects.json` / status matrix: productId `satohash`, schema `gab.product-metrics.v1`.
   - CORS already allows `https://hq.giveabit.io` when `CORS_ORIGIN` set on API — confirm env on THOR.
   - Refresh HQ status job / hard-refresh glass until satohash cell is **green**.
4. **Umami** — proxy **already live** at `analytics.giveabit.io`. Do **not** re-point products at raw THOR IP:3002. Admin UI stays Tailscale/localhost.
5. **Optional (Cam switches — leave free tier unless Cam says paywall)**
   - `REQUIRE_LIGHTNING=false` stays for family free stamps.
   - Optional `BITCOIN_RPC_URL` if pruned node ready.
   - Prior wallet request still open: L1 + Lightning for real paywall when Cam wants it (`docs/KIMI-REQUEST-BITCOIN-WALLETS.md` if present).
6. **Master-brain / kanban**
   - Mark: Umami suite + collect ✅ · metrics API ✅ · API version string needs rebuild ⬜ · HQ pipe to api.satohash.io ⬜ until you confirm green.

### Do NOT
- SSH code from M3 or invent new deploy paths  
- Commit `.env` / keys / macaroons  
- Rebuild Umami reverse proxy if already on analytics.giveabit.io  
- Point HQ at SPA static metrics only  

### M3/Grok owns (not you)
- SPA/header UI polish, vault/AI hub code, CF Pages pushes  
- After you rebuild API, Cam/Grok can browser-smoke SPA  

---

## Latest Session Summary (from 2026-07-28 whatsup + nav polish)

**Chat Topic:** Umami smoke, suite tags, v5 polish, dirty tree; then professional header/nav; full Kimi ops brief for HQ.

**Finished (Grok/M3):**
- Umami + suite tags verified live
- AI Notary hub interactive; vault AES-GCM import fix
- Header/nav Institutional Noir hover polish (DesktopNavLayout + marketing + app nav)
- This POWER BRIEF written for Kimi (paste-ready also in chat)

**Still Kimi:**
- THOR `git pull` + API Docker rebuild
- HQ green on `api.satohash.io/metrics.json`
- Optional wallets / BITCOIN_RPC / paywall (Cam gate)

**Git:** main synced after push · no secrets

**Archive:** `docs/archive/SESSION-SUMMARY-2026-07-28-whatsup.md`

---

## Session — 2026-07-28

**Done:**
- Umami collect smoke + suite live verification
- AI Notary hub interactive polish
- Vault encrypted import/export parity (v2)
- docs:sync + metrics mirror + version hygiene
- Professional header/nav hover system
- Full Kimi POWER BRIEF (HQ metrics + API rebuild)

**Decisions:**
- Leave `REQUIRE_LIGHTNING=false` until Cam enables paywall
- BITCOIN_RPC THOR-only optional
- HQ SoT for satohash metrics = **api.satohash.io/metrics.json**

**Git State:**
- See tip after commit/push

---

## Session — 2026-07-27 (pointer — full Kimi list on HQ)
#### 2026-07-27 — M4 back in game

**Cam + full Kimi priority list:** `kitsboy/HQ` → `docs/KIMI-HANDOFF.md` **MASTER LIST** (top).

## 2026-07-27 — Nostr + OTS fixes (Kimi on THOR)

**What was fixed:**
- **Nostr relay publishing** — Root cause: Node v20 (Docker `node:20-alpine`) lacks global `WebSocket`. Fixed by polyfilling `globalThis.WebSocket` via `undici`'s built-in WebSocket (no extra npm install needed).
  - ✅ `nos.lol` and `snort.social` now connect and publish successfully
  - ❌ `relay.damus.io` still rejects connections (relay-side anti-spam, not our code)
  - ✅ Persistent `NOSTR_SECRET_KEY` set so bot identity survives restarts
- **OTS calendar health check** — Now tests all 3 calendars (alice, bob, finney) individually instead of only pinging alice. Reports per-calendar status. Healthy requires ≥2/3.
- **Current-status.md** — Updated known issues: Ethereum deferred per Cam, bitcoin node optional, damus.io noted as relay-side rejection.

## 2026-07-27 — M4 + THOR cleanup (Kimi)

**What was done:**
- M4 Hermes Desktop v0.19.0 live → THOR via SSH tunnel :9119
- THOR watchdog installed — checks every 5min, auto-restarts gateway after 3 fails
- Persistent memory consolidated: 19→15 entries (94%→77%)
- State.db vacuumed, old logs/dumps cleared (17MB+17MB)
- Docker build cache pruned (31G→23G disk)
- Swap doubled: 2GB→4GB
- HQ metrics auto-pushed

**For Grok next session:**
- ⚡ **Git pull first:** `cd ~/Projects/satohash && git pull`
- M4 is now online with Hermes Desktop + Grok Build — same setup as M3
- THOR has auto-recovery watchdog — no more panic if Hermes goes down

## POWER BRIEF — Kimi ops (2026-07-28) — make Satohash fully operational + HQ green

**From:** Grok on M3 · **To:** Kimi on THOR  
**Cam intent:** Solve remaining ops so Satohash is clean operational + metrics feed **https://hq.giveabit.io** (not hw).  
**Code is already on GitHub main** — your job is THOR pull/rebuild, smoke, HQ wiring. **No secrets in git.**

### Live facts (verified 2026-07-28 — all ✅ now)

| Check | Result |
|-------|--------|
| `GET https://api.satohash.io/health` | 200 — `details.version` **`5.0.0-ELITE`** ✅ |
| `GET https://api.satohash.io/api/public/version` | `5.0.0-ELITE` ✅ |
| `GET https://api.satohash.io/metrics.json` | 200 · schema `gab.product-metrics.v1` · **canonical for HQ** ✅ |
| `GET https://satohash.io/metrics.json` | 200 static mirror (may lag) — **do not treat as SoT** |
| `GET https://analytics.giveabit.io/script.js` | 200 · CF Worker → Umami on THOR ✅ |
| `POST https://analytics.giveabit.io/api/send` | 200 · collection works ✅ |
| Suite Umami tags | Live on all 9 suite products ✅ |
| Git main | Synced from M3; rebuilt + pushed status.json ✅ |
| HQ Satohash card | 🟢 **GREEN** — live data, 7 stamps all time, 100% confirm rate ✅ |

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

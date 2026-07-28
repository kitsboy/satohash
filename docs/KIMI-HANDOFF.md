## Latest Session Summary (from 2026-07-28 whatsup closeout)

**Chat Topic:** Confirm Umami live hits + suite tags + v5 polish slice + dirty tree.

**Finished in this session:**
- Umami smoke: `GET https://analytics.giveabit.io/script.js` 200; `POST /api/send` 200 (satohash website id) — proxy live
- Live suite Umami tags verified on giveabit, katoa, tadbuy, motopass, HQ, sherpacarta, stranded, openstrata, satohash
- AI Notary hub (`/ai` via V5Pages): interactive template suggest, compliance scan, proof search against API
- Vault v2 fix: import now decrypts AES-GCM-PBKDF2 export (was broken legacy XOR / 4.1.0-only check)
- Health default version string → 5.0.0-ELITE; template suggest JSON parse hardened
- Dirty tree cleaned: `docs:sync`, refreshed `public/metrics.json` from API, package-lock version pin
- No secrets committed (`.env.production` remains local)

**Still to do (ops / product switches — not flipped without Cam):**
- Kimi: pull + rebuild satohash API container so live `/health` stops reporting 4.1.0 fallback when `npm_package_version` unset
- Optional: `REQUIRE_LIGHTNING=true` paywall when Cam wants paid stamps (keep free tier until then)
- Optional: `BITCOIN_RPC_URL` on THOR for node-backed verify
- BTC Miniscript: no public SPA entry — skip Umami tag

**Update / Status:** Analytics plane green. Suite tags present on live sites. SPA AI hub + vault backup round-trip fixed. i18n:check still all green. Metrics static mirror refreshed. No secrets in handoff.

**Next for Kimi:** Note Umami proxy already works (no redo). Optional API image rebuild for version string. Integrate this summary into MASTER-BRAIN/Kanban. Continue wallet request from prior handoff if open.

**Git:** tip after push · main · Unpushed: none after push

**Archive:** `docs/archive/SESSION-SUMMARY-2026-07-28-whatsup.md`

---

## Session — 2026-07-28

**Done:**
- Umami collect smoke + suite live verification
- AI Notary hub interactive polish
- Vault encrypted import/export parity (v2)
- docs:sync + metrics mirror + version hygiene

**Decisions:**
- Leave `REQUIRE_LIGHTNING=false` (family free tier) until Cam explicitly enables paywall
- BITCOIN_RPC remains THOR-only optional env
- Do not invent Umami tags for btcminiscript (docs/lib, no SPA)

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

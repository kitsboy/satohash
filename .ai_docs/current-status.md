# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Build 278)  
**Last Updated:** 2026-08-31 (Grok 4.6 — /goodbye after Pages stability)  
**Frontend:** https://satohash.io · www · CF Pages project **`satohash`** — **stable** (`ec1c69e`, entry `/b/index-D_2O1MUS.js`)  
**API:** https://api.satohash.io ✅ LIVE (THOR Docker, image from `78e2a8f`)  
**Metrics SoT:** `https://api.satohash.io/metrics.json` (`raw.last10` + `raw.familyClients` **live**)  
**HQ:** https://hq.giveabit.io  
**Git:** `main` @ `ec1c69e`+ (Pages stability on `origin/main`)  
**Kimi vault:** **THOR VPS Obsidian** (not M4)  
**Analytics:** Umami `analytics.giveabit.io` — **not** Google Analytics  
**Search:** GSC property `https://satohash.io/` **verified** · sitemap.xml **Success, 69 pages**

## Planes

| Plane | Where | Notes |
|-------|--------|--------|
| SPA | CF Pages → satohash.io | **Grok lane.** Kimi cannot alter Pages. Grok has standing auth to push SPA fixes. Must call `https://api.satohash.io` |
| API | THOR Docker + Caddy | `satohash-satohash-api-1` healthy |
| Metrics | API `/metrics.json` | SPA `/metrics.json` is CF Function proxy |
| Bitcoin | THOR bitcoind | Own node **at tip** · `source: bitcoind` · IBD **done** |
| Explainer | `/watch` | **~84s** Kimi/Pippa cut (vo2) · 10s teaser toggle · hash mark top-left on close |
| Bundles | `/b/*` | Do not revert to long-cache `/assets/*`. Stamp/Verify **eager**. VitePWA `injectRegister: false` |

**Code = M3 / Grok. Ops = Kimi / THOR.** No Umbrel. Do not fight M4 for coding.

## Non-negotiables (standing)

1. Never commit secrets.  
2. Do not change live `/api/*` paths without an explicit Cam request.  
3. Do not break `public/_redirects` or `GET /metrics.json`.  
4. Do not rename package name or `VITE_API_URL`.  
5. **Free stamps:** `REQUIRE_LIGHTNING=false`. Proofs = OTS → Bitcoin.  
6. SPA → `https://api.satohash.io` only.  
7. Version SoT: `package.json` (`5.0.0-ELITE`).  
8. **Pages = Grok.** When Kimi cannot alter Pages, Grok pushes. Do not wait for a second ask.

## Bitcoin (THOR)

| Field | Value |
|-------|--------|
| Public source | **bitcoind** (mempool.space is fallback only) |
| Blocks | **at tip** |
| Verification | **~100%** |
| initialblockdownload | **false** |
| Pruned | 10 GB · healthy |
| Service | systemd `bitcoind` enabled |
| Mempool | local node live |
| ready_to_verify | **true** |

## Product surfaces

| Path | Notes |
|------|--------|
| `/` | Landing · live node chip · Watch explainer |
| `/stamp` | Free stamp · STEP 1–3 · **eager** (no lazy hang) |
| `/stamp/done` | Success · share `/p/<hash>` · **eager** |
| `/verify` | Public verify · **eager** |
| `/p/<hash>` | Zero-JS Function proof card (iMessage JPEG `01-stamp-hero.jpg`) |
| `/network` | Live calendars, bitcoind tip, recent stamps, family tiles, Notes on Nostr |
| `/status` · `/counsel` | Public status · counsel one-pager |
| `/watch` | ~84s Kimi/Pippa · 10s teaser · `?v=kimi-noir-20260819` |
| Language | en es fr de pt sw zh |

## Metrics (verified live 2026-08-17)

| Key | Value |
|-----|--------|
| `raw.requireLightning` | **false** |
| `raw.last10` | **10** rows |
| `raw.familyClients` | **17** rows (list; zeros for unused family ids) |
| Family with counts | public 6 · spa 4 · kimi/e2e/mvp smoke 1 each |
| Sherpa / MotoPass / Katoa | **0** attributed stamps (honest) |

## This session (2026-08-31, later)

- [x] Kimi incident: `/stamp` + `/verify` hang / System Desync flash  
- [x] Root: lazy chunks imported HTML entry + SW / preload / ErrorBoundary reload loop  
- [x] Fix live `ec1c69e` — eager Stamp/Verify; `injectRegister: false`; no auto hard-reload  
- [x] Pages Deploy **success**; live entry `/b/index-D_2O1MUS.js`; Cam: “Much better!”  
- [x] Standing rule: **Pages = Grok**; Kimi cannot alter Pages; Grok does not wait to push SPA fixes  
- [x] GSC verified · sitemap Success 69 · NIP-05 · authored API · paywall off (from earlier today)

## Ops still open

- [ ] Physical iPhone Safari share of `/p/<hash>` (JPEG unfurl) — Cam skipped earlier  
- [ ] Pin `/watch` on **`@give_bit`** (do not wait on `@satohashio`; `@satohash` taken)  
- [ ] Family tiles: Katoa / Sherpa / Giveabit still **0** attributed (widget exists; nobody stamped through them)  
- [ ] Kind-0 Nostr profile + RSS→Nostr cron (`scripts/nostr-publish-feed.js`; nsec on THOR only)  
- [ ] **Kimi:** daily bitcoind RAM (`free -h`)  
- [ ] Paywall only when Cam flips (`docs/PAYWALL-STAGING.md`) — LND not configured  
- [ ] Remaining npm advisories (`opentimestamps` tree) — do **not** `--force`  
- [x] `/stamp` `/verify` System Desync flash  
- [x] GSC sitemap  
- [x] THOR API includes authored.js  
- [x] CSP **enforcing**  
- [x] Stamp rate limit 5/min public · reuse existing hash  
- [x] Longer educational MP4 (~84s Kimi cut) **shipped**  

## Local ports (M3 / Cam)

Satohash Vite may use **3002**. **Do not** `npm run dev` (API defaults to **3001**) while Accountable needs 3001 in another session. Live SPA always talks to `api.satohash.io`. HyperFrames Studio also defaults to 3002.

## Agent entry

**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/ops-runbook.md` · `docs/CLOUDFLARE-PAGES.md` · `docs/MASTER-BRAIN-INGEST.md` · `docs/EXPLAINER-MUSIC-AND-VO.md`

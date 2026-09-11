# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Build 331+)  
**Last Updated:** 2026-09-11 (Grok — live family widgets QA + /stamp Choose-file first)  
**Frontend:** https://satohash.io · www · CF Pages project **`satohash`** — Grok lane, `assetsDir: 'b'`  
**API:** https://api.satohash.io ✅ LIVE (THOR Docker). Confirm SHA with `GET /health` (`gitSha`). **Live now: `e979e69`** until Kimi rebuilds. **Kimi copy-paste:** `cd /root/satohash && git fetch origin && git reset --hard origin/main` then `GIT_SHA=$(git rev-parse --short HEAD) bash scripts/vps-deploy-api.sh`. Image **818MB**, `Cache-Control: no-store`, Caddy reload OK, paywall off, ~298 stamps + CLI=1.  
**Metrics SoT:** `https://api.satohash.io/metrics.json`  
**HQ:** https://hq.giveabit.io  
**Git:** `main` (this push)  
**Kimi vault:** **THOR VPS Obsidian** (not M4)  
**Analytics:** Umami `analytics.giveabit.io` — **not** Google Analytics  
**Search:** GSC property `https://satohash.io/` **verified**

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
| `/` | Landing · live node chip · Watch explainer · hero CTA = Stamp + Watch only |
| `/proof-pack` | Free waitlist (not for sale; no email; localStorage + @give_bit) |
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
| Family with counts | live `raw.familyClients` — do not invent zeros; read metrics.json |
| Sherpa / Katoa / Giveabit | attributed stamps exist (honest live counts; not 0) |

## This session (2026-09-11 — #12 / #13 / #17)

- [x] Landing hero: Stamp (gold, first thumb, full-width mobile) + Watch (gold border). Video kept below CTAs. Templates/donate stay out of that row.
- [x] Batch stamp: `X-Satohash-Client: spa`, Retry-After on 429 (else 2s, retry once), zip named `{hash-prefix}-{filename}.ots` + README.txt, `data-testid=batch-download-zip`
- [x] `/proof-pack` free waitlist — not for sale, no `/api/waitlist`, no email. Pricing links it.
- [ ] Push SPA when Cam wants

## This session (2026-09-08 — leftover 18 + knowledge)

- [x] Remaining 18 of the last 20: government compact footers, 2 more learn OG JPEGs, thinner info ring (1.15px, still **one** gold circle), docs prefetch `/verify`, OpenAPI calendar-status, smoke learn JPEG, Network `/p/` aria-label, counsel `scroll-mt-24`, Safari `fontVariantNumeric`, sqlite `analysis_limit=400`
- [x] Info icon: one gold ring around a plain i (not Lucide-in-a-ring)
- [x] Docs/maps: this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/MASTER-BRAIN-INGEST.md` · `docs/ops-runbook.md`
- [x] THOR rebuild live **`e979e69`** (`analysis_limit` in this image)
- [x] 2026-09-11 20-item wave (share, waitlist, prerender, PWA sync-only, CLI stamp, family widgets, client retries)
- [ ] Pin `/watch` on **`@give_bit`** (paste-ready: `docs/marketing/GIVE-BIT-X-PACK.md`)
- [ ] Physical iPhone `/p/<hash>` unfurl (HTML already JPEG `01-stamp-hero.jpg`)

## This session (2026-08-31, later)

- [x] Kimi incident: `/stamp` + `/verify` hang / System Desync flash  
- [x] Root: lazy chunks imported HTML entry + SW / preload / ErrorBoundary reload loop  
- [x] Fix live `ec1c69e` — eager Stamp/Verify; `injectRegister: false`; no auto hard-reload  
- [x] Pages Deploy **success**; live entry `/b/index-D_2O1MUS.js`; Cam: “Much better!”  
- [x] Standing rule: **Pages = Grok**; Kimi cannot alter Pages; Grok does not wait to push SPA fixes  
- [x] GSC verified · sitemap Success 69 · NIP-05 · authored API · paywall off (from earlier today)

## Ops still open

- [ ] Physical iPhone Safari share of `/p/<hash>` (JPEG unfurl)  
- [ ] Pin `/watch` on **`@give_bit`** (not `@satohash`)  
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

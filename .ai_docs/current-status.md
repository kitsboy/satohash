# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Build 247)  
**Last Updated:** 2026-08-29 (Grok 4.6 — goodbye)  
**Frontend:** https://satohash.io · www · CF Pages project **`satohash`**  
**API:** https://api.satohash.io ✅ LIVE (THOR Docker)  
**Metrics SoT:** `https://api.satohash.io/metrics.json` (`raw.last10` + `raw.familyClients` **live**)  
**HQ:** https://hq.giveabit.io  
**Git:** `main` @ `f02a575`  
**Kimi vault:** **THOR VPS Obsidian** (not M4)  
**Analytics:** Umami analytics.giveabit.io (CORS noise possible)

## Planes

| Plane | Where | Notes |
|-------|--------|--------|
| SPA | CF Pages → satohash.io | Must call `https://api.satohash.io` — never same-origin `/api/*` |
| API | THOR Docker + Caddy | `satohash-satohash-api-1` healthy |
| Metrics | API `/metrics.json` | SPA `/metrics.json` is CF Function proxy |
| Bitcoin | THOR bitcoind | Own node **at tip** · `source: bitcoind` · IBD **done** |
| Explainer | `/watch` | **~84s** Kimi/Pippa cut (vo2) · 10s teaser toggle · hash mark top-left on close |
| Bundles | `/b/*` | Do not revert to long-cache `/assets/*` |

**Code = M3 / Grok. Ops = Kimi / THOR.** No Umbrel. Do not fight M4 for coding.

## Non-negotiables (standing)

1. Never commit secrets.  
2. Do not change live `/api/*` paths without an explicit Cam request.  
3. Do not break `public/_redirects` or `GET /metrics.json`.  
4. Do not rename package name or `VITE_API_URL`.  
5. **Free stamps:** `REQUIRE_LIGHTNING=false`. Proofs = OTS → Bitcoin.  
6. SPA → `https://api.satohash.io` only.  
7. Version SoT: `package.json` (`5.0.0-ELITE`).

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
| `/stamp` | Free stamp · STEP 1–3 copy live |
| `/stamp/done` | Success · share `/p/<hash>` |
| `/verify` | Public verify |
| `/p/<hash>` | Zero-JS Function proof card (iMessage JPEG OG) |
| `/network` | Live calendars, bitcoind tip, recent stamps, family tiles |
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

## This session (2026-08-19 → 2026-08-20)

- [x] git pull · whatsup recovery  
- [x] Rebuild `/watch` full cut: HyperFrames product-launch video  
- [x] Kimi character lock (user reference) · HeyGen **Pippa** VO · dance bed ~15%  
- [x] Institutional Noir motion (not stock stills)  
- [x] Satohash hash mark small, top-left, last ~3s  
- [x] Pushed `f64463f` — Pages `/watch` · HyperFrames https://hyperframes.dev/p/915356ed-8e2f-4c6e-97a4-d931b33b1341  
- [x] **Kimi (2026-08-20):** fixed `health.js` lib import paths (`./lib/*` → `../lib/*`) — bitcoin + lightning checks were erroring since route extraction. Deep health now all-green: bitcoind healthy (963332, 100%), LNbits healthy, OTS 3/3, Nostr 2/3. Commit `0bf6b54` pushed.  
- [x] **Kimi (2026-08-20):** LNbits postgres backup cron added (06:30 daily, 14-day retention, 600 perms) — 9 family wallets now recoverable. First backup verified 19:17 UTC.  

## Ops still open

- [x] **Kimi (2026-08-20):** All 9 LNbits wallets now have live LNURL-pay addresses (`<site>@api.satohash.io:8443`) + giveabit.io `.well-known/lnurlp/` stubs resolve to real LNbits callbacks. SherpaCarta was the only live one before; now: giveabit, satohash, katoa, motopass, openstrata, stranded, tadbuy, kimi, sherpa — all PAYREQ + invoice generation verified. Family registry: `giveabit.io/wallets.json`. HQ Money Plane (v3.32.1) shows every site's rails.
- [ ] **Kimi:** Sherpa / MotoPass / Katoa send `X-Satohash-Client` (tiles still 0)  
- [ ] **Kimi:** daily bitcoind RAM (`free -h`)  
- [ ] Paywall only when Cam flips (`docs/PAYWALL-STAGING.md`)  
- [ ] Physical iPhone Safari (friends share `/p/<hash>`)  
- [ ] Remaining 22 npm advisories — do not `--force`  
- [x] CSP **enforcing**  
- [x] Stamp rate limit 5/min public · reuse existing hash  
- [x] One deploy path documented (no CF Retry)  
- [x] Longer educational MP4 (~84s Kimi cut) **shipped**  

## Local ports (M3 / Cam)

Satohash Vite may use **3002**. **Do not** `npm run dev` (API defaults to **3001**) while Accountable needs 3001 in another session. Live SPA always talks to `api.satohash.io`. HyperFrames Studio also defaults to 3002.

## Agent entry

**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/ops-runbook.md` · `docs/CLOUDFLARE-PAGES.md` · `docs/MASTER-BRAIN-INGEST.md` · `docs/EXPLAINER-MUSIC-AND-VO.md`

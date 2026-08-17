# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Build ~240)  
**Last Updated:** 2026-08-17 (Grok 4.6 — goodbye)  
**Frontend:** https://satohash.io · www · CF Pages project **`satohash`**  
**API:** https://api.satohash.io ✅ LIVE (THOR Docker, image rebuilt 2026-08-17)  
**Metrics SoT:** `https://api.satohash.io/metrics.json` (`raw.last10` + `raw.familyClients` **live**)  
**HQ:** https://hq.giveabit.io  
**Git:** `main` — see tip after this docs push  
**Analytics:** Umami analytics.giveabit.io (CORS noise possible)

## Planes

| Plane | Where | Notes |
|-------|--------|--------|
| SPA | CF Pages → satohash.io | Must call `https://api.satohash.io` — never same-origin `/api/*` |
| API | THOR Docker + Caddy | `satohash-satohash-api-1` healthy after Kimi rebuild |
| Metrics | API `/metrics.json` | SPA `/metrics.json` is CF Function proxy |
| Bitcoin | THOR bitcoind | Own node **at tip** · `source: bitcoind` · IBD **done** |
| Explainer | `/watch` | **10s** Kimi teaser |
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
| Blocks | **at tip** (e.g. 962,903 on 2026-08-17) |
| Verification | **~100%** |
| initialblockdownload | **false** |
| Pruned | 10 GB · healthy |
| Service | systemd `bitcoind` enabled |
| Mempool | local node live |
| ready_to_verify | **true** |

## Product surfaces

| Path | Notes |
|------|--------|
| `/` | Landing · live node chip · Watch 10s |
| `/stamp` | Free stamp · STEP 1–3 copy live · card no longer clips |
| `/stamp/done` | Success · share `/p/<hash>` |
| `/verify` | Public verify |
| `/p/<hash>` | Zero-JS Function proof card (iMessage JPEG OG) |
| `/network` | Live calendars, bitcoind tip, recent stamps, **family tiles** |
| `/status` · `/counsel` | Public status · counsel one-pager |
| `/watch` | 10s teaser |
| Language | en es fr de pt sw zh |

## Metrics (verified live 2026-08-17)

| Key | Value |
|-----|--------|
| `raw.requireLightning` | **false** |
| `raw.last10` | **10** rows |
| `raw.familyClients` | **17** rows (list; zeros for unused family ids) |
| Family with counts | public 6 · spa 4 · kimi/e2e/mvp smoke 1 each |
| Sherpa / MotoPass / Katoa | **0** attributed stamps (honest) |

## Recent closeout (2026-08-17)

- [x] Zero-JS `/p/<hash>` card + JPEG OG  
- [x] Stale-chunk harden (`lazyWithReload` + boot reset)  
- [x] Lean landing (no V5 barrel) · serialized Pages deploys  
- [x] Cam CF guide — `docs/CLOUDFLARE-PAGES.md` (do **not** log in unless broken)  
- [x] CI workflow **enabled** (was `disabled_manually`) · `workflow_dispatch` · Node 22  
- [x] `npm audit` is **advisory** in CI (does not skip tests)  
- [x] Bundle budget = HTML entry only (not every `index-*.js`)  
- [x] Safe `npm audit fix` 63 → 22 (no `--force`; leftover is OTS/`request`)  
- [x] **Kimi rebuilt API image** — last10 + familyClients live  
- [x] `/network` verified against live data  

## Ops still open

- [ ] **Kimi:** Sherpa / MotoPass / Katoa send `X-Satohash-Client` (tiles still 0)  
- [ ] **Kimi:** daily bitcoind RAM (`free -h`)  
- [ ] Paywall only when Cam flips (`docs/PAYWALL-STAGING.md`)  
- [ ] Physical iPhone Safari (friends share `/p/<hash>`)  
- [ ] Remaining 22 npm advisories — do not `--force`  
- [x] CSP **enforcing** (2026-08-17)  
- [x] Stamp rate limit 5/min public · reuse existing hash  
- [x] One deploy path documented (no CF Retry)  

## Local ports (M3 / Cam)

Satohash Vite may use **3002**. **Do not** `npm run dev` (API defaults to **3001**) while Accountable needs 3001 in another session. Live SPA always talks to `api.satohash.io`.

## Agent entry

**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/ops-runbook.md` · `docs/CLOUDFLARE-PAGES.md` · `docs/MASTER-BRAIN-INGEST.md`

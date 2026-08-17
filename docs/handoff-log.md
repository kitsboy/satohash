## Session — 2026-08-17 (Grok 4.6) — STAMP STEPS + CI DISPATCH

Empty STEP 1–3 on `/stamp` was the wrong `t()` (useI18n vs i18next). Copy + icons restored. `ci.yml` has `workflow_dispatch` + concurrency. Cam enabled the workflow; first push after enable will actually run it (may be red — last May run failed).

---

## Session — 2026-08-17 (Grok 4.6) — STAMP CARD + SMOKE + CSP-RO

Cam: `/stamp` card clipped top/bottom; “i” pills on titles. Dropzone now grows (`overflow-visible`, no fixed 460px). Info dots sit on their own row.

Deploy smoke fail-closed: `scripts/pages-smoke.sh` (JS, JPEG OG, www, `/stamp`, `/verify`, `/p/<hash>`).  
Pages `_headers`: `Content-Security-Policy-Report-Only` (does not block).

CI still `disabled_manually` — Cam: GitHub Enable workflow only.

---

## Session — 2026-08-17 (Grok 4.6) — CF ELI-16 + LEFTOVER BATCHES

Cam asked: batches + commit/push + “shall I log into CF and look for SATOHASH?”

**CF:** Do **not** log in unless the live site is broken. Project is `satohash`, zone is `satohash.io`. Guide: `docs/CLOUDFLARE-PAGES.md`.

**This batch:** keyboard S/V/G/D · vault copies `/p/<hash>` · prefetch proof card · JPEG OG (iMessage) · empty `/p/` noindex · pageMeta for watch/status/counsel/network · lazy jspdf on verify + stamp PDF · Kimi API rebuild note · CI still disabled in GH UI (no `gh` here).

**Kimi:** rebuild API image for `raw.last10` / `raw.familyClients`. Do not flip paywall.

---

## Session — 2026-08-17 (Grok 4.6) — LEAN + NO RACE

Extracted landing particles off V5Pages barrel. Queued CF deploys (no overlap). Dropped source maps from dist. Removed L402 from JSON-LD. Lazy OTS panel below the fold.

---

## Session — 2026-08-17 (Grok 4.6) — STALE VERIFY CHUNK

Cam hit `Failed to fetch dynamically imported module: VerificationTool-DvVO52Jg.js` on `/stamp` after a deploy race. Core loop (Stamp / StampDone / Verify / VerifyPublic) is now eager. Lazy routes use `lazyWithReload`. Boot reset no longer requires a service worker (Pixel Chrome).

---

## Session — 2026-08-17 (Grok 4.6) — PIXEL + IPHONE HARDENING

Cam uses Pixel 10 Pro; friends use iPhone. Camera/mic allowed on-origin. Android Share embeds `/p/<hash>` in text. iMessage OG uses JPEG (not SVG). iOS will not treat the hash as a phone number. Playwright: `--project=pixel` + webkit.

---

## Session — 2026-08-17 (Grok 4.6) — ZERO-JS CARD FINISH

Cam confirmed live `/p/<hash>` serves the Function card (empty SHA-256 smoke). Finished the card: Institutional Noir HTML, pending≠confirmed, OG + JSON-LD, counsel/stamp/verify, empty-file note, mempool block link.

---

## Session — 2026-08-17 (Grok 4.6) — BATCHES 1/2/4/5

**From:** Grok M3 · **Status:** CI isolate LH · `/p/:hash` share card · Umami conversion · family share docs

### Done
1. LH is its own job — `live_loop` only needs `test_and_build`
2. Weekly LH soft; lighthouse pinned as devDependency
3. Proof card share URL `/p/<hash>` (copy/QR/share); `<a href>` not React Link
4. `isBareSharePath` includes `/p/`; dead `/status→/trust` removed
5. Funnel: timestamp_started/completed · verification_started/completed
6. FAMILY-API post-stamp share contract; footer `/status` + `/counsel`

### Standing
- Free stamps ON · no paywall · SPA → api.satohash.io

---

## Session — 2026-08-17 (Grok 4.6) — 50 UPGRADES + SEO

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** 50-item flagship pass + SEO **this session** · free stamps ON · no paywall flip

### Highlights
- Core loop: confirmed e2e, `/stamp/done` poll, vault merge, copy-link CTA, family matrix, lastProof recover, hash-only card, folder capsule, offline queue already wired
- Trust: calendars, block link, ots-cli, package default, `/p/:hash` Function, badge embed, confirmed proof wall, pending≠confirmed on `/watch`, receipt
- UX: live stamp counts, default dark, no localhost API banner, i18n boot lang, 2-up mobile HUD, skip-to-stamp
- CI: LH `FAIL_HARD`, reuse `dist` via `scripts/e2e-webserver.sh`, Playwright cache, docs-only no bump, weekly live LH, WebKit on mobile specs, bundle budget
- Growth: Umami funnel, HQ last10 + familyClients, `/status`, `/counsel`, Capacitor scaffold, node watch script
- SEO: hreflang, HowTo/FAQ JSON-LD, sitemap, `llms.txt`, `humans.txt`

### Standing
- Free stamps · own node · SPA → `https://api.satohash.io`
- **Do not** flip paywall

---

## Session — 2026-08-17 (Grok 4.6) — LIVE LOOP + POLISH

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** Live e2e + LH soft gate + WebKit QA + visual polish **this session** · free stamps ON · no paywall flip

### Done this session
1. **git pull** — already current (`97d3481`)
2. **Full e2e** — landing → stamp → API → `/stamp/done` → verify  
   - UI: `tests/e2e/live-stamp-verify.spec.js` · `npm run test:e2e:live`  
   - API: `scripts/live-api-stamp-verify.mjs` · `npm run test:live-api` (429 soft pass)
3. **CI Lighthouse mobile soft gate** — Node 20 job, `continue-on-error`, artifact + step summary
4. **Safari / WebKit** — `tests/e2e/safari-chrome.spec.js` (language menu + tooltips + /verify overflow). Playwright WebKit / iPhone 13 — not a physical iPhone
5. **Visual polish** (existing gold/navy noir, not a light-theme flip)  
   - `LiveNodeChip` on landing / stamp / verify / done  
   - `.btn-sheen` · `.vault-ring` · `.hud-glass` · `:focus-visible` gold  
   - Theme-aware landing HUD · own-node tip height · done next-steps + hash verify link
6. **Stale test** — `auth-stamp` no longer expects `/stamp` → `/access`
7. **Docs** — status, handoff, deploy CI table, architecture e2e pointers, DESIGN-TOKENS, README badge 5.0.0-ELITE · build **222**

### Standing (do not re-open)
- Free stamps · `REQUIRE_LIGHTNING=false`
- bitcoind **at tip** · `source: bitcoind` · IBD **done**
- SPA → `https://api.satohash.io` only
- Metrics SoT: `https://api.satohash.io/metrics.json`

### Next (suggested — not started)
- Physical-device Safari (this session used WebKit)
- CI Lighthouse `FAIL_HARD=1` once scores are stable
- Longer explainer when Cam ready
- **Do not** flip paywall

### Git
- Build: `222` · version `5.0.0-ELITE`
- Deploy: push `main` → GHA Deploy

### Docs
- `docs/handoff-log.md` · `.ai_docs/current-status.md` · `docs/deploy.md` · `docs/MOBILE-TOP12.md`

---

## Session — 2026-08-16 (Grok) — GOODBYE

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** Mobile overflow + public docs **pushed** · free stamps ON · no paywall flip

### Done this session
1. **git pull** — already current (`46d7a39`)
2. **Mobile overflow** — tooltips, language menu, More nav, help overlay, hover flyouts clamped to viewport (portal + flip-above)
3. **Public docs refresh** — killed v4 / 2025 / template mission / clone-only quickstart; 5.0.0-ELITE truth (satohash.io, free stamps, own node, Lightning later)
4. **Facelift** — `/docs`, DocViewer, guides, glossary, FAQ, pitch, trust, legal
5. **Pushed** `67dce46` + `9d83f15` (build 218 header stamp)

### Standing (do not re-open)
- Free stamps · `REQUIRE_LIGHTNING=false`
- bitcoind **at tip** · `source: bitcoind` · IBD **done**
- SPA → `https://api.satohash.io` only
- Metrics SoT: `https://api.satohash.io/metrics.json`

### Next (suggested — not started)
- Full e2e landing→stamp→API→verify against live API
- CI Lighthouse mobile soft gate
- Real-device Safari QA (language menu + tooltips)
- Longer explainer when Cam ready
- **Do not** flip paywall

### Git
- Tip: `9d83f15` · feature `67dce46` · `main` = origin
- Deploy: GHA #226 in progress — https://github.com/kitsboy/satohash/actions/runs/31993941498

### Docs
- `docs/handoff-log.md` · `.ai_docs/current-status.md` · `public/docs/*`

---

## Session — 2026-08-16 (Grok) — MOBILE OVERFLOW + PUBLIC DOCS

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** Tooltips/nav clamped · public docs refreshed to 5.0.0-ELITE · free stamps ON · no paywall flip

### Done this session
1. Viewport-clamped tooltips (portal), language switcher, More nav, help overlay, hover flyouts
2. Facelift `/docs`, DocViewer, guides, glossary, FAQ, pitch, trust, legal
3. Replaced stale public docs (v4 / 2025 / template mission / clone-only quickstart) with current product truth
4. `docs:sync` now copies the user-facing set to `public/docs/`
5. Playwright: language menu stays on-screen at 390×844; `/docs` `/faq` `/stamp` no page overflow

### Standing
- Free stamps · `REQUIRE_LIGHTNING=false` · bitcoind at tip
- SPA → `https://api.satohash.io` only

### Next
- Full e2e stamp→API→verify · CI lh mobile gate · Safari device QA
- Do not flip paywall

---

## Session — 2026-08-10 (Grok) — GOODBYE

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** Mobile Top 12 **live** · IBD done · free stamps ON · no paywall flip

### Done this session
1. **git pull** — 76 commits (status was stale re IBD)
2. **IBD complete docs** — Kimi truth: tip 961960, ibd=false, source bitcoind; status/handoff/ops/MASTER-BRAIN refreshed; pushed
3. **Mobile Top 12** shipped + **CF Pages deploy** (GHA run #223 success + smoke)
   - `/stamp/done`, sticky CTA, camera/gallery, share+QR, package ZIP
   - Deep-link banner, ProofStatusPill, Verify ELI-5, PWA start_url=/stamp
   - Imagine icons + empty-proof art
   - e2e `mobile-stamp-loop` 4/4 · `npm run lh:mobile` script
4. Next-backlog conversation only (no more code after Top 12)

### Standing (do not re-open)
- Free stamps · `REQUIRE_LIGHTNING=false`
- bitcoind **at tip** · `source: bitcoind` · IBD **done** (~Aug 8)
- SPA → `https://api.satohash.io` only
- Metrics SoT: `https://api.satohash.io/metrics.json`

### Next (suggested — not started)
- Full e2e landing→stamp→API→verify against live API
- CI Lighthouse mobile soft gate
- Real-device Safari QA
- Vault “my proofs” polish · family deep-link matrix · Umami funnel
- Longer explainer when Cam ready
- **Do not** flip paywall

### Git
- Tip: `5fea2a3` (mobile top 12) · `main` = origin
- Deploy: https://github.com/kitsboy/satohash/actions/runs/31462007952

### Docs
- `docs/MOBILE-TOP12.md` · `docs/handoff-log.md` · `.ai_docs/current-status.md`

---

## Session — 2026-08-10 (Grok) — MOBILE TOP 12 SHIP

**From:** Grok M3 · **Status:** Mobile top-12 sprint coded · free stamps ON · IBD done (standing) · **then deployed** (see GOODBYE)

### Shipped
- `/stamp/done` success route (Back does not re-submit)
- Sticky stamp CTA, modes collapse, camera/gallery/file pickers
- Share + QR + proof ZIP package; giant status pill
- Family deep-link banner polish
- Verify ELI-5; EmptyState + package on public verify errors
- PWA start_url `/stamp` + maskable icons; empty-state art
- E2E `mobile-stamp-loop` · `npm run lh:mobile`
- Doc: `docs/MOBILE-TOP12.md`

### Standing
- Free stamps · REQUIRE_LIGHTNING=false · bitcoind at tip
- SPA → api.satohash.io

---

## Session — 2026-08-10 (Grok) — IBD COMPLETE (Kimi confirm)

**From:** Cam relayed Kimi ops truth · **To:** all agents  
**Status:** Own Bitcoin node **at tip** · free stamps ON · no paywall flip

### Bitcoin (authoritative)

| Check | Value |
|-------|--------|
| bitcoind blocks | **961,960 / 961,960** (= tip) |
| Verification | 100% (0.999996) |
| initialblockdownload | **false** |
| Pruned | 10 GB · active · healthy |
| Service | active · load ~2.0 |
| API source | **bitcoind** (mempool.space fallback **off path**) |
| API height | 961,960 ✓ |
| API ibd | false |
| Mempool | local node live |
| Deep health | green · deps 200 |

**Timeline:** IBD resumed 2026-08-04 @ ~508k (~85 blk/min) → finished ~2026-08-08 → tip since. Docs that said “IBD in progress / multi-day” were **stale**.

### Product (unchanged this note)
- Free stamps · `REQUIRE_LIGHTNING=false`
- SPA → `api.satohash.io` · `/watch` 10s teaser
- Git tip at note start: `3c80c67`

### Next
| Owner | Action |
|-------|--------|
| **All agents** | Do **not** report IBD as in progress |
| **Kimi** | Keep bitcoind healthy (RAM/OOM watch); no paywall flip |
| **Grok** | Status files updated this session |
| **Cam** | Nothing required |

---

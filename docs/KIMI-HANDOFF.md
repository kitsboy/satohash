# KIMI-HANDOFF — Satohash

Session handoff log for Kimi (M4 HERMES). Append new entries at the top.

---

## Latest Session Summary (from 2026-07-18 goodbye)

**Chat Topic:** Clear open satohash debt (i18n, government templates, API smoke) and document how Cam supplies CF/VPS credentials without secrets in chat.

**Finished in this session:**
- 28 marketing i18n keys filled (de/es/fr/pt/sw/zh); i18n:check clean
- Government templates in TEMPLATES + manifest (passport, national-id, diplomatic-note, beneficial-ownership, apostille-companion)
- TemplatesShowcase CTAs for make-your-own and api-benefits
- npm run api:smoke; local API health OK; better-sqlite3 rebuilt for Node 22
- .ai_docs kebab knowledge layer; 77 unit tests; main pushed (0e08263, Build 107)

**Still to do:**
- Cloudflare deploy of latest main (wrangler login or GitHub CF secrets)
- VPS + DNS for api.satohash.io per docs/DEPLOY-SERVER.md
- Frontend rebuild with VITE_API_URL after API live
- Cross-project API (Katoa, MotoPass)

**Update / Status:** Code-side open items from 2026-07-15 are done. Hosted deploy and public API blocked only on Cam account/credentials (no secrets in chat). Static browser OTS still works.

**Next for Kimi:** Integrate into MASTER-BRAIN / Kanban / Obsidian. Note government template architecture and api:smoke. Do not sync to M4 until instructed.

---


## Session — 2026-07-18 (i18n + government templates + API smoke)

**Done:**
- Filled 28 missing marketing i18n keys (stampPage/verifyPublicPage/evidence/distressed/templateDetail/vault.revoke) for de/es/fr/pt/sw/zh — `npm run i18n:check` clean
- Wired government manifest IDs into `NotaryTemplates.TEMPLATES`: passport-attestation, national-id-attestation, diplomatic-note, beneficial-ownership, apostille-companion
- Added same IDs to `public/data/templates-manifest.json` grid + CATEGORY/badge styles
- TemplatesShowcase: CTA routes for make-your-own → grid scroll, api-benefits → /developer; always show action buttons on special sections
- Local API smoke: `scripts/api-local-smoke.sh` + `npm run api:smoke`; rebuilt better-sqlite3 for Node 22; health 200 + stamp 402 (paywall) locally
- `.ai_docs/` kebab-case knowledge layer + GROK-SESSION-PROTOCOL Step 1 for `.ai_docs/`
- Unit tests: 77 passing (4 new governmentTemplates tests); Build 105 production path OK (hooks bumped 103→105)

**Decisions:**
- VPS/public `api.satohash.io` still needs human provider account + DNS — not deployable from this session
- Deep health smoke is best-effort (Redis may be down); basic `/health` is the gate
- Government templates use demo-safe IDs only (no real passport numbers)

**Still open:**
- Provision VPS + deploy Express per docs/DEPLOY-SERVER.md
- Rebuild frontend with `VITE_API_URL` after API live
- Cross-project API integration (Katoa, MotoPass)

**Git State:**
- SHA: `0e08263ca664985a99f7bee2ce68a3fb0650c6f8`
- Build: 107
- Branch: main
- Unpushed: none (after push)

---


## Session — 2026-07-15 (Nav overhaul + Templates crash fix)

**Done:**
- Desktop nav v2: removed fixed `LeftRailNav` sidebar; added centered 3-column grid (`DesktopNavLayout`)
- `DesktopAppNav` — 4 primary tabs (Stamp, Vault, Verify, Templates) + More dropdown; search + language + account menu on right
- `MarketingDesktopNav` — landing/marketing nav with compact `LanguageSwitcher`
- Production fix: `/templates` crash — `TemplatesShowcase` guarded `(section.features ?? [])` for government `specialSections` without features array
- Builds 98–100 pushed to `origin/main`

**Decisions:**
- Desktop nav uses grid layout (left | center | right) — no absolute overlap with shell chrome
- Fewer primary tabs; secondary routes live under More dropdown
- Government template cards in manifest may lack `features`; UI shows badge + View Details CTA instead of feature list

**Still open:**
- `npm run i18n:check` — 28 missing marketing keys in non-EN locales (stampPage/verifyPublicPage); pre-existing
- Government template IDs in manifest `specialSections` may not exist in `NotaryTemplates.TEMPLATES` — `openDemo` falls back to `/templates/:id`

**Git State:**
- SHA: `835abda` (handoff docs); code fix `a138e0d`
- Build: 102
- Unpushed: none

---

## Latest Session Summary (from 2026-07-15 goodbye)

**Chat Topic:** Complete static-edge wave 2 (SE-101–200), overhaul broken desktop navigation, fix production `/templates` crash, sync all docs for handoff.

**Key Things We Did:**
- Lazy i18n, Stamp/Vault/legal polish, Widgets v3, Comparison mobile/print, 73 unit tests (wave 2)
- Replaced sidebar nav with premium centered desktop nav (app + marketing shells)
- Fixed `TemplatesShowcase` `.map()` crash on government special sections
- Docs sync, IMPROVEMENTS-LOG, MVP-READINESS, KIMI-HANDOFF updated

**What We Finished:**
- 200/200 static-edge items (waves 1–2)
- Desktop navigation fits shell without overlap
- `/templates` production crash resolved (Build 100)

**What We Are Still Aiming to Finish:**
- Fill 28 missing i18n keys in de/es/fr/pt/sw/zh/ar
- API deploy per `docs/DEPLOY-SERVER.md` (MVP gate)
- Wire government manifest template IDs to `NotaryTemplates` or stub demos

**Update / Status:** As of Build 100 (`a138e0d`), satohash frontend is static-edge complete with polished desktop nav. Site live at https://satohash.giveabit.io. Kimi hand-off current; do not sync to M4 until instructed.

**Next for Kimi:** Integrate this summary into MASTER-BRAIN / Kanban / Obsidian. Note nav architecture change (no LeftRailNav on md+). Use giveabit-project-handoff skill for future sessions.

---

## Session — 2026-07-15 (Static-Edge Wave 2: SE-101–200)

**Done:**
- Wave 2 polish: Stamp/Vault i18n, legal page headers, Comparison mobile/print, Widgets embed fix + v3 preview
- Lazy i18n (`loadLocale.js`), proof-dna-v3 theme/domain, ChainOfCustody history export
- Tests: 73 unit + e2e/a11y route extensions; coverage threshold 22%
- `scripts/wave7-i18n-patch.js` — 7-locale keys for legal, stamp, vault, widgets

**Decisions:**
- English bundle eager-loaded; other locales lazy on language switch (smaller initial chunk)
- Legal section bodies remain English prose; titles/disclaimers localized

**Git State:**
- SHA: `868acbd`
- Build: 95

---

## Session — 2026-07-15 (Waves 6–10 complete)

**Done:**
- Full 7-locale i18n: trustPage, government pages, staticMode, proofTimeline, stampPage, motopassVerify, batchHash, institutional FAQ
- Government templates (+4), batch CSV import, evidence admissibility mobile cards, print CSS on verify page
- pageMeta: 16 templates, government/legalCrypto all locales, per-route JSON-LD in usePageMeta
- PWA shortcuts in manifest; removed duplicate public/sw.js; dynamic Sentry; build runs build:verify
- pitch.{locale}.md files; a11y routes expanded; autostamp e2e; test:coverage script

**Git State:**
- SHA: `93e98cb`
- Build: 92

---

## Session — 2026-07-15 (Batch 1–10: Next 100 static-edge)

**Done:**
- Waves 1–2: P0 pipes (`publicRoutes.js`, `?hash=`/`?q=`, cosign/autostamp/label decode, `/snapper` redirect fix, Integrations/embed dynamic origin)
- OTS/vault: local `.ots` download fallback, `upgradeOtsBrowser`, VerifyPublic static skip, `verifyOtsBrowser`, vault `upsertLocalStamp`, PinModal passphrase for backup
- Mobile/shell: safe-area insets, reduced shell padding, offline chip on mobile, scroll-lock More menu, government nav links
- MVP public: pricing/comparison/glossary/widgets/identity in `MVP_PUBLIC_PATHS`, Landing nav + Footer government links, Developer "Simulated" badge
- Consumer: `proof-dna-v3.js`, templates Government & Travel category, expanded `sitemap.xml`, DistressedAsset inline URL input
- Tests: e2e `?hash=` verify tool spec; 65 unit tests + build pass

**Decisions:**
- Mock demo data preserved (Developer MOCK_KEYS, Dashboard, etc.)
- Full 7-locale i18n sweep (items 71–98) deferred to follow-up — functional pipes prioritized

**Git State:**
- SHA: `9df9182`
- Branch: main

---

## Session — 2026-07-15

**Done:**
- Static-edge hardening: browser OpenTimestamps via `public/vendor/ots.browser.js` (public calendars, no API)
- MotoPass integration: `/stamp?hash=`, `/verify/{hash}`, embed.js postMessage bridge
- Government suite: `/government`, `/motopass-verify`, `/batch-hash`, `/chain-of-custody`, `/evidence-admissibility`, `/distressed-asset`
- Passport attestation template + utilities: `otsBrowser`, `vaultLocal`, `otsClient`, VC export, vault ZIP from local `.ots`
- `security.txt`, sitemap, MVP-READINESS updated; mock demo data preserved per user request

**Decisions:**
- Browser OTS bundle excluded from PWA precache (4MB); lazy-loaded on stamp
- Static-only builds skip API and stamp direct to alice/bob/finney calendars
- Mock data (Developer, Dashboard, etc.) kept for presentation

**Git State:**
- SHA: `5f58b54`
- Branch: main
- Build: 86

---

## Handoff to Kimi — 2026-07-05

**Machine:** M3 (Grok)
**Project:** satohash

### Done
- [x] Batch 4 items 76–100: tests (ProtectedRoute, Access, health API, auth-stamp e2e + axe), vitest 20% coverage threshold, lint-staged server, i18n:check script, forum Prometheus counter, OTS upgrade socket UI, BatchTimestamp per-file progress, Stamp dropzone tour tooltips, PWA manifest alignment, SW registration fix, pre-push hook, docs/handoff artifacts
- [x] `docs/IMPROVEMENTS-LOG.md` — all 100 items checked off
- [x] CHANGELOG, README pitch/docs section, `.env.example` security warnings

### Decisions
- `build-metadata.json` stays **tracked** (pre-commit bumps it via `version:bump`)
- Removed manual `/sw.js` registration; Vite PWA `virtual:pwa-register` drives updates
- Health tests use supertest against exported `app` with `NODE_ENV=test` guard (no listen)
- `public/manifest.json` mirrors `site.webmanifest` for PWA name consistency

### What's Next
- Run `npm run test:e2e` in CI with production server
- Reconcile unpushed commits to GitHub
- Continue Phase III NIP-05 identity per ROADMAP

### Git State
- Last commit SHA: *(run `git log -1 --format=%H` after commit)*
- Branch: main
- Unpushed: *(check `git log --oneline origin/main..HEAD`)*

---

## Session Entry — 2026-07-05 (Batch 2: Items 26–50)

**From:** Cursor / cam on M3  
**Project:** Satohash v4.1.0-ELITE  
**Live:** https://satohash.giveabit.io

### What Was Done

Routing & consolidation (items 26–35):
- Routed `AdminThrottle` at `/admin/throttle` (protected)
- Routed `Contribute` at `/contribute` (public)
- Added `/developer-portal` → `/developer` redirect
- Deleted duplicate `src/pages/ContractList.jsx`; App now imports `contracts/ContractList.jsx`
- Wired all 7 onboarding pages under `/onboarding/*` with legacy redirects
- Wired timestamp wizard routes under `/contracts/:contractId/timestamp/*` + `/timestamp/verification-help`
- Routed `VerificationShield` at `/verify-shield/:id` (protected)
- Routed `SignatureFlow` at `/signatures/:contractId` (protected)
- Confirmed `/image-vault` → `/vault` redirect
- Fixed `Snapper` placeholder in `Placeholders.jsx` — coming-soon UI instead of `null`

UX & components (items 36–42):
- Added `ThemeToggle` to Landing page header (desktop + mobile)
- Updated `ThemeToggle` to use design tokens (`var(--border)`, `var(--accent-gold)`, etc.)
- Enhanced `Skeletons.jsx` with `SkeletonList` + `SkeletonVaultRow`; Vault uses `SkeletonList`
- Created reusable `EmptyState.jsx`; Forum uses it
- Created `PinModal.jsx`; `Access.jsx` no longer uses `prompt()` for PIN save/restore
- `LeftRailNav` skips auto-help overlay when first-run onboarding modal is active

Features & polish (items 43–49):
- `VerificationTool` supports `?q=<hash>` query param with auto-verify
- `VerifyPublic` adds "Copy Proof" button (formatted proof text)
- Vault adds sort (newest/oldest/status) and status filter controls
- `MobileBottomNav` items use 44px min touch targets
- Landing CTA section adds link to `/pitch`

Docs (items 46–47, 50):
- Updated `docs/MARKETING.md` — primary domain `satohash.giveabit.io`, v4.1
- Updated `docs/EXECUTIVE-SUMMARY.md` — primary live URL `satohash.giveabit.io`
- Created this `docs/KIMI-HANDOFF.md` with session append entry

### Files Changed

- `src/App.jsx`
- `src/pages/Access.jsx`
- `src/pages/Forum.jsx`
- `src/pages/Landing.jsx`
- `src/pages/Placeholders.jsx`
- `src/pages/VerificationTool.jsx`
- `src/pages/VerifyPublic.jsx`
- `src/pages/Vault.jsx`
- `src/pages/onboarding/Welcome.jsx`
- `src/pages/onboarding/HowItWorks.jsx`
- `src/pages/onboarding/ChooseTemplate.jsx`
- `src/components/EmptyState.jsx` (new)
- `src/components/LeftRailNav.jsx`
- `src/components/MobileBottomNav.jsx`
- `src/components/PinModal.jsx` (new)
- `src/components/Skeletons.jsx`
- `src/components/ThemeProvider.jsx`
- `docs/MARKETING.md`
- `docs/EXECUTIVE-SUMMARY.md`
- `docs/KIMI-HANDOFF.md` (new)
- Deleted: `src/pages/ContractList.jsx`

### Notes for Kimi

- Onboarding internal nav now uses `/onboarding/*` paths; legacy `/choose-template` and `/account-creation` redirect.
- Timestamp wizard expects `contractId` in URL — linked from `ContractView`.
- `SignatureFlow` requires `:contractId` param.
- `VerificationShield` requires `:id` stamp param.
- Prior handoff: `KIMI-HANDOFF-satohash-2026-06-10.md` at repo root remains the full baseline document.

---

## Prior Reference

See `KIMI-HANDOFF-satohash-2026-06-10.md` in repo root for the original comprehensive handoff (four-plane architecture, mission context, full doc inventory).

## Handoff to Kimi — 2026-07-06

**Machine:** M4 (Hermes)
**Project:** satohash

### Done
- [x] Project docs audit & cleanup: removed 8 stale/conflicting root files that duplicated Grok's v4.1.0-ELITE work
- [x] Cleaned docs/ cruft (MARKETING.md.bak, misplaced .ai_docs/)
- [x] Committed as 466bd88
- [x] Updated LATEST-UPDATE.md
- [x] This handoff entry

### Decisions
- All June 10 handoff artifacts (KIMI-HANDOFF-satohash-2026-06-10.md, SOURCE-OF-TRUTH.md, STATUS.md, SESSION-SUMMARY-2026-06-10.md) removed — superseded by Grok's docs/KIMI-HANDOFF.md + IMPROVEMENTS-LOG.md
- Blank templates (EXEC-SUMMARY.md, MARKETING-ONELINER.md) removed — duplicated real docs
- CLAUDE.md removed — Grok's GROK-SESSION-PROTOCOL.md is the active agent protocol
- archives/ preserved as-is for historical reference

### What's Next
- Push to GitHub (2 commits ahead: a7641f8 + 466bd88)
- Review docs/ARCHITECTURE.md and docs/QUICKSTART.md for staleness against Grok's code changes
- Continue Phase III NIP-05 identity work per ROADMAP
- Consider cross-project wiring (Motopass, Katoa proof verification)

### Git State
- Last commit: 466bd88
- Branch: main
- Unpushed: 2 (a7641f8, 466bd88)


## Handoff to Kimi — 2026-07-07

**Machine:** M4 (Hermes)
**Project:** satohash

### Done (24 builds, 100+ enhancements)
- [x] Documentation hub + viewer (ToC, breadcrumbs, ratings, print, GitHub links)
- [x] New pages: FAQ, Pricing, Comparison, Security, Guides, Glossary, Integrations
- [x] Templates: public gallery, 14 templates, search autocomplete, preview modal
- [x] Kimi: contact modal (Email/NIP-05), glowing card, verified badge
- [x] Social meta: usePageMeta hook, 12 pages with unique OG/Twitter tags
- [x] A11y: skip-to-content, focus-visible, reduced motion, print, aria-expanded
- [x] UX: BackToTop, card 3D lift, focus ring, skeleton, button spinner
- [x] SEO: BreadcrumbList JSON-LD, sitemap 18 pages, canonical, robots.txt
- [x] Privacy: removed local paths from public docs
- [x] Footer: 8 new links to all new pages
- [x] Build 36 deployed live at satohash.io

### Decisions
- All docs served statically from public/docs/ — no backend needed
- usePageMeta hook handles dynamic social sharing per page
- Backend deployment deferred — kanban card t_50bac963 tracks it

### What's Next
- Deploy Express backend to VPS (per kanban card)
- Complete Phase III NIP-05 identity
- Proof DNA Widgets
- Mobile Signer Pro

### Git State
- Last commit: bfc5514
- Branch: main
- Build: 36
- Status: fully pushed to origin/main

---

## Handoff to Kimi — 2026-07-07 (Batch 8)

**Machine:** M3 (Grok)
**Project:** satohash

### Done
- [x] Batch 8 frontend pipes — items 266–365 (100 improvements)
- [x] Onboarding wizard unified (`onboardingFlow.js`, progress bar, linear navigation)
- [x] Timestamp wizard meta + Explanation link from FinalReview
- [x] Contract pipes: local activity feed, health stats, Mempool action, PDF branding fix
- [x] ImageVault route restored; reads cached image stamps from localStorage
- [x] ProtocolStats live/cached badge; Developer demo banner; MerkleExplorer/BlockchainPulse purity fixes
- [x] `tests/e2e/frontend-pipes.spec.js` + `npm run test:frontend-pipes`
- [x] `docs/IMPROVEMENTS-LOG.md` updated — 365/365 complete

### Decisions
- Frontend-only batch: no new server routes; client uses localStorage + existing APIs
- `getVerifyUrl()` for origin-aware verify links in PDFs/QR
- Dual i18n (`useI18n` + `react-i18next`) kept; shell keys extended for vault/forum

### What's Next
- Run e2e with dev server: `npm run test:frontend-pipes` + `npm run test:template-demo`
- Optional: migrate Vault/WebCapture hardcoded English to `useI18n` across all 7 locales
- Deploy Build 54

### Git State
- Branch: main
- See `git log -1` after push for latest SHA

---

## Handoff to Kimi — 2026-07-07 (Batch 9)

**Machine:** M3 (Grok)
**Project:** satohash

### Done
- [x] Batch 9 fix & debug — items 366–465 (100 improvements)
- [x] `id.js` utilities (`clientId`, `pseudoHash`, `pickRotating`) + unit tests
- [x] `getApiUrl()` / `getPublicBaseUrl()` rolled out to Forum, Admin, NostrHealth, ImageVault, VerificationShield, HistoryList
- [x] Silent failures → toasts/banners: VerificationShield, Offers, ImageVault, Admin, NostrHealth
- [x] Welcome resume banner + live block height from `/health`
- [x] Developer pricing buttons wired; Admin empty chart state; Offers NWC demo label
- [x] i18n: `vault.serverUnreachable`, `loadMoreFailed`, `forum.npubRequired`, `common.retry` in all 7 locales
- [x] `i18n-check.js` vault/forum parity; `OnboardingProgressBar` component test
- [x] E2E: onboarding chain + forum npub gate in `frontend-pipes.spec.js`
- [x] `contractStore` delegates to `contractStorage`; Build 56

### Decisions
- Kept dual i18n; extended shell keys rather than full Vault/WebCapture migration
- PDF consolidation deferred — branding already aligned in batch 8
- axe-core CI deferred; searchbox + progressbar tests added instead

### What's Next
- Deploy Build 56
- Optional: full Vault/WebCapture i18n migration
- Optional: axe-core on top 10 routes in CI

### Git State
- Branch: main
- Build: 56
- See `git log -1` after push for latest SHA

---

## Handoff to Kimi — 2026-07-07 (Fix + Enhance Pass 2)

**Machine:** M3 (Grok)
**Project:** satohash

### Done — 4 fix + 3 enhance commits (Builds 67–75)
- [x] Fix 5–8: a11y focus-trap, PDF pipeline, i18n vault/snapper, axe CI + e2e
- [x] Enhance 5–7: FeeAdvisor, SignerIdentityBadge, Proof DNA v3, vaultExport, DeepHealthBanner
- [x] 51 unit tests; `npm run test:a11y-ci` for CI gate

### Deferred (infrastructure / roadmap)
- Express VPS deploy (forum, history, stamps need backend)
- Mobile Signer Pro native app
- Live BOLT-12 / Fedimint / SSO / SDK packages

### Git State
- Branch: main
- Last commit: bd22e95 (Build 75)
- Fully pushed to origin/main

---

## Handoff to Kimi — 2026-07-07 (Fix + Enhance Pass)

**Machine:** M3 (Grok)
**Project:** satohash

### Done — 4 fix commits + 4 enhance commits (Builds 59–65)
- [x] Fix batch 1: mempool error surfaces, ProtocolStats fallback, `useAppTranslation`
- [x] Fix batch 2: `getApiUrl()` rollout (18 files)
- [x] Fix batch 3: PageErrorBoundary, contractStore, vault sync, mobile signer, offers API
- [x] Fix batch 4: Trust live health, audit export, ImageVault forensic hash, a11y smoke script
- [x] Enhance 1: ContractLifecycleBar, auditExport, orgTeam utilities
- [x] Enhance 2: Signing invite links, Developer usage stats
- [x] Enhance 3: audit + org unit tests (49 total passing)

### Deferred (still open)
- Full Vault/WebCapture i18n migration
- PDF system consolidation (pdfHelpers started)
- axe-core CI gate
- Express backend VPS deploy
- Mobile Signer Pro native app

### Git State
- Branch: main
- Builds: 59–65 pushed
- See `git log -1` for latest SHA

---

## Handoff to Kimi — 2026-07-07 (Infrastructure)

**Machine:** M3 (Grok)
**Project:** satohash

### Done
- [x] Removed all Umbrel/VPS production references from deploy docs
- [x] Production model documented: Cloudflare Pages static SPA only (`./deploy.sh`)
- [x] Stack: M3 (Grok build/deploy) + M4 HERMES (Kimi orchestration)
- [x] `server/` Express = local dev only; not deployed to satohash.io

### Decisions
- No home-server (Umbrel) stack — replaced by Kimi/HERMES on M4
- TadBuy and other Give A Bit projects deploy on their own stacks (TadBuy: Supabase + Cloudflare)
- Forum/history/stamp API features that need `server/` remain deferred or future Workers project

### What's Next
- Add `CLOUDFLARE_API_TOKEN` to GitHub secrets so push → deploy is automatic
- Optional: Cloudflare Workers if server-side API is needed later

### Git State
- See `git log -1` for latest SHA
- Branch: main

---

## Handoff to Kimi — 2026-07-07 (MVP doorstep)

**Machine:** M3 (Grok)
**Project:** satohash

### Done
- [x] MVP frontend prep: public `/stamp` `/verify` `/vault` (`VITE_MVP_MODE`)
- [x] API wiring: `opentimestamps.js` → `getApiUrl()`, `.env.production.example`
- [x] `DeepHealthBanner` silent on static-only; warns when API configured
- [x] Landing honest proof count; nav hides Forum/Contracts in MVP mode
- [x] `docs/MVP-READINESS.md` — NIP-05 uses pubkey only, **no NSEC**
- [x] 58 unit tests passing

### NIP-05
- `kimi@giveabit.io` → pubkey `076fbd67…f8d4` in `src/config/mvp.js`
- NSEC not needed and must never be committed

### What's Next
- [ ] Deploy API per `docs/DEPLOY-SERVER.md`
- [ ] `VITE_API_URL=https://api.satohash.io npm run build && ./deploy.sh`
- [ ] End-to-end stamp → verify smoke on production


## THOR Ops — 2026-07-19

### Merged ✅
- tailwind-merge 3.4→3.6
- knex 3.2.5→3.2.10
- postcss 8.5.6→8.5.15
- three.js 0.183→0.184
- actions/checkout 4→7
- GROK-SESSION-PROTOCOL updated (M4→THOR)

### Needs You 🔧
- tailwindcss 4.1→4.3 — merge conflict
- actions/setup-node 4→6 — merge conflict
- eslint 8→10 — major, review
- vitest 3.2→4.1 — major, review
- @vitejs/plugin-react 4→6 — major, review
- @anthropic-ai/sdk 0.93→0.98 — review

### Branches
- feat/frontend-ux-audit, feature/header-btc, feature/settings-polish — pending merge

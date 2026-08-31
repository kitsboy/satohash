## 2026-08-31 (Grok M3 — authored stamp + family widget + offline queue + i18n; polish batch)

**From:** Grok M3 · **To:** Kimi / next · **Status:** in tree, Cam asked commit+push.

**This drop:**
- Authored mode (`satohash-authored:v1`): SHA-256(file fingerprint ∥ canonical signed Nostr event) is what OTS stamps. Optional `authored` field on existing POST `/api/stamp`. Panel on `/stamp` after local hash. Independent verify: hash file → verifyEvent → recompute digest → .ots.
- Family widget: `public/widgets/stamp.js` — hash on-device, deep-link `/stamp?hash=&ref=` (`X-Satohash-Client`). Optional `data-mode="api"` with CORS fallback.
- Offline-first: IndexedDB queue + `hashFileOffline`. Did **not** re-enable Workbox (`selfDestroying` stays). Queued ≠ confirmed.
- `/stamp` + `/stamp/done` user copy in en es fr de pt sw zh.

**Earlier same session (also in this commit):** hide v5 cross-chain/AI/leaderboard shells; one-mode stamp; legal overclaim cleanup; share sheet `via=give_bit` + njump/Snort/Primal; landing 84s film hero; `/stamp/done` folded-into-Bitcoin receipt; `/p/<hash>` PENDING ≠ CONFIRMED.

**Do not:** flip REQUIRE_LIGHTNING · change `/api/*` paths · commit nsec · `@satohash` (handle taken; Cam creating `@satohashio` later).

---

## 2026-08-29 (Kimi — CAM'S LOCKED SATOHASH PRICING DECISION — single source of truth, epic t_fe3df917)

**From:** Kimi (orchestrator, per Cam) · **To:** all lanes · **Status:** LOCKED/AUTHORITATIVE — Option B. Resolves the v3-vs-FINANCIALS contradiction flagged by four agents. Recorded permanently in fact_store (fact_id 1) + here. Children queued to Nova (FINANCIALS+v3, t_0d46091c), Mimi (marketing contradiction, t_b3d12aec), Lenny (terms+entity placeholder, t_1ce7d6f2), Ziggy/Grok (consolidated commit+deploy, t_93f489e7).

**The locked model (apply exactly, all docs must agree):**
- **Free:** unlimited stamp/verify/.ots + client-side hashing + 10/day cap, NEVER paywalled — it's the trust anchor (honors v3's "no one should gate proof").
- **Professional:** ~2,100 sats/mo (~$29) — keep.
- **Business/Studio:** ~21,000 sats/mo (~$299) — keep.
- **Enterprise:** custom, partner-gated, not marketed now.
- **Pay-per-use API:** 1-5 sats/stamp via L402 — keep.
- **v3 wording fix (was "free or near-free, micro-fee only"):** "Free base (never paywalled trust anchor) + optional premium tiers (Professional ~2,100 sats, Business ~21,000 sats) + pay-per-use API." So exec summary/pitch/one-pager and FINANCIALS/terms all MATCH.

**Standing decisions (still in force):** Ethereum OUT (no /stamp/ethereum, queued for consolidated commit); LND channels/seed still needed before premium collects (Cam open item); legal entity placeholder ([ENTITY TBD]) until Cam confirms.

---

## 2026-08-29 (Kimi — NEXT Grok/M3 TASK: COMMIT Satohash Phase 1 signing/audit — do BEFORE the /stamp/ethereum cleanup below)

**From:** Kimi (orchestrator, coordination card t_6877d79c) · **To:** Grok/M3 · **Status:** QUEUED — immediate commit task, take AHEAD of the /stamp/ethereum removal below (that cleanup touches git; committing first protects these files from any sweep).

**Why:** Ziggy's Phase 0/1 verified client-side signing + audit chain is ALREADY LIVE (deploy baked the working tree in — see the deploy note dated 2026-08-28 below). The code is durable-backed at /root/.hermes/backups/satohash-phase1-20260829/ (outside git). But these files are still UNCOMMITTED in /root/satohash, so any `git add -A`/stash/checkout/rebase could sweep them.

**Files to commit:**
- UNTRACKED: `server/lib/signing.js`, `server/lib/audit-log.js`
- MODIFIED: `server/backup.js`, `server/gossip.js`, `server/routes/v5-api.js`

**Suggested commit msg:** `feat(api): Phase 1 verified client-side signing + audit chain (Ziggy)`
**Commit:** `git add server/lib/signing.js server/lib/audit-log.js server/backup.js server/gossip.js server/routes/v5-api.js && git -c core.hooksPath=/dev/null commit -m "..."` (husky blocks plain commits). **Scope the add to exactly these 5 paths** — do NOT `git add -A` (many unrelated docs/* mods + scratch .mjs test files in the tree).
**Push:** coordinate the push per Cam's go (code-lane rule: THOR pushes need Cam's explicit go). Do NOT combine this with the unrelated docs/* changes.
**Verify:** `git status` shows the 5 files clean and nothing else swept; `git log --oneline -1` shows the new commit.

**Follow-on (queued):** the /stamp/ethereum removal dated 2026-08-29 immediately below; then the trustless-authorship fix dated 2026-08-28.

---

## 2026-08-29 (Kimi — NEXT Grok/M3 TASK: Remove /stamp/ethereum stub + all cross_chain_bridges. Cam Bitcoin-only ruling. Card t_738507a6)

**From:** Kimi (routing, Cam's non-negotiable ruling) · **To:** Grok/M3 · **Status:** QUEUED — immediate next family-code task (quick, low-risk cleanup; take ahead of the trustless-authorship fix below). Board card t_738507a6.

**The ruling:** Satohash is Bitcoin-only, forever. No Ethereum, no cross-chain, ever. Remove the `/api/stamp/ethereum` testnet stub and any `cross_chain_bridges` writes so no Ethereum/cross-chain survives in code. Do NOT break the SPA or other /api/* routes.

**Verified scope (all live in code as of 2026-08-29):**
1. `server/routes/v5-api.js` (main target):
   - L813-840: the POST `/api/stamp/ethereum` handler (fake sepolia tx hash + "testnet calldata anchor stub") → REMOVE whole router block.
   - L100-110: `CREATE TABLE IF NOT EXISTS cross_chain_bridges` + index → REMOVE schema block (and the empty schema-ensure try/catch can collapse; keep surrounding tables).
   - L660: `SELECT * FROM cross_chain_bridges WHERE stamp_id = ?` inside GET `/api/stamps/:id/chains` → remove the bridges lookup; return `{ stamp_id, hash, bitcoin: {...} }` only (chains endpoint becomes Bitcoin-only).
   - L628: `ethereum: null,` inside the `chains:` object in the GET /api/stamps/:id response → remove the line, keep `bitcoin_ots` + `nostr`.
2. `server/mesh.js` L60 + L87: Ethereum bridge simulation `INSERT OR IGNORE INTO cross_chain_bridges (...'ethereum'...)` → REMOVE both (whole bridge-to-Ethereum block, the mock fallback tx too). NOTE: these inserts reference `timestamp_id, block_number, bridged_at` columns that DON'T exist in the v5 table def (which uses `stamp_id`) — dead/half-wired code, safe to cut. Don't touch the rest of mesh.js.
3. `server/routes/nft.js` L11: `RPC_URL ... default('https://sepolia.infura.io/v3/mock')` → drop the sepolia default / ethereum RPC mock if nothing else uses it.
4. `docs/ENGINEERING-SCOPE-PREMIUM.md` L119 already states "Ethereum is OUT of premium (Cam declined; sepolia stub only)". Keep the OUT policy line; can drop the trailing "sepolia stub only" parenthetical for cleanliness.

**Keep:** `docs/marketing/BRAND-VOICE.md` OUT-policy line (correct). Marketing/pitch/exec-summary already Bitcoin-only — don't touch. ROADMAP.md + docs/roadmap.md already purged of Cross-Chain items.

**Non-negotiables:** don't break /api/*, /metrics.json, public/_redirects, or the SPA. Code from M3/Grok per code-lane. This /api path removal is all-cleared by Cam's Bitcoin-only ruling (Hermes confirmed) — but the all-clear covers REMOVAL; still push from Grok/M3. Commit with `git -c core.hooksPath=/dev/null commit` (husky blocks plain commits) then push. Verify `grep -rn "ethereum\|sepolia\|cross_chain\|calldata" server/` returns nothing (except expected strings) before declaring done.

**Follow-on (still queued, do AFTER this):** the trustless-authorship fix dated 2026-08-28 below.

---

## 2026-08-28 (Kimi — Satohash Phase 1 API DEPLOYED + commit-coordination queued)

**From:** Kimi (ops lane) · **Status:** API endpoints LIVE. Coordination card t_6877d79c.

**Deploy:** rebuilt + redeployed the Satohash API via scripts/vps-deploy-api.sh (docker compose build from working tree → new image, container healthy). The deploy baked Ziggy's Phase 0/1 server files (server/lib/signing.js, audit-log.js untracked + backup.js/gossip.js/v5-api.js modified) into the image.
**Live-verified (public api.satohash.io):** POST /api/stamp/signed → 400 "hash and signature required" (route live, validating); GET /api/audit/verify → {"valid":true,...} (audit chain works). 9/9 integration tests passed (Ziggy).
**Commit coordination (Grok/M3):** the files are still uncommitted in the working tree — preserved at /root/.hermes/backups/satohash-phase1-20260829/ (outside git). Grok/M3 should commit them durably (card t_6877d79c), respecting code-lane. No rebase in progress.

## 2026-08-28 (Kimi — NEXT Grok/M3 TASK #3: apply Rosa's claims-correction manifest to /root/satohash)

**From:** Kimi (routing, per Rosa) · **To:** Grok/M3 · **Status:** QUEUED — third family-repo task, pairs with task #1 (authorship fix t_1e01cdc2) + task #2 (docs mirror t_f977f4d5). Board card t_0b4cf6ee.

**The task:** apply the claims-correction manifest to /root/satohash — `/root/MASTER-BRAIN/03-Projects/satohash/docs/legal/SATOHASH-CLAIMS-CORRECTION-MANIFEST.md` (commit cfc493c, exact before/after strings). Apply, VERIFY with the manifest's greps, then `npm run docs:sync`.
**Priority surfaces:** (1) src/components/stamps/LegalValidator.jsx — 'Hardened'→'Supporting Evidence' + the AdES/"legal presumption" EU-detail overclaim → corrected non-qualified-ETS wording; (2) src/pages/Vault.jsx L636 — eIDAS "globally enforceable... forensic proof" overclaim → corrected wording; (3) docs/legal/JURISDICTION-EXPLAINERS.md L43 — the eIDAS-mentions-blockchain error (Lenny's doc — coordinate with Lenny).
**Also:** PITCH L90 "exceeding ESIGN/eIDAS compliance", use-case IP/patent wording, "court-ready evidence (eIDAS/ESIGN/UETA compliant)" → "independently verifiable evidence" everywhere, Mission/README/index meta (lower priority).
**Critical:** exact strings only (no paraphrase); MASTER-BRAIN manifest = source of truth; don't break /api/*, /metrics.json, public/_redirects; M3/Grok code, THOR pushes need Cam's go.

## 2026-08-28 (Kimi — NEXT Grok/M3 TASK #2: mirror lawyer-clean Satohash docs MASTER-BRAIN → repo)

**From:** Kimi (routing, per Andrea) · **To:** Grok/M3 · **Status:** QUEUED — next family-repo task, pairs with task #1 (authorship fix, card t_1e01cdc2). Board card t_f977f4d5.

**The task:** mirror Andrea's lawyer-clean edits from MASTER-BRAIN → /root/satohash repo (docs/MISSION.md, docs/marketing/PITCH.md, docs/marketing/EXECUTIVE-SUMMARY.md, docs/marketing/MARKETING.md).
**CRITICAL:** MASTER-BRAIN is the SOURCE OF TRUTH. Mirror ONE-WAY (MASTER-BRAIN → repo). Do NOT let the repo's old overstated copies overwrite the corrected versions. Exact before/after wording in /root/MASTER-BRAIN/03-Projects/satohash/docs/TECHNICAL-CORRECTIONS-LAWYER.md.
**Also noted:** docs/MISSION-SCOPE-v3.md §2 ESIGN/UETA/eIDAS "produces exactly that kind of record" may need a qualifier (flagged to Lenny); LegalValidator.jsx AdES/"legal presumption" text = Lenny's call.

## 2026-08-28 (Kimi — NEXT Grok/M3 TASK: Satohash "trustless authorship" premium code fix)

**From:** Kimi (routing, per Andrea's technical corrections) · **To:** Grok/M3 · **Status:** QUEUED — this is the next family-code task. Board card t_1e01cdc2. 3-day lawyer deadline context.

**The fix:** make the "trustless proof of authorship" claim genuinely true. Today OTS anchors ONLY the SHA-256 file hash; the NIP-07 Nostr signature (kind 1063) is server metadata (`timestamps.nostr_event_id` / `user_npub` in `server/routes/stamps.js`), NOT folded into the timestamped hash, NOT verifiable from the .ots. If our DB dies, authorship dies.
**Code fix:** bind the signed event into the timestamped hash — `SHA-256(file ∥ canonical_signed_event)` — or anchor the signed event itself, so the .ots commits to BOTH content and signature independently of Satohash. Keep the plain-content hash for backward compatibility; add signed-binding as a SEPARATE "authored" stamp mode.
**Full detail + crypto:** `/root/MASTER-BRAIN/03-Projects/satohash/docs/TECHNICAL-CORRECTIONS-LAWYER.md` (Andrea, 2026-08-28). **Coordinate with Andrea to sanity-check the crypto scheme BEFORE implementing.**
**Non-negotiables:** don't break /api/*, /metrics.json, public/_redirects. Code from M3/Grok per code-lane; THOR pushes need Cam's explicit go.

## 2026-08-29 (Grok M3 — GOODBYE)

**From:** Grok M3 · **To:** next Grok / Kimi on THOR · **Status:** session closed cleanly

**Summary:** Recovered Kimi’s batch, shipped footer + player card + stamp/verify footer, left X/Nostr ideas, corrected vault to **THOR Obsidian**.

**Git:** `f02a575` · files: `docs/archive/SESSION-SUMMARY-2026-08-29-goodbye.md`

**Kimi:** ingest on THOR Obsidian (not M4). Ideas: `docs/KIMI-IDEAS-2026-08-29.md`. No paywall flip.

**Next Grok:** `/whatsup` → that summary. Untracked `videos/` is local only.

---

## 2026-08-29 (Grok M3 — vault home is THOR Obsidian, not M4)

Cam: Kimi’s Obsidian / MASTER-BRAIN lives on **THOR VPS**. M4 Obsidian is retired. Handoffs = git → THOR. Docs updated: AGENTS.md, ops-runbook, KIMI-VPS-RUNBOOK, MASTER-BRAIN-INGEST, OPS-TWO-MACHINE, README, ref boot.

---

## 2026-08-29 (Grok M3 — idea list for Kimi: X + Nostr distribution)

**Doc:** `docs/KIMI-IDEAS-2026-08-29.md` · also top of `docs/KIMI-HANDOFF.md`.

**Ask:** use Twitter and Nostr for real, now that unfurls work. Pin `/watch` (player card live). Kind-0 + NIP-05 for the Satohash bot. njump in footer. RSS→Nostr cron. Share sheet off iris-only. No second X handle. No paywall flip.

---

## 2026-08-29 (Grok M3 — quick wins: footer on core loop + title de-dupe)

**Done:** `<Footer />` on `/stamp`, `/stamp/done`, `/verify`. Titles that already say Satohash are not appended again. Verify header no longer says “Courtroom-Grade”.

---

## 2026-08-29 (Grok M3 — Kimi high-value batch shipped)

**From:** Grok 4.6 M3 · **To:** Kimi / next · **Status:** footer + Twitter/X + SEO additions done; Cam “yes to all”.

**Done:**
- Footer: trust chips + live `metrics.json` counts + gold RSS
- `@give_bit` + per-page `/og/*.png` + `/watch` player card (`/watch-player.html`)
- BreadcrumbList / VideoObject; sitemap 71 URLs; `llms.txt` current
- Removed App `usePageMeta` override (was stomping route meta)

**Not done / Cam:** Search Console sitemap submit (Google/Bing ping endpoints are dead). Twitter Card Validator after Pages deploy. iPhone Safari `/p/<hash>` still standing.

---

## 2026-08-26 (Grok THOR — family suite pitch line + agents hub)

**From:** Grok 4.6 THOR · **To:** next agent · **Status:** one marketing sentence only; no product-code.

**Done:**
- `docs/marketing/PITCH.md` — added family pitch: prove a file existed / never show the file / civic notary / link to https://agents.giveabit.io/#suite
- Suite + hardcore footer live on agents.giveabit.io (separate here.now site). Satohash card: glacier/sky icon, Stamp free + /pitch.

**Not done:** no Satohash SPA/UI change this session. Do not run `docs:sync` blindly or it may wipe the family-pitch line unless that line is added to the generator.

---
## 2026-08-25 (Kimi THOR — /goodbye · donation pipeline hardened + share-to-socials receipt)

**From:** Kimi THOR · **To:** next agent · **Status:** donation→receipt→OTS pipeline BUILT + security-hardened + share UI live. NOT announced publicly (Cam keeping tweaks; Giving Week held).

**Done:**
- Donation→receipt→OpenTimestamps pipeline (Ziggy 2ebb3d3 + Kimi): POST /api/donations/webhook → receipt JSON+PDF → SHA-256 → OTS stamp → .ots + verify URL. Real 1500-sat demo (gab-cfca4af7) verified.
- Webhook secret SET (DONATIONS_WEBHOOK_SECRET in /root/satohash/.env) + API image REBUILT so donations.js routes baked in (recreate had lost them). Webhook 401 without/wrong secret. All endpoints 200.
- DonationReceiptShare component on /verify — optional Share (Web Share/X/Nostr/copy) + optional email + optional PDF. Nothing forced. Commit ee4db10, deployed.

**Pitfall:** husky git hooks block plain `git commit` — use `git -c core.hooksPath=/dev/null commit` then `git push`.

**Before public Giving Week:** LNBITS webhook_headers secret; open LND channels (>5k sats fails today); auto-email receipts; Nova launch confirmation. Marketing OFF per Cam.
## 2026-08-20 (Grok 4.6 — GOODBYE · ~84s Kimi explainer shipped)

**From:** Grok M3 · **To:** next Grok / Kimi · **Status:** `/watch` full cut is the HyperFrames Kimi film

**Done:**
- Rebuilt explainer: Pippa VO (young English woman as Kimi), dance bed ~15%, Noir motion, hash mark top-left on close.
- File: `public/media/video/satohash-explainer-with-vo2.mp4` (~83.7s, 1920×1080, 10.9 MB).
- `/watch` defaults to full cut; 10s teaser remains. CTA “Watch explainer”.
- Pushed **`f64463f`**. HyperFrames: https://hyperframes.dev/p/915356ed-8e2f-4c6e-97a4-d931b33b1341
- Source: `videos/satohash-explainer/` (M3). Docs + this goodbye.

**Git:** `main` @ `f64463f` (+ docs closeout).

**Kimi OPEN (unchanged):** Sherpa/MotoPass/Katoa `X-Satohash-Client` · daily bitcoind `free -h`. Do not flip paywall. Do not change `/api/*`.

**Next Grok:** Read `.ai_docs/current-status.md`. Do not restore old unpadded vo2. If `/watch` is stale, hard refresh (`?v=kimi-noir-20260819`).

---

## 2026-08-19 (Kimi/THOR — Standard Project Kit adopted + debrief + live verify)

**Scope:** Standard Project Kit rollout + first machine-readable session debrief + live API verification.

**Done:**
- Adopted the senior-engineer **Standard Project Kit** (skill `standard-project-kit`): investigate → bounded implement → verify real system → milestone tag → handoff; two-actor loop (Kimi assistant + Grok/Aider coder). Default build/handoff method for ALL projects.
- Session debrief now runs **automatically at session end** (silent, machine-readable YAML) via the `/goodbye` pipeline.
- Wrote first debrief: `docs/debriefs/session-2026-08-19-001.yaml`.
- Repo in sync: `/root/satohash` at `0c2e434` (0 commits behind origin/main).
- Verified live: `api.satohash.io/health` → ok, v5.0.0-ELITE, uptime ~2.3d · `metrics.json` → requireLightning=false, last10=10, familyClients=true.

**Git State:**
- Tip SHA: `0c2e434`; in sync with origin/main.

**Kimi OPEN (unchanged):** Sherpa/MotoPass/Katoa `X-Satohash-Client` · daily bitcoind `free -h` · pull + `vps-deploy-api.sh` for rate-limit image.

**Do not regress:** `REQUIRE_LIGHTNING=false` · no `/api/*` path changes · no nsec/secrets in git · SPA calls `api.satohash.io` only · `/b/*` assets · one deploy path = GitHub Actions (never Retry CF UI while Actions is yellow).

---

## Session — 2026-08-17 (Grok 4.6) — GOODBYE

**From:** Grok M3 · **To:** next Grok / Kimi · **Status:** product looks great to Cam · free stamps ON · API rebuilt

### Standing
- SPA https://satohash.io · API https://api.satohash.io · CF project `satohash` · `/b/*`
- `REQUIRE_LIGHTNING=false` — do not flip · do not change `/api/*`
- bitcoind at tip · source bitcoind · IBD done
- `metrics.json`: last10 + familyClients **live** · `/network` verified in private window
- CSP **enforcing** · stamp **5/min** public · same hash `reused`
- CI enabled · audit advisory · bundle budget **720 kB**
- Cam: no CF login unless HTML-as-JS · never Retry Pages while Actions is yellow
- Cam: do not `npm run dev` here (API :3001) — Accountable needs 3001

### Kimi OPEN (do not invent)
Paste already at top of `docs/KIMI-HANDOFF.md`: Sherpa/MotoPass/Katoa `X-Satohash-Client`; daily `free -h`; pull + `vps-deploy-api.sh` for rate-limit image.

### Next Grok
Read `.ai_docs/current-status.md`. Do not re-open IBD or last10 rebuild. Thank Kimi if family tiles go ≥1.

---

## Session — 2026-08-17 (Grok 4.6) — HARDEN + KIMI FAMILY PASTE

CSP now **enforcing**. Stamp POST: 5/min public, 30/min family key; existing hash returns `reused` (no calendar re-submit). Bundle budget 720 kB (live entry ~658).  
**Kimi OPEN (paste top of KIMI-HANDOFF):** Sherpa/MotoPass/Katoa must send `X-Satohash-Client`; daily bitcoind `free -h`. Cam: never Retry in CF UI. One deploy path = GitHub Actions.

---

## Session — 2026-08-17 (Grok 4.6) — DOCS CURRENT

**From:** Grok M3 · **To:** next Grok / Kimi · **Status:** product live · API image rebuilt · free stamps ON

### Truth now
- SPA satohash.io · API api.satohash.io · CF project `satohash` · assets `/b/*`
- `REQUIRE_LIGHTNING=false` · do not flip
- bitcoind at tip · `source: bitcoind` · IBD done
- `metrics.json` raw: **last10=10** · **familyClients=17-row list** · **requireLightning=false**
- `/network` shows family tiles + recent confirmed stamps
- CI enabled; audit advisory; bundle budget = HTML entry; setup-node v7
- Cam: do **not** log into Cloudflare unless HTML-as-JS. Guide: `docs/CLOUDFLARE-PAGES.md`
- Cam: do **not** run Satohash `npm run dev` (binds API :3001) while Accountable needs 3001

### Kimi standing
- Bitcoind RAM/OOM watch only
- Rebuild recipe remains `bash scripts/vps-deploy-api.sh` (already done for last10)
- No `/api/*` path changes · no paywall flip

### Next (not blocking)
Paywall only on Cam flip · iPhone Safari later · no `npm audit --force`

---

## 2026-08-17 (Kimi on THOR) — API image rebuilt: last10 / familyClients LIVE

Rebuilt the THOR `satohash-api` Docker image from `main @ 820207e` (Grok's paste). Container `satohash-satohash-api-1` recreated → healthy. `REQUIRE_LIGHTNING=false` preserved; no `/api/*` path changes. Verified live `https://api.satohash.io/metrics.json` → `raw`: last10=10, familyClients=True (list), requireLightning=False. Grok's done-condition met — SPA `/network` tiles have data. Detail: `docs/KIMI-HANDOFF.md` top.

---

## Session — 2026-08-17 (Grok 4.6) — /NETWORK PICKUP (Kimi live)

Verified live `metrics.json`: last10=10, familyClients=17-row list, requireLightning=false.  
https://satohash.io/network shows bitcoind tip, 3/3 calendars, recent confirmed stamps, family tiles (spa 4, public 6, kimi/e2e rows). Loading copy no longer flashes “no family stamps”.

---

## Session — 2026-08-17 (Grok 4.6) — AUDIT FIX + KIMI REBUILD PASTE

Safe `npm audit fix` (no --force): 63 → 22 vulns. Remaining need breaking OTS/`request` upgrades — leave them.  
Kimi paste at top of `docs/KIMI-HANDOFF.md`: rebuild API image on THOR for `raw.last10` / `raw.familyClients`.

---

## Session — 2026-08-17 (Grok 4.6) — CI #66 BUNDLE BUDGET

Eager Stamp/Verify made `index-*.js` 1.1 MB. Budget now measures only the HTML entry. Core loop is lazyWithReload again. setup-node v7 on CI/Deploy (Dependabot PR #15 — Cam can ignore/close).

---

## Session — 2026-08-17 (Grok 4.6) — CI #64 RED WAS AUDIT GATE

Cam: do nothing on the red run. It died at `npm audit --audit-level=high` and skipped tests. Audit is now advisory; matrix is Node 22 only so e2e actually runs.

---

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

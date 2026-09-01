## ✅ LEGAL GATE CLOSED — Satohash AUTO can proceed (Kimi, 2026-09-02)

Lenny closed the legal gate (`t_b56fa721`). Full ruling: `/root/hq/docs/satohash-auto/ENTITY-TERMS-DONATE-RULING.md` (mirrored to private `kitsboy/HQ`; **never push satohash-auto/ to public kitsboy/satohash**).

**Bottom line for you (Grok):**
1. **Entity:** No registered entity for Satohash or Give A Bit. Free service is safe as-is (Terms carry `[ENTITY TBD]` / `[GOVERNING LAW TBD]`, Seychelles footer scrubbed all 7 langs). Paid launch only needs an entity + governing law — that's **Cam/counsel's call**, required only *before* a payment-gated rail flips.
2. **Terms:** approved-as-drafted for the **free tier**. Paid clauses (§07, §08) are forward-looking drafts — fine to publish, not live. Still open (don't block): R8 parent-site Terms, R11 pricing-model, German Impressum, §07 activation.
3. **"donate" vs "subscription" RULING:**
   - Keep **"donate"** on the live S1 Breez rail (`satohash@breez.tips`) — it's gratuitous, honest.
   - The **instant** `REQUIRE_LIGHTNING=true` + L402 gates a feature, flip the word to **"subscription"/"purchase"** and activate §07. **Never label a payment-gated tier "donate"** (deceptive practice, unenforceable refund waiver, false-advertising exposure).
   - Do NOT run S2 "Proof Pack" as paid — keep as free waitlist (blocked on entity + email infra).
4. **You are cleared to:** freeze SKUs per SKU-DRAFT (S1 donation = only live rail; paid tiers staged behind Cam's REQUIRE_LIGHTNING flip + funded/tested rail + entity) and write the **90-day AUTO calendar** with Safe Harbour intact.

**Awaiting:** Mimi's copy purge (`t_83602e70` — "2,400 professionals" + "10/day cap"). Do not enable REQUIRE_LIGHTNING. Do not contact officials.

---

## Latest Session Summary (from 2026-08-31 goodbye — Pages stable)

**Chat Topic:** Recover from last night, pull Kimi’s incident, stop `/stamp`+`/verify` flashing System Desync, record Pages = Grok standing auth, then close.

**Finished in this session:**
- Live SPA fix `ec1c69e` (Build 278). Pages Deploy success. Entry `/b/index-D_2O1MUS.js`. Cam: “Much better!”
- Stamp / StampDone / Verify **eager**. VitePWA `injectRegister: false`. No auto hard-reload on lazy-chunk errors. `scripts/verify-chunk-graph.mjs` in `build:verify`.
- Standing rule (Cam): **Kimi cannot alter Pages. Grok always has authorization** to push SPA/Pages fixes — do not wait for a second “ask before you push.”
- Maps updated: `AGENTS.md` #9 · `docs/architecture.md` · `docs/deploy.md` · `docs/CLOUDFLARE-PAGES.md` · `docs/OPS-TWO-MACHINE.md` · `docs/ops-runbook.md` · `docs/KIMI-VPS-RUNBOOK.md`

**Still to do:**
- Cam: iPhone `/p/<hash>` iMessage test; pin `/watch` on `@give_bit`
- Family tiles Katoa/Sherpa/Giveabit still 0
- Kind-0 + RSS→Nostr cron (script in git; nsec on THOR)
- Optional safe `npm audit fix` (non-force). Do **not** `--force` opentimestamps.
- Paywall / LND / GA stay off

**Next for Kimi:** Ingest this summary + the MASTER-BRAIN paste into **THOR Obsidian** (not M4). `git pull` on `/root/satohash` is docs only — **do not** rebuild the API for this. Educate Hermes: Pages incidents go to Grok; she does not wrangle Cloudflare. Do not flip `REQUIRE_LIGHTNING`. Do not change `/api/*`.

**Git:** `ec1c69e` on `origin/main`. Full notes: `docs/archive/SESSION-SUMMARY-2026-08-31-pages-stable-goodbye.md`

---

## ✅ RESOLVED — FRONTEND STABILITY: /stamp + /verify hang (Kimi 2026-08-31 → Grok `ec1c69e`)

Was: homepage OK; `/stamp` `/verify` hung on LoadingScreen / flashed System Desync. Mixed `/b/*` chunks + lazy Stamp importing the HTML entry + SW/`vite:preloadError`/ErrorBoundary reload loop.

**Fixed live.** Eager core loop. `injectRegister: false`. No auto-reload stack. Cam confirmed. If it returns: one hard refresh, then Grok (standing Pages auth — do not ask again).

Original incident text kept below for history.

---

## 🚨 For Grok — FRONTEND STABILITY: /stamp + /verify hang (Kimi/Hermes, 2026-08-31, PRIORITY)

Cam reports the site is "flashing/unstable" and I reproduced it in a real browser. **Please fix the frontend build — this is the active incident.**

**Verified symptoms (browser + server-side, cache-busted load):**
- **Homepage `/`** renders fully ✅ (all content, live telemetry).
- **`/stamp`** and **`/verify`** HANG — stuck forever on the `LoadingScreen` spinner ("LOADING SECURE MODULE...") under `<Suspense fallback={<LoadingScreen/>}>`. This is the flash Cam sees.
- **API is healthy** (readiness OK, bitcoin node healthy, paywall free_open, stamps live). Not a server issue — a **frontend lazy-load** issue.

**Strong root-cause clue — build mismatch (mixed deploy):**
- Served entry: `/b/index-ClusIukV.js` (referenced by served index.html).
- **BUT the Stamp chunk imports `index-DsWpoHFB.js`** (and local `dist/b/` ALSO has `index-DsWpoHFB.js`, while local dist entry is `index-BHDZz3rO.js`). Three different index-hashes across served/local = **chunks from different builds are being served together** → lazy route (`import('./pages/Stamp')`) fails → Suspense spinner never resolves.
- All 85+ direct and 16 nested chunks return 200 (real JS), so it's not a missing file — it's **inconsistent chunk set** (a stale index.js chunk cached against a newer build, or a half-pushed Pages deploy).

**Likely culprits to check:**
1. CF Pages deploy left a **mix of old+new chunks** (deploy raced, or long-lived HTTP cache on `/b/*` served stale index). Verify `/b/*` cache headers + purge.
2. `lazyWithReload` reload loop masking it (App.jsx uses `lazyWithReload(() => import('./pages/Stamp'))`).
3. The build-tag in footer shows "Build 276" — confirm the served `/b/index-*.js` matches ONE coherent build.

~~**Ask before you push the frontend fix**~~ **SUPERSEDED (Cam 2026-08-31):** Pages = Grok; standing auth to push SPA fixes. Keep `REQUIRE_LIGHTNING=false`, don't change `/api/*`.

---

## 📌 For Grok — dependency security note (Kimi/Hermes, 2026-08-31)

Cam asked me to review satohash deps (the same `npm audit` pass I did on the other 5 family sites). I pulled origin/main, read the handoff, and ran `npm audit --omit=dev`. **Heads up — satohash is the one repo I could NOT safely auto-fix:**

- **21 high/critical prod-dep vulnerabilities** remain, and nearly all trace to **`opentimestamps` (0.4.9)** — the unmaintained core library that **is** the stamping engine. Its ancient transitive tree pulls in `form-data@2.3.3`, `request`, `tough-cookie`, `ipfs-core-utils`, `nanoid` → the criticals.
- The only "fix" npm offers is a **destructive downgrade** (`opentimestamps@0.0.0`, `ipfs-http-client@39`) — that would **break stamping**. Do NOT run `npm audit fix --force` here.
- I applied only the **safe non-breaking** `npm audit fix` (react-router-dom 6.30.4→6.30.6 + vitest patch) and verified the full build passes. Per Cam I did **NOT push** it — it's documented here and I reset the local tree to clean origin/main.

**When you're next working in satohash (your lane), please:**
1. Optionally re-apply the safe bump: `npm audit fix` (non-breaking) → build-verified. Commit + push at your discretion.
2. Decide (with Cam) whether the `opentimestamps` criticals warrant a real migration — likely pinning a maintained fork or replacing it — **not** `--force`. The live THOR API must not break; handoff says "API does not need another rebuild."
3. Do NOT flip `REQUIRE_LIGHTNING`, change `/api/*`, or commit nsec/keys.

Everything else in the session is healthy — fleet audit (no-LLM) now covers all 9 repos + 8 bots and is silent when green.

---

## Latest Session Summary (from 2026-08-31 goodbye)

**Chat Topic:** Google findability + remaining product batch + THOR API rebuild so authored stamps persist.

**Finished in this session:**
- GSC verified; sitemap.xml Success **69** pages; keep `googlef508c6fb64de60ff.html` forever
- NIP-05 `satohash@satohash.io` + njump footer; `/p/<hash>` JPEG OG; family widget paste
- THOR `vps-deploy-api.sh` — authored **400** on bad field; free stamp **200** reuse; paywall off
- Clean pickup files: `.ai_docs/current-status.md` · `docs/handoff-log.md` · `docs/archive/SESSION-SUMMARY-2026-08-31-goodbye.md`

**Still to do:**
- Cam: iPhone `/p/<hash>` iMessage test; pin `/watch` on `@give_bit`
- Family tiles Katoa/Sherpa/Giveabit still 0
- Kind-0 + RSS→Nostr cron (script in git; nsec on THOR)
- Paywall / LND / GA stay off

**Next for Kimi:** Ingest this summary into **THOR Obsidian MASTER-BRAIN / Kanban** (not M4). API does **not** need another rebuild for authored. `git pull` on `/root/satohash` is enough to pick up docs. Educate Hermes. Do not flip `REQUIRE_LIGHTNING`. Do not change `/api/*`.

**Git:** `origin/main` through this goodbye. Full notes: `docs/archive/SESSION-SUMMARY-2026-08-31-goodbye.md`

---

## Session close — 2026-08-31 · Grok M3 → Kimi / next (Cam leaving)

**State:** Product live, stamps free. GSC done. THOR API rebuilt tonight.

**Shipped + verified:**
- GSC `https://satohash.io/` HTML-file verified; sitemap.xml Success **69** pages. Keep `googlef508c6fb64de60ff.html` forever.
- NIP-05 `satohash@satohash.io` (same public hex as kimi) on Pages + API; footer njump.
- `/p/<hash>` JPEG OG (`01-stamp-hero.jpg`) for iMessage; share uses `/p/<hash>`.
- Family widget paste on `/widgets`. Katoa/Sherpa/Giveabit tiles still 0 until someone stamps through them.
- THOR: `git pull` + `vps-deploy-api.sh` → image `78e2a8f`. Bad `authored.file_sha256` → 400. Normal stamp reuse 200. `REQUIRE_LIGHTNING=false`.

**Not tonight:** iPhone share test · pin `/watch` on `@give_bit` · RSS→Nostr cron (script is in git; nsec stays on THOR).

**Do not:** flip paywall · change `/api/*` · commit nsec · GA · `@satohash` · delete GSC file · Cloudflare login.

**Git:** `62b8999` on `origin/main`. Ingest into **THOR Obsidian MASTER-BRAIN**, not M4.

---

## Session close — 2026-08-29 · Kimi/Hermes → all agents (Cam /goodbye)

**State:** Satohash strong and live. Stamps free. Full-court-press content, docs, videos, SEO, RSS, and legal posture all shipped, merged, and live-verified. Grok M3 pulled and shipped a high-value batch (footer, X player card, per-page OG, ideas list).

**Shipped this session (all live + verified):**
- Docs live on agents.giveabit.io: Mission & Scope v3, Five-Pillars, both decks, ELI16 one-pager (`/satohash/*`), plus satohash.io `/docs/how-satohash-works` + `/docs/support-and-guidance`.
- E0 explainer videos (EN full-VO, ES full-VO, EN-subtitles-only) live on the Satohash doc pages.
- RSS feed at `/feed.xml` (RSS 2.0, learn-articles), footer + Guides subscribe buttons.
- Per-page static OG for crawlers (WhatsApp/Telegram/X/Nostr get per-page previews).
- 7-language SEO refresh (legally approved), es/pt civic framing ("Registro de Verdad Cívico" / "Notarização Cívica não licenciada"), FAQ JSON-LD softening.
- Grok: Glacier Jewel footer w/ live proof chips + trust badges, @give_bit canonical, /watch X player card, /og/*.png set, BreadcrumbList/VideoObject, footer on /stamp//verify loop.

**Standing truth (Grok-corrected):** Kimi vault/MASTER-BRAIN = THOR VPS Obsidian, not M4. Do not Tailscale-sync to M4.

**Cam-gated / pending:**
- Google Search Console sitemap submit for satohash.io (Cam; pop-up was blocked — reminder set 2026-08-30 10:00). Optional Twitter Card Validator on /watch.
- Trusted Chat Layer plan = PLAN ONLY, no build yet (`/root/MASTER-BRAIN/docs/FAMILY-TRUSTED-CHAT-PLAN.md`).
- Grok Bot fleet (travel agent, head butler, app-deployer) — design phase; system prompts drafted; harness-engineering reference filed.
- Paywall, LN channels, Giving Week public launch = HELD (Cam-gated).

**Do not:** flip REQUIRE_LIGHTNING · change /api/* paths · commit nsec/.env · create @satohash · announce Giving Week.

**Git:** satohash main pulled through Grok's `167f159`. HQ pushed.

---

## Latest Session Summary (from 2026-08-29 goodbye)

**Chat Topic:** Recover Satohash, ship the high-value batch, leave Kimi a Twitter/Nostr idea list. Vault = THOR Obsidian, not M4.

**Finished in this session:**
- Pulled Kimi’s `b5e425c` paste (was on GitHub, not M3)
- Footer polish + live proof chips + gold RSS; then Footer on `/stamp` `/stamp/done` `/verify`
- `/watch` X player card live (`/watch-player.html`); `@give_bit` + `/og/*.png`
- `docs/KIMI-IDEAS-2026-08-29.md` (X pin `/watch`, clips, RSS→Nostr, kind-0 + NIP-05, njump)
- Docs: Kimi vault is **THOR VPS Obsidian**, not M4

**Still to do:**
- Kimi: pin `/watch`; Satohash bot kind-0 + NIP-05; njump share sheet; `X-Satohash-Client`; bitcoind `free -h`
- Cam: Search Console sitemap; Card Validator on live `/watch`
- Paywall only on Cam flip. Giving Week held. No `@satohash` handle.

**Next for Kimi:** Pull `main` @ `f02a575` on THOR. Ingest this summary + `docs/KIMI-IDEAS-2026-08-29.md` into **THOR Obsidian MASTER-BRAIN / Kanban**. Do **not** use M4 Obsidian. Do **not** flip `REQUIRE_LIGHTNING`. Do **not** change `/api/*`.

**Git:** `f02a575` on `origin/main`.

---

## Standing — 2026-08-29 · Kimi vault is THOR Obsidian (not M4)

Cam: we **no longer use M4 Obsidian**. MASTER-BRAIN / Kanban / vault = **THOR VPS Obsidian**. GitHub handoffs (`docs/KIMI-HANDOFF.md`, `docs/KIMI-IDEAS-2026-08-29.md`, `docs/MASTER-BRAIN-INGEST.md`) are pulled on THOR. Do not Tailscale-sync notes to M4.

---

## Session — 2026-08-29 · IDEAS FOR KIMI (Grok M3)

**Full list:** `docs/KIMI-IDEAS-2026-08-29.md` (also MASTER-BRAIN paste below). Product looks good — this is **distribution + identity**, not a rebuild.

**Do not:** flip paywall · change `/api/*` · commit nsec · Giving Week announce · second X handle.

### Twitter / X (`@give_bit` only)
1. Pin `https://satohash.io/watch` — player card is **already live**. Card Validator must show video, not a still.
2. 3–4 × ~12s clips from the 84s film (hook / hash / block / CTA), each with its own URL.
3. One X card per new learn article (RSS + per-page OG already work).
4. Share intents: add `via=give_bit`; never auto-tweet a user’s hash.
5. Evergreen “how Bitcoin timestamps a file” thread → canned reply. Pending ≠ confirmed.
6. Optional Friday aggregate (“N fingerprints folded into Bitcoin today”) — no filenames.
7. Card Validator on every Pages deploy (`/` `/watch` `/stamp` one learn-*).

### Nostr
1. Kind-0 profile for the stamp bot: name Satohash, `lud16=satohash@breez.tips`, website satohash.io.
2. NIP-05 `satohash@giveabit.io` and/or `satohash@satohash.io` → **bot pubkey** (public hex). Keep `kimi@giveabit.io` as the human.
3. Footer + `llms.txt`: `njump.me/<npub>` (humans without a handler).
4. Share sheet: njump + primal/snort; stop **iris-only**.
5. `/network`: show kind-1 notes we already publish (hash prefix + njump). Stamps already go out as kind 1.
6. THOR cron: `feed.xml` → kind 1 (dedup by URL). nsec in Vault only.
7. Explainer kind-1 from Kimi npub with `/watch` + R2 mp4.
8. Relays: 5/7 green or honest 2/3 on `/status`. Kind 1063 often rejected — kind 1 is the real path.
9. `/p/<hash>`: njump `nevent` only if `nostr_event_id` exists.

**Honesty:** OTS hashes the file fingerprint only. Nostr id is metadata. Do not claim trustless authorship yet.

### Ops this week
Bitcoind `free -h` · GSC sitemap submit (ping URLs are dead) · MASTER-BRAIN ingest this list · Lighthouse after `11c0ceb` Pages · family `X-Satohash-Client` still 0.

---

## Session — 2026-08-29 · GROK HIGH-VALUE BATCH (Cam: use ~20% weekly allotment on Satohash)

**From:** Hermes (Kimi lane) via Cam. **Cam's mood:** "wow it is looking really good, well done!" — site in strong state. This is polish + verification, not a rebuild.

**Top asks for Grok:**
1. 🎨 **Modernize + upgrade the footer** (`src/components/layout/Footer.jsx`) — premium, on-brand (gold-accent Glacier Jewel). Add social-proof chips from live metrics (api.satohash.io/metrics.json), trust badges (Free · 0 KYC · Bitcoin-only · FOSS), cleaner grid/mobile. Keep honest posture. (RSS footer button already added — verify styled well.)
2. 🐦 **Twitter/X SEO** — verify all `twitter:` tags complete (SPA + static), run Twitter Card Validator, confirm @give_bit canonical, consider video/player card for /watch explainers.
3. 🔍 **Independent live verification** (Cam's never-relay rule) — RSS feed valid XML, per-page static OG works for all key pages w/ socialbot UA, es/pt civic framing live, FAQ JSON-LD softening live, fresh Lighthouse (desktop+mobile, fix perf/a11y), i18n keys intact, security spot-check (no secrets in bundle).
4. 🧠 **High-value additions** — JSON-LD depth (BreadcrumbList on docs, VideoObject on /watch), sitemap freshness (add new pages + feed.xml), llms.txt current, GSC/Bing submission, consider richer OG image set (coordinate Mimi).

**Questions for Cam (direction only, no action needed):**
1. Footer: full premium redesign or light refresh? (Assuming tasteful premium upgrade.)
2. Twitter: is @give_bit the canonical handle everywhere?
3. Video cards on /watch worth enabling?
4. Want Mimi to produce dedicated on-brand OG image set, or keep 01-stamp-hero.jpg?

**Handoff rule:** Grok reads TOP first, appends one-line DONE per item when shipped. Mirror relevant items to per-project docs. Push after update.

**DONE (Grok M3, 2026-08-29):**
1. Footer — DONE. Glacier Jewel trust chips (Free · 0 KYC · Bitcoin-only · FOSS), live metrics from `api.satohash.io/metrics.json` (proofs + today), gold RSS. Verified on `/` + `/pitch`, desktop 1714px and mobile 390px (no overflow).
2. Twitter/X — DONE. `@give_bit` canonical on SPA + prerender + `/p/<hash>` cards. Per-page `/og/*.png`. `/watch` is `twitter:card=player` + `https://satohash.io/watch-player.html` (embeddable CSP via Pages middleware; `X-Frame-Options: DENY` not inherited). Removed App-level `usePageMeta` override that was stomping page titles/images.
3. Live verification — DONE (M3). RSS `feed.xml` valid XML, 14 items, on-brand title. Live Twitterbot already gets per-page OG PNGs + `@give_bit`. FAQ JSON-LD is independently-verifiable (no “satisfy ESIGN”). es/pt civic titles live (`Bitcoin como Registro de Verdad Cívico` / `Notarização Cívica (não licenciada)`). No `nsec`/private keys in src. GSC/Bing ping URLs return 404/410 — Cam still submits sitemap in Search Console after this deploy.
4. Additions — DONE. BreadcrumbList on `/docs/*`, VideoObject on `/watch`, sitemap +`feed.xml` +`/docs/how-satohash-works` +`/docs/support-and-guidance` (71 URLs), `llms.txt` current, dedicated OG set wired (Cam: yes to Mimi/Kimi `/og/*.png`, not `01-stamp-hero.jpg`).

**DONE follow-on (Grok M3, same day):** Footer now on `/stamp` `/stamp/done` `/verify` (core loop was chrome-less). `usePageMeta` no longer doubles “Satohash | Satohash”. Verify pill: “Independent verification” (dropped courtroom-grade). Live `/watch` player card already 200 on Pages.

---

## Session — 2026-08-27 · Breez donate QR (Grok M3)

**Done:**
- THOR’s `dcd1557` (“Migrate donation receive to Breez Spark”) was already on origin — pulled on M3.
- Donate QR payload is `lightning:satohash@breez.tips` (`8b337fa`), not the HTTPS LNURL and not LNbits.
- Live `/donate`: Lightning address `satohash@breez.tips`, on-chain `bc1p25zw4…urdlsr`. `public/data/donate.json` Breez. OTS receipts unchanged.

**Git State:** SHA `8b337fa` on `origin/main`.

---
## Session — 2026-08-20 (Kimi on THOR — SEO prerender + AI crawler batch)

**SEO batch shipped (verified live):**

- **Prerendering** — `scripts/prerender-seo.js` generates 18 static HTML pages at build (landing, FAQ, 6 secondary: stamp/pricing/templates/verify/donate/network, 10 learn articles) with full content + Article/FAQPage JSON-LD. Wired into `npm run build`.
- **Crawler middleware** — `functions/_middleware.js` serves prerendered HTML to crawler UAs (Googlebot/Bingbot/DuckDuckBot verified 200 + content), humans keep the SPA (verified).
- **llms.txt** — AI-crawler map of Satohash (what/why/key facts/10 articles). Live at satohash.io/llms.txt, in sitemap.
- **robots.txt** — explicit Allow for GPTBot/ChatGPT-User/ClaudeBot/anthropic-ai/PerplexityBot/Applebot-Extended.
- **Sitemap** — +llms.txt, +robots.txt (68 URLs, valid).

**Verified live:** Googlebot → prerendered landing/article ✅ · Bingbot/DuckDuckBot ✅ · humans → SPA ✅ · llms.txt 200 ✅.

**⚠️ NEEDS CAM (2-min CF dashboard):** GPTBot/ClaudeBot/PerplexityBot get **403 from Cloudflare bot fight mode** (blocked at edge before middleware). To unblock:
1. dash.cloudflare.com → satohash.io → **Security → Bots** (or WAF → Custom rules)
2. Add rule: **Allow** when `User-Agent contains "GPTBot" OR "ClaudeBot" OR "PerplexityBot" OR "ChatGPT-User"**
3. Deploy. Then AI crawlers get the prerendered HTML too.
(Alternative: add a CF API token to THOR vault and I'll do it — but dashboard is 2 min.)

**Commits:** `c83d1f5` (prerender+llms+middleware) · `d44029e` (robots) · tests 126/126 · M3 synced.

---

## Session — 2026-08-21 (Kimi on THOR — day end / goodbye)

**Massive day — all four enhancement tiers + SEO + HQ shipped:**

- **Tier 1+2:** /donate page (Lightning QR + on-chain), TipButton, /status transparency dashboard, server-side proof certificate (GET /api/stamps/:id/certificate), proof-card share, batch-verify page, notify-me email on stamp, 5+5 learn articles (10 total), FAQPage/Article/WebSite schema, sitemap 68 URLs.
- **SEO engine:** 18 prerendered pages served to crawlers (functions/_middleware.js), llms.txt, robots welcomes AI bots, Cloudflare AI Crawl Control unblocked by Cam → **GPTBot/ClaudeBot/PerplexityBot all 200 + full content**. Suite 9/9 sites at 100 (SEO Plane 96/100 A).
- **HQ v3.32.7:** SEO Plane tab (nightly audit, self-healing: auto-discovers new sites + regression alerts), Money Plane, welcome strip, / palette keyboard nav, CSP fix (was blocking icons/metrics), clickable status chips, LN node chip redesign. v3.32.6 private-IP guard for LNbits proxy.
- **Security headers 9/9 green** across all family repos (motopass/tadbuy/stranded/sherpa/openstrata/HQ fixed; openstrata real app discovered on main branch).
- **Watchdogs:** satohash-logwatch (6h error sweep), backup-integrity-test (weekly, verified restores), header-parity-audit (weekly, 9/9).
- **Fixed live bug:** /api/public/readiness was 500 (import path) — 207 errors/6h → fixed.
- **Payment:** Cam's 6,865-sat test confirmed on-chain in LND. GiveABit 7,704 sats parked in LNbits until channels open (sweep later).

**Still open (Cam-gated):** Sentry DSN, LN channels (~500k sats), paywall flip, Umbrel node, iPhone Safari test, Search Console (Tue reminder).

**For Grok:** family-site X-Satohash-Client attribution + on-chain donate addresses (see docs/TIER3-4-PLAN.md §Handoff to Grok).

---

## Session — 2026-08-20 (Kimi on THOR — security headers parity, 9/9)

**Security headers sweep — ALL 9 SITES GREEN** (was 4-5 sites missing CSP/HSTS):

| Repo | Branch | Fix |
|------|--------|-----|
| motopass | main | + HSTS + CSP |
| tadbuy | main | + HSTS + CSP |
| stranded | main | + HSTS (had CSP) |
| sherpacarta | main | + HSTS (had CSP) |
| openstrata | **main** (SvelteKit app) | full `static/_headers` (CSP+HSTS+XFO) — discovered real app on main branch, not talent |
| HQ | main | + HSTS + CSP to `pages/_headers` (source; public/ is build output) |

- Verified live: every site now returns CSP + HSTS preload + XFO DENY + nosniff + referrer-policy. Re-audit: `bash /root/scripts/header-parity-audit.sh` → 9/9 ✅.
- Log watchdog (new) caught the readiness 500 bug class (263+207 in 6h) → already fixed via import path; state-file dedup now silent.
- All commits pushed per repo; openstrata deploy confirmed via CF native integration.

---

## Session — 2026-08-20 (Kimi on THOR — Batch 3: completion sweep)

**Autonomous completion batch (all verified live):**

- **Fixed production bug:** `/api/public/readiness` was returning **500 for 207 requests/6h** — `server/routes/public.js` imported `./lib/readiness.js` (wrong path, same class as the earlier health.js bug). Fixed → `../lib/readiness.js` → now 200 with all planes (proof_api, paywall, bitcoin_node, lightning, ai, nostr). **This was the endpoint LiveNodeChip/monitors rely on.**
- **Batch verify page** `/verify/batch` — paste up to 50 hashes, check all at once, confirmed/pending/not-found chips. Linked from verify page + sitemap.
- **Notify-me email** on Stamp — optional "email me when confirmed" field (backend `email` support already existed; UI now exposes it, sends on both stamp paths).
- **5 more learn articles** (10 total now): OTS vs DocuSign, protecting AI outputs, photos/video, blockchain for archives, compliance audits. All in sitemap.
- **Proof-wall link** on Network page + **live proof counter** on Pitch page.
- **Ops watchdogs (new crons):** `satohash-logwatch.sh` (6h error-class sweep → FIXES-LOG + TG alert on new classes), `backup-integrity-test.sh` (weekly — **verified LNbits restores 9 wallets + satohash SQLite integrity ok, 21 stamps**), `header-parity-audit.sh` (weekly — **found gaps: motopass/tadbuy/openstrata/hq/sherpa missing CSP/HSTS** → `/root/hq/docs/HEADER-PARITY.md`).
- **Nostr relays** already rotated (7 relays, env-config) — verified.

**Git:** satohash `23b2263` pushed · tests 126/126 · build clean · M3 synced · all new routes 200 live.

**Handed to Grok (family repos, M3 lane):** X-Satohash-Client attribution + on-chain donate for katoa/motopass/tadbuy/stranded/openstrata (see docs/TIER3-4-PLAN.md §Handoff to Grok).

---

## Session — 2026-08-20 (Kimi on THOR — Tier 3+4 batch)

**Tier 3 + Tier 4 shipped** (done directly — agents rate-limited last batch):

- **Swagger API docs** `server/swagger.js` → v5.0.0, **14 documented paths** (public, stamps, network, identity incl. certificate + LNURL + NIP-05). Live at api.satohash.io/api-docs (spec verified in swagger-ui-init.js).
- **CLI polish** `packages/satohash-cli` — `--json` output on all commands, `stamp --watch` (polls until Bitcoin-confirmed), `watch --interval N`, proper exit codes, richer help. Tested live (`status --json` 200).
- **Webhook recipes** `docs/WEBHOOKS.md` — accurate to real routes (X-Npub auth, /test endpoint, at-least-once semantics).
- **Tier 3/4 plan completion** — recon found most items ALREADY DONE (widgets, theme toggle, batch UI with zip, PWA install prompt, full CI with playwright, comprehensive _headers, live proofCount). Verified + documented in `docs/TIER3-4-PLAN.md`.
- **Security header sweep** — live-verified full CSP/HSTS/XFO/nosniff/referrer/permissions on 6 routes. ✅ No changes needed.
- **Sentry** — code wired both sides; **Cam-gated**: needs a free sentry.io DSN → Vault (self-host not recommended on THOR: kafka+clickhouse ~8GB RAM).

**Git:** satohash `b8fbbf3` pushed · tests 126/126 · build clean · M3 synced.

**Remaining gate items (Cam):** Sentry DSN, LN channels, paywall flip, Umbrel node, iPhone Safari test.

---

## Session — 2026-08-20 (Kimi on THOR — Tier 1+2 enhancement batch)

**Tier 1 + Tier 2 shipped** (4 parallel agents + orchestrator finishing; agents hit API rate-limit caps so orchestrator completed ~60% of the work directly):

- **Donate page** `/donate` — Lightning QR (satohash@api.satohash.io:8443) + on-chain card (LND address, mempool link) + transparency section. TipButton component on Landing hero. `public/data/donate.json` receive config.
- **Status page upgrade** `/status` — live transparency dashboard: service, Bitcoin node (blocks/chain/pruned/ready_to_verify), OTS calendars 3/3, Nostr relays, Lightning/LNbits, recent stamps. Fixed LiveNodeChip (was querying non-existent /api/public/readiness).
- **Proof certificate** — server endpoint `GET /api/stamps/:id/certificate` (jspdf PDF + QR, verified live 317KB PDF) + existing client-side certificate button.
- **Proof card share** `/p/<hash>` — Copy proof link + Share (navigator.share w/ copy fallback).
- **SEO** — FAQPage schema now emits 8 real Q&As from i18n; WebSite SearchAction schema on landing; 5 learn articles at /docs/learn-* (sitemap + hreflang audit doc).
- **Lighthouse/security audit** — `docs/LIGHTHOUSE-REPORT.md` (curl-based, honest).
- **Sentry** — DSN documented in .env.example (server + client both wired in code, just need a DSN in Vault).

**Git:** satohash `fd70475` pushed · tests 126/126 pass · build clean · live verified (donate/status/docs 200, certificate endpoint 200 PDF).

**Tier 3/4 plan** ready in `docs/TIER3-4-PLAN.md` (widget, CLI, API docs, webhooks, PWA, theme, batch UI; Sentry DSN, CI tests, cache audit, metrics strip, security sweep).

**Still open:** Cam's 6,865-sat test tx still mempool-pending (low fee); LN channels; X-Satohash-Client attribution; on-chain addresses on other sites.

---

## Session — 2026-08-20 (Kimi on THOR — money rails + resilience)

**Done this session:**
- **Health fix:** `server/routes/health.js` lib import paths `./lib/*` → `../lib/*` — bitcoin + lightning checks were erroring since route extraction. Deep health all-green now: bitcoind healthy (963,332, 100%), LNbits healthy, OTS 3/3, Nostr 2/3. Commits `0bf6b54` + `2796819`.
- **LNbits backup:** postgres dump cron 06:30 daily, 14-day retention, 600 perms — 9 family wallets now recoverable (`/root/scripts/backup-lnbits.sh`). First backup verified.
- **Money Plane (HQ v3.32.1):** new payment-audit section on Money tab — per-site on-chain / LNURL / LNbits / channels / paywall rows with ELI16 tooltips. Live on hq.giveabit.io.
- **All 9 LNURL addresses LIVE:** created LNURL-pay links for giveabit, satohash, katoa, motopass, openstrata, stranded, tadbuy, kimi + existing sherpa — all `PAYREQ` + invoice generation verified on `api.satohash.io:8443` and via giveabit.io `.well-known/lnurlp/*` stubs (commit `3e3f7c7`). Family registry: `giveabit.io/wallets.json` (commit `09e20b2`).
- **UI:** landing button "Confirm .ots" → **"Confirm .ots Stamp"** (`ddf4223`).
- **Resilience:** `vite:preloadError` auto-reload handler — recovers from deploy-race chunk fetch failures (`6ef0e6e`). Triggered by Cam's error report at 19:19Z during the rename deploy; old chunk `OtsVerifyPanel-DB13-VZL.js` retained on CDN.
- **On-chain test:** Cam sent 6,865 sats to fresh LND address `bc1qkrlg6ssme0ztgynr2us846mtlde0r33ly7kdmc` (txid `718fc6d0…`). Was mempool-pending at session close — verify LND `walletbalance` next session.

**Still to do:**
- Sherpa / MotoPass / Katoa `X-Satohash-Client` (tiles 0)
- Daily bitcoind `free -h`
- Paywall only when Cam flips
- iPhone Safari `/p/<hash>` share
- LN channels open (Cam: "soon") — large inbound needs them
- On-chain addresses published on other sites' donate pages

**Git:** satohash main @ `6ef0e6e` · HQ main @ `5ea7204b` · giveabit main @ `3e3f7c7` — all pushed, M3 synced.

---

## Latest Session Summary (from 2026-08-20 goodbye)

**Chat Topic:** Rebuild and publish the Satohash `/watch` explainer.

**Finished in this session:**
- ~84s Kimi/Pippa cut live as `/watch` full cut (`satohash-explainer-with-vo2.mp4`)
- Dance bed ~15%, Noir graphics, hash mark top-left on close
- Git `f64463f` · HyperFrames https://hyperframes.dev/p/915356ed-8e2f-4c6e-97a4-d931b33b1341
- 10s teaser still on `/watch` as Short

**Still to do:**
- Sherpa / MotoPass / Katoa `X-Satohash-Client` (tiles 0)
- Daily bitcoind `free -h`
- Paywall only when Cam flips
- iPhone Safari `/p/<hash>` share

**Next for Kimi:** Integrate this summary into MASTER-BRAIN / Kanban. Do **not** flip `REQUIRE_LIGHTNING`. Do **not** change `/api/*`. Do **not** touch Cloudflare Pages. OPEN block below is still the work.

---

## Grok goodbye (2026-08-17)

Session closed. Product verified. Your OPEN block below is still the work. Do not flip paywall. Do not change `/api/*`.

---

## OPEN — Kimi (2026-08-17) — family attribution + RAM watch

**From:** Grok M3 · **To:** Kimi on THOR · **Cam: paste this whole block — do not edit**

Do **not** flip `REQUIRE_LIGHTNING`. Do **not** change `/api/*` paths. Do **not** touch Cloudflare Pages.

### 1) Family tiles still 0 (Sherpa / MotoPass / Katoa)

`/network` family tiles for `sherpacarta`, `motopass`, `katoa` are **0**. The Satohash API is fine. Those **product apps** are not sending the client header (or not calling `POST https://api.satohash.io/api/stamp` at all).

For **each** of motopass, sherpacarta (and sherpacarta-canada), katoa:

1. Every `POST https://api.satohash.io/api/stamp` MUST include:
   ```
   X-Satohash-Client: motopass
   ```
   (or `sherpacarta` / `sherpacarta-canada` / `katoa` — exact id, lowercase)
2. Prefer `packages/satohash-client` (`createSatohashClient({ clientId: 'motopass' })`).
3. Deep-link fallback only: `https://satohash.io/stamp?hash=<64hex>&ref=motopass` (SPA will set the header).
4. After one real stamp per product, hand back:
   ```
   curl -sS https://api.satohash.io/metrics.json | python3 -c 'import json,sys; rows=(json.load(sys.stdin).get("raw") or {}).get("familyClients") or [];
   [print(r.get("id"), r.get("value")) for r in rows if r.get("id") in ("motopass","sherpacarta","sherpacarta-canada","katoa")]'
   ```
   Want those values **≥ 1**.

Do **not** invent new API paths. Do **not** stamp fake hashes into production except one smoke per product with `X-Satohash-Client`.

### 2) bitcoind RAM / OOM (standing)

Node died to OOM 2026-07-28. IBD is **done**. Once per day (or after any API rebuild):

```bash
free -h
systemctl is-active bitcoind
bitcoin-cli -getinfo | head -20
```

If RSS climbs or `bitcoind` is dead, restart the unit only (`systemctl start bitcoind`). Do not reindex. Hand back `free -h` + `is-active` if anything looks wrong.

### 3) Pull stamp rate-limit (after this Grok push lands on main)

```bash
cd /root/satohash && git pull --ff-only origin main && bash scripts/vps-deploy-api.sh
```

New: public `POST /api/stamp` **5/min/IP**; family key **30/min**; same hash returns existing proof (`reused: true`) — no second calendar submit. Keep `REQUIRE_LIGHTNING=false`.

---

## Standing (2026-08-17) — current

**From:** Grok M3 · **To:** Kimi / next Grok

| Item | State |
|------|--------|
| Free stamps | `REQUIRE_LIGHTNING=false` — **do not flip** |
| `/api/*` paths | **do not change** |
| API image | **Rebuilt** 2026-08-17 — `raw.last10` + `raw.familyClients` live |
| bitcoind | At tip · source bitcoind · IBD done · **daily RAM watch (open)** |
| Family tiles | sherpa/motopass/katoa still **0** — **open** (header on those apps) |
| Cam / CF | Do not log in unless site broken — `docs/CLOUDFLARE-PAGES.md` |
| Deploy API | `bash scripts/vps-deploy-api.sh` on THOR checkout |

Open Kimi work: **family X-Satohash-Client** + **RAM watch**. No image rebuild unless those apps need a new Satohash API (they do not).

---

## Session — 2026-08-17 (Kimi on THOR) — ✅ API IMAGE REBUILT: last10 / familyClients LIVE

**From:** Kimi · **To:** Grok M3 · **Hand-back:** done + verified live.

Rebuilt the THOR `satohash-api` Docker image from `main` @ `820207e` (the paste you left). Container `satohash-satohash-api-1` recreated → **healthy**. `REQUIRE_LIGHTNING=false` preserved. No `/api/*` paths touched.

Live `https://api.satohash.io/metrics.json` → `raw`:
- `last10`: **10**
- `familyClients`: **True (list)**
- `requireLightning`: **False**

Your done-condition met — SPA `/network` tiles have data now. Plausible analytics: https://github.com/plausible/analytics

---

## Session — 2026-08-17 (Grok) — REBUILD API IMAGE (last10) — **recipe; already executed**

**From:** Grok M3 · **To:** Kimi on THOR · **Status:** executed same day  
**Do not** flip `REQUIRE_LIGHTNING`. **Do not** change `/api/*` paths.

Kept as the rebuild recipe. Live `metrics.json` **already has** `raw.last10` + `raw.familyClients`.

### On THOR (paste)

```bash
# find the satohash checkout (adjust if your path differs)
cd /root/satohash 2>/dev/null || cd ~/satohash 2>/dev/null || cd /opt/satohash || pwd

git fetch origin
git checkout main
git pull --ff-only origin main

# keep existing .env — REQUIRE_LIGHTNING must stay false
grep -n REQUIRE_LIGHTNING .env || echo "REQUIRE_LIGHTNING=false" >> .env
grep REQUIRE_LIGHTNING .env

# rebuild API only (do not recreate Caddy / bitcoind)
bash scripts/vps-deploy-api.sh
# if compose is already named:
# docker compose -f docker-compose.vps.yml up -d --build satohash-api

sleep 5
curl -sf http://127.0.0.1:3001/health && echo
curl -sS https://api.satohash.io/metrics.json | python3 -c 'import json,sys; d=json.load(sys.stdin); r=d.get("raw") or {}; print("last10", len(r.get("last10") or [])); print("familyClients", bool(r.get("familyClients"))); print("requireLightning", r.get("requireLightning"))'
```

**Done when:** `last10` prints a number (0 is ok if no rows) **and** `familyClients` is True (or a list). `requireLightning` must be False.

**Hand back to Grok:** those three printed lines. No secrets.

---

## Session — 2026-08-17 (Grok) — CF GUIDE + LEFTOVER LIST

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** leftover polish on `main` · free stamps ON

### Kimi
1. ~~Rebuild API image~~ **DONE 2026-08-17** — last10 + familyClients live
2. Do **not** flip `REQUIRE_LIGHTNING`
3. Do **not** change `/api/*` paths
4. Cam should **not** log into Cloudflare unless the site is broken — `docs/CLOUDFLARE-PAGES.md`

### Cam
Stay out of the CF dashboard. After deploy: private window → `/` → `/stamp` → `/p/<hash>`.

---

## Session — 2026-08-10 (Grok) — GOODBYE · Mobile Top 12 live

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** Mobile Top 12 **on CF Pages** · IBD **done** · free stamps ON

### Done
- IBD status docs corrected (your tip numbers) + pushed
- Mobile Top 12 code + GHA Deploy #223 success (smoke green)
- Tip `5fea2a3` · live satohash.io/stamp · /stamp/done · /verify ELI-5

### Ops standing
- Free stamps · REQUIRE_LIGHTNING=false · **do not flip**
- bitcoind at tip · source bitcoind · no IBD monitoring as open work
- Watch RAM/OOM only
- HQ metrics: api.satohash.io/metrics.json

### Kimi next
1. No paywall flip  
2. bitcoind health/RAM only  
3. Optional: hard-refresh SPA after deploys if edge stale  

### Next Grok (suggested)
Full stamp e2e vs API · CI lh mobile · vault polish · family deep-link matrix · Umami funnel · longer explainer when Cam ready

---

## Session — 2026-08-10 (Grok) — IBD COMPLETE (Kimi confirm via Cam)

**From:** Cam + Kimi THOR truth · **To:** all agents · **Status:** **IBD DONE** · free stamps ON · no paywall flip

### Bitcoin — DONE (do not re-report as “in progress”)

| Check | Value |
|-------|--------|
| blocks | **961,960 / 961,960** (= chain tip) |
| Verification | 100% (0.999996) |
| initialblockdownload | **false** |
| Pruned | 10 GB target · active · healthy |
| Service | bitcoind active · load ~2.0 |
| API source | **bitcoind** (mempool.space fallback **not in path**) |
| API height / ibd | 961,960 ✓ · **false** |
| Mempool | local node live |
| Deep health | green · all deps 200 |

**Story:** IBD resumed Aug 4 @ ~508k (~85 blk/min, ETA ~4d) → finished ~Aug 8; tip since. API reads chain + mempool from local node. Suite (satohash, katoa, tadbuy/motopass, stranded) can lean on own-node.

### Standing (unchanged product)
- Free stamps ON · `REQUIRE_LIGHTNING=false` · SPA → `api.satohash.io`
- HQ metrics SoT: `https://api.satohash.io/metrics.json`
- Git tip (pre this doc commit): `3c80c67`

### Next
1. **Do not** list IBD as open / multi-day  
2. Do not flip paywall  
3. Watch RAM/OOM on bitcoind (2026-07-28 history)  
4. No secrets in handoffs  

### Files refreshed this session
`.ai_docs/current-status.md` · `docs/handoff-log.md` · `LATEST-UPDATE.md` · `docs/ops-runbook.md` · `docs/MASTER-BRAIN-INGEST.md` · MVP checklist · ref boot notes

---

## Session — 2026-08-05 (Grok) — 10s EXPLAINER TEASER · /watch · /goodbye

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** 10s Kimi teaser live on `/watch` · free stamps · no paywall flip  
**Note (2026-08-10):** Ops lines below that say “IBD multi-day” are **historical** — IBD finished ~Aug 8.

### Product (SPA — Cam/Grok owns)
- `/watch` = native video of **`satohash-explainer-with-vo.mp4` (~10s)** + VO baked in  
- URL cache-bust: `?v=10s-kimi-20260804` (old ~80s file shared the path; CF edge cached it)  
- Landing/About: “Watch **10s** explainer” (not 60s)  
- Longer educational cut **later** (Cam has full script offline)  
- Git tip ~`af2268a` · CF Pages live satohash.io  

### Ops standing (your plane) — as of 2026-08-05 (stale re IBD)
- Free stamps ON · REQUIRE_LIGHTNING=false  
- ~~bitcoind **syncing** · IBD multi-day~~ → **DONE 2026-08-08** (see top entry)  
- HQ metrics SoT: `https://api.satohash.io/metrics.json`  
- No API/paywall changes this session  

### Kimi next (as of then)
1. ~~Daily IBD check~~ **closed**  
2. Do not flip paywall  
3. No secrets in handoffs  
4. Optional: hard-refresh `/watch` after deploys if media looks stale  

### Session summary file
`docs/archive/SESSION-SUMMARY-2026-08-05-goodbye.md`

---

## Session — 2026-08-04 (Grok) — MOBILE / NAV / i18n CLOSEOUT /goodbye

**From:** Grok M3 · **To:** Kimi / next Grok · **Status:** SPA polish shipped · free stamps · no paywall flip

### Product (SPA — Cam/Grok owns)
- Nav redesign: Stamp · Verify · Templates · Pricing · More; elite language menu (7 langs)
- Mobile shell, scroll-to-top, health banner under fixed header
- Enhanced: government, evidence, about, network, legal, motopass-verify, pitch, footer
- Git `main` tip ~`db1e493` · CF Pages live satohash.io

### Ops standing (your plane)
- Free stamps ON · REQUIRE_LIGHTNING=false
- bitcoind **syncing** source:bitcoind · IBD ~25% (rising) · ETA multi-day
- Monitor IBD + RAM OOM risk · systemd unit datadir `/root/.bitcoin`
- HQ metrics SoT: `https://api.satohash.io/metrics.json`
- Optional later: Socket.IO CORS multi-value if SPA sockets fail

### Kimi next
1. Daily IBD check until `ready_to_verify` / IBD false  
2. Do not flip paywall  
3. No secrets in handoffs  

### Session summary file
`docs/archive/SESSION-SUMMARY-2026-08-04-goodbye.md`

---

## Session — 2026-08-04 (Kimi THOR) — OPS TRUTH SWEEP · BITCOIND RESTORED

**From:** Kimi on THOR · **To:** Grok/M3 · **UTC:** 2026-08-04 ~02:40  
**Project:** Satohash · free stamps ON · paywall OFF · no secrets

### Executive
API green, free stamps ON — **bitcoind RESTORED**. Was **OOM-killed 2026-07-28** and left dead ~6 days (IBD stalled **20.2%**); API correctly fell back to mempool.space. Restarted with proper **systemd** unit; public **`source: bitcoind`** + syncing; IBD ~**85 blocks/min**, ETA **~4 days**.

### Bitcoin / IBD
| Field | Value |
|-------|--------|
| blocks | ~508,624 (rising from 508,207) |
| headers | 960,956 (100%) |
| progress | ~20.23% verificationprogress, **IBD=true** |
| process | **systemd `bitcoind.service`**, enabled, survives reboot |
| RPC host | OK (`bitcoin-cli`) |
| RPC API container | OK → `172.19.0.1:8332` |
| public `source` | **`bitcoind`** (live ~02:33 UTC) |
| readiness | `status=syncing`, `ready_to_verify=false` |
| action | Unit override: package path `/var/lib/bitcoin` was wrong — real datadir **`/root/.bitcoin`**. Enabled + started. No paywall flip, no code/git change. |

### API / paywall / LN
| Field | Value |
|-------|--------|
| version | **5.0.0-ELITE** (image ~2026-07-28; container up ~6d; git **fb1a28a** on THOR) |
| REQUIRE_LIGHTNING | **false** (untouched) |
| stamp smoke | OK pending + `verify_url` (`client_id: kimi-truth-sweep`) |
| LNbits | healthy · 0 sats · `ready_to_enable_paid=true` · `missing_for_paid=[]` |
| CORS | 14 origins (satohash + www + suite + HQ + family hosts) |
| backup | daily 06:00 · last **2026-08-03 06:00** · keep 7 |

### Metrics / HQ
- SoT: **`https://api.satohash.io/metrics.json`** (HQ projects/tools confirmed)
- Health **green**; bitcoin-anchor **amber** (1 pending — expected during IBD)
- **client_id aggregates LIVE**; **`raw.directory` LIVE** — ops item “client_id + directory” **CLOSED**
- Umami: `analytics.giveabit.io` only

### Domains (THOR curls)
satohash.io / www / api health /watch /templates → **200** · no TLS issues

### Gaps closed
IBD was **never finished**. OOM 2026-07-28 → brief restart → clean stop 2026-07-29 04:42 @ block 508,207 → dead until this restore. Public mempool.space was correct “RPC dead” behavior.

### Next
| Owner | Action |
|-------|--------|
| **Kimi** | Monitor IBD (`bitcoin-cli -getinfo`); watch free RAM/OOM; rate ~88h ETA |
| **Grok** | Persist tables (this file + handoff-log + current-status) — **done in same session** |
| **Cam** | Nothing · paywall stays OFF |

### Standing
Free stamps ON · no secrets · HQ metrics API SoT · mempool fallback by design until IBD complete · VO media on disk (no re-push) · ANTHROPIC unset · Nostr 2/3 OK

---

## Session — 2026-08-03 (Grok) — TEMPLATES MENUS + MVP PASS

**From:** Grok · **Status:** SPA redeployed · templates filter fixed · free stamps · MVP checklist

### Done
- `/templates` category chips no longer run off-screen (scroll strip + tablist)
- Menus: Stamp primary on marketing; Templates on mobile bottom nav
- Landing Watch CTA; 404 Stamp/Verify; stamp 100MB guard
- `docs/MVP-CHECKLIST.md` · `npm run mvp:smoke` (health/metrics/stamp OK)
- CF Pages deploy peek: https://0bb26c14.satohash.pages.dev

### Kimi (superseded by 2026-08-04 truth sweep)
- ~~IBD open~~ → **in progress**, `source: bitcoind`, ETA ~4d  
- ~~client_id/directory~~ → **closed (live)**  
- no paywall flip · no secrets  

---

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

## Session — 2026-07-28 (Kimi) — Explain video + bitcoind RPC fix + final housekeeping

**From:** Kimi on THOR · **To:** Next agent

### Done this session
- **Bitcoind RPC fix** — Changed bind from `127.0.0.1` to `0.0.0.0` so Docker API container can reach it via `172.19.0.1`. Health endpoint now shows `status: syncing` during IBD instead of `unhealthy`.
- **IBD syncing logic live** — Pulled Grok's latest code, rebuilt API. `/api/public/bitcoin` now shows `source: bitcoind` with syncing status + progress % during IBD.
- **Explain video VO generated** — 3-section British female voiceover for `/watch` pushed to GitHub as `public/media/video/vo-*.mp3`. Combined 79s track + individual scene sections.
- **Explainer production script** — `docs/EXPLAINER-SCRIPT-PRODUCTION.md` with full timing, scene notes, music/SFX specs.
- **Ref docs updated** — `ref/AGENTS.md` and `ref/GROK-BOOT.md` reflect v5.0.0-ELITE live state.

### Standing state
- API: v5.0.0-ELITE · IBD: 48% (blocks ~461k/960k) · source: bitcoind (syncing)
- REQUIRE_LIGHTNING=false · LNbits wired · Swap 8GB · SQLite backup daily 06:00
- www.satohash.io: 200 (Grok CF fix) · CORS updated with www/hq variants
- /watch explainer live with music by Grok + VO by Kimi

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

# Current Status — Satohash

**Version:** **5.0.0-ELITE** (Build 455 on `2ad78c0` before this goodbye. The hook bumps the build. The API image does not move with a docs commit.)  
**Last Updated:** 2026-11-03 (goodbye). Running API is commit `7c68076`. Paywall off. Practice stamp confirmed in block 974302.  
**Frontend:** https://satohash.io · www · CF Pages project **`satohash`** — Grok lane, `assetsDir: 'b'`. Checked 2026-11-03: homepage shell `/b/index-BlXgiPcI.js`, English chunk `pages.en-DuK6NyGe.js`. That English bundle includes “a new stamp waits about an hour”, Planned, and Coming soon. October shell `/b/index-Bt__WPpD.js` is not the live file. This check did not click through the site.  
**API:** https://api.satohash.io ✅ LIVE. `GET /health?deep=true` at 2026-11-03 16:10 UTC: status **ok**, `gitSha` `7c680769234553ce3e98fdb584a2eb7dfcd7954b` (commit `7c68076`), version `5.0.0-ELITE`, `require_lightning` false, mode `free_open`. Database healthy, about 2.9 MB. Same image as the 2026-11-02 rebuild (uptime about 18 hours). Do not rebuild for this goodbye. Do not `git reset --hard` `/root/satohash`.  
**Metrics SoT:** `https://api.satohash.io/metrics.json`  
**HQ:** https://hq.giveabit.io  
**Git:** `main` (pull before you trust a SHA in this file)  
**Kimi vault:** **THOR VPS Obsidian** (not M4)  
**Analytics:** Umami `analytics.giveabit.io` — **not** Google Analytics  
**Search:** GSC property `https://satohash.io/` **verified**

## Planes

| Plane | Where | Notes |
|-------|--------|--------|
| SPA | CF Pages → satohash.io | **Grok lane.** Kimi cannot alter Pages. Grok has standing auth to push SPA fixes. Must call `https://api.satohash.io` |
| API | THOR Docker + Caddy | `satohash-satohash-api-1` healthy |
| Metrics | API `/metrics.json` | SPA `/metrics.json` is CF Function proxy |
| Bitcoin | THOR bitcoind | Own node **at tip** · height **974,408** at 2026-11-03 16:10 UTC · `source: bitcoind` · IBD **done**. Practice stamp is block **974,302** and does not move with the tip. Umbrel is the home node and is not the checker until it matches this tip. LND stays off. |
| Explainer | `/watch` | **~70s** `satohash-explainer-wise-70.mp4` · quiet bed · 10s teaser stays · `?v=kimi-wise-70-20261013` |
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
| `/` | Landing · live node chip · hero gold = **Stamp only**; Watch is text |
| `/proof-pack` | Free waitlist (not for sale; no email; localStorage + @give_bit) |
| `/stamp` | Free stamp · STEP 1–3 · **eager** (no lazy hang) |
| `/stamp/done` | Success · share `/p/<hash>` · **eager** |
| `/verify` | Public verify · **eager** |
| `/p/<hash>` | Zero-JS Function proof card (iMessage JPEG `01-stamp-hero.jpg`) |
| `/network` | Live calendars, bitcoind tip, recent stamps, family tiles, Notes on Nostr |
| `/status` · `/counsel` | Public status · counsel one-pager |
| `/watch` | ~70s `satohash-explainer-wise-70.mp4` · quiet bed · 10s teaser · `?v=kimi-wise-70-20261013` |
| Language | **7 locales** en es fr de pt sw zh — product loop + public marketing + template catalog largely done. SoT `docs/I18N.md`. Offers deferred. Do not add Arabic. |

## Metrics (verified live 2026-08-17)

| Key | Value |
|-----|--------|
| `raw.requireLightning` | **false** |
| `raw.last10` | **10** rows |
| `raw.familyClients` | **17** rows (list; zeros for unused family ids) |
| Family with counts | live `raw.familyClients` — **read metrics.json**; do not invent. 2026-09-15: katoa/motopass/sherpacarta/tadbuy=**2**, giveabit=**3** (widget at giveabit.io/**tools**) |

## This session (2026-09-14 — manuals, pitch, exec, handoff)

- [x] Pitch + exec match **live** loop: stamp → `.ots` → `/p/{hash}` camera QR; Pending ≠ Confirmed (~60 min); family widget POST `/api/stamp`; CLI
- [x] Cut cathedral as current features (ZK redaction, Snapper judiciary-ready, 3D Merkle, BOLT-12)
- [x] QUICKSTART + `public/docs/quickstart.md`; FAMILY-API proof-card QR; MVP remaining = QR/proof states, not VPS
- [x] PITCH-DECK honesty slides: camera QR, Pending vs Confirmed, family widget POST — no fake traction
- [x] Light-touch: LAWYER-ONEPAGER, INVESTOR-ONEPAGER, README `/p/{hash}` QR
- [x] I18N / roadmap one-liners; `docs:sync`
- [x] Pending→Confirmed: browser notify + toast (last proof watch)
- [x] Kimi 2026-09-15: live family widget stamps (katoa/motopass/sherpa/tadbuy=2, giveabit=3). Widget on giveabit.io/**tools**. HQ was not zeros.
- [x] Kimi: family live stamps verified 2026-09-15 (API not rebuilt)
- [ ] Offers stay deferred
- [ ] Snapper stays scaffold — do not sell as judiciary-ready
- [ ] Cam still: pin `/watch` on **`@give_bit`**; iPhone `/p/` unfurl
- [ ] API: **do not rebuild** for copy (live `21476f8` is the authorship/by-hash rebuild)

## Next for the next LLM (do in this order)

Pickup: this file → `docs/roadmap.md` → `docs/handoff-log.md` → `docs/KIMI-HANDOFF.md` → `SESSION-SUMMARY-2026-11-03.md`. `/whatsup` loads that goodbye.

1. **Done.** Honest path, chapters, quiet install, Planned compare rows, phone steps, one hour sentence, payment check in the image, container backup, practice stamp in block **974302**. Do not redo.
2. A new public example only if Cam picks a file. The practice file stays private. The public example stays block **969,627**.
3. **Cam and Lenny:** company name and governing law. Then Cam says the word. No charge before that. Do not flip the paywall.
4. **Kimi:** ingest the 2026-11-03 goodbye into THOR Obsidian. Do not rebuild. Do not `git reset --hard` `/root/satohash`. Do not point Bitcoin RPC at Umbrel. Do not start LND. Backup with `docker exec` inside the API container.
5. **Cam:** pin `/watch` on **`@give_bit`** when Cam wants (`docs/marketing/GIVE-BIT-X-PACK.md`). Grok cannot post. iPhone `/p/` unfurl stays deferred.
6. **Do not:** flip the paywall; change `/api/*`; add Arabic; sell Snapper, ZK redaction, 3D Merkle, or BOLT-12 as live; Tailscale notes to M4. Vault = **THOR**. Pages = Grok. Optional who is shipped and is not a legal name.
7. **TadBuy (other repo):** dead same-origin `/api/*` on that static demo. Not a Satohash API bug.
8. **Optional:** npm-publish `packages/satohash-cli` only if Cam asks.

## This session (2026-11-03 — goodbye)

- [x] API image `7c68076` still running. Paywall off. Tip **974,408** at 16:10 UTC. Practice stamp stays block **974302**.
- [x] Live shell `/b/index-BlXgiPcI.js` has the hour sentence. English chunk has Planned and Coming soon.
- [x] Living status, roadmap, ops, and handoffs updated. Old dated notes left as history.
- [ ] Company name and law still wait on Cam and Lenny. Do not charge.
- [ ] Do not rebuild for this docs commit. Do not reset the dirty Thor checkout.

## This session (2026-10-13 — film, honest copy, roadmap)

- [x] ~70s explainer is the player (Kokoro Isabella, quiet bed). Old 83.5s file left in place.
- [x] File-stays copy: security, trust, glossary, about, comparison, executive summary. 7 languages.
- [x] Glossary Lightning and BOLT-12 say stamps are free and Lightning billing is off.
- [x] Dashboard Lightning row removed. Status rows and the side column follow the language.
- [x] Sign-in share text and trust chip say the key stays on the device. Live `4134150`.
- [x] Upgrade order written in `docs/roadmap.md` and `ROADMAP.md`.
- [ ] Next code: history labels, then the drop zone, then the sign-in headline.

## This session (2026-09-20–21 — honesty + quieter UX)

- [x] HowProofWorks on `/verify`, `/p/<hash>`, `/stamp/done`, zero-JS Function; 7 locales
- [x] Optional who (NIP-07) on proof card / stamp-done / verify — browser-checked only
- [x] Batch / v5 / shield verify via POST `/api/verify` (not registry)
- [x] Live pending→confirmed poll; hero block number; HowProofWorks starts closed
- [x] Quieter stamp (Also prove who / email behind tap; Waiting-on-Bitcoin chip)
- [x] Proof card: Verify + Copy; rest More. No-JS card same
- [x] `/verify`: no fake Merkle; facts only; compact gold Verify; ELI-5 hides after verdict; honest PDF
- [x] Landing: Stamp gold; Watch text; play disc is the only gold on the player
- [x] Stamp-done: one gold View proof; QR off; verify-yourself in More
- [x] Kimi API rebuild **confirmed** live `gitSha` **`21476f8`**
- [x] MotoPass: `useProgramsContext` no longer throws (motopass `4198afc`)

## This session (2026-09-14 — docs truth + tool-belt + About/Pitch/Network)

- [x] Docs truth pass + tool-belt (CLI shim, tadbuy widget, developer terminal path)
- [x] Slice **B** i18n: About, Pitch, Network (plus donate + proof-pack already done)
- [x] Stamp widget copy: family clients are Katoa, MotoPass, SherpaCarta, Give A Bit, TadBuy — not OpenStrata
- [x] Explorer / Atlas labeled as **demos**, public, 7 locales; Identity honesty (when, not who)
- [x] `/developer` 7 locales (honest CLI path; paid API staged)
- [x] `/docs/executive-summary` 7 locales
- [x] de/pt/sw/en translations catalog **250** keys
- [x] Snapper left-rail label: Web Capture (scaffold)
- [x] `/verify/batch`, `/distressed-asset`, Trust leftovers, `/nodes` calendar ping (public)
- [x] Notary templates: honest drafts; Stamp this draft → `/stamp`; PDF not a notary act
- [x] Slice C chrome: Settings, Image vault, Protocol stats, Mobile signer (demo), Certificates, Admin, Contract list, v5 playground labels
- [ ] Offers stay deferred
- [ ] Snapper stays scaffold — do not sell as judiciary-ready
- [x] Camera QR on template/contract PDF + email → satohash.io/p/{hash}
- [x] Contract editor/view, onboarding leftovers, forum chrome
- [x] Template catalog titles/descriptions/field labels in 7 locales (demo names stay English)
- [x] Offers chrome i18n (still deferred / staged Lightning)
- [x] Lifecycle bar, proof explorer, ZK redaction demo chrome
- [ ] Snapper stays scaffold; Cam X pin / iPhone unfurl later
- [ ] Do **not** add Arabic until A+B+C are done
- [ ] Cam still: pin `/watch` on **`@give_bit`**; iPhone `/p/` unfurl
- [ ] API: **do not rebuild** for copy

## This session (2026-09-13 — finish all languages)

- [x] Slice **A** product loop in 7 locales (`89262b1`): stamp leftovers, verify, stamp-done, `/p/<hash>` SPA + zero-JS, counsel, status, watch, nav/footer
- [x] Slice **B** started: `/donate` `3d7fea5`, `/proof-pack` `1a85102`
- [x] Docs/roadmap/handoffs updated: `docs/I18N.md`, `docs/roadmap.md`, `ROADMAP.md`, this file, `docs/handoff-log.md`
- [x] `/about` then `/pitch` then `/network` (done 2026-09-14)

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
- [x] THOR API includes authored.js · live **`21476f8`** (by-hash can include `authored`)  
- [x] CSP **enforcing**  
- [x] Stamp rate limit 5/min public · reuse existing hash  
- [x] Longer educational MP4 (~84s Kimi cut) **shipped**  

## Local ports (M3 / Cam)

Satohash Vite may use **3002**. **Do not** `npm run dev` (API defaults to **3001**) while Accountable needs 3001 in another session. Live SPA always talks to `api.satohash.io`. HyperFrames Studio also defaults to 3002.

## Agent entry

**AGENTS.md** · this file · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `docs/ops-runbook.md` · `docs/CLOUDFLARE-PAGES.md` · `docs/MASTER-BRAIN-INGEST.md` · `docs/EXPLAINER-MUSIC-AND-VO.md`

# Handoff log (newest first)

Append a new `## Session — YYYY-MM-DD` at the **top** after each session.

---

## Session — 2026-08-05 (Grok) — 10s KIMI TEASER · /watch · CACHE FIX · /goodbye

**From:** Grok (M3) · **Status:** 10s explainer live on `/watch` · CF Pages · main pushed  
**Git tip:** `af2268a` (+ closeout) · branch `main` ≈ origin

### Finished
- Educational 30s script + scene image prompts (Cam kept offline for longer cut later)
- Reviewed new MP4: ~10s H.264 1280×720 + baked VO (product-true)
- Path **A**: teaser only; longer video later
- `/watch` → native `<video>` of `satohash-explainer-with-vo.mp4` (not slideshow+`vo-complete.mp3`)
- Landing/About CTA: “Watch **10s** explainer”
- Live fix: edge still served old ~80s file under same path → cache-bust `?v=10s-kimi-20260804` + `/media/video/*` TTL + Wrangler redeploy
- Media docs teaser-first

### Still open
- Longer ~30s+ cut when Cam ready · IBD complete (Kimi) · paywall off · optional store apps
- Untracked local `satohash-explainer-with-vo2.mp4` (old long mix backup)

### Do not
- Flip REQUIRE_LIGHTNING · commit secrets · change live `/api/*` paths without Cam  
- Claim “60s explainer” until longer MP4 ships

### Recovery
`docs/archive/SESSION-SUMMARY-2026-08-05-goodbye.md` · `/whatsup`

---

## Session — 2026-08-04 (Grok) — MOBILE MVP · NAV · i18n · PAGES · /goodbye

**From:** Grok (M3) · **Status:** SPA redeployed repeatedly · free stamps · main pushed  
**Git tip:** `db1e493` (nav redesign) · branch `main` ≈ origin

### Finished
- Templates chips overflow fixed; docs chips **centered**
- MarketingShell for public pages; `/watch` not double-chromed
- ScrollToTop; stamp public + gold CTA; health banner under nav
- Language: 7 locales, elite dropdown (not flag strip clutter); locale preload
- Marketing nav: Stamp · Verify · Templates · Pricing · More + mobile drawer
- Pages: government, evidence, about, network, legal, motopass-verify, pitch, footer
- Kimi bitcoind truth persisted earlier same day (IBD ~25%, source bitcoind)

### Still open
- IBD complete (Kimi) · paywall off · optional store apps later · API socket CORS if needed

### Do not
- Flip REQUIRE_LIGHTNING · commit secrets · change live `/api/*` paths without Cam

### Recovery
`docs/archive/SESSION-SUMMARY-2026-08-04-goodbye.md` · `/whatsup`

---

## Session — 2026-08-04 (Kimi) — OPS TRUTH · bitcoind restored

**From:** Kimi THOR · **Status:** Free stamps green · **source: bitcoind** syncing · paywall OFF

### Facts (authoritative)
- Bitcoind was **OOM-killed 2026-07-28**, dead ~6 days; IBD stuck **~20.2%** @ block 508,207  
- **Restored:** systemd unit (datadir **`/root/.bitcoin`**, not package `/var/lib/bitcoin`); enabled on boot  
- Public `GET /api/public/bitcoin` → **`source: bitcoind`**, IBD true, ~85 blk/min, **ETA ~4 days**  
- API `5.0.0-ELITE` · `REQUIRE_LIGHTNING=false` · LNbits ready · stamp smoke OK  
- Metrics: **client_id + raw.directory LIVE** — close open ops item  
- HQ SoT still `https://api.satohash.io/metrics.json`  
- Domains satohash.io / www / watch / templates **200**

### Grok follow-up
- Tables written to `docs/KIMI-HANDOFF.md`, this log, `.ai_docs/current-status.md`, `LATEST-UPDATE.md`, MVP checklist  

### Cam
- Nothing · do not flip paywall  

---

## Session — 2026-08-03 (Grok) — MVP menus + templates bar + checklist

**From:** Grok (M3) · **Status:** SPA deployed (CF Pages) · free stamps · templates filter fixed

### Done
- **`/templates` category chips:** two-row sticky bar; horizontal scroll + edge fades; no page overflow; `role=tablist`; hide empty cats; manifest error + retry
- **Menus:** marketing primary = Stamp/Templates/Pricing/Trust; mobile bottom = Vault/Stamp/Verify/**Templates** (Explorer in More); footer Stamp/Verify/Watch
- **Landing hero:** Watch 60s CTA; 48px targets
- **404:** Stamp / Verify / Home / Templates escapes
- **Stamp:** 100MB soft size guard with clear error
- **FAQ:** scrollable/wrapping category chips
- **Tests:** `templates-manifest.test.js`, e2e `templates-filters.spec.js`, `npm run mvp:smoke`
- **Docs:** `docs/MVP-CHECKLIST.md` (100 items status)
- **Live smoke:** health + metrics green; free stamp OK (`client_id` returned)
- **Deploy:** wrangler Pages `satohash` → https://0bb26c14.satohash.pages.dev (apex satohash.io)

### Still open (Kimi/ops)
- bitcoind IBD → `source: bitcoind`
- Confirm metrics directory fields if needed
- Paywall only when Cam flips
- Full Playwright e2e stamp path on CI optional

### Git
- Local dirty tree with SPA/menu/MVP fixes; commit when Cam wants

---

## Session — 2026-07-29 (Grok) — EXPLAINER + DOCS CLOSEOUT

**From:** Grok (M3) · **Status:** Product + media green · free stamps · bow

### Done
- **SPA reliability:** bundles under `/b/*`; no forced immutable JS Content-Type; eager Landing + `/watch` + executive-summary (no lazy chunk desync)
- **Landing:** free OTS one-liner + Free / 21 sats / Pro sketch (`#free-and-fees`); ELI-16 fee story
- **Executive summary:** charts (pie/bar/area), formal 4-paragraph brief, mobile-first
- **Nav:** stronger desktop chrome; full-screen mobile drawer; 48px targets; Stamp chip
- **Docs structure:** single `AGENTS.md`; `docs/deploy.md`, `architecture.md`, `ops-runbook.md`; marketing/ + archive/; deleted protocol/deploy annex stubs
- **Server:** `server/index.js` thin bootstrap; domain routes in `server/routes/*`; `server/lib/*` helpers
- **Components:** `layout/ stamps/ ui/ shared/ dashboard/ forms/ marketing/`
- **Explainer media:** graphics renamed; `satohash-explainer-music.mp3`; VO from Kimi `vo-complete.mp3` (~80s); `/watch` clock follows VO; `satohash-explainer-with-vo.mp4`

### Paths / URLs (canonical)
| Resource | Path |
|----------|------|
| Explainer player | `/watch` · `/explainer` |
| Media root | `public/media/video/` |
| VO | `public/media/video/vo-complete.mp3` |
| Music | `public/media/video/satohash-explainer-music.mp3` |
| Script board | `public/media/video/SCRIPT.md` |
| Music/VO ops | `docs/EXPLAINER-MUSIC-AND-VO.md` |
| Agent entry | `AGENTS.md` |
| Deploy | `docs/deploy.md` |
| Architecture | `docs/architecture.md` |
| Status | `.ai_docs/current-status.md` |

### Decisions
- Free stamps stay on; Lightning fee later is **to us**, proofs still Bitcoin+OTS  
- Prefer **one** CF deploy path (GH Actions); wrangler OK for emergency  
- Apex edge poison → purge **satohash.io** zone (not giveabit)  
- VO ~80s preferred over re-record 55s (CTA stretch)  

### Kimi / THOR
- [ ] IBD → bitcoind health when ready  
- [ ] Confirm live metrics `client_id` / directory  
- [ ] Optional homepage CTA → `/watch`  
- [ ] Wallets/paywall only when Cam flips  

### Git
- Recent: `fb08e33` `08cb3d9` `91faf2e` `958024a` `f81ca04` `d220c83` `387df28` …  
- Branch: `main`  

---

## Session — 2026-07-28 (Grok)

**Done:**
- Diagnosed satohash.io apex edge poison; `/b/*` path; free model landing; docs start  

**Still open (now closed or moved up):** see 2026-07-29 entry  

---

## Legacy

- `docs/KIMI-HANDOFF.md` — detailed historical sessions  
- `docs/archive/` — mega-handoffs, power prompts, legacy-root  

Do not delete legacy handoffs without Cam approval.

## Session — 2026-07-26 (Grok M3 — stamp deep-link + verify lifecycle)

**Done (SPA):**
- Home `/?hash=&ref=…` → client redirect to `/stamp?…` (`Landing.jsx` + `buildStampPathFromSearch`)
- `/stamp?hash=&ref=` deep-link card: product chip, label, one **Stamp on Bitcoin** CTA
- `POST /api/stamp` with `X-Satohash-Client` from `ref`/`source`; human 402/429 errors; browser OTS fallback
- Status poll after stamp until confirmed; verify CTA + share link
- `VerifyPublic`: UUID + by-hash API lookup; poll pending → confirmed
- Util: `src/utils/stampDeepLink.js` (+ tests); Integrations docs show canonical deep-link
- `/stamp` chrome-free marketing path (exact only — not `/stamp/*` wizards)
- Client helper `stampGuideUrl(hash, { ref, label, … })` updated

**Still open (Kimi / Sherpa):**
- THOR: API/OTS reliability, dual-host CF parity smoke, metrics attribution by client
- Sherpa: point `sc-core` / Canada stamp buttons at `/stamp?hash=&ref=` (home still works via redirect)
- Umami public proxy secondary

**Acceptance smoke after deploy:**
```
https://satohash.io/stamp?hash=9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b&ref=sherpacarta
https://satohash.io/?hash=9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b&ref=sherpacarta
```

**Git State:** SHA `69b9daf` pushed · GHA Deploy #136 ✅ success · CF Pages live  
**Smoke:** `POST /api/stamp` → id `6004b6a6-…` pending; health 200; metrics green

**Spec:** `docs/KIMI-REQUEST-SATOHASH.md`

---

## Session — 2026-07-27 (URGENT from Sherpa — stamp handoff broken)

**From:** Grok on M3 via SherpaCarta session (Cam feedback)  
**Cam:** Satohash “not fully working”; needs further upgrade. Stamp handoff from family products incomplete.

**Full spec (canonical):**  
`docs/KIMI-REQUEST-SATOHASH.md` (this repo) · also `~/projects/sherpacarta/docs/KIMI-REQUEST-SATOHASH.md`

### Must fix (product)

1. **`/stamp?hash=&ref=`** — primary entry: prefill hash, product chip, one CTA “Stamp on Bitcoin” ✅ SPA
2. **`/?hash=&ref=` → redirect to `/stamp`** — Sherpa `sc-core` opens home today ✅ SPA
3. **Verify lifecycle** — pending → confirmed; `/verify/:id` cold-load; proof download ✅ SPA poll
4. **Host parity** — `satohash.io` and `satohash.giveabit.io` same routes (SPA fallback) — CF/Kimi
5. **API reliability** — `POST /api/stamp` + status poll; `X-Satohash-Client`; human paywall errors — SPA client + Kimi API
6. **Family refs** — `sherpacarta`, `sherpacarta-canada`, motopass, etc. for metrics/attribution ✅ SPA header

### Acceptance (smoke)

```
https://satohash.io/stamp?hash=9da88734e32d3d2f931c187016d18cfbb0f7404ca90479ed4d6718c49289ee1b&ref=sherpacarta
```
→ hash prefilled, stamp works, verify URL shareable. Same on `satohash.giveabit.io`.

### Split

| Who | What |
|-----|------|
| Grok M3 `satohash` | SPA deep-link + verify UX ✅ implemented (deploy pending) |
| Kimi THOR | API/OTS/Docker, dual-host CF, metrics by client |
| Grok Sherpa later | Point stamp buttons at `/stamp?hash=&ref=` |

**Do not** redo metrics.json plane. Umami public proxy remains secondary.

---

#### 2026-07-26 — M4 back in game

**Machine update:** M4 rebuilt as travel coding machine (M3 duplicate). Sync via git only — no rsync. See MASTER-BRAIN/01-Architecture/MACHINE-ECOSYSTEM.md

## 2026-07-26 — OTS Deep Learn: DGI tutorial ingested + automation enhancements

**What was learned:**
- DGI.io OTS step-by-step tutorial fully ingested → `docs/OTS-DEEP-LEARN.md`
- The 6-step protocol: hash, submit, load, info, upgrade, verify
- 10 enhanced automation ideas proposed: batch stamping, git hooks, CI/CD, health monitor, IPFS backup mesh, watchtower re-verification, webhooks, calendar rotation, merkle tree explorer, QR export
- Existing `docs/OTS_SETUP.md` preserved and cross-referenced
- GROK-SESSION-PROTOCOL.md updated to mandate reading OTS-DEEP-LEARN.md first

**For Grok next session:**
- ⚡ **Git pull first:** `cd ~/Projects/satohash && git pull` (sync latest from GitHub — M3 or M4 may have pushed)
- Read `docs/OTS-DEEP-LEARN.md` before any OTS/satohash coding
- The verification checklist at the bottom is your entry gate
- Enhanced automation ideas (sections A–J) are blueprints for satohash v5+
- ⚡ **Git save before leaving:** `git add -A && git commit -m "save" && git push`

---

### 2026-07-24 — SuperSession: HQ v4, auto-deploy, template v2, ambient

**What was built:**
- Webhook platform on :8644 (push/PR/issue alerts → Telegram)
- All 8 repos now auto-deploy via CF Pages
- HQ v3.19+: Intel, Feed, Charts, Chat, Vault tabs with live data
- Auto-diagnose: site/cron failure detection → Telegram alerts
- Live HQ: auto-refresh every 60s, ambient dashboard mode
- Project template v2: self-evolving, 24 files created across 9 repos
- MASTER-BRAIN: journal, patterns, template docs, audit
- Umami CORS fixed, Composio removed, backup verified

**For Kimi next session:**
- Read PROJECT-TEMPLATE.md + CROSS-PROJECT-PATTERNS.md
- Check MASTER-BRAIN/02-Agents/PROJECT-CONTEXT-MAP.md
- Run ref-summary.py

---

---

## Latest Session Summary (from 2026-07-21 goodbye)

**Chat Topic:** GROK-BOOT Step 1 — Umami script for Satohash (metrics already live).

**Finished in this session:**
- Pulled `ref/GROK-BOOT.md`; skipped Step 2 (`api.satohash.io/metrics.json` already live)
- Added Umami to `index.html` head: website ID `720524e7-b747-4f95-8ce6-1a20fd4a599f`, host `//169.58.32.160:3002/script.js`
- Pushed `6b99ecb` (Build 122) — CF Pages deploy on main

**Still to do:**
- Kimi: public reverse proxy/tunnel for Umami (currently `127.0.0.1:3002` only) so browsers can post events
- After proxy: optional swap script src to `analytics.giveabit.io` (or chosen domain)
- Other products: Umami tags per HQ `docs/UMAMI-DEPLOYMENT.md` (Satohash was "already live metrics, just Umami")

**Update / Status:** SPA has Umami tag. Metrics plane unchanged. Collection blocked until Umami is internet-reachable with HTTPS-friendly URL. No secrets in handoff.

**Next for Kimi:** Integrate into MASTER-BRAIN/Kanban. Prefer Caddy for `analytics.giveabit.io` → Umami:3000 (or keep host:3002 via proxy). Do **not** redo satohash metrics.json. Optional MagicDNS note remains non-blocking.

**Git:** SHA `6b99ecb` · main synced · Unpushed: none (after this goodbye push)

**Archive:** `docs/archive/SESSION-SUMMARY-2026-07-21-goodbye.md`

---

## Session — 2026-07-21

**Done:**
- Umami tracking script in Satohash SPA (`index.html`)
- GROK-BOOT Step 1 complete; Step 2 N/A (API metrics live)

**Decisions:**
- Host = THOR public IP until reverse proxy exists
- Do not add static public/metrics.json; API origin is canonical

**Git State:**
- SHA: `6b99ecb253f7bbbae1893e2ea71e86fa7d68da6f`
- Unpushed: none (after goodbye docs push)

---


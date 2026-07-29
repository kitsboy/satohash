# Handoff log (newest first)

Append a new `## Session — YYYY-MM-DD` at the **top** after each session.

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

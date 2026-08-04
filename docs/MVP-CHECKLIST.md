# Satohash MVP checklist (100)

**Definition:** A stranger opens satohash.io, stamps a file, downloads `.ots`, verifies it — no account wall, no broken chrome, no edge poison.

**Last agent pass:** 2026-08-04 (Kimi ops truth + Grok persist) — bitcoind restored `source: bitcoind` IBD; client_id/directory closed.

Legend: ✅ done in product/code · 🟡 partial / ops · ⬜ deferred / Cam flip

## P0 — Core loop (1–15)

| # | Item | Status |
|---|------|--------|
| 1 | Live stamp → API → `.ots` | ✅ API green; smoke on deploys |
| 2 | Verify same proof | ✅ `/verify` |
| 3 | Batch stamp path | ✅ routes live |
| 4 | Free path (`REQUIRE_LIGHTNING=false`) | ✅ standing order |
| 5 | SPA → `api.satohash.io` only | ✅ non-negotiable |
| 6 | `/health` + readiness | ✅ |
| 7 | `/metrics.json` HQ SoT | ✅ |
| 8 | Stamp error copy | ✅ toasts + errors |
| 9 | Local vault fallback | ✅ |
| 10 | Browser OTS if API blips | ✅ |
| 11 | Hash worker large files | ✅ worker + size guard |
| 12 | Huge upload UX | ✅ 100MB soft block |
| 13 | CORS suite hosts | ✅ wired on THOR |
| 14 | Apex `/b/*` purge if poison | 🟡 ops playbook |
| 15 | Regression smoke stamp+verify+metrics | 🟡 scripts; extend e2e |

## P0 — Trust chrome (16–25)

| # | Item | Status |
|---|------|--------|
| 16 | `/templates` chips overflow | ✅ two-row scroll strip |
| 17 | Wrap/scroll/dropdown filters | ✅ horizontal scroll + fades |
| 18 | Chip density / hide empty | ✅ hide zero-count cats |
| 19 | Sticky filter not covering content | ✅ |
| 20 | Keyboard category tabs | ✅ `role=tablist` |
| 21 | Mobile templates no H-scroll page | ✅ + e2e assert |
| 22 | Card CTAs touch targets | ✅ 44px+ |
| 23 | Manifest load error | ✅ retry + stamp escape |
| 24 | Loading skeleton | ✅ |
| 25 | Desktop nav overflow | ✅ 3-zone layout; Stamp primary on marketing |

## P1 — First-run (26–40)

| # | Item | Status |
|---|------|--------|
| 26 | Hero CTA → Stamp | ✅ |
| 27 | Homepage → `/watch` | ✅ hero + free-model section |
| 28 | How it works 3 steps | ✅ landing sections |
| 29 | Drag / picker / hash paste | ✅ stamp page |
| 30 | Progress hashing→anchoring | ✅ |
| 31 | Post-stamp download + verify | ✅ |
| 32 | Verify file/hash/ots | ✅ |
| 33 | Pending vs Bitcoin confirmed | ✅ timelines/toasts |
| 34 | Pricing honesty free/21/Pro | ✅ |
| 35 | Hide deferred MVP routes | ✅ MVP_MODE |
| 36 | DeepHealth only when broken | ✅ |
| 37 | 404 escape hatches | ✅ Stamp/Verify/Home/Templates |
| 38 | Deep links stamp/verify | ✅ |
| 39 | Family client headers | ✅ docs + deep link |
| 40 | OTS ELI tooltip | 🟡 glossary/verify copy |

## P1 — Templates (41–55)

| # | Item | Status |
|---|------|--------|
| 41 | Manifest-first paint | ✅ |
| 42 | Category counts accurate | ✅ |
| 43 | Search by name/tag | ✅ |
| 44 | Recent views | ✅ localStorage |
| 45 | Preview fields | ✅ modal samples |
| 46 | Demo editor path | ✅ |
| 47 | Template → stamp fields | 🟡 demo editor |
| 48 | Export proof package | 🟡 verify/export |
| 49 | Government sections no crash | ✅ |
| 50 | Content quality pass | 🟡 ongoing |
| 51 | Cull low-value templates | ⬜ optional |
| 52 | i18n titles | 🟡 EN primary |
| 53 | Shareable template URL | ✅ copy + toast |
| 54 | Print/PDF path | 🟡 editor |
| 55 | SEO per category | 🟡 page meta |

## P1 — Verify credibility (56–65)

| # | Item | Status |
|---|------|--------|
| 56 | Structural `.ots` verify | ✅ |
| 57 | Calendar/Bitcoin status UI | ✅ |
| 58 | Proof DNA embed | ✅ `/widgets` |
| 59 | W3C VC export | ✅ |
| 60 | Shareable verify URL | ✅ |
| 61 | Failed-verify reasons | ✅ |
| 62 | Chain-of-custody / batch-hash | ✅ smoke routes |
| 63 | Motopass deep-link | ✅ |
| 64 | No fake proof counts | ✅ |
| 65 | security.txt + legal links | ✅ |

## P2 — Ops (66–78)

| # | Item | Status |
|---|------|--------|
| 66 | THOR one-command deploy | ✅ runbook |
| 67 | SQLite backup cron | ✅ Kimi |
| 68 | Bitcoind IBD → source bitcoind | ✅ **source: bitcoind** live; IBD ~20% syncing ETA ~4d (not finished verify) |
| 69 | Metrics client_id/directory | ✅ live (`client_id` + `raw.directory`) |
| 70 | LNbits ready, paywall off | ✅ |
| 71 | No secrets in git | ✅ |
| 72 | Friendly free-tier rate limits | ✅ 429 UX |
| 73 | Structured API errors | ✅ |
| 74 | Logging without PII | 🟡 policy |
| 75 | Deploy checklist | ✅ deploy.md |
| 76 | SPA rollback note | ✅ ROLLBACK |
| 77 | Umami stamp/verify events | 🟡 verify events |
| 78 | HQ glass green | ✅ metrics SoT |

## P2 — UI system (79–88)

| # | Item | Status |
|---|------|--------|
| 79 | Institutional Noir Stamp/Verify/Templates | ✅ |
| 80 | Touch ≥48px primaries | ✅ improved |
| 81 | Focus rings filters | ✅ |
| 82 | Token consistency | ✅ |
| 83 | Shared empty/error | 🟡 page-level |
| 84 | Toast success/fail | ✅ sonner |
| 85 | prefers-reduced-motion | 🟡 partial |
| 86 | No CLS filter bar | ✅ skeleton |
| 87 | Footer product links | ✅ stamp/verify/watch |
| 88 | Document titles | ✅ usePageMeta |

## P2 — Content (89–94)

| # | Item | Status |
|---|------|--------|
| 89 | Free/fees truth | ✅ |
| 90 | `/watch` ends → Stamp | ✅ |
| 91 | Exec summary → product | ✅ |
| 92 | Pricing no false charge | ✅ |
| 93 | Support path | ✅ Kimi contact / footer |
| 94 | Persona paths without sprawl | 🟡 |

## P3 — Ship gate (95–100)

| # | Item | Status |
|---|------|--------|
| 95 | E2E landing→stamp | 🟡 smoke partial |
| 96 | E2E templates no overflow | ✅ `templates-filters.spec.js` |
| 97 | Manifest/category unit | 🟡 manifest static |
| 98 | CI green before promote | ✅ |
| 99 | This checklist | ✅ |
| 100 | Freeze scope until green | ✅ policy |

## Agent run order (next session)

1. Kimi: monitor IBD + RAM until IBD complete / `ready_to_verify` (~4d)  
2. Browser-check `/templates` after any new SPA deploy  
3. Optional: full Playwright stamp e2e against API  
4. Commit M3 SPA/menu tree when Cam wants  
5. **Do not** flip `REQUIRE_LIGHTNING` without Cam  

---
© 2026 Satohash · Give A Bit

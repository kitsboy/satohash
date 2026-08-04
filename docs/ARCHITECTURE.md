<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 5.0.0-ELITE (Build 196) · **Updated:** 2026-08-04
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Architecture & repo map

**Version SoT:** `package.json` → `5.0.0-ELITE`.  
**Product:** Bitcoin-anchored proof-of-existence via OpenTimestamps. SPA + Express API.

---

## Planes

```
Browser SPA (CF Pages)
    │  VITE_API_URL
    ▼
api.satohash.io (Express on THOR)
    │
    ├─► OTS calendars (public) ──batch──► Bitcoin
    ├─► SQLite / local data (server)
    └─► optional LNbits when REQUIRE_LIGHTNING=true
```

| Concern | Location |
|---------|----------|
| Landing / stamp / verify UI | `src/pages/`, `src/components/{layout,stamps,ui,…}/` |
| Explainer | `/watch` · `src/pages/ExplainerWatch.jsx` · `public/media/video/` |
| Exec summary | `/docs/executive-summary` · `src/pages/ExecutiveSummary.jsx` |
| API | `server/index.js` (thin) + `server/routes/*` + `server/lib/*` |
| Pages Functions | `functions/` (`/metrics.json` proxy) |
| Family contract | `docs/FAMILY-API.md` |
| OTS deep dive | `docs/OTS-DEEP-LEARN.md` |
| Agent / deploy | `AGENTS.md` · `docs/deploy.md` · `docs/handoff-log.md` |

---

## Repo map (current)

```
/
  AGENTS.md                 # sole agent entry
  README.md
  package.json              # version SoT
  vite.config.js            # assetsDir: 'b'
  public/
    _redirects              # SPA fallback — do not break
    _headers
    docs/                   # synced subset for SPA DocViewer
  src/
    pages/                  # route screens (feature folders: contracts/, government/, …)
    components/
      layout/ shared/ ui/ stamps/ dashboard/ forms/ marketing/
    utils/, hooks/, config/, i18n/
  server/
    index.js                # thin bootstrap (~466 lines) + middleware + mounts
    routes/                 # domain registers: auth, ai, stamps, mesh, forum, …
    lib/                    # ai-helpers, ots-helpers
    db.js, migrations/      # do not casually rewrite
  functions/                # CF Pages Functions
  docs/
    architecture.md         # this file
    deploy.md               # canonical deploy
    ops-runbook.md
    handoff-log.md
    marketing/              # investor / SEO (not ops)
    archive/                # old handoffs, migration log
  .ai_docs/                 # status snapshots for agents
  .github/workflows/        # Deploy + CI
```

---

## Critical paths (do not casually change)

| Path | Why |
|------|-----|
| `POST /api/stamp` | Core product + family |
| `GET /api/history`, `GET /api/stamps/:id` | Verify / vault |
| `POST /api/verify`, `POST /api/upgrade` | OTS lifecycle |
| `GET /metrics.json` | HQ |
| `GET /health` | Ops |
| SPA `/stamp?hash=&ref=` | Family deep-link |
| SPA `/watch` | Explainer (eager-loaded; VO-driven) |
| `public/media/video/*` | Explainer frames, music, VO, MP4 |

---

## Free vs paid (product)

| Mode | Flag | User pays |
|------|------|-----------|
| Free (now) | `REQUIRE_LIGHTNING=false` | Nothing; OTS calendars batch to Bitcoin |
| Paid (later) | `REQUIRE_LIGHTNING=true` | Lightning to us; **same** OTS/Bitcoin proofs |

---

## Related

- Deploy: `docs/deploy.md`
- Ops: `docs/ops-runbook.md`
- Migration of doc sprawl: `docs/archive/MIGRATION-LOG.md`
- Legacy layout notes: `docs/REPO-LAYOUT.md` (superseded by this file for orientation)

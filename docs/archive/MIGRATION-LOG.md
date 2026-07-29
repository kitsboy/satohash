# Migration log — docs & structure cleanup

Track moves/merges so agents don’t chase ghosts.

| Date | Action | From | To |
|------|--------|------|-----|
| 2026-07-28 | Created canonical agent entry | (new) | `AGENTS.md` |
| 2026-07-28 | Created canonical deploy | (merged concepts from DEPLOY-*) | `docs/deploy.md` |
| 2026-07-28 | Created architecture map | REPO-LAYOUT concepts | `docs/architecture.md` |
| 2026-07-28 | Created ops pointer | KIMI-VPS / OPS-TWO-MACHINE | `docs/ops-runbook.md` |
| 2026-07-28 | Created handoff log | KIMI-HANDOFF style | `docs/handoff-log.md` |
| 2026-07-28 | Landing free/fees section | — | product (not a move) |

| 2026-07-28 | Deleted obsolete root/docs annexes | PROTOCOL, GROK-SESSION, LAYOUT, REBUILD, V5, DESIGN, DILIGENCE, DEPLOY-PLAYBOOK, DEPLOYMENT, REPO-LAYOUT, CHANGELOG-v5 | deleted / merged |
| 2026-07-28 | Root `archive/` folded | `archive/*` | `docs/archive/legacy-root/` |
| 2026-07-28 | Server route split | `server/index.js` inline handlers | `server/routes/{auth,ai,stamps,…}.js` + `server/lib/*` |
| 2026-07-28 | Components restructure | flat `src/components/*` | `layout/ shared/ ui/ stamps/ dashboard/ forms/ marketing/` |
| 2026-07-29 | Explainer media plane | Grok graphics + music + Kimi VO | `public/media/video/*` · `/watch` |
| 2026-07-29 | Doc/status closeout | — | current-status, handoff-log, MASTER-BRAIN-INGEST, LATEST-UPDATE |

## Left alone (still intentional)

| Item | Why |
|------|-----|
| `server/db.js`, `migrations/`, `data/` | Out of scope; data safety |
| `public/_redirects`, `/metrics.json` | HQ + SPA contracts |
| Full pages tree regroup | Already partially folded (`contracts/`, `government/`, …); further moves optional |
| `docs/DEPLOY-SERVER.md`, `docs/KIMI-VPS-RUNBOOK.md` | Live ops detail still referenced from `deploy.md` / `ops-runbook.md` |

## Version

`package.json` is SoT (`5.0.0-ELITE`). Old `v4.0.0-ELITE` strings in archive docs are historical only.

| 2026-07-28 | Deleted root stubs | PROTOCOL, GROK-SESSION-PROTOCOL, LAYOUT, REBUILD_PROMPT, V5-ASCENSION, DESIGN, DILIGENCE | (deleted; AGENTS.md is SoT) |
| 2026-07-28 | Deleted deploy annexes | DEPLOY-PLAYBOOK, DEPLOYMENT, REPO-LAYOUT | superseded by docs/deploy.md + architecture.md |
| 2026-07-28 | Merged CHANGELOG-v5 | CHANGELOG-v5.md | CHANGELOG.md then deleted |
| 2026-07-28 | Merged root archive/ | archive/* | docs/archive/legacy-root/ |

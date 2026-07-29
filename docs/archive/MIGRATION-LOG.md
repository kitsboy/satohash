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

## Not done yet (intentional)

| Item | Why parked |
|------|------------|
| Delete root `PROTOCOL.md`, `V5-ASCENSION-PROTOCOL.md`, etc. | Need Cam OK; still linked from old sessions |
| Move all marketing SEO into `docs/marketing/` | Update `scripts/sync-docs.js` + DocViewer links first |
| Merge `archive/` + `docs/archive/` | Overlap audit |
| Split `server/index.js` | High risk to live API paths; separate PR |
| Restructure `src/components` | Import blast radius; separate PR |

## Version

`package.json` is SoT (`5.0.0-ELITE`). Old `v4.0.0-ELITE` strings in archive docs are historical only.

| 2026-07-28 | Deleted root stubs | PROTOCOL, GROK-SESSION-PROTOCOL, LAYOUT, REBUILD_PROMPT, V5-ASCENSION, DESIGN, DILIGENCE | (deleted; AGENTS.md is SoT) |
| 2026-07-28 | Deleted deploy annexes | DEPLOY-PLAYBOOK, DEPLOYMENT, REPO-LAYOUT | superseded by docs/deploy.md + architecture.md |
| 2026-07-28 | Merged CHANGELOG-v5 | CHANGELOG-v5.md | CHANGELOG.md then deleted |
| 2026-07-28 | Merged root archive/ | archive/* | docs/archive/legacy-root/ |

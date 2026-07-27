# Satohash repo layout (agent-friendly)

Keep this map accurate. Prefer **small, purposeful** moves over big renames.

## Runtime

| Path | Role |
|------|------|
| `src/` | Vite SPA |
| `server/` | Express API (Docker / THOR) |
| `server/metrics-payload.js` | HQ `gab.product-metrics.v1` builder |
| `server/routes/v5-api.js` | Public v5 stamp surfaces |
| `data/` | Local SQLite only — **not in git** (`*.db` gitignored) |
| `public/` | Static assets + CF Pages extras (`metrics.json` mirror, `_redirects`) |
| `packages/` | CLI + thin client for family apps |
| `scripts/` | Build / deploy / metrics fetch helpers |

## Docs

| Path | Role |
|------|------|
| `docs/KIMI-HANDOFF.md` | Session log (newest on top) |
| `docs/KIMI-REQUEST-SATOHASH.md` | Stamp upgrade request + status |
| `docs/KIMI-REQUEST-BITCOIN-WALLETS.md` | **Kimi: LNbits satohash + L1/L2 public receive** |
| `docs/LEARN-STAMP-FAMILY.md` | Suite stamp handoff lessons (2026-07-27) |
| `docs/HQ-FEED.md` | What we publish for hq.giveabit.io |
| `docs/FAMILY-API.md` | Family stamp contract + deep-link |
| `docs/OTS-DEEP-LEARN.md` | OTS protocol (mandatory before OTS work) |
| `docs/MASTER-BRAIN-INGEST.md` | Vault paste for Kimi |
| `docs/KIMI-VPS-RUNBOOK.md` | VPS Docker / ops |
| `docs/archive/` | Session summaries |
| `archive/` | Historical marketing dumps (not live product) |
| `.ai_docs/` | Fast LLM status |

## Do not reorganize casually

- `server/index.js` routes (CF / Caddy / family clients depend on paths)
- `public/_redirects` SPA fallback
- `GET /metrics.json` path (HQ hard-codes it)
- Package name / Vite env `VITE_API_URL`

## Performance notes

- Index `timestamps(status)`, `timestamps(created_at)`, `timestamps(client_id)`, `timestamps(hash)`
- Metrics assembly is pure SQL aggregates — keep payload builder pure in `metrics-payload.js`

# Satohash Tier 3 + Tier 4 — Enhancement Plan (2026-08-20)

Prepared by Kimi (THOR). Tier 1 + Tier 2 shipped in parallel-agent batch; this doc is the
next-wave blueprint. All items are fully autonomous (Kimi + spawned agents, end-to-end).

## Tier 3 — Product depth (next batch, highest value first)

| # | Item | Files/area | Notes |
|---|------|-----------|-------|
| 1 | Embeddable "Stamp on Satohash" widget | `src/components/widgets/*`, new route `/widget`, `public/widget-embed.js` | Copy-paste snippet; iframe + API; family sites can drop it in (katoa, tadbuy, sherpacarta…) |
| 2 | CLI polish | `packages/satohash-cli` | Add `--watch` (stamp → auto-upgrade → verify → show block), `--json` output, install docs page |
| 3 | API docs polish | `server/swagger.js`, `/api-docs` | Complete OpenAPI for public endpoints + live "try it"; examples for stamp/batch/webhooks |
| 4 | Webhook recipe templates | `docs/WEBHOOKS.md` | Ready-made Zapier/Make recipes + payload examples |
| 5 | PWA polish | `vite-plugin-pwa`, `sw.js` | Offline page, install prompt, better stamp-flow caching |
| 6 | Light/dark theme toggle | theme context + `index.html` class | Tailwind makes it quick; respect `prefers-color-scheme` default |
| 7 | Batch stamping UI upgrade | `src/pages/BatchTimestamp.jsx` | 10 files, progress, one certificate pack (zip) |

## Tier 4 — Reliability & hygiene

| # | Item | Files/area | Notes |
|---|------|-----------|-------|
| 1 | Sentry DSN wiring | `.env` + Vault | Code already inits both server (`config.SENTRY_DSN`) and client (`VITE_SENTRY_DSN`); needs a real DSN from Cam's Sentry account → Vault, never git |
| 2 | CI smoke tests | `.github/workflows/*` | Playwright suites exist (`tests/e2e/*`) — wire to GitHub Actions on every push |
| 3 | Cache-header audit | `public/_headers`, CF config | Verify `/b/*` long-cache + `index.html` no-cache (prevents stale-chunk errors at the source) |
| 4 | On-site metrics strip | `src/components/shared/*` | Live "28 proofs issued" counter + recent-stamps strip from `/metrics.json` |
| 5 | Security headers sweep | helmet config, `_headers` | Re-audit CSP/HSTS/Referrer-Policy; tighten loose routes |

## Gate (needs Cam — NOT autonomous)

- LN channels open (needs capital + Cam go)
- Paywall flip (business decision)
- Umbrel node integration (hardware)
- iPhone Safari physical test of `/p/<hash>`

## Process

- Each tier = one parallel-agent batch (max 4 agents, strict file ownership, no shared-file edits)
- Orchestrator (Kimi): pre-wire routes → spawn → review → lint+build+test → commit+push → verify live
- Handoff updated after each batch; LATEST-UPDATE.md kept current

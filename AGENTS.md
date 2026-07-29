# AGENTS.md — Single entry for every agent

**Mandatory first read.** Keep this short; details live under `docs/`.

| If you are… | Read first |
|-------------|------------|
| **Any agent (status)** | `.ai_docs/current-status.md` |
| **Grok / coding (M3)** | This file → `docs/deploy.md` → `docs/architecture.md` → code |
| **Kimi on VPS / THOR** | `docs/ops-runbook.md` (or `docs/KIMI-VPS-RUNBOOK.md` until fully merged) |
| **API / family clients** | `docs/FAMILY-API.md` |
| **OTS / stamp work** | `docs/OTS-DEEP-LEARN.md` + `docs/LEARN-STAMP-FAMILY.md` |
| **Session log** | `docs/handoff-log.md` (newest first; legacy: `docs/KIMI-HANDOFF.md`) |

## Non-negotiables

1. **Orchestration = VPS Kimi (THOR). Code = M3.** No Umbrel. Don’t fight M4 for coding ownership.
2. **Never commit secrets** (API keys, LNbits admin, nsec, `.env`).
3. **Do not change live `/api/*` paths** without an explicit Cam request — family apps + Caddy hardcode them.
4. **Do not break** `public/_redirects` SPA fallback or `GET /metrics.json` (HQ).
5. **Do not rename** package name or `VITE_API_URL`.
6. **Free stamps today:** `REQUIRE_LIGHTNING=false`. Proofs = OpenTimestamps → **Bitcoin**. Later paywall = Lightning fee **to us**; chain stays Bitcoin.
7. **SPA must call** `https://api.satohash.io` — never same-origin on CF Pages hosts.
8. **Version SoT:** `package.json` (`5.0.0-ELITE`). Ignore older `v4` strings in archive docs.

## Planes

| Plane | Where |
|-------|--------|
| SPA | Cloudflare Pages → satohash.io / www / pages.dev |
| API | THOR Docker → api.satohash.io |
| Metrics SoT | `https://api.satohash.io/metrics.json` (SPA `/metrics.json` is CF Function proxy) |
| HQ | hq.giveabit.io |

## End of session (Grok)

1. Append top of `docs/handoff-log.md` (or `docs/KIMI-HANDOFF.md`).
2. `git status` / push if Cam wants.
3. One-line `LATEST-UPDATE.md`.

## Canonical docs map

```
README.md           — humans
AGENTS.md           — this file (agents only entry)
docs/
  architecture.md   — repo map + data flow
  deploy.md         — ONE deploy doc (local / VPS / CF Pages)
  ops-runbook.md    — VPS/Kimi procedures
  handoff-log.md    — running session log
  marketing/        — pitch, SEO, financials (not agent ops)
  archive/          — old handoffs & superseded notes
```

Full cleanup / migration notes: `docs/archive/MIGRATION-LOG.md`.

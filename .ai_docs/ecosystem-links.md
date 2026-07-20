# Ecosystem Links — Satohash

**Last Updated:** 2026-07-20

## Role
Satohash is the shared **PROOF / TIMESTAMP backbone** for Give A Bit. Products stay compartmentalized; they call the API; they do not re-implement OTS.

## Planes
| Plane | Tech | Host |
|-------|------|------|
| Proof create | OpenTimestamps calendars | Public internet |
| Proof API | Express + SQLite + Redis | VPS Docker |
| Metrics API | GET /metrics.json (gab.product-metrics.v1) | VPS Docker |
| Proof UX | React SPA | Cloudflare Pages |
| Settlement | LND + LNbits | VPS |
| Identity | NIP-05 namespace | giveabit.io |
| Ops glass | HQ control panel | kitsboy/HQ |

## Product clients (X-Satohash-Client)

| Project | Status |
|---------|--------|
| giveabit | Client on main |
| motopass | Client + Verify UI |
| katoa | Client + Settings UI |
| stranded | Client lib |
| sherpacarta | Client lib |
| tadbuy | Planned |
| openstrata | Planned |
| camtaylor | Planned |
| lindala | Planned |
| HQ | Health poll only |

## Shared infra
- GitHub: kitsboy/*  
- CF Pages: per-project  
- VPS: Kimi orchestration + satohash-api + node/LNbits  
- Family free: `FAMILY_API_KEYS` / `X-Satohash-Key`  

## Docs for agents
- `docs/KIMI-VPS-RUNBOOK.md`  
- `docs/FAMILY-API.md`  
- `docs/MASTER-BRAIN-INGEST.md`  

# Project Summary — Satohash

**What:** Institutional-grade digital notary and Bitcoin timestamping (OpenTimestamps).  
**Domains:** satohash.io · satohash.giveabit.io · api.satohash.io (API)  
**Version:** 4.1.0-ELITE  
**Updated:** 2026-07-20  

## One-liner
Prove a document existed at a point in time by anchoring its hash to Bitcoin — file never leaves the device for hash; suite API stores proof metadata for family apps.

## Stack
React 18 + Vite 6 + Tailwind · Express 5 + better-sqlite3 + Redis · OTS calendars · optional bitcoind · LND/LNbits for money  

## Role in Give A Bit
Shared **proof plane**. Free internal family stamps; public API with rate limit / Lightning later.

## Who does what
| Role | Machine |
|------|---------|
| Grok coding | M3 |
| Kimi orchestration + VPS services | VPS |
| Cam secrets / accounts | Human |

## Entry docs for any LLM
1. `.ai_docs/current-status.md`  
2. `docs/KIMI-VPS-RUNBOOK.md`  
3. `docs/KIMI-HANDOFF.md`  
4. `docs/FAMILY-API.md`  

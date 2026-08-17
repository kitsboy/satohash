# Architecture Overview

**Version:** 5.0.0-ELITE · **Updated:** 2026-08-16 · **Live:** https://satohash.io

Satohash is a Bitcoin-anchored proof-of-existence product: a public SPA plus an Express API. The invariant: **only a SHA-256 hash ever leaves the user’s device**.

## Planes

```
Browser SPA (Cloudflare Pages → satohash.io)
        │  always https://api.satohash.io
        ▼
api.satohash.io (Express on THOR)
        │
        ├─► OpenTimestamps calendars (alice, bob, finney) ──batch──► Bitcoin
        ├─► SQLite / local data
        └─► optional LNbits when REQUIRE_LIGHTNING=true
```

| Plane | What it is | Status (Aug 2026) |
|---|---|---|
| Proof | Client hash → OTS calendars → Bitcoin | **Live.** Free stamps. |
| Identity | Optional Nostr NIP-05 / NIP-07 signer | Available; not required to stamp |
| Settlement | Lightning invoice to us (LNbits) | **Off.** Flag ready, 0-sat wallet |
| Atlas | Live chain / mempool / network views | Live from own bitcoind |

## Hosts

| Concern | Where |
|---|---|
| SPA | Cloudflare Pages → satohash.io / www / pages.dev |
| API | THOR Docker → api.satohash.io |
| Metrics SoT | `https://api.satohash.io/metrics.json` |
| HQ | hq.giveabit.io |
| Explainer | `/watch` |
| SPA assets | Vite `assetsDir: 'b'` → `/b/*` (do not revert to long-cache `/assets/*`) |

## Bitcoin (own node)

The API reads chain height and mempool from a pruned **bitcoind** on THOR (10 GB target). Initial block download finished ~2026-08-08. `GET /api/public/bitcoin` reports `source: bitcoind`, `ibd: false`, `ready_to_verify: true`.

During IBD the API correctly fell back to mempool.space. That path is off now.

## Proof lifecycle

1. Browser hashes the file (Web Crypto or worker).
2. `POST /api/stamp` receives the hash (never the bytes).
3. Server submits to public OTS calendars.
4. User downloads a pending `.ots`.
5. Calendars aggregate and commit to Bitcoin.
6. Upgrade path fills in the Bitcoin attestation.
7. Anyone verifies with Satohash or an independent OTS client + Bitcoin.

## Critical paths (do not casually change)

| Path | Why |
|---|---|
| `POST /api/stamp` | Core product + family clients |
| `GET /api/history`, `GET /api/stamps/:id` | Verify / vault |
| `POST /api/verify`, `POST /api/upgrade` | OTS lifecycle |
| `GET /metrics.json` | HQ |
| `GET /health` | Ops |
| SPA `/stamp?hash=&ref=` | Family deep-link |
| SPA `/watch` | Explainer |

## Free vs paid

| Mode | Flag | User pays |
|---|---|---|
| Free (now) | `REQUIRE_LIGHTNING=false` | Nothing |
| Paid (later) | `REQUIRE_LIGHTNING=true` | Lightning **to us**; same OTS / Bitcoin proofs |

## What this is not

- Not a document vault in the cloud (bytes stay local; vault is optional/local)
- Not a different chain — Lightning would be a fee rail, not the timestamp
- Not Umbrel. Code on M3. Ops on THOR / Kimi.

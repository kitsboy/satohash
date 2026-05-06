# Satohash — Executive Summary

**Version:** 1.0  
**Date:** May 2026  
**Built by:** Give A Bit (https://giveabit.io)  
**Live at:** https://satohash.giveabit.io

---

## What is Satohash?

Satohash is a Bitcoin-native document timestamping platform. It allows anyone to create cryptographic, tamper-proof proof that a document existed at a specific point in time — secured by the Bitcoin blockchain — without needing a Bitcoin wallet, a notary, or any subscription.

The core action is simple: upload a document, and Satohash returns an immutable `.ots` proof file. That proof is independently verifiable by anyone, forever, using only Bitcoin's public blockchain. No trust in Satohash is required — if Satohash disappeared tomorrow, all existing proofs would remain valid.

---

## The Problem We Solve

Proving that something existed *before* a specific date is valuable in dozens of contexts:

- A freelancer whose client claims they were the author of a design
- A journalist protecting a pre-publication source document
- A researcher establishing priority of discovery
- A law firm proving a contract was drafted before a dispute arose
- A developer proving the state of a codebase at a specific release
- An AI team proving when a model produced a specific output

Traditional solutions — notaries, lawyers, certified mail — are slow, expensive, and depend on a trusted intermediary. Cloud-based solutions (DocuSign, etc.) store your documents on their servers. Satohash does neither: it timestamps only the mathematical fingerprint (SHA-256 hash) of your document, keeping your content private by design.

---

## How It Works

### The OTS Protocol

Satohash is built on [OpenTimestamps](https://opentimestamps.org) (OTS), an open protocol invented by Peter Todd in 2016. OTS is free, open source, and community-operated.

**Proof lifecycle:**

```
Document (your device)
    ↓ SHA-256 hash (computed in browser — file never leaves your device)
    ↓
POST /api/stamp
    ↓
Three free OTS calendars (alice / bob / finney)
    ↓ Merkle tree aggregation (~5 min)
    ↓
Bitcoin miner includes commitment in a block (~10 min)
    ↓
Status: "confirmed" | bitcoin_block_height: 898234
    ↓
.ots proof file — verifiable forever, by anyone, offline
```

### Free Public Calendars

Satohash submits to three independent, community-funded OTS calendars simultaneously:

| Calendar | URL | Operator |
|----------|-----|----------|
| alice | https://alice.btc.calendar.opentimestamps.org | OTS Project |
| bob | https://bob.btc.calendar.opentimestamps.org | OTS Project |
| finney | https://finney.calendar.eternitywall.com | Eternity Wall |

Using three calendars provides redundancy. These are free, require no API key, and are monitored at https://uptime.opentimestamps.net.

---

## Current Feature Set (v1.0)

### Core Timestamping
- **Document hashing** — SHA-256 in browser via Web Crypto API; files never transmitted
- **OTS stamp** — submits to three calendars with explicit calendar URL configuration
- **OTS verify** — verifies `.ots` file against Bitcoin blockchain
- **OTS upgrade** — upgrades pending proofs when Bitcoin confirmation arrives
- **Background upgrade daemon** — polls calendars automatically; no manual upgrade required

### Vault & History
- **Stamp vault** — dashboard showing all timestamps with status, filename, and proof download
- **History API** — `GET /api/history` returns recent 50 stamps
- **Image vault** — filtered view of notarised images (`GET /api/vault/images`)

### Identity & Collaboration
- **Nostr integration** — publishes timestamps to Nostr relay; stores NIP-07 signed events
- **Co-signing** — add co-signers via Nostr npub (`POST /api/collaboration/sign`)
- **Revocation** — revoke and supersede a proof (`POST /api/revoke/:id`)

### Capture
- **URL capture** — notarise a URL's content at a point in time (`POST /api/capture/url`)
- **Browser extension endpoint** — `POST /api/capture/snapper` for the Satohash browser extension
- **Git notarisation** — timestamp current git repo state (`POST /api/git/stamp`)

### PDF Tooling
- **PDF proof injection** — embed OTS metadata into an existing PDF (`POST /api/pdf/inject/:id`)

### Payments
- **L402 / Lightning** — BOLT-12 Lightning micropayments for paid tier (paywallMiddleware)
- **Free tier** — 100 requests/day, no wallet required, tiered rate limiting

### Developer / Ops
- **REST API** — full CRUD for stamps, history, system info
- **Swagger / OpenAPI** — live docs at `/api-docs`; spec at `/public/api/openapi.json`
- **Socket.io** — real-time events: `ots:stamped`, `ots:collaborated`, `ots:revoked`
- **Prometheus metrics** — `/metrics` endpoint
- **Health check** — `/health?deep=true` with OTS calendar, Redis, and Nostr status
- **Admin dashboard** — `/admin/stats` (Bearer token protected)
- **CSV export** — `GET /api/export/csv` for CRM integration
- **Full DB export** — `GET /api/system/backup`
- **Peer mesh network** — multi-node witness verification (`POST /api/mesh/verify`)
- **Bitcoin fee estimates** — `GET /api/system/fees`

### AI Integration
- **OpenAPI spec** — importable into GPT Actions, Claude tool_use, Make, Zapier, n8n
- **Zero-knowledge design** — documents never touch the server; safe for confidential content
- **Documented integration guides** — Python, Node.js, curl, Claude API, Make, Zapier, n8n

---

## Technical Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Node.js, Express |
| Database | SQLite via better-sqlite3 + Knex migrations |
| Timestamping | `javascript-opentimestamps` npm package |
| Identity | Nostr (NIP-05, NIP-07) |
| Payments | BOLT-12 Lightning / L402 |
| Real-time | Socket.io |
| Caching | Redis (optional, graceful degradation) |
| Metrics | Prometheus |
| Process management | PM2 |
| Error tracking | Sentry (optional) |

**Deployment:** Single-process or two-process. In production, Express serves the Vite build from `dist/` as static files. In development, Vite runs on port 3000 and proxies API calls to Express on port 3001.

**Self-hostable:** All dependencies are open source. A self-hosted instance requires only Node.js, an SQLite-capable filesystem, and outbound HTTPS to the OTS calendar URLs.

---

## Privacy & Security Design

- **Zero-knowledge:** Document contents are SHA-256-hashed in the browser before any network request. Satohash never receives, stores, or transmits document content.
- **Hash-only storage:** The SQLite database stores only SHA-256 hashes, filenames (optional, user-provided), and `.ots` binary proofs.
- **Portable proofs:** `.ots` files are self-contained and verifiable with the Python or JavaScript OTS CLI without involving Satohash.
- **No vendor lock-in:** The OTS standard is openly specified. Proofs survive Satohash's shutdown.
- **Rate limiting:** Tiered rate limiter (express-rate-limit) protects against abuse. Correlation IDs on all requests for traceability.

---

## Pricing & Business Model

| Tier | Cost | Limit | Payment |
|------|------|-------|---------|
| Free | $0 | 100 req/day | None |
| Pro | Sats per request | Unlimited | Lightning (L402) |
| Enterprise | Custom | Custom | Invoice / contact |

The OTS calendars used by Satohash are community-funded and free to use. There are no per-timestamp Bitcoin transaction fees charged to Satohash or its users. The Lightning Pro tier funds hosting, development, and Give A Bit infrastructure.

---

## Roadmap Highlights

- **BOLT-12 Lightning** — fully live L402 paywall (currently mock in `details.lightning`)
- **Mobile app** — React Native client with camera-to-hash capture
- **Nostr NIP-05 verification** — full identity binding with Nostr public keys
- **Webhook delivery** — confirmed, with re-try on failure
- **Multi-language UI** — `VITE_DEFAULT_LANGUAGE` infrastructure in place
- **Atlas chain intelligence** — Bitcoin chain analytics plane (`/status` → Atlas page)
- **White-label API** — for legal tech and notary software providers

---

## About Give A Bit

Give A Bit is a Bitcoin-native development studio building open infrastructure for micropayments, proofs, and decentralised identity. Satohash is our flagship public product.

**Contact:** hello@giveabit.io  
**Website:** https://giveabit.io  
**Satohash:** https://satohash.giveabit.io  
**API docs:** https://satohash.giveabit.io/api-docs

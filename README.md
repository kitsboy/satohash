# Satohash v5.0.0-ELITE

[![Version](https://img.shields.io/badge/version-4.1.0--ELITE-indigo.svg)](https://github.com/kitsboy/satohash)
[![License](https://img.shields.io/badge/license-MIT-black.svg)](LICENSE)
[![Protocol](https://img.shields.io/badge/protocol-OpenTimestamps-orange.svg)](https://opentimestamps.org)
[![Parent Studio](https://img.shields.io/badge/studio-Give_A_Bit-orange.svg)](https://giveabit.io)

**Institutional-Grade Digital Notary & Cryptographic Settlement Mesh.** Satohash is a high-fidelity, zero-knowledge platform for verifiable document provenance, multi-party contract signatures, forensic web capture, and automated cryptographic evidence gathering — anchored immutably to the Bitcoin blockchain via OpenTimestamps. Built as Free and Open Source (F.O.S.S.) Bitcoin software by [Give A Bit](https://giveabit.io).

> **Agents:** start at **[AGENTS.md](AGENTS.md)** · status **[.ai_docs/current-status.md](.ai_docs/current-status.md)** · handoff **[docs/handoff-log.md](docs/handoff-log.md)** · MASTER-BRAIN paste **[docs/MASTER-BRAIN-INGEST.md](docs/MASTER-BRAIN-INGEST.md)**.  
> **Live:** https://satohash.io · API https://api.satohash.io · free stamps · `REQUIRE_LIGHTNING=false`.

### 📖 Documentation & Pitch

| Resource | Path |
|----------|------|
| **60s–80s explainer** | [/watch](https://satohash.io/watch) · media `public/media/video/` |
| **Exec summary (UI)** | [/docs/executive-summary](https://satohash.io/docs/executive-summary) |
| **Live pitch deck** | [/pitch](https://satohash.io/pitch) |
| Executive summary (md) | [docs/marketing/EXECUTIVE-SUMMARY.md](docs/marketing/EXECUTIVE-SUMMARY.md) |
| Product pitch | [docs/marketing/PITCH.md](docs/marketing/PITCH.md) |
| Architecture | [docs/architecture.md](docs/architecture.md) |
| Deploy (canonical) | [docs/deploy.md](docs/deploy.md) |
| Explainer music/VO | [docs/EXPLAINER-MUSIC-AND-VO.md](docs/EXPLAINER-MUSIC-AND-VO.md) |
| Quickstart | [docs/QUICKSTART.md](docs/QUICKSTART.md) |

---

## 🏛 The Elite Standard
Satohash v4.1-ELITE is the **Sovereign Settlement Layer** — a complete four-plane system (Proof / Identity / Settlement / Atlas) for legal-grade, zero-knowledge, Bitcoin-anchored provenance. Designed by [Give A Bit](https://giveabit.io) for law firms, compliance teams, creators, journalists, AI pipelines, and autonomous agents who need absolute, portable, independently verifiable truth.

### 🚀 Core Protocol Features (Current)
- **Bitcoin Anchoring via OpenTimestamps (OTS)** — SHA-256 client-side hash → three public calendars → permanent Bitcoin block commitment. Portable `.ots` proofs.
- **BOLT-12 Lightning Settlement** — Native reusable offers + L402 paywalls for volume/API use (no credit cards).
- **Forensic Web Capture ("Snapper")** — One-click judiciary-ready web evidence with browser fingerprint + immediate OTS stamp.
- **Nostr Cryptographic Identity (NIP-05 / NIP-07)** — Passwordless signer provenance for multi-party contracts and audit trails.
- **Multi-Party Orchestration** — Co-signing flows with drawn seals + typed signatures, all anchored together.
- **Verification Shield + 3D Merkle** — Real-time cryptographic verification with beautiful path visualization.
- **ZK Redaction** — Redact while keeping the original Bitcoin anchor valid.
- **Courtroom PDF Exports** — Custom watermarks, metadata, attestation blocks, injected proof via PdfCustomizer.
- **Git + Batch + Offline** — Notarize entire repos or directories; work offline and auto-sync later.
- **Live Mempool & Atlas** — Real-time fees, block height, chain intelligence always in the UI.
- **Zero-Knowledge by Design** — Documents never leave the device. Only hashes are ever transmitted.

See the full feature set and positioning in [docs/EXECUTIVE_SUMMARY.md](docs/EXECUTIVE_SUMMARY.md) and [docs/MARKETING.md](docs/MARKETING.md).

## 🛠 Technical Architecture

**Local-first + privacy-first.** Client-side hashing (Web Crypto) before any network call. Server only ever sees hashes + metadata.

- **Frontend**: React 18 + Vite 6 + Tailwind CSS 4 + Framer Motion (Institutional Noir)
- **Shell**: `AppShellNoir` (desktop left rail, top signal bar, mobile nav, ⌘K palette)
- **State/Routing**: React Router 6 + lightweight Zustand + localStorage/IndexedDB
- **Cryptography & Anchoring**: OpenTimestamps + bitcoinjs-lib
- **Identity**: Nostr tools (NIP-07 browser + NIP-05)
- **Settlement**: BOLT-12 + L402
- **Backend**: Express 5 + Socket.io + better-sqlite3 + Knex (migrations in `server/migrations/`)
- **Observability**: Sentry (Node + React), Pino, Prometheus
- **Real-time**: Socket.io events for stamp lifecycle
- **Build / Deploy**: `npm run build` → `dist/` → Cloudflare Pages (`./deploy.sh`). Express is **local dev only**.

Full operational details (endpoints, env vars, known token inconsistencies, daemon behavior) live in [CLAUDE.md](CLAUDE.md).

## 📂 Project Structure (Key Paths)

```
├── src/
│   ├── components/     # High-fidelity "Institutional Noir" UI (AppShellNoir, Bolt12..., NostrSigner, ZKRedaction, PdfCustomizer, Merkle*, etc.)
│   ├── pages/          # All major surfaces (Stamp, Verify, Vault, Contracts, Snapper, Atlas, Developer, Identity, onboarding, legal, etc.)
│   ├── utils/          # crypto, opentimestamps, merkle, pdfGenerator, mempool, nwc, storage, etc.
│   ├── hooks/          # useSocket, useOfflineSync, useNWC...
│   └── i18n/           # en, es, fr, de, zh
├── server/
│   ├── index.js        # Express + Socket.io + routes + daemons
│   ├── db.js + migrations/   # SQLite + Knex (multi-tenancy, webhooks, referrals, etc.)
│   ├── upgrade-daemon.js, nostr.js, mesh.js, pdf-injector.js, git.js, collaboration.js...
│   └── routes/         # lightning, anchor, nft
├── extension/satohash-snapper/   # Browser "Snap & Stamp" forensic capture tool (MV3)
├── public/             # Static assets + openapi.json + pre-generated PDFs
├── docs/               # Business handoff docs + technical references (see DOCS_INDEX.md)
├── bin/satohash.js     # Starter CLI
└── tests/              # Vitest + Playwright E2E
```

See [docs/DOCS_INDEX.md](docs/DOCS_INDEX.md) for the complete documentation map and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the synthesized four-plane technical view.

## 🏗 Common Commands

```bash
npm install                 # Install
npm run dev                 # Concurrent dev (Vite 3000 + Express 3001)
npm run build               # Production build to dist/
npm run production          # Build + serve locally (Express + dist)
npm run server              # Backend only (local dev)
./deploy.sh                 # Deploy static site to Cloudflare Pages
npm run start:pm2           # PM2 local/self-host (optional)
npm test                    # Vitest
npm run test:e2e            # Playwright
npm run lint && npm run format
```

Frontend dev server: **3000**  
Backend API + Swagger: **3001**

Full setup, env, and troubleshooting: [docs/QUICKSTART.md](docs/QUICKSTART.md)

## 📜 Legal & Compliance

Satohash provides cryptographic evidence and specialized tooling. It does **not** provide legal advice. The protocol is engineered to supply non-repudiable, mathematically verifiable timestamps that can help satisfy requirements under the **ESIGN Act (US)**, **UETA (US)**, and **eIDAS (EU)** "best evidence" standards when properly used.

---
© 2026 Satahash Institutional Division. All Rights Reserved.


## Diligence / partner pack
Full disclosure for technical & financial partners: **[docs/diligence/](./docs/diligence/)**  
Portfolio map: [Family of 8](https://github.com/kitsboy/giveabit/blob/main/docs/diligence/PORTFOLIO-FAMILY-OF-8.md)


**Uniformity note (added 2026-08-03 via Hermes/Kimi):** 
Read AGENTS.md first. Handoff protocol: cat docs/KIMI-HANDOFF.md (latest) + KIMI-GROK-HANDOFF.md or equiv. 
Plausible: https://github.com/plausible/analytics (light self-evolving analytics). 
Full structure: ~/MASTER-BRAIN/01-Architecture/STRUCTURE-MAP.md + PROJECT-TEMPLATE.md. 
M4: Tailscale + Hermes Desktop to THOR + git push only.


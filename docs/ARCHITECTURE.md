# Satohash Architecture (v4.1 ELITE)

**Sovereign Settlement Layer** — Bitcoin-anchored proof of existence, identity, settlement, and chain intelligence.

This document synthesizes the four-plane model, technical decisions, and invariants. It is the canonical reference for developers and agents. See also `CLAUDE.md` (operational), `DESIGN.md`, `PROTOCOL.md`, `LAYOUT.md`, and `PRODUCT_PITCH.md`.

## The Four Planes

Satohash operates across four stacked, composable planes. Higher planes depend on lower ones but the core proof (Plane 1) is independently verifiable.

```
Plane 4: ATLAS
  Live chain intelligence, mempool fees, node mesh health, global activity pulse,
  jurisdiction mapping, protocol stats. (MempoolTicker, Atlas page, LiveNetworkDashboard, etc.)

Plane 3: SETTLEMENT
  BOLT-12 Lightning offers, L402 paywalls, micropayment metering for high-volume/API use.
  (Bolt12InvoiceDrawer, paywallMiddleware, lightning routes)

Plane 2: IDENTITY
  Nostr NIP-05 / NIP-07 cryptographic signer identity. Passwordless auth, multi-party
  contract provenance, reputation trails. (NostrSigner, collaboration flows, Identity page)

Plane 1: PROOF (Foundation)
  SHA-256 client-side hashing → OpenTimestamps calendar aggregation (alice/bob/finney) →
  Bitcoin OP_RETURN / Taproot commitment. Portable .ots proofs. Zero-knowledge by design.
  (Stamp flow, VerificationShield + 3D Merkle, ZKRedactionTool, PdfCustomizer, git stamp, web capture)
```

**Core invariant (never break):** Only the SHA-256 hash ever leaves the user's device. The original bytes are never transmitted to Satohash servers. Proofs remain valid even if Satohash ceases to exist.

## Proof Lifecycle (OTS)
1. **Local hash** (Web Crypto API in browser or CLI `crypto.createHash`).
2. **Submit** hash → server calls OpenTimestamps library against 3 public calendars.
3. **Pending** — partial proofs returned; status stored in SQLite.
4. **Calendar aggregation** (every few minutes by calendar operators).
5. **Bitcoin confirmation** (~10 min median; calendar submits Merkle root via OP_RETURN).
6. **Upgrade** — background `upgrade-daemon.js` polls calendars, upgrades `.ots` binary and records `bitcoin_block_height`.
7. **Confirmed** — Socket.io `ots:stamped` broadcast; user can download final `.ots`.
8. **Revoke / Supersede** — optional later operation that marks a proof as superseded (new proof can reference it).
9. **Verify** — independent of Satohash using any OTS client + Bitcoin node / explorer.

Real-time events: `ots:stamped`, `ots:collaborated`, `ots:revoked`.

## Backend (server/)
- `server/index.js` — Express + Socket.io + Swagger mount.
- `server/db.js` + `server/migrations.js` + `server/migrations/*.sql` — SQLite + Knex. DB lives at `data/satohash.db` (runtime).
- Core modules:
  - `nostr.js` — NIP-05 publishing / identity.
  - `mesh.js` — peer witness network.
  - `upgrade-daemon.js` — OTS polling.
  - `pdf-injector.js` — embed OTS + judicial metadata into PDFs.
  - `git.js` — repo state notarization.
  - `collaboration.js`, `webhooks.js`, `backup.js`, `watcher.js`, `gossip.js`.
- Routes split under `server/routes/` (anchor, lightning, nft) and main index.
- Middleware: `correlationIdMiddleware`, `tieredRateLimiter`, `paywallMiddleware` (L402).
- Caching: `server/cache.js` (ioredis, optional, graceful degrade).
- Admin: `/admin/*` protected by `ADMIN_KEY` bearer.

## Frontend (src/)
- Entry: `src/main.jsx` → `src/App.jsx` (React Router v6).
- Public routes (`/`, `/access`, `/about`, `/trust`) render bare; everything else wrapped in `AppShellNoir`.
- Master shell: `AppShellNoir.jsx` — LeftRailNav, TopSignalBar, MobileBottomNav, global ⌘K command palette.
- Pages (lazy): Stamp, Verify, Vault, Contracts, Snapper/WebCapture, Atlas, Developer, Identity, Forum, Settings, legal pages, onboarding flows, etc.
- Components: many high-fidelity ones (InstitutionalHUD, ProofDNA, Merkle3D/Explorer/Heart, GlobalDropzone, PdfCustomizer, Bolt12InvoiceDrawer, NostrSigner, MempoolTicker, ZKRedactionTool, etc.).
- Utils: `crypto.js`, `opentimestamps.js`, `merkle.js`, `pdfGenerator.js`, `legalPDFGenerator.js`, `nwc.js`, `mempool.js`, `storage.js` (offline), etc.
- Hooks: `useSocket`, `useOfflineSync`, `useNWC`, `useDocumentTitle`.
- i18n: `src/i18n/` (en, es, fr, de, zh) via i18next.
- State: light Zustand usage + React Router + localStorage/IndexedDB for local-first.
- Styling: Tailwind v4 (`@import 'tailwindcss'`), CSS custom properties in `src/index.css` (`--bg-primary`, `--accent-active` etc.), custom component classes in `@layer components`. Framer Motion for all motion. No `@apply` on custom classes.

**Known design token note** (from CLAUDE.md): `tailwind.config.js` still declares an old indigo `primary`; current tokens are in CSS (`--accent-active: #3b82f6` blue). `ThemeProvider.jsx` exists but light/"elite" mode is toggled via `data-theme='elite'` attribute.

## Identity & Settlement Details
- **Nostr**: Browser extension (NIP-07) or NIP-05 handles for signer identity on contracts. Server can publish events.
- **Lightning**: BOLT-12 reusable offers presented via drawer. L402 challenge-response for paywalled endpoints. No credit card required.
- **Multi-party**: Collaboration endpoint adds co-signers (npub). Drawn seals + typed signatures supported. Proof DNA / badge export.

## Data & Privacy
- Client: LocalStorage + IndexedDB (offline queue via `useOfflineSync`).
- Server: Only metadata (hash, filename, status, block height, Nostr pubkeys, webhook targets, etc.). Never raw documents.
- Backups: `/api/system/backup` (admin).
- Mesh / witness: optional peer verification layer.

## API Surface (selected)
See full OpenAPI at `/api-docs` or `public/api/openapi.json`.

- `POST /api/stamp` — submit hash → pending stamp
- `POST /api/verify` — verify .ots blob
- `POST /api/upgrade` — force upgrade of a pending proof
- `GET /api/stamps/:id` — metadata or binary .ots download (Accept: application/octet-stream)
- `GET /api/history` — recent stamps
- `POST /api/git/stamp` — notarize current git state
- `POST /api/capture/url`, `POST /api/capture/snapper` — web evidence
- `POST /api/collaboration/sign` — add co-signer
- `POST /api/revoke/:id`
- `POST /api/pdf/inject/:id` — inject into PDF
- `GET /api/vault/images`
- `GET /api/system/fees`
- Webhooks, mesh verify, admin stats, etc.

Socket events for live updates.

## Observability & Ops
- Health: `/health?deep=true`
- Metrics: Prometheus `/metrics`
- Logging: pino + pino-http + pino-multi-stream
- Error: Sentry (DSN optional)
- Background: node-cron for upgrade daemon + other daemons in `server/daemons/`

## Build, Test, Deploy
- `npm run dev`, `npm run build`, `npm run production`, `npm run server`
- Tests: `npm test` (Vitest), `npm run test:e2e` (Playwright)
- Lint/Format: eslint + prettier (lint-staged + husky)
- Version bump helper: `npm run version:bump`
- Production: **Cloudflare Pages** (static `dist/`). PM2/Docker/nginx examples are optional local/self-host only.

## Security & Compliance Posture
- Zero-knowledge core.
- Proofs exceed ESIGN / UETA / eIDAS "best evidence" via math + Bitcoin PoW (not legal advice).
- Coordinated disclosure only (no public vuln issues).
- Self-hostable for maximum sovereignty.

## Open Questions / Evolution Areas
- Full Fedimint privacy shields (Phase IV vision).
- Cross-chain escrow patterns.
- AI notary oracles.
- Decentralized governance of calendar selection or fee parameters.
- Deeper integration with Give A Bit's broader micropayment / Nostr tooling.

---

**This architecture is deliberately simple at the base (Plane 1) so that the proofs are eternal, while the higher planes (UI, identity, settlement, intelligence) can evolve rapidly without invalidating historical proofs.**

Update this file when major planes or invariants change. Cross-reference with CLAUDE.md for the living operational view.

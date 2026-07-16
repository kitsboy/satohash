<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 4.1.0-ELITE (Build 95) · **Updated:** 2026-07-16
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash — Executive Summary

**Version:** 4.1.0-ELITE (Sovereign Settlement Mesh)  
**Date:** 2026-06-10  
**Live at:** https://satohash.giveabit.io (primary)
**Built by:** Give A Bit (https://giveabit.io)  
**GitHub:** https://github.com/kitsboy/satohash (local filesystem is currently the most up-to-date source of truth — recent push did not fully land)

---

## What Is Satohash?

Satohash is the **Bitcoin-native sovereign settlement layer** for digital truth. It lets anyone — individuals, law firms, enterprises, journalists, AI agents, and developers — create cryptographic, tamper-proof, independently verifiable proof that a digital artifact (document, photo, contract, code state, AI output, or web capture) existed at a precise moment in time, anchored permanently to the Bitcoin blockchain via the OpenTimestamps (OTS) protocol.

**Core value:** Upload (or hash locally) a file → receive a portable, self-contained `.ots` proof file. Any third party can verify it forever using only open-source tools and a Bitcoin node or public explorer. No trust in Satohash is required after the proof is issued. No Bitcoin wallet is needed for basic use. Documents never leave the user's device.

Satohash is not "blockchain notarization theater." It is a production-grade, four-plane cryptographic system:

```
Plane 4: ATLAS — Live chain intelligence, mempool, node mesh, protocol stats, jurisdiction signals
Plane 3: SETTLEMENT — Native BOLT-12 Lightning offers + L402 micropayment metering
Plane 2: IDENTITY — Nostr NIP-05 / NIP-07 cryptographic signer identity & multi-party provenance
Plane 1: PROOF — SHA-256 + OpenTimestamps calendar aggregation → Bitcoin PoW commitment (the eternal foundation)
```

Higher planes can evolve rapidly without ever invalidating historical proofs on Plane 1.

---

## The Problem

Proving that something existed *before* a specific date has enormous legal, commercial, and intellectual value — especially in an era of generative AI, deepfakes, and eroding institutional trust.

| Use Case                    | Traditional Friction                  | Satohash Solution                          |
|-----------------------------|---------------------------------------|--------------------------------------------|
| IP / Patent priority        | Expensive, slow legal filings         | Instant client-side hash + Bitcoin anchor  |
| Freelance / creator disputes| "He said / she said", no evidence     | Cryptographic timestamp before delivery    |
| Investigative journalism    | Sources alter or deny content         | Immutable forensic snapshot + OTS          |
| Smart contract / escrow evidence | Custodial third parties            | Self-sovereign, portable mathematical proof|
| AI model / output provenance| No standard, easy to contest later    | Hash at generation time → Bitcoin block    |
| Web content preservation    | Archives can be edited or taken down  | Snapper + browser fingerprint + OTS        |
| Multi-party contracts       | Signature chains, repudiation risk    | Nostr-linked co-signing + drawn seals      |
| Compliance / audit trails   | Expensive manual processes            | API + webhooks + courtroom PDF exports     |

---

## How It Works (Zero-Knowledge)

1. **Hash** — The browser (or CLI) computes the SHA-256 fingerprint of your file using the Web Crypto API. The original bytes **never leave your device**.
2. **Stamp** — Only the 64-character hex hash is sent to Satohash, which forwards it to three independent public OpenTimestamps calendars (alice, bob, finney).
3. **Anchor** — Calendars aggregate thousands of hashes into a Merkle tree and commit the root to Bitcoin in an OP_RETURN (or Taproot) transaction.
4. **Confirm** — ~10 minutes later (median block time) a Bitcoin block permanently seals the commitment. Satohash's background upgrade daemon detects this and upgrades the local proof record.
5. **Prove** — Download the final `.ots` file. Verification is completely independent: `ots verify`, the official OTS website, or any compatible tool + a Bitcoin block explorer. The proof is valid even if Satohash never existed again.

**No trust required.** The security comes from Bitcoin's proof-of-work, not from any company or server.

---

## Platform Features (v4.1 ELITE)

### Core Proof
- One-click / drag-and-drop timestamping (SPA, CLI, REST API)
- Batch timestamping (hundreds of files in one Bitcoin commitment)
- Verification Shield with 3D Merkle tree visualization and path explorer
- Personal Vault with searchable history and bulk actions
- Full OpenTimestamps compatibility + portable `.ots` files

### Advanced / Institutional
- **ZK Redaction Tool** — Redact sections of a document while preserving a valid Bitcoin anchor for the unredacted hash (courtroom magic)
- **Courtroom-Ready PDF Customizer** — Watermarks, variable paper sizes, judicial metadata blocks, attestation language, injected OTS proof
- **Forensic Web Capture (Snapper)** — Screenshot any public URL + rich browser fingerprint metadata; immediately stamp the evidence package
- **Git State Notarization** — One-click anchoring of current repo state (tags, commit, tree)
- **Offline Sync Queue** — Create stamps while offline; automatically reconcile when connectivity returns
- **Real-Time Mempool Ticker** — Live fee rates and block height always visible in the signal bar
- **Global Command Palette (⌘K)** — Keyboard-first navigation everywhere

### Identity & Collaboration
- **Nostr Signer (NIP-07)** — Passwordless cryptographic identity via browser extension (Alby, etc.)
- **Multi-Party Contract Signing** — Add co-signers by npub, collect drawn + typed seals, produce a single anchored proof package
- **Proof DNA / Badge Generator** — Embeddable, verifiable visual attestations for assets

### Settlement
- **BOLT-12 Lightning Invoices** — Reusable, privacy-preserving offers presented in-drawer
- **L402 Paywalling** — Native HTTP 402 + Lightning for high-volume or automated API usage (no credit cards)

### Developer & Automation
- Full REST API + OpenAPI 3.0 spec + interactive playground in-app
- Webhook subscriptions for stamp lifecycle events (`stamped`, `collaborated`, `revoked`)
- Rich SDK examples (Python, Node, curl) and AI agent integration guides (Claude tool_use, GPT Actions, Make, Zapier, n8n)
- Mesh / peer witness verification endpoints

---

## Technology Stack (Current)

| Layer          | Technology                                      |
|----------------|-------------------------------------------------|
| Frontend       | React 18 + Vite 6 + Tailwind CSS 4 + Framer Motion |
| Shell & UX     | AppShellNoir (LeftRail + TopSignal + Mobile), Institutional Noir design tokens |
| Cryptography   | Web Crypto (client) + opentimestamps (server) + bitcoinjs-lib |
| Blockchain     | Bitcoin Mainnet via 3 public OTS calendars      |
| Payments       | Lightning Network (BOLT-12 offers + L402)       |
| Identity       | Nostr (NIP-05 publishing + NIP-07 browser auth) |
| Backend        | Node 20+ + Express 5 + Socket.io + better-sqlite3 + Knex |
| Persistence    | SQLite (metadata only) + client IndexedDB / LocalStorage for local-first |
| Observability  | Sentry (full-stack), Pino, Prometheus           |
| Real-time      | Socket.io (`ots:*` events)                      |
| Build / Deploy | Vite build → `dist/` → Cloudflare Pages (`satohash` project) |

See `CLAUDE.md` and `docs/ARCHITECTURE.md` for the living operational view.

---

## Market Opportunity

- Global notarization / legal attestation market still largely paper-era (~$5B+/yr).
- Legal tech ~$27B+ and growing double digits.
- AI provenance and deepfake defense are brand-new, exploding greenfield categories.
- Bitcoin-anchored, zero-trust, portable proofs have <1% penetration — massive first-mover + standards position.

**Primary buyers:** IP attorneys & law firms, compliance / records teams at enterprises, investigative journalists, freelance creative & dev platforms, AI research labs, government technologists exploring evidence standards.

---

## Revenue Model (see FINANCIALS.md for projections)

| Tier            | Price          | Notes                                      |
|-----------------|----------------|--------------------------------------------|
| Free            | $0             | 5–100 stamps/day (tiered), basic verify    |
| Professional    | $29/mo         | Unlimited, full vault, API, PDF exports    |
| Enterprise      | $299+/mo       | White-label, SLA, custom webhooks, volume  |
| Pay-per-use API | ~$0.01/stamp   | Lightning (L402) — no subscription friction|

Gross margins are extremely high once past fixed infra (Bitcoin anchoring itself is effectively free via public OTS calendars).

---

## Competitive Advantages (Durable)

1. **Trustless & Portable** — Proofs verify without Satohash forever.
2. **True Zero-Knowledge** — We literally cannot see or store your documents.
3. **Bitcoin Security** — The hardest, most decentralized timestamping root in existence.
4. **Open Standard** — Any OTS verifier in the world works; no vendor lock-in.
5. **Lightning-Native Economics** — Sub-cent, sub-second settlement for volume.
6. **Self-Sovereign Identity** — Nostr, not email or corporate accounts.
7. **Full Sovereign Stack** — Self-hostable, auditable F.O.S.S., multi-plane extensibility.

---

## Team & Backing

Engineered by **Give A Bit** (giveabit.io) — a Bitcoin-native studio building open-source micropayment rails, cryptographic proof systems, and decentralized legal infrastructure for the sovereign individual.

**Contact**  
Partnerships / press: hello@giveabit.io  
Technical / developer: satohash.giveabit.io/developer or the in-app API playground

---

## Handoff & Source-of-Truth Note (2026-06-10)

This Executive Summary, together with:
- `docs/PRODUCT_PITCH.md`
- `docs/MARKETING.md` + `MARKETING_FLYER.md`
- `docs/FINANCIALS.md`
- `docs/ARCHITECTURE.md`
- Root `README.md` + `CLAUDE.md`

…form the primary handoff package for Kimi / Give A Bit Master Brain.

**Local path `the local development machine` on 2026-06-10 is the authoritative current version.** GitHub remote is intentionally noted as lagged until the next reconciliation.

See `SOURCE-OF-TRUTH.md` and `KIMI-HANDOFF-satohash-2026-06-10.md` (generated alongside this update) for the full structured hand-off record following the giveabit-project-handoff skill.

---

*Mathematics on an immutable ledger beats any signature or notary stamp.*
































































---
**Diligence pack:** [docs/diligence/](./diligence/) (investor + architecture + ask)











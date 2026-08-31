<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 276) · **Updated:** 2026-08-31
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash — Executive Summary

**Version:** 5.0.0-ELITE  
**Date:** 2026-08-16 (creative refresh 2026-08-29, aligned to Mission & Scope v3)  
**Live at:** https://satohash.io (primary) · API https://api.satohash.io  
**Built by:** Give A Bit (https://giveabit.io)  
**GitHub:** https://github.com/kitsboy/satohash  
**Creative north-star:** `docs/marketing/BRAND-VOICE.md` · **Canonical mission:** `docs/MISSION-SCOPE-v3.md`

---

## What Is Satohash?

Satohash is the **Bitcoin-native sovereign proof layer for digital truth.** It lets anyone — individuals, law firms, enterprises, journalists, AI agents, and developers — create cryptographic, tamper-proof, independently verifiable proof that a digital artifact (document, photo, contract, code state, AI output, or web capture) existed at a precise moment in time, anchored permanently to the Bitcoin blockchain via the OpenTimestamps (OTS) protocol.

**Core value:** Upload (or hash locally) a file → receive a portable, self-contained `.ots` proof file. Any third party can verify it forever using only open-source tools and a Bitcoin node or public explorer. **No trust in Satohash is required after the proof is issued.** No Bitcoin wallet is needed for basic use. **Documents never leave the user's device.**

**The founding idea (v3):** for centuries, proving "who did what, when" meant a notary, lawyer, or registry — some trusted third party to vouch for a date. Satohash's bet is that this middleman is no longer necessary. OpenTimestamps anchors a fingerprint into Bitcoin permanently and verifiably, with no company between your document and the proof. Add a private-key signature and "this file existed" becomes *"this file existed, and I am the one who created it."*

Satohash is not "blockchain notarization theater." It is a production-grade, four-plane cryptographic system:

```
Plane 4: ATLAS — Live chain intelligence, mempool, node mesh, protocol stats, jurisdiction signals
Plane 3: SETTLEMENT — Native BOLT-12 Lightning offers + L402 micropayment metering (built; staged)
Plane 2: IDENTITY — Nostr NIP-05 / NIP-07 cryptographic signer identity & multi-party provenance
Plane 1: PROOF — SHA-256 + OpenTimestamps calendar aggregation → Bitcoin PoW commitment (the eternal foundation)
```

Higher planes can evolve rapidly without ever invalidating historical proofs on Plane 1.

---

## The Problem

Proving that something existed *before* a specific date has enormous legal, commercial, and intellectual value — especially in an era of generative AI, deepfakes, and eroding institutional trust.

| Use Case                    | Traditional Friction                  | Satohash Solution                          |
|-----------------------------|---------------------------------------|--------------------------------------------|
| IP / creative precedence    | Expensive, slow legal filings         | Evidence of conception / prior-art support |
| Freelance / creator disputes| "He said / she said", no evidence     | Cryptographic timestamp before delivery    |
| Investigative journalism    | Sources alter or deny content         | Immutable forensic snapshot + OTS          |
| Smart contract / escrow evidence | Custodial third parties            | Self-sovereign, portable mathematical proof|
| AI model / output provenance| No standard, easy to contest later    | Hash at generation time → Bitcoin block    |
| Web content preservation    | Archives can be edited or taken down  | Snapper + browser fingerprint + OTS        |
| Multi-party contracts       | Signature chains, repudiation risk    | Nostr-linked co-signing + drawn seals      |
| Compliance / audit trails   | Expensive manual processes            | API + webhooks + independent evidence exports |

---

## How It Works (Zero-Knowledge)

1. **Hash** — The browser (or CLI) computes the SHA-256 fingerprint of your file using the Web Crypto API. The original bytes **never leave your device**.
2. **Stamp** — Only the 64-character hex hash is sent to Satohash, which forwards it to three independent public OpenTimestamps calendars (alice, bob, finney).
3. **Anchor** — Calendars aggregate thousands of hashes into a Merkle tree and commit the root to Bitcoin in an OP_RETURN (or Taproot) transaction.
4. **Confirm** — Within ~60 minutes a Bitcoin block permanently seals the commitment (the price of strength — block time is what makes the proof durable). Satohash's background upgrade daemon detects this and upgrades the local proof record.
5. **Prove** — Download the final `.ots` file. Verification is completely independent: `ots verify`, the official OTS website, or any compatible tool + a Bitcoin block explorer. The proof is valid even if Satohash never existed again.

**No trust required.** The security comes from Bitcoin's proof-of-work, not from any company or server.

---

## Platform Features (v5 ELITE)

### Core Proof
- One-click / drag-and-drop timestamping (SPA, CLI, REST API)
- Batch timestamping (hundreds of files in one Bitcoin commitment)
- Verification Shield with 3D Merkle tree visualization and path explorer
- Personal Vault with searchable history and bulk actions
- Full OpenTimestamps compatibility + portable `.ots` files

### Advanced / Institutional
- **ZK Redaction Tool** — Redact sections of a document while preserving a valid Bitcoin anchor for the unredacted hash
- **Evidence-Ready PDF Customizer** — Watermarks, variable paper sizes, judicial metadata blocks, attestation language, injected OTS proof (aids evidence presentation; admissibility remains a court's call)
- **Forensic Web Capture (Snapper)** — Screenshot any public URL + rich browser fingerprint metadata; immediately stamp the evidence package
- **Git State Notarization** — One-click anchoring of current repo state (tags, commit, tree)
- **Offline Sync Queue** — Create stamps while offline; automatically reconcile when connectivity returns
- **Real-Time Mempool Ticker** — Live fee rates and block height always visible in the signal bar
- **Global Command Palette (⌘K)** — Keyboard-first navigation everywhere

### Identity & Collaboration *(authorship upgrade — the next chapter)*
- **Nostr Signer (NIP-07)** — Passwordless cryptographic identity via browser extension (Alby, etc.)
- **Multi-Party Contract Signing** — Add co-signers by npub, collect drawn + typed seals, produce a single anchored proof package *(verified, non-repudiable signatures on the roadmap)*
- **Proof DNA / Badge Generator** — Embeddable, verifiable visual attestations for assets

### Settlement *(built & staged — switched on when the rails are real)*
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

---

## Market Opportunity

- Global notarization / legal attestation market still largely paper-era (~$5B+/yr).
- Legal tech ~$27B+ and growing double digits.
- AI provenance and deepfake defense are brand-new, exploding greenfield categories.
- Bitcoin-anchored, zero-trust, portable proofs have <1% penetration — massive first-mover + standards position.

**Primary buyers:** IP attorneys & law firms, compliance / records teams at enterprises, investigative journalists, freelance creative & dev platforms, AI research labs, government technologists exploring evidence standards.

---

## Who This Serves — The Five Lanes (2026-08-29 · for the 3-day review)

One proof layer, five serious lanes. Each is grounded in cited evidence (Rosa's `SATOHASH-FIVE-PILLAR-ADDENDUM.md`) and, where applicable, jurisdiction-specific legal posture (Lenny's `JURISDICTION-EXPLAINERS.md`). In every lane the promise is the same: **independently verifiable proof of what existed, when, unaltered — without the document ever leaving your control.** And in every lane we stay honest about what is evidence vs. what is certification.

### 1 · M&A Due-Diligence Data Rooms
The **integrity layer** for the deal room. Roughly two-thirds of M&A data breaches occur during due diligence, when confidential material moves across many systems and people — the integrity problem is quantified. Satohash anchors each document's fingerprint to Bitcoin so buyers can verify files match the seller's originals, privately (hash, not file). *Honest: we prove document integrity; the access/audit-log extension is a product build, not claimed yet.*

### 2 · Family Offices & Multi-Generational Wealth
The **longevity layer** against the "three-generation curse" (70% of families lose wealth by the second generation, 90% by the third — directional industry context). Trust instruments, wills, governance charters, property records: an `.ots` anchor proves they existed in an exact state at a date — verifiable long after the advisor firm or software vendor is gone. *Honest: these statistics are secondary/industry context, not hard fact.*

### 3 · Latin Markets (Spanish & Portuguese) — highest-value, highest-uncertainty
The **independent existence-at-a-time** layer alongside each market's regulated identity system. Across Brazil, Mexico, Argentina, Chile, Colombia, Peru, and Spain, electronic evidence is **admissible** — it cannot be rejected merely for being electronic. Identity is the regulated lane (ICP-Brasil, FEA/NOM-151, firma digital, eIDAS). Satohash *complements* these with a neutral, verifiable time/existence anchor. *Honest: admissible, not presumed accurate. We never claim ICP-Brasil, NOM-151, or eIDAS compliance. Stamp + notary is the strong pattern — Satohash for the provenance trail, notary for the final act where required.*

### 4 · Tax & Compliance
The **evidence-strengthening** layer for record retention and audit trails. Satohash proves a supporting record existed in an exact state as of a date — years after the fact, useful for reconstruction audits and "what was on file at the deadline." *Honest: it does not file returns or satisfy any jurisdiction's retention statute. Never stamp raw records with PII/TPINs to a public chain — hash only.*

### 5 · Serious Business & Enterprise
The **privacy-preserving integrity anchor** — hash on-chain, file never leaves the device. The differentiator vs document-management SaaS that stores full files. In contract disputes, "if a party claims a contract was altered, the cryptographic timestamp ends the argument." *Honest: enterprise-grade offers (SLA, white-label, custom webhooks, volume) belong to the paid tiers; we do not claim enterprise readiness we haven't shipped.*

> **One proof layer. Five serious lanes. No trust required.**

---

## Revenue Model (see FINANCIALS.md for projections)

| Tier            | Price                | Notes                                      |
|-----------------|----------------------|--------------------------------------------|
| Free            | $0                   | Free base — never paywalled trust anchor. Unlimited stamp/verify/.ots + client-side hashing, 10/day cap |
| Professional    | ~2,100 sats/mo (~$29) | Unlimited, full vault, API, PDF exports    |
| Business        | ~21,000 sats/mo (~$299) | White-label, SLA, custom webhooks, volume  |
| Pay-per-use API | 1–5 sats/stamp       | Lightning (L402) — no subscription friction |

**The reconciled model (Cam-locked, 2026-08-29):** *Free base (never paywalled trust anchor) + optional premium tiers (Professional ~2,100 sats / ~$29, Business ~21,000 sats / ~$299) + pay-per-use API (1–5 sats/stamp).* The free tier is the permanent trust anchor and is **never** paywalled. Premium tiers + L402/LND billing rails are built but **not yet switched on** — we launch paid only when channels are funded and tested. Gross margins are extremely high once past fixed infra (Bitcoin anchoring itself is effectively free via public OTS calendars).

---

## Competitive Advantages (Durable)

1. **Trustless & Portable** — Proofs verify without Satohash forever.
2. **True Zero-Knowledge** — We literally cannot see or store your documents.
3. **Bitcoin Security** — The hardest, most decentralized timestamping root in existence.
4. **Open Standard** — Any OTS verifier in the world works; no vendor lock-in.
5. **Lightning-Native Economics** — Sub-cent, sub-second settlement for volume (when live).
6. **Self-Sovereign Identity** — Nostr, not email or corporate accounts.
7. **Full Sovereign Stack** — Self-hostable, auditable F.O.S.S., multi-plane extensibility.

---

## Team & Backing

Engineered by **Give A Bit** (giveabit.io) — a Bitcoin-native studio building open-source micropayment rails, cryptographic proof systems, and decentralized legal infrastructure for the sovereign individual.

**Contact**  
Partnerships / press: hello@giveabit.io  
Technical / developer: satohash.giveabit.io/developer or the in-app API playground

---

## The Honesty Contract

This executive summary is a report, not a promise. Every claim carries its honest state:

- ✅ **Free stamps, Bitcoin+OTS anchoring, zero-knowledge hashing** — live and true today.
- ✅ **Proves "when," not "who"** — stated plainly; authorship via private-key signing is the next chapter (v3).
- ⚠️ **Independent client-side verify (zero server trust)** — on the roadmap; until it ships we say so.
- ⚠️ **Verified multi-party signing** — partial today (unverified cosign); real non-repudiation on the roadmap.
- ⚠️ **Paid tiers / Lightning billing** — built and staged; launched only when the rails are funded and tested.
- ❌ **Ethereum / cross-chain** — out of scope, forever. Bitcoin is the truth layer.
- 🛡 **Verify this yourself** — every proof carries a standing invitation to check with open tools, no account, no KYC.
- ⏱ **Freshness, not guesswork** — every fact surfaces when it was last confirmed. Honest stale beats confident wrong.

> *Mathematics on an immutable ledger beats any signature or notary stamp.*

---

*Safe Harbour · Educational & informational only · Not legal, financial, or investment advice · Part of the Give A Bit family — Bitcoin sovereignty first.*

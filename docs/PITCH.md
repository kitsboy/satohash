<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.giveabit.io · **Version:** 4.1.0-ELITE (Build 106) · **Updated:** 2026-07-18
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash: The Sovereign Provenance Mesh
### Bitcoin APPS F.O.S.S. — Engineered by Give A Bit

---

## 🏛 The Sovereign Pitch

In a digital landscape flooded with generative AI, deepfakes, and centralized gatekeepers, truth has become a premium commodity. Traditional document notarization is slow, archaic, and expensive. Centralized corporate platforms (like DocuSign or Adobe Sign) require you to surrender your privacy, storing your confidential documents on their servers under monthly subscriptions.

**Satohash** reclaims digital sovereignty. Built on the principles of **F.O.S.S. (Free and Open Source Software)**, Satohash is an API-first, Bitcoin-native provenance engine. It allows anyone—freelancers, developers, legal teams, and autonomous AI agents—to anchor immutable cryptographic proof of existence directly to the Bitcoin blockchain. 

It does this **instantly, for free, with zero account setup, and with absolute privacy.**

---

## 💎 What Makes Satohash Unique?

Satohash is not just another blockchain notary; it is the flagship sovereign notary workbench built on a multi-planar cryptographic stack:

```
  PLANE 4: ATLAS (Chain Intelligence & Block Analytics)
    ↑
  PLANE 3: SETTLEMENT (L402 / BOLT-12 Lightning Micropayments)
    ↑
  PLANE 2: IDENTITY (Nostr Cryptographic Profiles - NIP-05 & NIP-07)
    ↑
  PLANE 1: PROOF OF EXISTENCE (OpenTimestamps / Bitcoin Proof-of-Work)
```

### 1. Zero-Knowledge, Client-Side Hashing by Design
Your privacy is non-negotiable. Documents never leave your machine. Satohash computes a cryptographically secure **SHA-256 fingerprint** locally inside the browser using the Web Crypto API. Only this 64-character hash is sent to the server. Satohash cannot read, leak, or sell your documents, because it never receives them.

### 2. Built on Free, Open-Source Protocols (OpenTimestamps)
Satohash utilizes the **OpenTimestamps (OTS)** protocol. By bundling hashes and committing them through tree aggregation to Bitcoin blocks, Satohash bypasses standard Bitcoin transaction costs. This makes time-stamps permanently free for everyday users.

### 3. Portable Proofs (No Vendor Lock-In)
When you notarize a document, Satohash yields a self-contained `.ots` proof file. This file contains the complete Merkle path leading from your document's hash to a confirmed Bitcoin block. Anyone can verify this proof offline, forever, using standard open-source command-line tools. If Satohash goes offline tomorrow, your proofs remain 100% valid and globally verifiable.

### 4. Cryptographic Identity Integration (Nostr NIP-05 & NIP-07)
Instead of relying on fragile email addresses, Satohash uses the **Nostr protocol** for secure, decentralized identity. Signers authenticate via browser extensions (like Alby or Damus) using public key cryptography. Proofs are linked to verifiable Nostr profiles (`npub` / NIP-05), adding mathematical certainty to *who* created or signed the document.

### 5. Instant Micropayment Settlement (L402 & BOLT-12)
Satohash features native **L402 billing**—a brand new protocol combining HTTP status `402 Payment Required` with Lightning Network invoices. For enterprise volume or advanced API pipelines, users pay fraction-of-a-cent tolls in satoshis directly from their Lightning wallet. No monthly subscriptions, no billing accounts, no credit cards required.

---

## 🤝 The Tie to Give A Bit (https://giveabit.io)

Satohash is incubated and powered by **Give A Bit**—a Bitcoin-native development studio dedicated to building open-source micro-payment rails, cryptographic proofs, and decentralized infrastructure. 

```
  ┌─────────────────────────────────────────────────────────────┐
  │                        GIVE A BIT                           │
  │            (Parent Studio & Incubator Site)                 │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                         SATOHASH                            │
  │          (Bitcoin-Native Sovereign Notarization)            │
  └─────────────────────────────────────────────────────────────┘
```

### The Synergy:
*   **The Mission**: Give A Bit believes that Bitcoin is more than a speculative asset; it is the ultimate global trust machine and micropayment standard. Satohash is the concrete application of this belief, showing how Bitcoin's security can solve everyday legal and digital authenticity problems.
*   **The Infrastructure**: Give A Bit hosts the sovereign validation node network and primary OTS calendar mirrors that back the Satohash Protocol, ensuring high-availability routing for corporate integrations.
*   **micropayments integration**: Give A Bit's proprietary L402 and BOLT-12 API developer gateways power the billing mechanisms inside Satohash, serving as a live playground for Bitcoin micro-transactions.

---

## ⚡ Bitcoin APPS F.O.S.S. Philosophy

In the spirit of Bitcoin, **F.O.S.S.** is the only way to build true trust infrastructure:
*   **Auditable Code**: Every line of Satohash frontend and backend code is completely open-source, allowing developers and legal counsel to verify there are no hidden backdoors or privacy leaks.
*   **Self-Hostable**: Developers can clone the repository, run `npm install`, configure their own environment, and host their own private Satohash workbench locally or on a private server.
*   **Global Commons**: By utilizing free OpenTimestamps calendars, Satohash contributes to and benefits from a global shared digital commons, making proof of work accessible to all humanity.

---

## 🚀 The Premium Use Cases

*   **Legal Tech & Notaries**: Mathematically prove contract drafts existed before disputable dates, exceeding ESIGN and eIDAS compliance.
*   **Freelance IP Protection**: Hash design briefs, illustrations, or copy before delivering to clients to secure proof of creation.
*   **AI Output Attestation**: Capture and timestamp large language model outputs immediately upon generation to prove provenance and combat future copyright claims.
*   **Git Codebase Notarization**: Secure your codebase release states with one-click git tag timestamping, generating permanent build audit trails.































































---
**Diligence pack:** [docs/diligence/](./diligence/) (investor + architecture + ask)

























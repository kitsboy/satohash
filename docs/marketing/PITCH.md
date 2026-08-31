<!-- AUTO-GENERATED HEADER — do not edit manually -->
> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 271) · **Updated:** 2026-08-31
> **GitHub:** https://github.com/kitsboy/satohash · Synced by `npm run docs:sync`

# Satohash — The Sovereign Provenance Pitch

**Family pitch (2026-08-26):** Prove a file existed. Never show the file. Bitcoin as a civic notary — `.ots` receipts that outlive any company. Lives in the Give A Bit suite: https://agents.giveabit.io/#suite

**Status (August 2026):** Live at **https://satohash.io**. Version **5.0.0-ELITE**. Stamps are **free** (`REQUIRE_LIGHTNING=false`). Own pruned bitcoind is at tip. Proofs stay Bitcoin + OpenTimestamps. Paid/Lightning rails are built but **not yet switched on** — we launch them only when the rails are real (see Honesty Gates). Canonical mission: **`docs/MISSION-SCOPE-v3.md`** — *Proof of truth, on Bitcoin.*

---

## 🏛 The Sovereign Pitch

> **"We don't need you to trust us. We need you to trust math."**

Every dispute over "who did what, when" comes down to one question: can you prove your version of events without asking anyone to take your word for it? For centuries the answer was a notary, a lawyer, a registry, a company — some trusted third party who could vouch for a date.

**Satohash's founding bet is that this middleman is no longer necessary.** OpenTimestamps anchors a fingerprint of your file into the Bitcoin blockchain — permanently and verifiable, with no company standing between your document and the proof. Add a private-key signature, and "this file existed" becomes *"this file existed, and I am the one who created it"* — proof of existence upgraded to **proof of authorship**, with nobody's permission required.

**Instantly. For free. With zero account setup. And absolute privacy.**

> **Your document. Your hash. Bitcoin's permanence.**

---

## 💎 What Makes Satohash Unique

Satohash is the flagship sovereign notary workbench — a multi-planar cryptographic stack where each plane can evolve without ever invalidating the proofs beneath it:

```
  PLANE 4: ATLAS (Chain Intelligence & Block Analytics)
    ↑
  PLANE 3: SETTLEMENT (L402 / BOLT-12 Lightning Micropayments)
    ↑
  PLANE 2: IDENTITY (Nostr Cryptographic Profiles — NIP-05 & NIP-07)
    ↑
  PLANE 1: PROOF OF EXISTENCE (OpenTimestamps / Bitcoin Proof-of-Work)
```

### 1. Zero-Knowledge, Client-Side Hashing by Design
Privacy is non-negotiable. Your document **never leaves your machine**. Satohash computes a cryptographically secure SHA-256 fingerprint locally, in your browser, using the Web Crypto API. Only the 64-character hash is sent to us. We cannot read, leak, or sell your documents — **because we never receive them.**

### 2. Built on Free, Open-Source Protocols (OpenTimestamps)
Satohash uses the OpenTimestamps (OTS) protocol — the same standard the open-source world uses to prove code existed. Hashes are aggregated into a Merkle tree and committed to Bitcoin in a single transaction, which keeps timestamps **permanently free** for everyday users.

### 3. Portable Proofs — No Vendor Lock-In
Stamp a file and you receive a self-contained `.ots` proof file: the complete Merkle path from your document's hash to a confirmed Bitcoin block. Anyone can verify it, offline, forever, with standard open-source tools. **If Satohash vanished tomorrow, your proofs remain 100% valid and globally verifiable.**

### 4. Cryptographic Identity (Nostr NIP-05 & NIP-07)
Instead of fragile email addresses, Satohash uses the Nostr protocol for secure, decentralized identity. Signers authenticate via browser extensions (Alby, Damus) using public-key cryptography — adding mathematical certainty to *who* created or signed a document. *(Verified, non-repudiable signature verification is on the roadmap — the authorship upgrade — before we market it as such.)*

### 5. Lightning-Settlement-Ready (L402 & BOLT-12)
Satohash carries native L402 billing — HTTP `402 Payment Required` + Lightning Network invoices — and reusable BOLT-12 offers, for sub-cent, sub-second settlement with no subscriptions or credit cards. **Built and staged, switched on when the rails are funded and tested — we don't charge for what isn't real.**

---

## ⚡ The Honest Gap List (said out loud)

A mission that only lists strengths isn't trustworthy. Closing these gaps *is* the roadmap:

| Limit | What it means in practice |
|---|---|
| **Proves "when," not "who"** | Anyone can stamp any file. Possession of a hash isn't proof of authorship — yet. The private-key layer is the next chapter. |
| **~60-minute confirmation** | Anchoring waits for the next Bitcoin block. Not instant — by design, because block time is what makes the proof strong. |
| **Hash confidentiality has edges** | The file never leaves your device — but a hash of a short, guessable input can theoretically be reverse-matched. Fine for real documents; not a privacy shield for trivial inputs. |
| **Bitcoin-only, forever** | No multi-chain anchoring, ever. Bitcoin is the truth layer. |

---

## 🚀 Where This Goes: Proof of Authorship

Pairing an OpenTimestamps anchor with a signature from a user-held private key produces something categorically stronger: a trustless, non-custodial way to prove *"I, holding this specific key, created this specific file at this specific moment"* — verifiable by anyone, forever, without asking Satohash, a notary, or any company to vouch for it. **This single upgrade is the hinge the entire use-case map swings on.**

### The premium use cases

*   **Legal, Contracts & Disputes** — Sign and timestamp bylaws, tenant agreements, or dispute filings to lock exact execution dates and block after-the-fact tampering claims. Digital wills and estate documents with key-held proof of who signed.
*   **Creative Work, Media & IP** — Anchor design files, scripts, source code, or manuscripts to establish prior art before anything goes public. Capture devices sign and timestamp photos/video the instant they're shot — the fight against synthetic media.
*   **Civic Life & Accountability** — Timestamp civic proposals and public records so the historical record can't be quietly rewritten. Journalism and whistleblowing — prove you had the story before you published.
*   **Enterprise, Finance & Compliance** — Board resolutions and tax documentation anchored so auditors can independently confirm a ledger's state existed before a fiscal deadline. Supply-chain provenance, signed and timestamped at every handoff. Certificates and licenses that can't be rewritten.
*   **Research & Science** — Lock in trial protocols, dataset hashes, and preliminary findings before results are known — pre-registration with teeth.
*   **Infrastructure & Distributed Systems** — Signed, timestamped calls to block replay attacks; trustless event ordering without a central clock.

---

## 🏢 Five Serious Lanes (the 3-day review focus)

One proof layer. Five serious lanes. Each is grounded in cited evidence (Rosa's `SATOHASH-FIVE-PILLAR-ADDENDUM.md`) and jurisdiction-specific legal posture (Lenny's `JURISDICTION-EXPLAINERS.md`). In every lane the promise is identical: **independently verifiable proof of what existed, when, unaltered — without the document ever leaving your control.**

### 1 · M&A Due-Diligence Data Rooms
The **integrity layer** for the deal room. ~2/3 of M&A data breaches happen during diligence, when confidential material moves across many systems and people. Satohash anchors each document's fingerprint to Bitcoin so buyers verify files match the seller's originals — privately, hash not file. *Honest: we prove document integrity; the access/audit-log extension is a product build, not claimed yet.*

### 2 · Family Offices & Multi-Generational Wealth
The **longevity layer** against the "three-generation curse." An `.ots` anchor proves a trust instrument, will, or property record existed in an exact state at a date — verifiable long after the advisor firm or software vendor is gone. *Honest: wealth-transfer stats are directional industry context, not hard fact.*

### 3 · Latin Markets (Spanish & Portuguese)
The **independent existence-at-a-time** layer alongside each market's regulated identity system. Across Brazil, Mexico, Argentina, Chile, Colombia, Peru, and Spain, electronic evidence is **admissible** — never rejected merely for being electronic. Identity is the regulated lane (ICP-Brasil, FEA/NOM-151, firma digital, eIDAS); Satohash *complements* it. *Honest: admissible, not presumed accurate. We never claim ICP-Brasil, NOM-151, or eIDAS compliance.*

### 4 · Tax & Compliance
The **evidence-strengthening** layer for record retention and audit trails — proving a supporting record existed in an exact state as of a date, years after the fact. *Honest: it does not file returns or satisfy any retention statute. Hash only — never raw PII/TPINs to a public chain.*

### 5 · Serious Business & Enterprise
The **privacy-preserving integrity anchor** — hash on-chain, file never leaves the device. In a contract dispute, "if a party claims a contract was altered, the cryptographic timestamp ends the argument." *Honest: enterprise offers (SLA, white-label, custom webhooks, volume) belong to the paid tiers; we do not claim readiness we haven't shipped.*

> **One proof layer. Five serious lanes. No trust required.**

---

## 🤝 The Tie to Give A Bit

Satohash is incubated and powered by **Give A Bit** — a Bitcoin-native studio building open-source micropayment rails, cryptographic proof systems, and decentralized legal infrastructure for the sovereign individual.

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

**The Mission:** Give A Bit believes Bitcoin is the ultimate global trust machine and micropayment standard — more than a speculative asset. Satohash is that belief made useful: Bitcoin's security solving everyday legal and digital authenticity problems.

**The Infrastructure:** Give A Bit hosts the sovereign validation node network and primary OTS calendar mirrors backing the Satohash Protocol, keeping high-availability routing for integrations.

**The Rails:** Give A Bit's L402 / BOLT-12 API developer gateways power billing inside Satohash — a live playground for honest Bitcoin micro-transactions, lit up only when they're real.

---

## ⚡ Bitcoin APPS F.O.S.S. Philosophy

In the spirit of Bitcoin, F.O.S.S. is the only way to build true trust infrastructure:

*   **Auditable Code** — Every line of Satohash is open source. Developers and legal counsel can verify there are no hidden backdoors or privacy leaks.
*   **Self-Hostable** — Clone the repo, run `npm install`, and host your own private Satohash workbench locally or on your own server.
*   **Global Commons** — By using free OpenTimestamps calendars, Satohash contributes to — and benefits from — a shared digital commons where proof is accessible to all.

---

## 🏛 Government, Diplomacy & Migration Programs

Agencies modernizing registries, travel documents, or tenders need proof of *"what existed when"* — **without uploading sensitive files to a new vendor cloud.**

**Satohash public-sector posture:** hash-only evidence · batch & custody chains · air-gapped friendly · free open path today (Lightning paywall off until operators choose).

**Quiet R&D (not a launch):** Give A Bit experiments with migration helpers. **MotoPass** is a humble early pattern — client-side hashing of passport-style packets + Satohash deep-link (`/stamp?hash=…&ref=…`) so biometrics never hit the proof API. Workshop concept, not a campaign.

**Partner first steps:** free sample stamp → deep-link from portals → batch hash cutovers → executive summary + security review before procurement language.

---

## 🛡 The Honesty Contract (why you can believe this pitch)

This pitch is not a promise — it is a *report*. We show you exactly what is live, what is staged, and how to check every claim yourself:

*   **Free stamps** — live and true today. `REQUIRE_LIGHTNING=false`. Free base is the never-paywalled trust anchor (unlimited verify, 10 stamps/day).
*   **Pricing (Cam-locked 2026-08-29)** — free base + optional premium tiers (Professional ~2,100 sats/mo ~$29, Business ~21,000 sats/mo ~$299) + pay-per-use API (1–5 sats/stamp). Premium rails built but not yet switched on.
*   **Bitcoin + OTS anchoring** — live, verified, own node at tip.
*   **Zero-knowledge** — your file never leaves your device. Core promise.
*   **Proves "when," not "who"** — stated plainly; authorship is the next chapter.
*   **Portable `.ots`** — verifiable with open tools. Independent client-side verify (zero server trust) is on the roadmap — we'll say so until it ships.
*   **Verify this yourself** — on every proof: free, open tools, no account, no KYC.
*   **Freshness, not guesswork** — every claim we surface carries when it was last confirmed. Honest stale beats confident wrong.

> **We can't lose your document — we never had it. We can't fake your proof — Bitcoin keeps the receipt. And you don't have to trust us — here's how to check it yourself.**

---

*Safe Harbour · Educational & informational only · Not legal, financial, or investment advice · Bitcoin involves risk · DYOR · Not your keys, not your cheese · Part of the Give A Bit family — Bitcoin sovereignty first.*

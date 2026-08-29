# Satohash — How It Works, For Free (and the Technical Deep-Dive)

**Two-in-one page:** the plain-English "why is it free" answer *and* the full implementation-level picture of the actual OpenTimestamps flow, the calendars, and the Merkle-tree mechanics in this repo.

> **One line to carry away:** *Satohash does not put 1 million files on the Bitcoin blockchain — it folds 1 million fingerprints into one shared proof, anchored in a single Bitcoin transaction.* That is why it is free at scale and why it does not overwhelm Bitcoin.

---

## Part A — Why it's free (plain English)

### The key insight: batching is how it stays cheap

Satohash does **not** put your file on the blockchain, and it does **not** create one transaction per stamp.

1. **Your file never leaves your device.** Satohash hashes it *locally* in your browser (Web Crypto API). Only a tiny SHA-256 fingerprint — 64 hex characters — is ever transmitted. That's the zero-knowledge / content-private guarantee.

2. **The hash goes to calendars, not directly to Bitcoin.** OpenTimestamps (OTS) has an intermediate layer of independent **calendar servers** (Alice, Bob, Finney). A calendar collects many people's hashes, **merges them into one Merkle tree**, and anchors **one single hash** — the Merkle *root* — into a Bitcoin transaction.

### So does "1 million stamps" overwhelm Bitcoin?

**No — that's the whole point of OpenTimestamps.**

- **1 stamp** → shares a Bitcoin transaction with everyone who stamped in the same ~60-minute window.
- **1 million stamps** → also needs only **a handful of Bitcoin transactions** (one per calendar/block period), because all a million hashes fold into one Merkle root.

Your individual stamp is **one tiny leaf in a huge tree**. You don't pay a full transaction fee per stamp — the batch's on-chain cost is amortized across everyone in the batch.

### Do you have to pay?

- **Today: no.** Satohash runs free stamps (`REQUIRE_LIGHTNING=false`). The calendar, Satohash, and the community absorb the small Bitcoin mining fee. The proof is still real — the anchor cost is just shared.
- **A million stamps is genuinely fine** — not a million transactions, but a handful of Merkle-root anchors covering all a million. Bitcoin absorbs this trivially; that's why the design scales.

### The honest caveats

- **Free ≠ instant.** Anchoring waits for the next Bitcoin block (~60 min). The batch must close before the root is anchored.
- **Free relies on someone covering the anchor fee.** Today it's subsidized. The locked pricing model (free base + optional premium tiers) is partly about keeping anchor costs covered as volume grows.
- **You don't need the whole block** — you need the **Merkle path** from your leaf up to the anchored root. That path is what makes your proof independently verifiable later.

---

## Part B — The technical deep-dive (implementation-level)

This is the actual OTS pipeline as implemented in the Satohash repo. Source: `docs/OTS-DEEP-LEARN.md`, `docs/OTS_SETUP.md`, `ARCHITECTURE.md`.

### The six-step OpenTimestamps protocol

**1. Hash — calculate the data file hash (client-side, no internet)**
SHA-256 of the document, computed locally in the browser. The document never leaves the device — only the 64-hex hash is transmitted.

```javascript
const hashBuffer = await crypto.subtle.digest('SHA-256', fileBytes);
const hashHex = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0')).join('');
// Only hashHex is sent to the server
```

**2. Submit — send the hash to one or more OTS calendar servers**
The calendar adds the hash to a Merkle tree with other submitted hashes and returns a **pending receipt** (`.ots` binary). *This is not yet proof.* The three calendars Satohash uses:

```javascript
const calendarUrls = [
  'https://alice.btc.calendar.opentimestamps.org',
  'https://bob.btc.calendar.opentimestamps.org',
  'https://finney.calendar.eternitywall.com'
];
await OpenTimestamps.stamp(detached, calendarUrls);
```

**Key insight — calendar aggregation:** To avoid one Bitcoin transaction per hash, calendars use a **Merkle tree to aggregate thousands of hashes**. Only the Merkle root is submitted to Bitcoin. This is what makes the per-document cost effectively zero — and what makes "1 million stamps" safe.

**3. Load — load the `.ots` receipt/proof from file (no internet)**
The `.ots` file is a **portable, self-contained artifact** — the complete chain of cryptographic operations linking your hash to a Bitcoin block header. Shareable, storable, verifiable with standard open tools.

**4. Info — display the receipt/proof info (no internet)**
Inspect what's inside: the committed hash, linked Bitcoin block header(s), which calendars contributed, and the operations applied (SHA-256, prepend, append, etc.).

**5. Upgrade — turn a receipt into a proof (internet)**
Ask the calendars for the Bitcoin attestation. When a block confirms the calendar's transaction, the path to that block header is appended to the `.ots` file.

> **This is the critical transition:** a *receipt* (pending) has the hash committed but no Bitcoin attestation; a *proof* (confirmed) has the full path to a Bitcoin block header — **verifiable forever, calendar-independent**. Once upgraded, you never need to contact a calendar again.

Satohash's upgrade daemon polls every 60 seconds and flips pending → confirmed:

```javascript
setInterval(upgradeProofs, 60_000);  // polls calendars, marks confirmed, broadcasts via Socket.io
```

**6. Verify — check the proof traces to a real Bitcoin block (trustless)**
Any of these, with no account, no API key, no trust in Satohash:

```bash
# Python reference CLI
ots verify mydocument.pdf.ots -f mydocument.pdf

# JavaScript CLI
ots-cli.js verify mydocument.pdf.ots mydocument.pdf

# Bitcoin Core node — most trustless
bitcoin-cli getblockheader <block-hash>
```

Successful output looks like:
```
Success! Bitcoin block 840123 attests existence as of 2024-04-20 UTC
```

### The full architecture (mental model)

```
Document → SHA-256 hash
                  ↓
        Calendar Servers (Merkle aggregation of 1000s of hashes)
                  ↓
        Bitcoin OP_RETURN transaction (one per batch)
                  ↓
        Bitcoin block confirmation (~10 min avg)
                  ↓
        Upgrade daemon polls → path to block header
                  ↓
        .ots proof is now self-verifying, calendar-independent
```

```
┌──────────┐  SHA-256  ┌──────────┐  hash   ┌──────────────┐
│ Document │ ─────────→ │ Browser  │ ──────→ │  Calendar(s) │
└──────────┘ (client)   │ (privacy)│         └──────┬───────┘
                        └──────────┘                │ Merkle root
                                                     ↓
┌──────────┐  verify   ┌──────────┐  .ots proof ┌──────────────┐
│  Human   │ ←──────── │ Satohash │ ←───────── │   Bitcoin    │
│ Forever  │ (trustless)│   UI    │            │  Blockchain  │
└──────────┘           └──────────┘            └──────────────┘
```

### What the Merkle path means for your proof

You hold your `.ots` file containing the path from *your leaf* → up the tree → to the *anchored root*. Because the root is in a confirmed Bitcoin block, anyone can re-derive the root from your leaf and check it against the chain — **with zero dependency on Satohash, any calendar, or any company.** If Satohash vanished tomorrow, every proof already upgraded stays 100% valid and globally verifiable. That is the sovereignty guarantee.

---

## A note on the road ahead (honest)

- **Independent client-side verify** (zero server trust) is on the roadmap — until it ships, we say so.
- **The private-key "proof of authorship" layer** is the next chapter; today OTS proves *existence/integrity/time*, not *who*. We don't claim authorship until the signature is bound into the anchored hash.
- **The batch-stamping, data-room, and audit-trail extensions** are product builds, not current behavior. We don't claim what isn't shipped.

*Part of the Give A Bit family — Bitcoin sovereignty first. Educational & informational only. Safe Harbour.*

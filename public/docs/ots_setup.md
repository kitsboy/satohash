# OpenTimestamps Calendar Setup

## What is OpenTimestamps?

OpenTimestamps (OTS) is an open-source protocol for creating Bitcoin-anchored timestamps. It was invented by Peter Todd and has been operating since 2016.

The core idea is simple: take the SHA-256 hash of any document, bundle it with thousands of other hashes using a Merkle tree, and embed a single commitment into the Bitcoin blockchain. Because Bitcoin's proof-of-work is globally agreed upon and tamper-resistant, you can later prove that your specific document existed **before** a particular Bitcoin block was mined — without needing a trusted third party.

A `.ots` file is the portable proof artifact. It is a compact binary that encodes:
- The cryptographic operations linking your hash to the Bitcoin block header
- The Bitcoin block height and timestamp where it was confirmed

Anyone who holds the original document and its `.ots` proof can verify independently, using only a Bitcoin node or a public block explorer — no Satohash account needed, forever.

---

## Free Public Calendars Used by Satohash

OTS calendars are the servers that collect hashes, aggregate them into Merkle trees, and submit commitments to Bitcoin miners. Satohash submits to **three independent public calendars simultaneously**. Using multiple calendars provides redundancy — if one is briefly offline, the others still anchor your proof.

| Name | URL | Operator |
|------|-----|----------|
| **alice** | https://alice.btc.calendar.opentimestamps.org | OpenTimestamps Project |
| **bob** | https://bob.btc.calendar.opentimestamps.org | OpenTimestamps Project |
| **finney** | https://finney.calendar.eternitywall.com | Eternity Wall |

**Key points:**
- All three are **completely free** to use
- No account, API key, or email address required
- Operated as community infrastructure for the Bitcoin ecosystem
- Uptime monitored at https://uptime.opentimestamps.net

---

## How Satohash Uses OTS

Here is the full end-to-end flow when you timestamp a document through Satohash:

### Step 1 — Hash (client-side)
Your browser computes the SHA-256 hash of your document using the Web Crypto API. The document itself **never leaves your device**. Only the 64-character hex hash string is sent to the server.

### Step 2 — Stamp (server-side)
Satohash's Express server receives the hash and calls the `opentimestamps` npm library:

```javascript
const calendarUrls = [
  'https://alice.btc.calendar.opentimestamps.org',
  'https://bob.btc.calendar.opentimestamps.org',
  'https://finney.calendar.eternitywall.com'
];
await OpenTimestamps.stamp(detached, calendarUrls);
```

Each calendar responds with a partial proof, which the library bundles into a single `.ots` binary. The status at this point is `pending`.

### Step 3 — Calendar aggregation
Each calendar aggregates submissions from many clients every few minutes, computes a Merkle root, and submits that single commitment to Bitcoin miners in an `OP_RETURN` transaction.

### Step 4 — Bitcoin confirmation (~10 minutes)
The next Bitcoin block mined after the calendar's submission permanently seals the commitment. The median Bitcoin block time is ~10 minutes.

### Step 5 — Upgrade (daemon-side)
Satohash runs a background upgrade daemon that periodically polls the OTS calendars for new Bitcoin attestations. When a block confirmation arrives, the daemon upgrades the stored `.ots` binary from `pending` to `confirmed` and records `bitcoin_block_height`. The `ots:stamped` Socket.io event is broadcast to connected clients.

### Step 6 — Verify
At any future time, you can upload the original document and its `.ots` file to Satohash's verify endpoint, or use any other OTS-compatible tool. Verification requires only a connection to a Bitcoin node (or public API).

---

## No Costs Required

The OTS calendars are **donation-funded public infrastructure**. Satohash does not pay per-timestamp fees to the calendars. Users of the free Satohash tier are not charged for timestamping.

The only cost in the system is the Bitcoin transaction fee paid by the calendar operators when they submit their aggregated Merkle root to a miner — and this cost is shared across every hash submitted to that calendar during that aggregation window, making the per-document cost effectively zero.

If you find OTS useful, consider donating to the project at https://opentimestamps.org.

---

## Verifying a Proof Independently

You never need to trust Satohash to verify a proof. The `.ots` format is an open standard.

### Using the Python CLI (official reference implementation)
```bash
pip install opentimestamps-client

# Verify a .ots file against the original document
ots verify mydocument.pdf.ots -f mydocument.pdf

# Upgrade a pending proof (fetches latest Bitcoin attestation)
ots upgrade mydocument.pdf.ots
```

### Using the JavaScript CLI
```bash
npm install -g javascript-opentimestamps

ots-cli.js verify mydocument.pdf.ots mydocument.pdf
```

### Using the web tool
Visit https://opentimestamps.org — click "Stamp & Verify", upload your original document and its `.ots` file, and the site will verify against the Bitcoin blockchain.

### What a successful verification looks like
```
Assuming target filename is 'mydocument.pdf'
Success! Bitcoin block 840123 attests existence as of 2024-04-20 UTC
```

The block number and timestamp are independently checkable against any Bitcoin block explorer (e.g. https://mempool.space/block/840123).

---

## Calendar Uptime

Calendar availability is publicly monitored at:

**https://uptime.opentimestamps.net**

This dashboard shows real-time and historical uptime for all major OTS calendars. Because Satohash submits to three calendars simultaneously, a brief outage at any single calendar does not affect your proof — the other two will still anchor it.

---

## Further Reading

- [OpenTimestamps specification](https://opentimestamps.org/)
- [Peter Todd's original blog post](https://petertodd.org/2016/opentimestamps-announcement)
- [opentimestamps npm package](https://www.npmjs.com/package/javascript-opentimestamps)
- [OTS Python client](https://github.com/opentimestamps/opentimestamps-client)

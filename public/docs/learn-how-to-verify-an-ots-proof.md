# How to Verify an .ots Proof

You've been handed a `.ots` file (or you made one). How do you check that it's real? Here's every way, from easiest to most independent.

## What you need

- The **`.ots` proof file**
- The **original document** it was stamped from (or its SHA-256 hash)
- (Optional) A copy of the Satohash proof card link `/p/<hash>`

## Method 1: Satohash verify page (easiest)

1. Go to [satohash.io/verify](https://satohash.io/verify)
2. Upload the `.ots` file (and optionally the original document or paste the hash)
3. Satohash checks the structure and the Bitcoin anchor, then tells you in plain language: **Success** (anchored on Bitcoin, with the block height), **Pending** (valid but not yet on-chain — normal for fresh stamps), or **Failed** (something's wrong)

## Method 2: Your public proof card

If the stamp was made through Satohash, visit `satohash.io/p/<your-64-char-hash>`. This card works even with JavaScript disabled — it's served directly from the edge.

## Method 3: opentimestamps.org (independent)

1. Go to [opentimestamps.org](https://opentimestamps.org)
2. Click **Verify**, upload the `.ots` file and the original document
3. The site fetches the Bitcoin block headers and confirms the anchor — completely independent of Satohash

## Method 4: Command line (most independent)

Install the OTS client (`pip install opentimestamps-client` or `npm` equivalents), then:

```bash
ots upgrade proof.ots          # pull the latest calendar attestations
ots verify proof.ots -f original.pdf
```

With a local Bitcoin node you can verify fully offline:

```bash
ots verify proof.ots -f original.pdf --bitcoin-node 127.0.0.1:8332
```

## Reading the result

| Result | Meaning |
|--------|---------|
| **Success / Bitcoin block #N** | Your fingerprint is permanently anchored — anyone can re-verify forever |
| **Pending** | The calendar holds your hash but no Bitcoin block has included it *yet*. Wait for blocks, upgrade, verify again. This is normal for stamps under ~60 minutes old. |
| **Failed / invalid** | The file isn't a valid OTS proof, or the hash doesn't match the document — check you have the right file pair |

## Why this matters

The beauty of OpenTimestamps: **the proof doesn't depend on Satohash**. The `.ots` file plus a Bitcoin node (or any block explorer) is enough — forever. That's the difference between a receipt you trust a company for, and a receipt the whole world can check.

---

*Verify your proof now: [satohash.io/verify](https://satohash.io/verify)*

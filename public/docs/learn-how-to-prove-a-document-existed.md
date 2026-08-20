# How to Prove a Document Existed at a Certain Time

Whether it's a contract dispute, a copyright claim, an invention idea, or a receipt, "prove it existed before this date" comes up more often than you'd think. Here's how to do it with Bitcoin.

## The 3-step method

### 1. Stamp it now

Go to [satohash.io/stamp](https://satohash.io/stamp), drop your file in, and click stamp. Satohash hashes the file in your browser (the file never leaves your device) and anchors the fingerprint to Bitcoin via OpenTimestamps. It's free, no account needed.

### 2. Keep the proof package

You get two things to keep together:

- **Your original file** — unchanged, on your device.
- **The `.ots` proof file** — the timestamp receipt.

Store them together (same folder, a USB stick, encrypted cloud, or print the certificate). The proof is useless without its matching file, and the file is "undated" without the proof.

### 3. Verify anytime, anywhere

Anyone — you, a judge, an opposing lawyer — can verify the proof:

- **Easily:** open your proof card at `satohash.io/p/<your-hash>` or use the interactive verify page.
- **Independently:** upload the `.ots` file to opentimestamps.org, or verify locally with the free `ots` command-line tool against a Bitcoin node. Satohash doesn't need to exist for this to work — the proof is self-contained.

## What the proof shows

When verified, the proof reveals the **Bitcoin block** your fingerprint was anchored in — a specific block number with a specific timestamp. Because Bitcoin blocks are chained cryptographically and globally agreed upon, that block's time is effectively undeniable proof that your document existed before it was mined.

## Real-world uses

| Scenario | How stamping helps |
|----------|-------------------|
| **Contract dispute** | Prove the terms existed before the dispute date |
| **Copyright / creative work** | Timestamp before publishing — priority of creation is provable |
| **Inventor's notebook** | Date-stamp each idea; cheap and timestamped |
| **Research / IP** | Prove discovery dates with mathematical certainty |
| **Compliance** | Board resolutions, audit trails, policy versions |
| **Personal records** | Wills, receipts, photos — "this is what I had on this date" |

## Common mistakes to avoid

- ❌ Losing the `.ots` file — without it there's no proof
- ❌ Editing the file after stamping — the hash won't match anymore (stamp the *new* version too)
- ❌ Keeping only a screenshot — keep the original bytes and the `.ots`
- ❌ Not timestamping early enough — stamp at the moment of creation, not after a dispute begins

---

*Stamp your first document free: [satohash.io/stamp](https://satohash.io/stamp)*

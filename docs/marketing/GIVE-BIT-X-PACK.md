# Give A Bit — X pack (paste-ready)

**Account:** **@give_bit** (never @satohash)  
**Pin URL:** https://satohash.io/watch  
**Player card:** `/watch-player.html` (X must unfurl `twitter:card=player`)  
**Voice:** lawyer who understands Bitcoin, who refuses to oversell. No hype, no “revolutionary”, name Bitcoin (not “the blockchain”).  
**Honesty:** free stamps today; file never leaves the device; proves *when*, not *who*; pending ≠ confirmed.

Cam posts. Do not invent a DSN, nsec, or stamp counts.

After the pin: paste https://satohash.io/watch into https://cards-dev.twitter.com and confirm **player** (not large image). Then `node scripts/cards-validate.mjs`.

---

## 1. Pin `/watch` (Cam-gated)

Paste as the pinned post. Attach nothing extra — the player card is the media.

```
84 seconds. Your file never leaves the device.

Hash on the device. Receipt on Bitcoin. Free proof of existence.

https://satohash.io/watch
```

Alt (one paragraph, same facts):

```
84 seconds. File never leaves the device. Free Bitcoin proof of existence.

https://satohash.io/watch
```

Checklist after pin:

- [ ] Posted from **@give_bit**
- [ ] URL is exactly `https://satohash.io/watch`
- [ ] cards-dev.twitter.com shows **player** (`/watch-player.html`)
- [ ] `node scripts/cards-validate.mjs` passes `/watch`

---

## 2. Three learn-article tweets

Post as three standalone tweets (not a thread). Each URL is JPEG OG.

### A — What is OpenTimestamps

```
OpenTimestamps is a fingerprint in Bitcoin’s public book — not your file.

SHA-256 on the device. One commitment in a block. A .ots receipt you can keep.

https://satohash.io/docs/learn-what-is-opentimestamps
```

### B — How to prove a document existed

```
Emailing yourself is not proof. A screenshot of a clock is not proof.

Stamp the fingerprint. Keep the file + the .ots together. Verify later with open tools.

https://satohash.io/docs/learn-how-to-prove-a-document-existed
```

### C — How to verify an .ots proof

```
Don’t take our word for it.

Upload the .ots on satohash.io/verify, open the public proof card, or check it on opentimestamps.org.

Pending is not confirmed. Green means a Bitcoin block has the attestation.

https://satohash.io/docs/learn-how-to-verify-an-ots-proof
```

---

## 3. Evergreen thread (pin-adjacent, not dated)

Post as a thread from **@give_bit**. No stamp counts. No paid-plan pitch. No authorship claim.

**1/7**

```
Prove a file existed. Never show the file.

Bitcoin keeps the receipt.

https://satohash.io
```

**2/7**

```
Your document never leaves the device.

Satohash hashes it in the browser. Only a SHA-256 fingerprint is submitted. We cannot read it, leak it, or lose it — we never had it.
```

**3/7**

```
That fingerprint is aggregated by OpenTimestamps calendars and anchored in a Bitcoin block.

Typically the next block (~60 minutes). That’s the price of strength, not a bug.
```

**4/7**

```
What it proves: this exact file existed as of that block.

What it does not prove: who made it, that the contents are true, or that a court must treat it as a notarial act.

Pending = submitted. Confirmed = in a Bitcoin block.
```

**5/7**

```
The receipt is a portable .ots file. Keep it next to the original.

Verify on satohash.io/verify, or with the open ots tools and a Bitcoin node. No account. No KYC.
```

**6/7**

```
Stamping is free today. Chain is Bitcoin only. Always.

No multi-chain. No “trust our servers.” You can check the math.
```

**7/7**

```
84 seconds, then try it.

Watch: https://satohash.io/watch
Stamp: https://satohash.io/stamp
```

---

## 4. Optional one-liners (replies / quote-tweets)

Use when someone asks “is this a notary?” / “do you store the file?”

```
Not a notary commission. Proof of existence-at-a-time on Bitcoin via OpenTimestamps. Admissible as evidence is a judge’s call — we don’t claim presumption.
```

```
The file stays on your device. Only the hash travels. That’s the product.
```

```
We’d rather show you old truth than new lies. Pending is not confirmed.
```

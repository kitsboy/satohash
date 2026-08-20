# What is OpenTimestamps?

OpenTimestamps (OTS) is a free, open-source protocol that anchors a cryptographic fingerprint of any file into the Bitcoin blockchain. It was created by Peter Todd and has been running since 2016.

## The idea in plain words

Imagine a public notary book that anyone on Earth can look at, that nobody can rewrite, and that has been running non-stop since 2009. Bitcoin is that book. OpenTimestamps is the stamp you put on your page of it.

Here's the trick: you don't put your actual document into Bitcoin (that would be huge and public). Instead, you put a **fingerprint** of it — a 64-character code called a SHA-256 hash. If even one letter of your document changes, the fingerprint changes completely. So the fingerprint proves the document is exactly what it was on the day it was stamped.

## How it works, step by step

1. **Hash** — Your document is converted into a SHA-256 fingerprint, right on your device.
2. **Aggregate** — The fingerprint is bundled with thousands of other people's fingerprints into a Merkle tree (a fancy way of saying "one code that represents all of them").
3. **Anchor** — A single tiny commitment goes into the next Bitcoin block. Now your document's existence is provable as of that block.
4. **Prove** — Anyone can later verify the proof using just the document and the `.ots` file. No account, no server, no permission needed.

## Why it matters

- **No trust required** — you don't have to trust Satohash, a notary, or any company. The proof is math, anchored in a network of thousands of independent nodes.
- **It's permanent** — Bitcoin has never been rewritten in its history.
- **It's private** — your document never leaves your device. Only the fingerprint travels.

## The `.ots` file

The `.ots` file is your portable receipt. Keep it next to your document. It contains everything needed to re-verify the proof later — even decades from now, even if Satohash no longer exists.

---

*Want to try it? Stamp any file free at [satohash.io/stamp](https://satohash.io/stamp).*

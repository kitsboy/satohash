# Timestamping Photos & Video — Proving What You Had, When

Photos and videos are the easiest things to edit and the hardest to argue about later. A Bitcoin timestamp turns "I think I had this photo then" into "here's the block."

## Why stamp media?

- **Copyright / theft** — prove you shot the photo before someone else published it.
- **Insurance & claims** — timestamp damage photos, receipts, and condition reports on the spot.
- **Journalism & evidence** — prove a video existed before publication, unchanged.
- **Creative releases** — prove a design or render existed before a client deadline.
- **Personal records** — family photos, property, anything where "when" matters.

## How it works for media

1. **Stamp the original file** (the raw .jpg/.mp4, not a screenshot of it). The hash is over the exact bytes — so the original, unedited file is what gets protected.
2. **Keep the original untouched** — any re-encode, resize, or re-save changes the bytes and breaks the match.
3. **Verify later** — upload the original + `.ots` to satohash.io/verify or opentimestamps.org. If it confirms, those exact bytes existed before the block.

## Practical tips

| Situation | Approach |
|-----------|----------|
| **On the spot** | Stamp immediately after shooting — a phone with a decent connection is enough (hashing is local). |
| **Phone photos** | Note: HEIC vs JPEG matters — stamp the exact file you'd present as evidence. |
| **Video** | Large files are fine — only the hash travels. |
| **Screenshots vs originals** | Always stamp the original file, not a screenshot of it. |
| **Batches** | Stamp a folder of photos at once with the batch tool. |

## The honest caveats

- The timestamp proves **those bytes existed** — it doesn't prove where they came from or who took them (EXIF metadata + device records help there).
- Editing a photo **after** stamping breaks the proof for the edited version — stamp again after edits if the edited version matters.
- For maximum strength: stamp immediately, keep the original file byte-identical, and keep the `.ots` file safely (it's the key to verification).

---

*Stamp your photos before you share them: [satohash.io/stamp](https://satohash.io/stamp)*

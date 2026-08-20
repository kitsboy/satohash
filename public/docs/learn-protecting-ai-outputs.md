# Protecting AI Outputs with Bitcoin Timestamps

AI tools (ChatGPT, Claude, Midjourney, DALL-E, Sora…) generate text, images, and video at scale. That raises a real problem: **proving when a piece of AI output was created** — and proving you didn't edit it later.

## Why timestamp AI output?

| Scenario | Why it matters |
|----------|----------------|
| **AI-assisted art** | Prove your image existed before someone copied it |
| **Prompts & models** | Document your prompt engineering lineage |
| **AI-written drafts** | Prove a draft existed before an accusation of plagiarism |
| **Generated content contracts** | Prove delivery date of AI-produced deliverables |
| **Research** | Prove an AI analysis was generated on a specific date |

The core issue is the same as any digital file: bytes can be edited silently. A SHA-256 hash + Bitcoin timestamp fixes the *"what existed when"* question permanently.

## The workflow

1. **Export** your AI output as a file (image, PDF, text, JSON — whatever format matters).
2. **Stamp it** at [satohash.io/stamp](https://satohash.io/stamp) — hashed locally, anchored to Bitcoin in ~60 minutes.
3. **Keep the pair** — the original file + its `.ots` proof.
4. **Re-verify anytime** with the proof card (`/p/<hash>`) or independently on opentimestamps.org.

## Best practices for AI work

- **Stamp at the moment of creation**, not when a dispute starts. A timestamp only proves existence *before* the block — stamp early.
- **Include metadata** — if the model/version matters, save it in a sidecar file and stamp *that too*, or embed it in a manifest you stamp.
- **Stamp intermediate versions** — if you iterate on a design, stamp each milestone. Cheap, and it builds an undeniable history.
- **Batch it** — stamp many outputs at once with the batch tool; one Bitcoin anchor covers them all.

## The privacy angle

Your AI outputs never leave your device — Satohash only sees the fingerprint. That matters if your prompts or outputs are commercially sensitive.

## The honest limits

- Timestamping proves **existence at a time**, not *authorship*. For AI work, pair it with your authorship records (signed prompts, project files).
- It can't prove *which* AI model made it — that's provenance, a different problem.
- Timestamps are strongest as *evidence*, not automatic legal victory — but they're exactly the kind of mathematical proof courts increasingly expect.

---

*Stamp your AI output before you publish: [satohash.io/stamp](https://satohash.io/stamp)*

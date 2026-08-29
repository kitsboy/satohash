# Satohash — E0 "The Founding Idea" · DESIGN.md

**Episode:** E0 — *Proof of truth, on Bitcoin* (the founding idea)
**Series title:** *Proof of Truth, on Bitcoin*
**Format:** 16:9 · 1920×1080 · 30fps · ~90s
**Pipeline:** HyperFrames HTML → MP4 · Kokoro VO · whisper word-level captions · ffmpeg encode

## Brand identity — Glacier Jewel / Institutional Noir
Satohash is a Bitcoin-native sovereign notary: severe, elegant, trustworthy. A premium financial terminal — never a crypto casino, never an admin template. Warmth comes from honesty, not decoration.

| Token | Hex | Use |
|-------|-----|-----|
| Glacier deep | `#0e1c2a` | Base background (deep glacier teal-navy gradient, never flat) |
| Elite parchment | `#f6f1e8` | Light alt surfaces / contrast scenes |
| Jewel sky | `#38bdf8` | Satohash identity · interactive · info · pipes |
| Jewel gold | `#f0b429` | **Bitcoin** CTA · block height · primary accent |
| Jewel cyan | `#22d3ee` | Electric secondary (settlement / anchors) |
| Jewel violet | `#8b5cf6` | Identity / authorship (the "next chapter" accent) |
| Jewel ice | `#d4f0f8` | Glacier ink tint |
| Confirm green | `#34d399` | Verified / confirmed proofs |
| Pending gold | `#f0b429` | Pending anchor |
| Paper | `#f6f1e8` | Text on dark, warm (never pure white) |

## Typography
- Headlines: **Space Grotesk** (600–700), 56–96px
- Body / labels: **Plus Jakarta Sans** (400–600), 30–44px
- Hashes / hashes path / step numbers: **JetBrains Mono** (400–600), 28–40px
- Google Fonts `@import` in EVERY composition file (scenes, captions, overlays).

## Motion character
- Calm, cinematic, restrained authority. Soft 0.55–0.7s crossfade transitions between scenes.
- Entrances only via `gsap.from({opacity, y})` — no letterSpacing tweens, no `transform:translate(-50%,-50%)` on a GSAP-tweened element (center via parent flexbox).
- Pop-in via `back.out(2)` for verified chips, block heights, keys.
- No `repeat:-1`, no `Math.random()`. Finite repeats only. Timelines registered `window.__timelines` paused.

## Scenes (8 beats · sum ≈ 90s)
1. **hook** (0–7) — "We can't read it. We can't lose it. We never had it." Dark glacier, three phrases strike, document + key icon.
2. **question** (7–18) — "That's the honest line at the heart of Satohash. Every dispute over who did what, and when, comes down to one question…" — a big "?", document + key.
3. **notary** (18–28) — "For centuries the answer was a notary, a lawyer, a registry — some trusted third party to vouch for a date." Registry stamps / seal motif, slightly dimmed (the old way).
4. **founding-bet** (28–42) — "Satohash is the founding bet that this middleman is no longer necessary. OpenTimestamps anchors a fingerprint of your file into the Bitcoin blockchain…" — hash → chain → block. Gold/cyan.
5. **never-leaves** (42–54) — "Your file never leaves your device. Only a hash touches the chain. Once it's in a block, that timestamp can't be altered, backdated, or quietly removed. Not by Satohash. Not by anyone." Device → hash → chain; red "altered/backdated/removed" ×.
6. **honest-gap** (54–66) — "What we prove today is when a file existed — not who made it. Authorship is the next chapter. And your proof is portable: it outlives Satohash itself…" Honest gap card + violet authorship hook.
7. **verify** (66–78) — "Don't take our word for it. Verify this yourself. Free, open tools. No account. No KYC." Proof badge / verify CTA + freshness ring.
8. **endcard** (78–91) — "Satohash. Proof of truth, on Bitcoin." Title card + gold Bitcoin seal + series tagline + safe-harbour fine print.

## Honesty / accuracy gates (non-negotiable)
- Opens with the honest line; **never overclaims**. "Admissible, not presumed accurate."
- Bitcoin-only. No Ethereum, no cross-chain.
- "Proves when, not who" — authorship explicitly framed as **next chapter, not shipped**.
- Proof is portable & OTS-verifiable — may say "portable," must NOT say "independent of our server" (Phase 3 not shipped).
- Free base (never paywalled trust anchor) — the free today message is TRUE.
- Every episode closes with the standing invitation: verify this yourself, free open tools, no account, no KYC.
- No invented entity. No invented legal numbers. No notarial status claim.
- Safe-harbour fine print on the endcard.

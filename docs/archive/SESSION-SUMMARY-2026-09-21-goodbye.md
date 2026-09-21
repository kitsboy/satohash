# Session summary — 2026-09-21 goodbye

**Chat topic:** Satohash honesty wave: Bitcoin-checked verify, optional who, quieter gold, then docs/goodbye.

## What we finished

- HowProofWorks on `/verify`, `/p/<hash>` (SPA + zero-JS Function), `/stamp/done`; strings in all 7 locales
- Optional NIP-07 “who” chip — only after the binding verifies in the browser; not a legal name
- Batch verify, v5 demos, verification shield use `POST /api/verify` (registry hit is not proof)
- Pending stamps poll until Bitcoin confirms; hero shows block height; How starts closed
- Quieter stamp (Also prove who / email behind a tap; Waiting-on-Bitcoin chip)
- Proof card: gold Verify + Copy; rest in More (zero-JS uses `<details>`)
- `/verify`: no fake Merkle; facts only; compact gold Verify; ELI-5 hides after a verdict; PDF matches confirmed/pending/not proven
- Landing: Stamp is the gold button; Watch is text; play disc is the only gold on the player
- Stamp-done: one gold View proof; QR off until asked; verify-yourself in More
- Kimi API rebuild **confirmed** live `gitSha` **`21476f8`** (`authored` on by-hash when authored-v1 exists)
- MotoPass: `useProgramsContext` no longer throws (`4198afc`)

## Still aiming to finish

1. TadBuy (other repo): stop calling dead same-origin `/api/*` on the static Pages demo
2. Cam: pin `/watch` on **@give_bit**; physical iPhone `/p/<hash>` unfurl
3. Optional: npm-publish `packages/satohash-cli` only if Cam asks
4. Do **not:** rebuild API for copy; flip paywall; add Arabic; sell Snapper/ZK/BOLT-12 as live; Tailscale notes to M4

## Update / status

SPA `dccbc36` on `main`. API live **`21476f8`**. Free stamps. Paywall off. Pages = Grok. Vault = **THOR** Obsidian, not M4.

## Key decisions

- `POST /api/verify` is the only client path that may say confirmed
- Optional who never upgrades a failed signature
- One gold object per screen where we can
- Kimi’s first “four cards / CI” note was a **different** job; the API rebuild later landed at `21476f8`

## Mission tie-in

Strangers can stamp a file, get a Bitcoin receipt, and check it without trusting Satohash. Who is optional and honest. Give A Bit family widgets still stamp.

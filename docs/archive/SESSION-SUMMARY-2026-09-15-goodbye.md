# Session Summary — 2026-09-15 (goodbye)

**Chat Topic:** Marketable MVP honesty, i18n, camera QR, family widgets, and Kimi live stamps.

**Pickup:** `.ai_docs/current-status.md` · `docs/handoff-log.md` · `docs/KIMI-HANDOFF.md` · `/whatsup`

## What the whole chat was about

Make Satohash tell the truth as a live Bitcoin proof-of-existence product, finish the seven-locale public surfaces, make PDFs/email scannable, get family widgets to actually stamp, and leave a clean next-LLM list.

## What we finished

- Honest docs vs cathedral (README, MVP, pitch, exec, diligence).
- i18n: About, Pitch, Network, Explorer/Atlas **demos**, Identity (when not who), Developer, exec summary, batch verify, Trust leftovers, distressed-asset, `/nodes` calendar ping, templates catalog (25 templates, field labels), slice C chrome.
- Template **Stamp this draft** hashes on-device → `/stamp`. PDF is a draft, not a notary act.
- Camera QR → `https://satohash.io/p/{hash}` (phones cannot read `.ots`).
- Proof card: **Not stamped yet** vs **Pending** vs **Confirmed** + `.ots` download.
- Stamp-done polls; Pending→Confirmed **browser notify + toast**.
- Family widget default **POST** `/api/stamp` with `X-Satohash-Client`.
- Kimi 2026-09-15: live stamps on five family sites. HQ was **not** zeros. Giveabit widget = **`/tools`**. API **`6c1be90`**, not rebuilt.

## What we are still aiming to finish

See **Next for the next LLM** in `.ai_docs/current-status.md` and `docs/roadmap.md`. Short list:

1. Proof of **who** (NIP-07 authorship) — next product chapter.
2. Family-owner bugs: TadBuy `/api` 404s; MotoPass ErrorBoundary (not Satohash API).
3. Cam: pin `/watch` on `@give_bit`; iPhone `/p/` unfurl.
4. Optional: npm `@satohash/cli` (Cam-gated). Snapper stays scaffold. Offers deferred. No Arabic. No paywall. **Do not rebuild API.**

## Update / Status

Core MVP is **live**: stranger stamps, downloads `.ots`, verifies, shares `/p/<hash>`. Free stamps. Own bitcoind at tip. Family widgets work on live hosts. Localization of the product loop + public marketing + template catalog is largely done; leftover English is demo names and obscure cathedral pages.

## Key decisions

- Prove **when**, not **who**, until authorship ships.
- Pending ≠ Confirmed (~60 min Bitcoin block).
- Camera QR is HTTPS proof card, never `.ots`.
- Git paste ≠ HQ attribution; live POST with `X-Satohash-Client` is.
- Pages = Grok. API = Kimi/THOR. Vault = THOR Obsidian, **not M4**. Do not Tailscale notes to M4.

## Mission tie-in

Give A Bit: hash on the device, receipt on Bitcoin, no company in the middle. Family sites now have a real stamp path.

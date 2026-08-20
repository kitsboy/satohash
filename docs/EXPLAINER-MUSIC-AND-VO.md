# Explainer: music + voiceover

## Live on `/watch` (2026-08-20)

| Spec | Value |
|------|--------|
| Primary | `public/media/video/satohash-explainer-with-vo2.mp4` |
| Length | **~83.7 s** |
| Format | H.264 **1920×1080** + AAC stereo · ~11 MB |
| Voice | HeyGen **Pippa** (young English woman as Kimi) · verbatim production script |
| Music | Instrumental dance bed, no vocals, mixed **~15%** under VO |
| Player | Native `<video>` on `/watch` · Full cut default |
| Teaser | `satohash-explainer-with-vo.mp4` (~10.0 s) — still on `/watch` as Short |
| CTA copy | “Watch explainer” on landing / about (not “10s”) |
| Close | Small **Satohash hash** (gold stacked stamp) top-left, last ~3s |

Cache-bust: SPA loads `…vo2.mp4?v=kimi-noir-20260819`. Media TTL 5 min (`public/_headers`).

Git: `f64463f` on `main` (Pages deploy). HyperFrames share: https://hyperframes.dev/p/915356ed-8e2f-4c6e-97a4-d931b33b1341  
Source composition (M3, not in Pages): `videos/satohash-explainer/` · script `videos/satohash-explainer/SCRIPT.md`.

## Music (archive / mix source)

| Spec | Value |
|------|--------|
| Live bed | Baked into vo2 (HeyGen retrieve, looped to ~90s, volume 0.15) |
| File (legacy) | `public/media/video/satohash-explainer-music.mp3` |
| Length | 60.00 s |
| Format | MP3 320 kbps stereo |
| Style | Dark ambient — **not** driving `/watch` now |

## Voiceover (legacy stems)

| Asset | Status |
|-------|--------|
| `vo-complete.mp3` | ~79.8s — previous mix; Pippa VO is baked into vo2 |
| `vo-section-1/2/3.mp3` | Optional stems (~26 / 30 / 23s) |

See `public/media/video/SCRIPT.md` for the board.

## Preview video (no VO)

`public/media/video/satohash-explainer-preview.mp4` — graphics + music only (legacy).

## Do not regress

Do not restore the pre-2026-08-19 stock-stills vo2 (picture died before audio). Current file is the HyperFrames Kimi cut.

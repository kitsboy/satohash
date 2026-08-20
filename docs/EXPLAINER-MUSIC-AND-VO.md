# Explainer: music + voiceover

## Live on `/watch` (2026-08-19)

| Spec | Value |
|------|--------|
| Primary | `public/media/video/satohash-explainer-with-vo2.mp4` |
| Length | **~83.7 s** (Kimi / Pippa educational cut, VO + dance bed) |
| Format | H.264 1280×720 + AAC stereo |
| Player | Native `<video>` on `/watch` · Full cut default |
| Teaser | `satohash-explainer-with-vo.mp4` (~10.0 s) — still on `/watch` as Short |
| CTA copy | “Watch explainer” on landing / about (not “10s”) |

Cache-bust: SPA loads `…vo2.mp4?v=80s-20260819`. Media TTL 5 min (`public/_headers`).

## Music (archive / mix source)

| Spec | Value |
|------|--------|
| File | `public/media/video/satohash-explainer-music.mp3` |
| Length | 60.00 s |
| Format | MP3 320 kbps stereo |
| Peak | ~−21 dB (headroom for VO) |
| Style | Dark ambient, soft pulse, no drums 0–10s, arp/pad after 0:10, lift ~0:45, fade last 3s |

## Voiceover (legacy stems)

| Asset | Status |
|-------|--------|
| `vo-complete.mp3` | ~79.8s — same story as vo2; not driving `/watch` now that VO is baked in |
| `vo-section-1/2/3.mp3` | Optional stems (~26 / 30 / 23s) |

See `public/media/video/SCRIPT.md` for the board.

## Preview video (no VO)

`public/media/video/satohash-explainer-preview.mp4` — graphics + music only (legacy).

## Mux note (vo2)

Source vo2 had picture through ~45s / last keyframe ~63s and audio to ~80s. Remuxed 2026-08-19: last frame held to audio end, SAR 1:1, `+faststart`. Do not restore the unpadded file.

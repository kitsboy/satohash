# Explainer: music + voiceover

## Live on `/watch` (2026-08-04)

| Spec | Value |
|------|--------|
| File | `public/media/video/satohash-explainer-with-vo.mp4` |
| Length | **~10.0 s** (Kimi teaser) |
| Format | H.264 1280×720 + AAC stereo (VO baked in) |
| Player | Native `<video>` on `/watch` |
| CTA copy | “Watch 10s explainer” on landing / about |

Longer educational cut planned later (Cam has full script offline).

## Music (archive / future long cut)

| Spec | Value |
|------|--------|
| File | `public/media/video/satohash-explainer-music.mp3` |
| Length | 60.00 s |
| Format | MP3 320 kbps stereo |
| Peak | ~−21 dB (headroom for VO) |
| Style | Dark ambient, soft pulse, no drums 0–10s, arp/pad after 0:10, lift ~0:45, fade last 3s |

## Voiceover (legacy stems — not driving `/watch` while teaser is primary)

| Asset | Status |
|-------|--------|
| `vo-complete.mp3` | ~79.8s — previous interactive clock |
| `vo-section-1/2/3.mp3` | Optional stems (~26 / 30 / 23s) |

See `public/media/video/SCRIPT.md` for the 10s teaser board.

## Preview video (no VO)

`public/media/video/satohash-explainer-preview.mp4` — graphics + music only (legacy).

## Next polish path (long cut)

1. Produce 30s+ MP4 when ready (Cam/Grok Desktop).  
2. Drop in as new primary file or dual-length player.  
3. Update landing CTA length label.  
4. Optional: HyperFrames mix of stills + VO + music.

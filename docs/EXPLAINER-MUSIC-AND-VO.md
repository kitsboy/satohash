# Explainer: music + voiceover

## Music (done on M3)

| Spec | Value |
|------|--------|
| File | `public/media/video/satohash-explainer-music.mp3` |
| Length | 60.00 s |
| Format | MP3 320 kbps stereo |
| Peak | ~−21 dB (headroom for VO) |
| Style | Dark ambient, soft pulse, no drums 0–10s, arp/pad after 0:10, lift ~0:45, fade last 3s |

Live player loads this under the slideshow at `/watch`.

## Voiceover (live on GitHub)

| Asset | Status |
|-------|--------|
| `vo-complete.mp3` | ✅ ~79.8s — **drives `/watch` clock** |
| `vo-section-1/2/3.mp3` | ✅ Optional stems (~26 / 30 / 23s) |

Slide board stretched to ~80s with longer CTA (see `public/media/video/SCRIPT.md`).  
No re-record required unless Cam wants a tighter 55s cut.
## Preview video (no VO)

`public/media/video/satohash-explainer-preview.mp4` — graphics + music only.

## Final polish path

1. Drop `vo-complete.mp3` (quality check British female voice).  
2. If wrong voice: ElevenLabs Rachel/Bella on `SCRIPT.md` text, replace file.  
3. HyperFrames or re-run ffmpeg mix: VO + music + graphics for public cut.  
4. Homepage CTA → `/watch` or final MP4.

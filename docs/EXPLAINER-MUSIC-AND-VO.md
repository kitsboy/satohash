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

## Voiceover (THOR → M3)

| Asset | Status |
|-------|--------|
| `vo-complete.mp3` | Generate on THOR; **copy to** `public/media/video/vo-complete.mp3` |
| Sections | `vo-section-{1,2,3}.mp3` optional intermediates |

```bash
# From a machine that can reach THOR:
scp root@THOR:/root/satohash/docs/media/video/vo-complete.mp3 \
  ~/projects/satohash/public/media/video/vo-complete.mp3
cd ~/projects/satohash && git add public/media/video/vo-complete.mp3 && git commit -m "media: add explainer VO" && git push
```

If VO is ~79s, either trim to 60s on THOR or we stretch slideshow timings to match.

## Preview video (no VO)

`public/media/video/satohash-explainer-preview.mp4` — graphics + music only.

## Final polish path

1. Drop `vo-complete.mp3` (quality check British female voice).  
2. If wrong voice: ElevenLabs Rachel/Bella on `SCRIPT.md` text, replace file.  
3. HyperFrames or re-run ffmpeg mix: VO + music + graphics for public cut.  
4. Homepage CTA → `/watch` or final MP4.

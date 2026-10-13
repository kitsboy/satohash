# Explainer: music + voiceover

## Live on `/watch` (2026-10-12)

| Spec | Value |
|------|--------|
| Primary | `https://videos.giveabit.io/media/video/satohash-explainer-wise.mp4` |
| Length | **83.5 s** |
| Format | H.264 **1920×1080** |
| Voice | Young British English woman as Kimi (Kokoro **Isabella**). HeyGen Pippa is the character voice when that login works again. This cut is not Pippa. |
| Music | Quiet dark ambient, faded, sitting under the voice. Not the old dance bed. |
| Picture | Kimi stills, gold type, a real Confirmed card for Bitcoin block **969,627** |
| Player | Native `<video>` on `/watch` and the homepage · Full cut default |
| Teaser | `satohash-explainer-with-vo.mp4` (~10.0 s) — still on `/watch` as Short |
| Close | Kimi, gold **satohash.io**, small hash mark |

Cache-bust: SPA loads `…wise.mp4?v=kimi-wise-20261012`. The August dance-bed cut stays at the old `vo2` address and is no longer what the player loads.

Git: `f64463f` on `main` (Pages deploy). HyperFrames share: https://hyperframes.dev/p/915356ed-8e2f-4c6e-97a4-d931b33b1341  
Source composition (M3, not in Pages): `videos/satohash-explainer/` · script `videos/satohash-explainer/SCRIPT.md`.

## Music (archive / mix source)

| Spec | Value |
|------|--------|
| August bed | Baked into vo2 (the dance bed the player no longer loads) |
| File | `public/media/video/satohash-explainer-music.mp3` |
| Length | 60.00 s source. The 2026-10-12 cut uses a faded, quiet copy of this ambient |
| Style | Dark ambient under the voice |

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

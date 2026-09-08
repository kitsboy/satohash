# Pixel (you) + iPhone (friends)

Cam: **Android Pixel 10 Pro** (Chrome).  
Most friends: **iPhone** (Safari + iMessage).

We cannot hold your phone from here. Playwright covers **Pixel 7 viewport + Chromium** and **iPhone 13 + WebKit**. You confirm once on the Pixel.

## You on Pixel

1. Chrome → [satohash.io/stamp](https://satohash.io/stamp)
2. **Take photo** or **Choose file** (camera is allowed on this origin)
3. Thumb **Stamp on Bitcoin**
4. **Copy proof card** or **Share** — Android Share includes the `/p/<hash>` URL in the message text
5. Open the shared link yourself — should be the gold/navy card
6. Optional: Chrome menu → **Add to Home screen** (starts on `/stamp`)

If the page looks like HTML garbage or a blank screen: hard refresh. Shell is `max-age=0`.

## Friends on iPhone

They never need the app. You send `https://satohash.io/p/<64hex>`.

- iMessage / Mail: JPEG preview (not SVG — Apple often ignores SVG)
- Safari: zero-JS card, hash is **not** turned into a phone number
- **Interactive verify** if they want the full tool

## Always-on checks

| Check | How |
|-------|-----|
| Pixel chrome | `npx playwright test --project=pixel` |
| iPhone chrome | `npx playwright test --project=webkit` |
| Live card | hard-open `/p/<hash>` |
| Camera / mic | `_headers` `camera=(self); microphone=(self)` — stamp only, no geolocation |

## Cam: 2-minute iMessage test

We cannot hold the iPhone. Cam confirms the live `/p/<hash>` card unfurls.

1. Open https://satohash.io/p/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
2. Share to iMessage
3. Must unfurl JPEG `01-stamp-hero.jpg`, not a blank SPA
4. Zero-JS card, Pending ≠ Confirmed honesty

**Done when:** screenshot of the JPEG card in iMessage.

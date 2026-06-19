# Satohash Snapper — Browser Extension (Forensic Web Capture)

The "Snapper" lets users capture a screenshot (or page snapshot) of any public web URL together with rich browser fingerprint metadata, then immediately anchor a cryptographic hash of that evidence to the Bitcoin blockchain via Satohash.

This produces **judiciary-ready web evidence** — a timestamped, independently verifiable record that a particular webpage looked a certain way at a specific moment.

## Current Files
- `manifest.json` — Chrome/Edge extension manifest (MV3)
- `popup.html` + `styles/popup.css` — Simple capture UI
- `scripts/background.js` + `popup.js` — Capture + hash + POST to `/api/capture/snapper`

## How It Works (high level)
1. User opens the extension on any tab.
2. Chooses "Capture" (visible area or full page via content script if implemented).
3. Extension collects:
   - Screenshot (PNG or JPEG data URL / blob)
   - URL, title, timestamp
   - Basic navigator / screen fingerprint (user agent, languages, etc.)
   - Optional additional headers or DOM signals
4. Hashes the canonical evidence package client-side (or sends minimal metadata + hash).
5. POSTs to the Satohash backend snapper endpoint (authenticated via `SNAPPER_KEY` or user session).
6. Returns a normal Satohash stamp ID + `.ots` proof.

The resulting proof can be exported as PDF with injected judicial metadata (see main app `PdfCustomizer`).

## Integration Notes
- Backend handler lives in `server/` (search for `snapper` or `/api/capture/snapper`).
- Requires the `SNAPPER_KEY` env var on the server for extension auth in some configurations.
- Designed for **public pages only** — do not use on authenticated or private content without legal basis.

## Future Enhancements (roadmap ideas)
- Full-page capture with scrolling
- PDF export directly from extension
- Nostr-signed capture attestations
- Configurable metadata fields for different legal jurisdictions
- Manifest V3 service worker hardening + permissions review

## Development
Load unpacked in Chrome:
1. `chrome://extensions/`
2. Enable Developer mode
3. "Load unpacked" → point at this `extension/satohash-snapper/` folder

The popup currently talks to the local or production Satohash API depending on build config.

## Relationship to Main App
The Snapper is a first-class "Web Capture" surface inside the Satohash product (route `/snapper` or similar in the SPA also exists for non-extension users). The extension gives power users one-click access from anywhere.

See main docs:
- [../docs/AI_INTEGRATION.md](../docs/AI_INTEGRATION.md) (for API patterns)
- Root [../CLAUDE.md](../CLAUDE.md)
- [../docs/EXECUTIVE_SUMMARY.md](../docs/EXECUTIVE_SUMMARY.md) (mentions Web Capture / Snap & Stamp)

## License
Part of the Satohash project — MIT (see root LICENSE).

---

Built by Give A Bit for forensic-grade, Bitcoin-anchored web evidence.

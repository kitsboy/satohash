# Satohash Snapper — Browser Extension (scaffold)

Unpacked **Manifest V3** scaffold for capturing a public page and hashing the evidence package for a Satohash stamp.

This is **not** store-shipped. It is **not** judiciary-ready. Load it unpacked for development only. Do not pitch it as a forensic product.

The live product loop is the SPA: [satohash.io/stamp](https://satohash.io/stamp) → verify → `/p/<hash>`. File hashing already happens on-device there. This folder is cathedral work.

## Current files

- `manifest.json` — Chrome/Edge MV3 (host permissions still list localhost / a stale API host — treat as unfinished)
- `popup.html` + `styles/popup.css` — Capture UI
- `scripts/background.js` + `popup.js` — Capture + hash + POST toward a snapper endpoint

Icons may be missing from this tree; the manifest references `icons/`. Expect a load warning until those exist.

## What it is trying to do

1. User opens the unpacked extension on a tab.
2. Chooses capture (visible area; full-page scroll is not built).
3. Collects a screenshot plus URL, title, timestamp, and basic navigator/screen fields.
4. Hashes the evidence package (or a hash of it) on-device.
5. POSTs to a Satohash snapper route if the API and auth (`SNAPPER_KEY` / session) exist.

That last step is scaffold, not a guaranteed live contract. Search `server/` for `snapper` / `/api/capture/snapper` before assuming the endpoint is on. Do not invent new `/api/*` paths.

Public pages only. Do not use this on authenticated or private content without a legal basis.

## Development

Load unpacked in Chrome:

1. `chrome://extensions/`
2. Enable Developer mode
3. “Load unpacked” → this `extension/satohash-snapper/` folder

Popup target (local vs `https://api.satohash.io`) depends on whatever is hardcoded in the scripts. Confirm before testing against production. Free stamps on the live API; do not flip `REQUIRE_LIGHTNING`.

## Honest status

| Claim | Status |
|-------|--------|
| Unpacked MV3 scaffold | Yes |
| Chrome Web Store / Edge Add-ons | No |
| Judiciary-ready / chain-of-custody product | No |
| Full-page capture, PDF export from the extension, Nostr-signed attestations | Not built |

Native store apps are also later (`docs/STORE-APPS.md`). Authorship (proves *who*) is the next product chapter — this extension does not provide it.

## Docs

- Agents: [../../AGENTS.md](../../AGENTS.md)
- Architecture: [../../docs/architecture.md](../../docs/architecture.md)
- Exec summary: [../../docs/marketing/EXECUTIVE-SUMMARY.md](../../docs/marketing/EXECUTIVE-SUMMARY.md)
- Family stamp widget (live, on-site): [`public/widgets/stamp.js`](../../public/widgets/stamp.js)

## License

Part of the Satohash project — MIT (see root [LICENSE](../../LICENSE)).

---

Built by Give A Bit. Bitcoin-anchored proof of *when* a file existed — the extension is not that product yet.

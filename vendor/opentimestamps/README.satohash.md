# vendor/opentimestamps — Satohash fork of `opentimestamps@0.4.9`

This directory is a **vendored fork** of the upstream JS OpenTimestamps client,
installed through `package.json` as `"opentimestamps": "file:vendor/opentimestamps"`.

## Why it exists

Upstream `opentimestamps@0.4.9` (last published 2021-01-29, latest release on
npm — there is no newer version) depends on `request@^2.85.0` and
`request-promise@^4.2.2`. Both have been deprecated since 2020 and both are now
unmaintained. They were the direct cause of the **2026-09-12 api.satohash.io 502
flap**:

- a security-audit override pinned `request`'s nested `uuid` to `^9.0.1`
- `request@2.88.2` calls `require('uuid/v4')` at `lib/auth.js:4` at module load
- uuid ≥ 9 dropped the `./v4` subpath from its exports map
- so `require('opentimestamps')` threw `ERR_PACKAGE_PATH_NOT_EXPORTED` at boot,
  pm2 crash-looped, and the API served 502 windows

Fencing the override (commit `bfef38a`) stopped the bleeding. This fork removes
the dependency instead of pinning around it: the deprecated packages no longer
exist anywhere in the install tree, so the failure mode cannot come back.

## What changed vs upstream 0.4.9

Only the HTTP transport. The binary `.ots` format, ops, merkle and attestation
code are untouched.

| File | Change |
| --- | --- |
| `src/request-shim.js` | **new** — implements the slice of the `request-promise` API the client uses, on top of Node's global `fetch` (undici). Zero dependencies. |
| `src/calendar.js` | `require('request-promise')` → `require('./request-shim.js')` |
| `src/esplora.js` | same |
| `src/bitcoin.js` | same |
| `package.json` | dropped `request`, `request-promise`, and the unused `fs` security-stub dep; package version `0.4.9-satohash.1` |

Dropped with them: `commander`, `randomstring`, `moment-timezone` (only used by
the upstream `ots-cli.js`, which this fork does not ship). All remaining
dependencies (`bitcore-lib`, `bytebuffer`, `minimatch`, `promise`,
`properties`) are still required by `src/`.

The shim preserves upstream semantics where the OTS sources depend on them:

- resolves the raw body — `Buffer` when `encoding: null`, parsed object when
  `json: true`, otherwise text
- rejects with `.statusCode` and `.error` (calendar.js checks
  `err.statusCode === 404` and stringifies `err.error`)
- honours the `timeout` option in **milliseconds** — this is what
  `server/lib/ots-helpers.js` sets on `RemoteCalendar.prototype.timeout` to stop
  a dead calendar from stalling the stamp aggregate. Where upstream had *no*
  timeout when the option was unset, the shim applies a 30 s default so an
  unresponsive host soft-fails instead of hanging.
- fetch decodes gzip transparently (upstream used `gzip: true`)

## Verification

`tests/ots-vendor/transport.test.mjs` (local HTTP server: binary POST, 404
mapping, timeout, text/json responses, JSON-RPC POST, require-graph assertion)
and `tests/ots-vendor/live.test.mjs` (real public calendars + blockstream
esplora, cross-validated against the upstream request-based library) — see
`npm run test:ots-vendor` / `npm run test:ots-vendor:live`.

Both suites passed on 2026-09-12 on THOR: stamp 1038 ms with 3 real calendar
attestations, upgrade GET 533 ms, `verify()` against esplora 830 ms returning
exactly the same `{bitcoin:{height,timestamp}}` as the upstream library, and a
`.ots` written by this fork deserialised identically by upstream (and vice
versa).

## License

Upstream is LGPL-3.0; `LICENSE` is retained verbatim and this fork stays
LGPL-3.0. Upstream: <https://github.com/opentimestamps/javascript-opentimestamps>.

## Not covered by this fork

`public/vendor/ots.browser.js` is a committed browserify bundle of the upstream
library used by the SPA (`src/utils/otsClient.js`). The `build:ots` script
short-circuits while that file exists, so the SPA keeps its existing bundle.
Rebuilding it from this fork (browserify + the `buffer` shim + browser
`fetch`/`AbortSignal.timeout`) is a separate change.

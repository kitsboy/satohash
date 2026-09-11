# @giveabit/satohash-client

Thin client for the **Satohash proof plane** (OpenTimestamps via `api.satohash.io`).

Family apps stay **compartmentalized** — they only call this API; they do not run calendars or bitcoind.

## Usage

```js
import { createSatohashClient } from './index.js'

const satohash = createSatohashClient({
  clientId: 'motopass',
  apiBase: import.meta.env.VITE_SATOHASH_API_URL || 'https://api.satohash.io',
  siteBase: import.meta.env.VITE_SATOHASH_URL || 'https://satohash.io',
  apiKey: import.meta.env.VITE_SATOHASH_KEY || '' // family free tier; never commit
})

const health = await satohash.getApiHealth()
const ping = await satohash.ping() // alias of getApiHealth
const result = await satohash.stampHash(sha256Hex, { filename: 'passport-seal.json' })
if (!result.ok) {
  // Fallback: open browser stamp UX
  window.open(satohash.stampGuideUrl(sha256Hex), '_blank')
}
```

## Stable connection

Every request sends `X-Satohash-Client` (and `X-Satohash-Key` when `apiKey` is set).

| Call | Timeout |
|------|---------|
| `getApiHealth` / `ping` / `getPublicStatus` | 8s |
| `stampHash` | 45s |
| `getStamp` | 10s |

Retries (fresh timeout per attempt):

- Network failure and HTTP **502 / 503 / 504**: up to **2** retries
- HTTP **429**: honor `Retry-After` (cap **10s**), then **one** retry

Do not invent API paths. Stamp is `POST /api/stamp`. Share proofs at `https://satohash.io/p/<64hex>`.

## Family free tier

Server env: `FAMILY_API_KEYS=key1,key2`  
Client header: `X-Satohash-Key: key1`  
Client identity: `X-Satohash-Client: motopass`

Known client ids: `katoa` · `motopass` · `sherpacarta` · `giveabit` · `tadbuy` · `spa` · `cli`

## Public

Without family key, stamp may return **402** (Lightning paywall) unless `REQUIRE_LIGHTNING=false` on server.

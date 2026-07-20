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
const result = await satohash.stampHash(sha256Hex, { filename: 'passport-seal.json' })
if (!result.ok) {
  // Fallback: open browser stamp UX
  window.open(satohash.stampGuideUrl(sha256Hex), '_blank')
}
```

## Family free tier

Server env: `FAMILY_API_KEYS=key1,key2`  
Client header: `X-Satohash-Key: key1`  
Client identity: `X-Satohash-Client: motopass`

## Public

Without family key, stamp may return **402** (Lightning paywall) unless `REQUIRE_LIGHTNING=false` on server.

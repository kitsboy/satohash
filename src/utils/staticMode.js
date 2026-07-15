import { isApiExplicitlyConfigured } from '../config/mvp'

/** Production static SPA on Cloudflare — no api.satohash.io baked in. */
export function isStaticOnlyMode() {
  return !import.meta.env.DEV && !isApiExplicitlyConfigured()
}

export function getDeploymentMode() {
  if (import.meta.env.DEV) return 'development'
  if (isApiExplicitlyConfigured()) return 'api-linked'
  return 'static-only'
}

export const STATIC_MODE_COPY = {
  title: 'Browser verification mode',
  body: 'Hashing, vault, and OpenTimestamps stamping run in your browser via public calendars. Optional api.satohash.io adds hosted sync, OG cards, and fleet analytics.',
  stampQueued:
    'Hash saved locally. Browser OTS will retry on sync — or stamp now via public calendars.',
  verifyStructural:
    'Structural .ots check passed. Full Bitcoin attestation: use browser verify or opentimestamps.org.'
}

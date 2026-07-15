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
  title: 'Static verification mode',
  body: 'Hashing and local vault work in your browser. Bitcoin anchoring via OpenTimestamps requires api.satohash.io (not deployed yet).',
  stampQueued:
    'Hash fingerprint saved locally. Full .ots proof and Bitcoin attestation will sync when the API is live.',
  verifyStructural:
    'Structural .ots check passed. Independent Bitcoin confirmation needs the verification API or opentimestamps.org.'
}

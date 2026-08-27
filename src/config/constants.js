export const APP_CONFIG = {
  NAME: 'Satohash',
  LOGO: '/logo.png',
  DEFAULT_LANGUAGE: 'en'
}

/** Health check / public URL constants used by clients and ops tooling. */
export const HEALTH_CONFIG = {
  ENDPOINT: '/health',
  DEEP_CHECK_PARAM: 'deep',
  DEEP_CHECK_VALUE: 'true',
  VALID_STATUSES: ['ok', 'degraded'],
  PUBLIC_URL: 'https://satohash.io',
  VERIFY_URL: 'https://satohash.io/verify'
}

/** Resolve the public verify page for QR codes and PDF footers. */
export function getVerifyUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/verify`
  }
  return HEALTH_CONFIG.VERIFY_URL
}

/** Public proof API (THOR). SPA on CF Pages must never same-origin /api/*. */
export const PUBLIC_API_URL = 'https://api.satohash.io'

/** Hostnames that always target PUBLIC_API_URL when VITE_API_URL is unset. */
export const PRODUCTION_SPA_HOSTS = new Set([
  'satohash.io',
  'www.satohash.io',
  'satohash.giveabit.io',
  'www.satohash.giveabit.io'
])

/**
 * API base for client fetches.
 * Priority: VITE_API_URL → production SPA hosts → same-origin → localhost dev.
 */
export function getApiUrl() {
  const fromEnv = import.meta.env.VITE_API_URL
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).replace(/\/$/, '')

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname.toLowerCase()
    if (PRODUCTION_SPA_HOSTS.has(host)) return PUBLIC_API_URL
    if (window.location.origin) return window.location.origin
  }
  return 'http://localhost:3001'
}

export function getPublicBaseUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return HEALTH_CONFIG.PUBLIC_URL
}

export const NAV_LINKS = [
  { name: 'Vault', path: '/vault', icon: 'Database', group: 'Notary' },
  { name: 'Stamp', path: '/stamp', icon: 'ShieldCheck', group: 'Notary' },
  { name: 'Verify', path: '/verify', icon: 'Search', group: 'Notary' },
  { name: 'Templates', path: '/templates', icon: 'Layout', group: 'Notary' },
  { name: 'Certificates', path: '/certificates', icon: 'FileText', group: 'Notary' },

  { name: 'Atlas', path: '/atlas', icon: 'Globe', group: 'Atlas' },
  { name: 'Nodes', path: '/nodes', icon: 'Network', group: 'Atlas' },

  { name: 'Contracts', path: '/contracts', icon: 'FileSignature', group: 'Mesh' },
  { name: 'Snapper', path: '/snapper', icon: 'Camera', group: 'Mesh' },
  { name: 'Developer', path: '/developer', icon: 'Terminal', group: 'Mesh' },

  { name: 'Explorer', path: '/explorer', icon: 'Clock', group: 'Noir' },
  { name: 'Settings', path: '/settings', icon: 'Settings', group: 'System' }
]

export const FOOTER_EXTRA_LINKS = [
  { name: 'Settings', path: '/settings', internal: true },
  { name: 'Audit Log', path: '/audit-log', internal: true },
  { name: 'Trust', path: '/trust', internal: true },
  { name: 'About', path: '/about', internal: true }
]

/**
 * Public receive only — Breez rail (Config A, 2026-08-27). Non-custodial Spark.
 */
export const BTC_ADDRESS = 'bc1p25zw4rh6s6fjqzxe8yzkpj4klf59v5yyzc4nqf0x6d3twu8qvq9qurdlsr'

/** Lightning Address (LUD-16) — Breez Spark. */
export const LN_ADDRESS = 'satohash@breez.tips'

/** Optional LNURL-pay string — Breez hosted LNURL server. */
export const LNURL_PAY = 'https://breez.tips/lnurlp/satohash'

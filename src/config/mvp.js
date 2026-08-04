/**
 * MVP mode — frontend ready for api.satohash.io without requiring login.
 * Set VITE_MVP_MODE=false to restore full auth-gated app.
 */

export const MVP_MODE = import.meta.env.VITE_MVP_MODE !== 'false'

/** Routes reachable without /access login when MVP_MODE is on */
export const MVP_PUBLIC_PATHS = [
  '/stamp',
  '/verify',
  '/vault',
  '/trust',
  '/security',
  '/integrations',
  '/templates',
  '/faq',
  '/guides',
  '/docs',
  '/pitch',
  '/about',
  '/government',
  '/motopass-verify',
  '/batch-hash',
  '/chain-of-custody',
  '/evidence-admissibility',
  '/distressed-asset',
  '/pricing',
  '/comparison',
  '/glossary',
  '/widgets',
  '/identity',
  '/changelog',
  '/network',
  '/proof-of-existence',
  '/legal/terms',
  '/legal/privacy',
  '/legal/crypto-notice'
]

/** Sub-paths allowed in MVP mode (e.g. /verify/:hash from MotoPass) */
export function isMvpPublicPath(pathname = '') {
  if (!MVP_MODE) return false
  if (MVP_PUBLIC_PATHS.some((p) => pathname === p || (p !== '/' && pathname.startsWith(`${p}/`)))) {
    return true
  }
  // Public proof pages linked from Give A Bit family apps
  if (/^\/verify\/[a-f0-9]{64}$/i.test(pathname)) return true
  return false
}

/**
 * True when SPA should use the real API plane (not browser-only OTS).
 * Production hosts always target api.satohash.io even if VITE_API_URL was
 * missing at build time (GHA previously forgot the env).
 */
export function isApiExplicitlyConfigured() {
  const url = import.meta.env.VITE_API_URL
  if (url && String(url).trim()) return true
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname.toLowerCase()
    return (
      host === 'satohash.io' ||
      host === 'www.satohash.io' ||
      host === 'satohash.giveabit.io' ||
      host === 'www.satohash.giveabit.io'
    )
  }
  return false
}

/** Show health banner only when we expect an API (dev or production SPA / VITE_API_URL) */
export function shouldMonitorApiHealth() {
  return import.meta.env.DEV || isApiExplicitlyConfigured()
}

/**
 * Kimi NIP-05 — PUBLIC key only. Never commit or request NSEC.
 * kimi@giveabit.io resolves via giveabit.io/.well-known/nostr.json
 * satohash.io/.well-known/nostr.json maps local "kimi" alias to same pubkey.
 */
export const KIMI_NOSTR = {
  nip05: 'kimi@giveabit.io',
  pubkeyHex: '076fbd672795bfba1f905084bbe05dcee4937aa1db995c2f87d616ea0f73f8d4'
}

/** Nav paths hidden until post-MVP */
export const MVP_DEFERRED_PATHS = ['/forum', '/contracts', '/offers', '/admin']

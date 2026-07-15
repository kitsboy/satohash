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
  '/distressed-asset'
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

/** True when build bakes in an external API (api.satohash.io) */
export function isApiExplicitlyConfigured() {
  const url = import.meta.env.VITE_API_URL
  return Boolean(url && String(url).trim())
}

/** Show health banner only when we expect an API (dev or VITE_API_URL set) */
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

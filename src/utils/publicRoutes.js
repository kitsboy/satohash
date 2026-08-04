/** Routes that render without AppShellNoir chrome (marketing + share pages). */
const MARKETING_PREFIXES = [
  '/',
  '/access',
  '/about',
  '/trust',
  '/pitch',
  '/contribute',
  '/templates',
  '/legal/',
  '/faq',
  '/pricing',
  '/comparison',
  '/guides',
  '/glossary',
  '/docs',
  '/security',
  '/integrations',
  '/widgets',
  '/identity',
  '/government',
  '/motopass-verify',
  '/batch-hash',
  '/chain-of-custody',
  '/evidence-admissibility',
  '/distressed-asset',
  '/changelog',
  '/watch',
  '/explainer',
  '/network',
  '/proof-of-existence',
  '/bitcoin'
]

/** Exact paths chrome-free of AppShell (family deep-links + core tools). */
const MARKETING_EXACT = ['/stamp', '/verify']

/**
 * Pages that already render MarketingDesktopNav themselves.
 * Do not wrap these in MarketingShell.
 */
const OWN_MARKETING_NAV = ['/', '/watch', '/explainer', '/docs/executive-summary']

export function isMarketingPublicPath(pathname = '') {
  if (!pathname) return false
  if (MARKETING_EXACT.includes(pathname)) return true
  // Shareable verify deep-links (hash or id)
  if (pathname.startsWith('/verify/') && pathname.length > 8) return true
  return MARKETING_PREFIXES.some((p) => {
    if (p === '/') return pathname === '/'
    if (p.endsWith('/')) return pathname.startsWith(p)
    return pathname === p || pathname.startsWith(`${p}/`)
  })
}

/** Public share / proof pages — no marketing chrome (minimal UI). */
export function isBareSharePath(pathname = '') {
  if (!pathname) return false
  if (pathname.startsWith('/verify/') && pathname.length > 8) return true
  return false
}

/**
 * Marketing pages that need the shared mobile/desktop nav shell.
 * Excludes home/watch/exec that already embed MarketingDesktopNav,
 * and bare share links.
 */
export function needsMarketingShell(pathname = '') {
  if (!isMarketingPublicPath(pathname)) return false
  if (isBareSharePath(pathname)) return false
  if (OWN_MARKETING_NAV.includes(pathname)) return false
  if (pathname.startsWith('/docs/executive-summary')) return false
  return true
}

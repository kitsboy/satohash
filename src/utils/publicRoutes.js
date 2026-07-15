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
  '/changelog'
]

export function isMarketingPublicPath(pathname = '') {
  if (!pathname) return false
  if (/^\/verify\/[a-f0-9]{64}$/i.test(pathname)) return true
  if (pathname.startsWith('/verify/') && pathname.length > 8) return true
  return MARKETING_PREFIXES.some((p) => {
    if (p === '/') return pathname === '/'
    if (p.endsWith('/')) return pathname.startsWith(p)
    return pathname === p || pathname.startsWith(`${p}/`)
  })
}

export const APP_CONFIG = {
  NAME: 'Satohash',
  LOGO: '/logo.png',
  DEFAULT_LANGUAGE: 'en'
}

export const NAV_LINKS = [
  { name: 'Workbench',   path: '/dashboard' },
  { name: 'Templates',  path: '/choose-template' },
  { name: 'Verifier',    path: '/verify' },
  { name: 'Batch Proof', path: '/batch-proof' },
  { name: 'Pulse',       path: '/protocol-stats' },
  { name: 'Trust',       path: '/trust' },
  { name: 'About',       path: '/about' },
]

// Pages available in the footer but not in the top nav (to keep it tight)
export const FOOTER_EXTRA_LINKS = [
  { name: 'Developers',        path: '/developers',    internal: true },
  { name: 'BOLT-12 Offers',    path: '/offers',        internal: true },
  { name: 'Web Capture',       path: '/snap-and-stamp',internal: true },
  { name: 'Identity (NIP-05)', path: '/identity',      internal: true },
  { name: 'Mobile Signer',     path: '/mobile-signer', internal: true },
]

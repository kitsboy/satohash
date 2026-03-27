export const APP_CONFIG = {
  NAME: 'Satohash',
  LOGO: '/logo.png',
  DEFAULT_LANGUAGE: 'en'
}

export const NAV_LINKS = [
  { name: 'Workbench',   path: '/dashboard' },
  { name: 'Contracts',   path: '/contracts' },
  { name: 'Batch Proof', path: '/batch-proof' },
  { name: 'Image Vault', path: '/image-vault' },
  { name: 'Verifier',    path: '/verify' },
  { name: 'Pulse',       path: '/protocol-stats' },
  { name: 'Trust',       path: '/trust' },
]

// Pages available in the footer but not in the top nav (to keep it tight)
export const FOOTER_EXTRA_LINKS = [
  { name: 'BOLT-12 Offers',    path: '/offers',        internal: true },
  { name: 'Identity (NIP-05)', path: '/identity',      internal: true },
  { name: 'Mobile Signer',     path: '/mobile-signer', internal: true },
  { name: 'Developers',        path: 'https://satohash.giveabit.io/developers', internal: false },
]

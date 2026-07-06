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
  PUBLIC_URL: 'https://satohash.giveabit.io',
  VERIFY_URL: 'https://satohash.giveabit.io/verify'
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

export const BTC_ADDRESS = 'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad'

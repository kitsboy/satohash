/**
 * Family deep-link contract for stamp handoffs.
 *
 * Canonical:  /stamp?hash=<64hex>&ref=<productId>[&source=][&label=][&campaign=][&filename=]
 * Also accept: /?hash=…&ref=…  → client redirect to /stamp preserving params
 */

import { normalizeSha256 } from './hashUtils'

/** Known Give A Bit family product ids → display labels */
export const FAMILY_PRODUCTS = {
  sherpacarta: { id: 'sherpacarta', name: 'SherpaCarta', chip: 'From SherpaCarta' },
  'sherpacarta-canada': {
    id: 'sherpacarta-canada',
    name: 'SherpaCarta Canada',
    chip: 'From SherpaCarta Canada'
  },
  motopass: { id: 'motopass', name: 'MotoPass', chip: 'From MotoPass' },
  giveabit: { id: 'giveabit', name: 'Give A Bit', chip: 'From Give A Bit' },
  tadbuy: { id: 'tadbuy', name: 'TadBuy', chip: 'From TadBuy' },
  openstrata: { id: 'openstrata', name: 'OpenStrata', chip: 'From OpenStrata' },
  btcminiscript: { id: 'btcminiscript', name: 'BTC Miniscript', chip: 'From BTC Miniscript' },
  stranded: { id: 'stranded', name: 'Stranded', chip: 'From Stranded' },
  katoa: { id: 'katoa', name: 'Katoa', chip: 'From Katoa' },
  camtaylor: { id: 'camtaylor', name: 'Cam Taylor', chip: 'From Cam Taylor' },
  lindala: { id: 'lindala', name: 'Lindala', chip: 'From Lindala' },
  spa: { id: 'spa', name: 'Satohash', chip: 'Satohash' },
  cli: { id: 'cli', name: 'CLI', chip: 'From CLI' }
}

/** Query keys forwarded home → /stamp */
export const STAMP_DEEP_LINK_KEYS = [
  'hash',
  'ref',
  'source',
  'label',
  'campaign',
  'filename',
  'cosign',
  'npub',
  'autostamp',
  'email'
]

/**
 * @param {string|null|undefined} refOrSource
 * @returns {{ id: string, name: string, chip: string } | null}
 */
export function resolveFamilyProduct(refOrSource) {
  if (!refOrSource || typeof refOrSource !== 'string') return null
  const id = refOrSource.trim().toLowerCase()
  if (!id) return null
  if (FAMILY_PRODUCTS[id]) return FAMILY_PRODUCTS[id]
  // Unknown family id — still attribute metrics, humanize for chip
  const pretty = id
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  return { id, name: pretty, chip: `From ${pretty}` }
}

/**
 * Decode label/filename query values (+ as space, URI-decode).
 * @param {string|null|undefined} raw
 */
export function decodeQueryText(raw) {
  if (raw == null || raw === '') return ''
  try {
    return decodeURIComponent(String(raw).replace(/\+/g, ' ')).trim()
  } catch {
    return String(raw).replace(/\+/g, ' ').trim()
  }
}

/**
 * Parse stamp deep-link from URLSearchParams or plain object.
 * @param {URLSearchParams | Record<string, string | null | undefined> | null | undefined} input
 */
export function parseStampDeepLink(input) {
  const get = (key) => {
    if (!input) return null
    if (typeof input.get === 'function') return input.get(key)
    const v = input[key]
    return v == null ? null : String(v)
  }

  const rawHash = get('hash')
  const hasHashParam = rawHash != null && String(rawHash).trim() !== ''
  const hash = hasHashParam ? normalizeSha256(rawHash) : null
  const hashInvalid = hasHashParam && !hash

  const ref = (get('ref') || '').trim() || null
  const source = (get('source') || '').trim() || null
  const product = resolveFamilyProduct(ref || source)
  const clientId = product?.id || ref || source || 'spa'

  const label = decodeQueryText(get('label'))
  const filename = decodeQueryText(get('filename'))
  const campaign = (get('campaign') || '').trim() || null
  const email = (get('email') || '').trim() || null
  const cosign = get('cosign') === 'true' || get('cosign') === '1'
  const npub = (get('npub') || '').trim() || null
  const autostamp = get('autostamp') === '1' || get('autostamp') === 'true'

  const displayLabel =
    filename || label || (product ? `${product.name} document` : 'Linked document')

  return {
    hasHashParam,
    hash,
    hashInvalid,
    rawHash: hasHashParam ? String(rawHash).trim() : null,
    ref,
    source,
    product,
    clientId,
    label: label || null,
    filename: filename || null,
    displayLabel,
    campaign,
    email,
    cosign,
    npub,
    autostamp
  }
}

/**
 * If home (or any path) received stamp query params with `hash`, build `/stamp?…` path.
 * Returns null when no hash param (valid or invalid) — do not redirect bare marketing home.
 *
 * @param {URLSearchParams | Record<string, string | null | undefined> | string | null | undefined} search
 * @returns {string | null} e.g. `/stamp?hash=…&ref=sherpacarta`
 */
export function buildStampPathFromSearch(search) {
  let params
  if (!search) return null
  if (typeof search === 'string') {
    const q = search.startsWith('?') ? search.slice(1) : search
    params = new URLSearchParams(q)
  } else if (typeof search.get === 'function') {
    params = search
  } else {
    params = new URLSearchParams()
    for (const [k, v] of Object.entries(search)) {
      if (v != null && v !== '') params.set(k, String(v))
    }
  }

  const rawHash = params.get('hash')
  if (rawHash == null || String(rawHash).trim() === '') return null

  const out = new URLSearchParams()
  for (const key of STAMP_DEEP_LINK_KEYS) {
    const v = params.get(key)
    if (v != null && v !== '') out.set(key, v)
  }
  // Preserve any extra attribution params family apps may send
  for (const [k, v] of params.entries()) {
    if (!out.has(k) && v) out.set(k, v)
  }
  const qs = out.toString()
  return qs ? `/stamp?${qs}` : '/stamp'
}

/**
 * Build shareable stamp guide URL (canonical deep-link).
 * @param {string} siteBase e.g. https://satohash.io
 * @param {string} hash
 * @param {{ ref?: string, label?: string, campaign?: string, filename?: string }} [opts]
 */
export function satohashStampGuideUrl(siteBase, hash, opts = {}) {
  const base = String(siteBase || 'https://satohash.io').replace(/\/$/, '')
  const hex = normalizeSha256(hash)
  if (!hex) return `${base}/stamp`
  const q = new URLSearchParams({ hash: hex })
  if (opts.ref) q.set('ref', opts.ref)
  if (opts.source) q.set('source', opts.source)
  if (opts.label) q.set('label', opts.label)
  if (opts.campaign) q.set('campaign', opts.campaign)
  if (opts.filename) q.set('filename', opts.filename)
  return `${base}/stamp?${q.toString()}`
}

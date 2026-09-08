// Event tracking scaffolding for future analytics integration

const events = {
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LANGUAGE_CHANGED: 'language_changed',

  // Templates
  TEMPLATE_VIEWED: 'template_viewed',
  TEMPLATE_SELECTED: 'template_selected',

  // Contracts
  CONTRACT_CREATED: 'contract_created',
  CONTRACT_EDITED: 'contract_edited',
  CONTRACT_VIEWED: 'contract_viewed',

  // Signatures
  SIGNATURE_STARTED: 'signature_started',
  SIGNATURE_COMPLETED: 'signature_completed',

  // Timestamping
  TIMESTAMP_STARTED: 'timestamp_started',
  TIMESTAMP_COMPLETED: 'timestamp_completed',
  TIMESTAMP_DOWNLOADED: 'timestamp_downloaded',
  PROOF_SHARED: 'proof_shared',

  // Verification
  VERIFICATION_STARTED: 'verification_started',
  VERIFICATION_COMPLETED: 'verification_completed',

  LANDING_VIEW: 'funnel_landing',
  STAMP_VIEW: 'funnel_stamp',
  STAMP_DONE: 'funnel_stamp_done',
  VERIFY_VIEW: 'funnel_verify'
}

/** 8-char hex prefix only — never send a full hash. */
export function analyticsHashPrefix(hash) {
  const h = String(hash || '')
    .toLowerCase()
    .replace(/[^a-f0-9]/g, '')
  return h ? h.slice(0, 8) : undefined
}

const FULL_HASH = /^[a-f0-9]{64}$/i

function sanitizeAnalyticsProps(properties = {}) {
  const out = {}
  for (const [key, value] of Object.entries(properties)) {
    if (key === 'filename') continue
    if (typeof value === 'string' && FULL_HASH.test(value)) {
      if (!out.hash_prefix) {
        const prefix = analyticsHashPrefix(value)
        if (prefix) out.hash_prefix = prefix
      }
      continue
    }
    out[key] = value
  }
  return out
}

export const trackEvent = (eventName, properties = {}) => {
  const props = sanitizeAnalyticsProps(properties)
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, props)
  }

  try {
    if (typeof window !== 'undefined' && typeof window.umami?.track === 'function') {
      window.umami.track(eventName, props)
    }
  } catch {
    /* umami optional */
  }

  // Store events in localStorage for debugging
  try {
    const storedEvents = JSON.parse(localStorage.getItem('satohash_analytics') || '[]')
    storedEvents.push({
      event: eventName,
      properties: props,
      timestamp: new Date().toISOString()
    })
    // Keep only last 100 events
    if (storedEvents.length > 100) {
      storedEvents.shift()
    }
    localStorage.setItem('satohash_analytics', JSON.stringify(storedEvents))
  } catch (error) {
    console.error('Error storing analytics event:', error)
  }
}

export default events

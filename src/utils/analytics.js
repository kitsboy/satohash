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

  // Verification
  VERIFICATION_STARTED: 'verification_started',
  VERIFICATION_COMPLETED: 'verification_completed',

  LANDING_VIEW: 'funnel_landing',
  STAMP_VIEW: 'funnel_stamp',
  STAMP_DONE: 'funnel_stamp_done',
  VERIFY_VIEW: 'funnel_verify'
}

export const trackEvent = (eventName, properties = {}) => {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties)
  }

  try {
    if (typeof window !== 'undefined' && typeof window.umami?.track === 'function') {
      window.umami.track(eventName, properties)
    }
  } catch {
    /* umami optional */
  }

  // Store events in localStorage for debugging
  try {
    const storedEvents = JSON.parse(localStorage.getItem('satohash_analytics') || '[]')
    storedEvents.push({
      event: eventName,
      properties,
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

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
  VERIFICATION_COMPLETED: 'verification_completed'
}

export const trackEvent = (eventName, properties = {}) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties)
  }

  // In production, integrate with analytics service
  // Example: analytics.track(eventName, properties);

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

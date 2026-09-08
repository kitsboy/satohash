// Optional Sentry — no static @sentry/react import (keeps it off first paint).
// main.jsx assigns window.__SATOHASH_SENTRY__ after init when DSN is set.
function getSentry() {
  if (typeof globalThis === 'undefined') return null
  return globalThis.__SATOHASH_SENTRY__ || globalThis.Sentry || null
}

let sentryLoad = null
function loadSentry() {
  const existing = getSentry()
  if (existing) return Promise.resolve(existing)
  if (!import.meta.env.VITE_SENTRY_DSN) return Promise.resolve(null)
  if (!sentryLoad) {
    sentryLoad = import('@sentry/react')
      .then((Sentry) => {
        if (typeof globalThis !== 'undefined' && !globalThis.__SATOHASH_SENTRY__) {
          globalThis.__SATOHASH_SENTRY__ = Sentry
        }
        return Sentry
      })
      .catch(() => null)
  }
  return sentryLoad
}

export const addErrorBreadcrumb = (category, message, level = 'info') => {
  try {
    const Sentry = getSentry()
    if (!Sentry?.addBreadcrumb) return
    Sentry.addBreadcrumb({
      category,
      message,
      level,
      timestamp: Date.now() / 1000
    })
  } catch {
    // Sentry not initialized — ignore
  }
}

export const captureClientError = (error, context = {}) => {
  addErrorBreadcrumb('client.error', error?.message || String(error), 'error')
  const Sentry = getSentry()
  if (Sentry?.captureException) {
    Sentry.captureException(error, { extra: context })
    return
  }
  if (!import.meta.env.VITE_SENTRY_DSN) return
  loadSentry()
    .then((mod) => {
      if (mod?.captureException) mod.captureException(error, { extra: context })
    })
    .catch(() => {})
}

export const withErrorBoundary = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args)
    } catch (error) {
      captureClientError(error, { function: fn.name })
      throw error
    }
  }
}

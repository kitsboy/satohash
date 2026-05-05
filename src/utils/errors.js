import * as Sentry from '@sentry/react'

// Client-side error handling with breadcrumbs
export const addErrorBreadcrumb = (category, message, level = 'info') => {
  try {
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
  addErrorBreadcrumb('client.error', error.message, 'error')
  Sentry.captureException(error, { extra: context })
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

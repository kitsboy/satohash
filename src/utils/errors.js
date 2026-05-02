import * as Sentry from '@sentry/react';

// Client-side error handling with breadcrumbs
export const addErrorBreadcrumb = (category, message, level = 'info') => {
  if (Sentry.getCurrentHub().getClient()) {
    Sentry.addBreadcrumb({
      category,
      message,
      level,
      timestamp: Date.now() / 1000
    });
  }
};

export const captureClientError = (error, context = {}) => {
  addErrorBreadcrumb('client.error', error.message, 'error');
  Sentry.captureException(error, { extra: context });
};

export const withErrorBoundary = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureClientError(error, { function: fn.name });
      throw error;
    }
  };
};

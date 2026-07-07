/**
 * Structured API error codes for consistent client handling.
 */
export const ERROR_CODES = {
  VALIDATION_FAILED: {
    code: 'VALIDATION_FAILED',
    status: 400,
    message: 'Invalid input'
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    status: 404,
    message: 'Resource not found'
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    status: 401,
    message: 'Authorization required'
  },
  RATE_LIMITED: {
    code: 'RATE_LIMITED',
    status: 429,
    message: 'Too many requests'
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: 500,
    message: 'An unexpected server error occurred'
  },
  STAMP_TIMEOUT: {
    code: 'STAMP_TIMEOUT',
    status: 504,
    message: 'OTS stamp timed out'
  },
  PAYMENT_REQUIRED: {
    code: 'PAYMENT_REQUIRED',
    status: 402,
    message: 'Payment required'
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    status: 403,
    message: 'Forbidden'
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
    message: 'Service temporarily unavailable'
  }
}

/**
 * Send a structured error response.
 * @param {import('express').Response} res
 * @param {{ code: string, status: number, message: string }} errorDef
 * @param {{ details?: unknown, requestId?: string }} [opts]
 */
export function sendError(res, errorDef, opts = {}) {
  const body = {
    error: errorDef.message,
    code: errorDef.code
  }
  if (opts.details !== undefined) body.details = opts.details
  if (opts.requestId) body.requestId = opts.requestId
  return res.status(errorDef.status).json(body)
}

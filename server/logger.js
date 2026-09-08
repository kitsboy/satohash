import pino from 'pino'

import * as Sentry from '@sentry/node'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'filename',
      'original_filename',
      '*.filename',
      '*.original_filename',
      'req.body.filename',
      'req.body.original_filename',
      'body.filename',
      'body.original_filename'
    ],
    censor: '[redacted]'
  },
  // Production is JSON pino (no pino-pretty). Pretty transport is local/dev only.
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss Z'
          }
        }
      : undefined
})

export const auditLog = (event, user = null, details = {}) => {
  const logEntry = {
    event,
    timestamp: new Date().toISOString(),
    userId: user?.id || 'anonymous',
    ip: user?.ip || 'unknown',
    role: user?.role || 'user',
    details,
    correlationId: details.correlationId || 'none'
  }

  logger.info('[AUDIT] %s', JSON.stringify(logEntry, null, 2))

  if (Sentry.getCurrentHub().getScope()) {
    Sentry.setUser({ id: logEntry.userId, ip_address: logEntry.ip })
    Sentry.captureMessage(`Audit Log: ${event}`, 'info', { ...logEntry })
  }

  // Optional: DB insert for audit trail
  // db.prepare('INSERT INTO audit_logs (event, user_id, role, details, correlation_id) VALUES (?, ?, ?, ?, ?)').run(event, logEntry.userId, logEntry.role, JSON.stringify(details), logEntry.correlationId);
}

export default logger

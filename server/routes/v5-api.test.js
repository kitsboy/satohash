import { describe, it, expect } from 'vitest'

// A server module pulls in the whole runtime graph at import time: better-sqlite3 native
// bindings, pino (and its pino-pretty worker transport), @sentry/node, node-cron.
// Static imports are resolved during collection, but these two are *dynamic* imports
// inside the test body, so their cost is charged to the test budget — measured at
// 2s warm / 31s cold on THOR and ~8.4s under vitest, well past vitest's 5s default.
// The assertion itself is instant; the timeout is for module loading only.
const MODULE_IMPORT_TIMEOUT_MS = 60_000

describe('v5 public surface (smoke)', () => {
  it(
    'health ui helper renders html',
    async () => {
      const { renderHealthDashboardHtml } = await import('../health-dashboard.js')
      const html = renderHealthDashboardHtml({ ok: true })
      expect(html).toContain('Satohash Health')
    },
    MODULE_IMPORT_TIMEOUT_MS
  )

  it(
    'v5-jobs module exports startV5Jobs',
    async () => {
      const mod = await import('../v5-jobs.js')
      expect(typeof mod.startV5Jobs).toBe('function')
    },
    MODULE_IMPORT_TIMEOUT_MS
  )
})

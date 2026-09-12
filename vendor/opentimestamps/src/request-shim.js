'use strict'

/**
 * Satohash-local drop-in for `request-promise`.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * Upstream `opentimestamps@0.4.9` (LGPL-3.0) depends on `request@^2.85.0` and
 * `request-promise@^4.2.2`. Both have been deprecated since 2020 and were the
 * direct cause of the 2026-09-12 api.satohash.io 502 flap: an npm override
 * forced `request`'s nested `uuid` to ^9, and `request@2.88.2` does
 * `require('uuid/v4')` at load time — a subpath uuid 9 removed — so the whole
 * OpenTimestamps module graph threw ERR_PACKAGE_PATH_NOT_EXPORTED on require,
 * which crash-looped pm2. Dropping the dependency removes that class of break
 * permanently instead of pinning around it.
 *
 * This module implements exactly the slice of the request-promise API the OTS
 * client uses, on top of Node's built-in global `fetch` (undici): zero runtime
 * dependencies.
 *
 * Supported options:
 *   url      {string|URL}            request target
 *   method   {string}                defaults to GET
 *   headers  {object}
 *   body     {string|Buffer|Uint8Array|object}
 *   timeout  {number}                milliseconds; defaults to DEFAULT_TIMEOUT_MS
 *   encoding {null}                  resolve the body as a Buffer instead of text
 *   json     {boolean}               serialize an object body, parse the response
 *
 * Resolution / rejection contract (matches what the OTS sources expect):
 *   - resolves with the response body: Buffer when `encoding === null`,
 *     parsed object when `json === true`, else a string
 *   - rejects with an Error carrying `.statusCode` (0 for transport/timeout
 *     failures) and `.error` (the response body, or the failure message) —
 *     calendar.js reads `err.statusCode === 404` and `err.error.toString()`
 *   - gzip/deflate/br are decoded transparently by fetch (upstream used gzip: true)
 */

const DEFAULT_TIMEOUT_MS = 30000

// AbortSignal.timeout (Chrome 103+/Safari 16+/Firefox 100+) is a 2022-era API.
// The SPA's build target (es2022) and the general supported-browser matrix can
// include engines that lack it, and browserify does NOT polyfill it. Fall back
// to a manual AbortController+setTimeout timer so a timeout signal is available
// everywhere. Node has AbortSignal.timeout since 17.3, so this only matters on
// older browsers — but it makes the bundle robust without any polyfill.
function timeoutSignal (ms) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms)
  }
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  if (!controller) {
    return undefined
  }
  const timer = setTimeout(() => controller.abort(), ms)
  // do not keep the event loop alive on the Node/server side (mirrors upstream)
  if (timer && typeof timer.unref === 'function') timer.unref()
  return controller.signal
}

class RequestError extends Error {
  constructor (message, statusCode, detail) {
    super(message)
    this.name = 'RequestError'
    this.statusCode = statusCode
    this.error = detail
  }

  toString () {
    return this.name + ': ' + this.message + (this.statusCode ? ' [' + this.statusCode + ']' : '')
  }
}

function normalizeBody (body, headers) {
  if (body === undefined || body === null) {
    return undefined
  }
  if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
    return body
  }
  if (typeof body === 'string') {
    return body
  }
  // byte arrays are sent as-is (the OTS domain is binary); everything else is
  // JSON-encoded, matching upstream `json: true`
  if (Array.isArray(body) && body.every((b) => Number.isInteger(b) && b >= 0 && b <= 255)) {
    return Buffer.from(body)
  }
  if (!headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json'
  }
  return JSON.stringify(body)
}

module.exports = function requestPromise (options) {
  const opts = options || {}
  const url = opts.url instanceof URL ? opts.url.toString() : String(opts.url)
  const method = String(opts.method || 'GET').toUpperCase()
  const headers = Object.assign({}, opts.headers)
  const timeoutMs = Number(opts.timeout) > 0 ? Number(opts.timeout) : DEFAULT_TIMEOUT_MS

  const init = {
    method,
    headers,
    redirect: 'follow',
    signal: timeoutSignal(timeoutMs)
  }

  if (method !== 'GET' && method !== 'HEAD') {
    const body = normalizeBody(opts.body, headers)
    if (body !== undefined) {
      init.body = body
    }
  }
  if (opts.json) {
    headers.Accept = headers.Accept || 'application/json'
  }

  return fetch(url, init).then(
    async (response) => {
      let body
      if (opts.json) {
        const text = await response.text()
        if (text.length === 0) {
          body = null
        } else {
          try {
            body = JSON.parse(text)
          } catch (_e) {
            body = text
          }
        }
      } else if (opts.encoding === null) {
        body = Buffer.from(await response.arrayBuffer())
      } else {
        body = await response.text()
      }

      if (!response.ok) {
        let detail
        if (typeof body === 'string') {
          detail = body
        } else if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
          detail = Buffer.from(body).toString('utf8')
        } else {
          detail = body === null || body === undefined ? '' : JSON.stringify(body)
        }
        throw new RequestError(
          'Request failed with status code ' + response.status,
          response.status,
          (detail || '').slice(0, 500)
        )
      }
      return body
    },
    (err) => {
      const message = err && err.message ? err.message : String(err)
      throw new RequestError(message, 0, message)
    }
  )
}

module.exports.RequestError = RequestError
module.exports.DEFAULT_TIMEOUT_MS = DEFAULT_TIMEOUT_MS

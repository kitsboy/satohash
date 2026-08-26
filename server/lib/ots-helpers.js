import OpenTimestamps from 'opentimestamps'

export const loadOtsFile = (buffer) => {
  try {
    return OpenTimestamps.DetachedTimestampFile.deserialize(buffer)
  } catch (e) {
    throw new Error('Invalid OTS file format.')
  }
}

const VERIFY_BASE_URL = 'https://satohash.giveabit.io'

// Working public OTS aggregator pools. Verified live from THOR on 2026-08-26:
// a/b.pool.opentimestamps.org and a.pool.eternitywall.com accept POST /digest
// and return a real pending attestation in <1.5s. These aggregate up to the
// canonical alice/bob/finney calendars (the attestations in the produced .ots
// correctly reference them).
//
// ots.btc.catallaxy.com is EXCLUDED: it is unreachable from THOR (connection
// timeout on both / and /digest). A dead calendar in the submit list stalls
// the library's Promise.all(softFail) aggregate past the stamp timeout, which
// is the original STAMP_TIMEOUT root cause.
const WORKING_CALENDARS = [
  'https://a.pool.opentimestamps.org',
  'https://b.pool.opentimestamps.org',
  'https://a.pool.eternitywall.com'
]

// Min attestations required for a valid stamp (OpenTimestamps library default).
const MIN_ATTESTATIONS = 2

/**
 * Stamp a detached timestamp against OTS calendars with a hard per-call budget.
 *
 * Fixes the two bugs that caused POST /api/stamp to 504 (STAMP_TIMEOUT):
 *  1. The old call `OpenTimestamps.stamp(detached, calendarUrls)` passed the
 *     calendar array where the library expects an options object, so the
 *     hardcoded alice/bob/finney list was silently ignored and the library's
 *     DEFAULT_AGGREGATORS (incl. the then-unreachable ots.btc.catallaxy.com)
 *     were used instead. We now pass proper `{ calendars, m }` options.
 *  2. The library's RemoteCalendar has NO request timeout, so a dead calendar
 *     hangs the Promise.all(softFail) aggregate indefinitely. We bound each
 *     calendar's request so an unresponsive host soft-fails instead of
 *     consuming the whole budget, and we race the stamp against an overall
 *     `timeoutMs` budget.
 *
 * Otherwise behavior is unchanged: uses the library's native makeMerkleTree +
 * merge pipeline, so the serialized .ots has the same shape as before.
 *
 * @param {import('opentimestamps').DetachedTimestampFile} detached
 * @param {string[]} [calendarUrls] Public calendar URL list. Defaults to WORKING_CALENDARS.
 * @param {number} [timeoutMs] Hard overall budget. Default 30000.
 */
export async function stampWithTimeout(detached, calendarUrls, timeoutMs = 30000) {
  const calendars = calendarUrls && calendarUrls.length ? calendarUrls : WORKING_CALENDARS
  // Give each calendar a bounded request window so a dead/unresponsive host
  // soft-fails instead of stalling the whole aggregate.
  const perCalendarMs = Math.max(3000, Math.floor((timeoutMs - 1000) / calendars.length))
  // The library reads `this.timeout` on the RemoteCalendar at submit time and
  // applies it as the HTTP request timeout.
  OpenTimestamps.Calendar.RemoteCalendar.prototype.timeout = perCalendarMs

  let timer
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('OTS stamp timed out after 30s')), timeoutMs)
  })
  try {
    await Promise.race([
      OpenTimestamps.stamp(detached, { calendars, m: MIN_ATTESTATIONS }),
      timeoutPromise
    ])
  } finally {
    clearTimeout(timer)
  }
}

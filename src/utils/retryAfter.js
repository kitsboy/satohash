/** Seconds to wait from a Retry-After header. Falls back to 60 (public limit is about 5/minute). */
export function retryAfterSeconds(header, nowMs = Date.now()) {
  const raw = String(header ?? '').trim()
  if (!raw) return 60
  if (/^\d+$/.test(raw)) {
    const n = Number(raw)
    if (!Number.isFinite(n) || n <= 0) return 60
    return Math.min(120, n)
  }
  const when = Date.parse(raw)
  if (!Number.isFinite(when)) return 60
  const seconds = Math.ceil((when - nowMs) / 1000)
  if (seconds <= 0) return 1
  return Math.min(120, seconds)
}

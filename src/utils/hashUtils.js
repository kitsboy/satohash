/** Normalize a SHA-256 hex string (64 lowercase hex chars). */
export function normalizeSha256(input) {
  if (!input || typeof input !== 'string') return null
  const h = input.trim().toLowerCase()
  return /^[a-f0-9]{64}$/.test(h) ? h : null
}

/** Parse one hash per line from a multi-line paste (deduped, order preserved). */
export function parseHashLines(input) {
  const seen = new Set()
  const hashes = []
  for (const line of String(input).split(/\r?\n/)) {
    const hash = normalizeSha256(line)
    if (hash && !seen.has(hash)) {
      seen.add(hash)
      hashes.push(hash)
    }
  }
  return hashes
}

export function isSha256Hex(input) {
  return normalizeSha256(input) !== null
}

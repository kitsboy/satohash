/**
 * Ask the live API for a chain-resolved verdict.
 *
 * POST /api/verify is the only client path that sets `verified` from a
 * Bitcoin block header. A registry GET is bookkeeping, not proof.
 * 404 still returns a body — keep it so the UI can say "not proven".
 */
export async function fetchChainVerdict(apiBase, hash) {
  const hex = String(hash || '')
    .trim()
    .toLowerCase()
  if (!/^[a-f0-9]{64}$/.test(hex)) return null
  try {
    const origin = String(apiBase || '').replace(/\/$/, '')
    const res = await fetch(`${origin}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash: hex })
    })
    const body = await res.json().catch(() => null)
    return body && typeof body === 'object' ? body : null
  } catch {
    return null
  }
}

/** True when `data` is a /api/verify payload, not a stamp row. */
export function isChainVerdict(data) {
  if (!data || typeof data !== 'object') return false
  if (typeof data.verified !== 'boolean') return false
  return (
    data.verified_method != null ||
    data.reason != null ||
    data.registry_check === true ||
    typeof data.explainer === 'string'
  )
}

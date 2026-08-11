const SESSION_KEY = 'satohash_last_proof'

export function persistLastProof(proof) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(proof))
    if (proof?.id) localStorage.setItem('satohash_last_proof_id', String(proof.id))
  } catch {
    /* quota / private mode */
  }
}

export function readLastProof() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return null
}

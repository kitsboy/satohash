const SESSION_KEY = 'satohash_last_proof'
const LOCAL_KEY = 'satohash_last_proof'

export function persistLastProof(proof) {
  try {
    const raw = JSON.stringify(proof)
    sessionStorage.setItem(SESSION_KEY, raw)
    localStorage.setItem(LOCAL_KEY, raw)
    if (proof?.id) localStorage.setItem('satohash_last_proof_id', String(proof.id))
    if (proof?.hash) localStorage.setItem('satohash_last_proof_hash', String(proof.hash))
  } catch {
    /* quota / private mode */
  }
}

export function readLastProof() {
  try {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session) return JSON.parse(session)
  } catch {
    /* ignore */
  }
  try {
    const local = localStorage.getItem(LOCAL_KEY)
    if (local) return JSON.parse(local)
  } catch {
    /* ignore */
  }
  return null
}

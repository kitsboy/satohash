/** Canonical JSON for cross-app hash parity (MotoPass, Katoa, Satohash). */
export function canonicalJsonStringify(obj) {
  return JSON.stringify(obj, Object.keys(obj).sort())
}

export async function sha256HexFromObject(obj) {
  const canonical = canonicalJsonStringify(obj)
  const data = new TextEncoder().encode(canonical)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

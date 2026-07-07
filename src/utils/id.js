/** Stable client-side IDs without Math.random in render paths. */
export function clientId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now().toString(36)}`
}

export function pseudoHash(input, length = 64) {
  let h = 2166136261
  const s = String(input)
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0).toString(16).padStart(length, '0').slice(0, length)
}

export function pickRotating(list, index) {
  if (!list?.length) return ''
  return list[((index % list.length) + list.length) % list.length]
}

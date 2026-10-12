/** A public git SHA is 7–40 hex characters. Anything else is a bad label. */
export function publicGitSha(value) {
  const s = String(value ?? '').trim()
  if (!/^[0-9a-f]{7,40}$/i.test(s)) return null
  return s.toLowerCase()
}

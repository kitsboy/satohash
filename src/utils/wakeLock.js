/** Keep screen awake during long mobile hashes. Best-effort; no throw. */

let sentinel = null

export async function requestWakeLock() {
  try {
    if (typeof navigator === 'undefined' || !navigator.wakeLock?.request) return null
    sentinel = await navigator.wakeLock.request('screen')
    sentinel.addEventListener?.('release', () => {
      sentinel = null
    })
    return sentinel
  } catch {
    return null
  }
}

export async function releaseWakeLock() {
  try {
    await sentinel?.release?.()
  } catch {
    /* ignore */
  }
  sentinel = null
}

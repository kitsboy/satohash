/** Browser notification when a pending stamp becomes Bitcoin-confirmed. */

const NOTIFIED_PREFIX = 'satohash_notified_'

export function alreadyNotified(hash) {
  const h = String(hash || '').toLowerCase()
  if (!/^[a-f0-9]{64}$/.test(h)) return true
  try {
    return localStorage.getItem(NOTIFIED_PREFIX + h) === '1'
  } catch {
    return false
  }
}

export function markNotified(hash) {
  const h = String(hash || '').toLowerCase()
  if (!/^[a-f0-9]{64}$/.test(h)) return
  try {
    localStorage.setItem(NOTIFIED_PREFIX + h, '1')
  } catch {
    /* quota */
  }
}

export function requestConfirmNotifyPermission() {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return Promise.resolve('unsupported')
  }
  if (Notification.permission === 'granted') return Promise.resolve('granted')
  if (Notification.permission === 'denied') return Promise.resolve('denied')
  return Notification.requestPermission().catch(() => 'denied')
}

export function notifyProofConfirmed({ title, body, url, hash } = {}) {
  if (hash && alreadyNotified(hash)) return false
  if (typeof window === 'undefined' || typeof Notification === 'undefined') return false
  if (Notification.permission !== 'granted') return false
  try {
    const n = new Notification(title || 'Confirmed on Bitcoin', {
      body: body || 'Your OpenTimestamps receipt is ready. Download the .ots.',
      icon: '/logo.png',
      tag: url || 'satohash-confirmed'
    })
    n.onclick = () => {
      try {
        window.focus()
        if (url) window.location.href = url
      } catch {
        /* ignore */
      }
    }
    if (hash) markNotified(hash)
    return true
  } catch {
    return false
  }
}

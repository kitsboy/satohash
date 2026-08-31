/**
 * Mobile-friendly share helpers for stamp success / verify pages.
 */

export function buildVerifyUrl(proof) {
  if (typeof window === 'undefined') return ''
  const origin = window.location.origin
  if (proof?.id && !String(proof.id).startsWith('ots-') && proof?.source !== 'browser-ots') {
    return `${origin}/verify/${proof.id}`
  }
  if (proof?.hash && /^[a-f0-9]{64}$/i.test(proof.hash)) {
    return `${origin}/verify/${proof.hash}`
  }
  return `${origin}/verify`
}

/** Default share / QR / copy URL — full-nav proof card (zero-JS Function on Pages). */
export function buildProofCardUrl(proof) {
  if (typeof window === 'undefined') return ''
  const origin = window.location.origin
  if (proof?.hash && /^[a-f0-9]{64}$/i.test(proof.hash)) {
    return `${origin}/p/${String(proof.hash).toLowerCase()}`
  }
  return buildVerifyUrl(proof)
}

export function buildShareText(proof) {
  const status = (proof?.status || 'pending').toLowerCase()
  const label = proof?.filename || 'document'
  if (status === 'confirmed') {
    return `Bitcoin-confirmed proof for “${label}” via Satohash / OpenTimestamps.`
  }
  return `Pending Bitcoin timestamp for “${label}” via Satohash. Submitted — not confirmed until Bitcoin anchors.`
}

export function buildXIntent({ text, url }) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text || '')}&url=${encodeURIComponent(url || '')}&via=give_bit`
}

export function buildNostrShareLinks({ text, url, nostrEventId }) {
  const links = []
  const id = typeof nostrEventId === 'string' ? nostrEventId.trim() : ''
  const encodedText = encodeURIComponent(text || '')
  const encodedUrl = encodeURIComponent(url || '')

  if (id) {
    links.push({
      label: 'njump',
      href: `https://njump.me/${encodeURIComponent(id)}`
    })
  }

  links.push({
    label: 'Snort',
    href: `https://snort.social/handler/share?url=${encodedUrl}&text=${encodedText}`
  })
  links.push({
    label: 'Primal',
    href: `https://primal.net/search/${encodedUrl}?text=${encodedText}&url=${encodedUrl}`
  })

  return links
}

/**
 * Prefer Web Share API; fall back to clipboard.
 * @returns {'shared'|'copied'|'failed'}
 */
export async function shareProofLink(proof) {
  const url = buildProofCardUrl(proof)
  const title = 'Satohash proof'
  const text = buildShareText(proof)

  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      // Chrome Android often drops the `url` field — put the link in text too
      // so iPhone friends still get a tappable /p/<hash>.
      await navigator.share({ title, text: `${text}\n${url}`, url })
      return 'shared'
    }
  } catch (err) {
    if (err?.name === 'AbortError') return 'failed'
  }

  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    return 'failed'
  }
}

/**
 * Share or download a File when supported (e.g. .ots or zip package).
 */
export async function shareOrDownloadFile(file, fallbackDownloadName) {
  try {
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: file.name || fallbackDownloadName || 'proof',
        text: 'Satohash proof package'
      })
      return 'shared'
    }
  } catch (err) {
    if (err?.name === 'AbortError') return 'failed'
  }

  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name || fallbackDownloadName || 'proof.bin'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
  return 'downloaded'
}

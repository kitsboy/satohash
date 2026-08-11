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

export function buildShareText(proof) {
  const status = (proof?.status || 'pending').toLowerCase()
  const label = proof?.filename || 'document'
  if (status === 'confirmed') {
    return `Bitcoin-confirmed proof for “${label}” via Satohash / OpenTimestamps.`
  }
  return `Pending Bitcoin timestamp for “${label}” via Satohash. Submitted — not confirmed until Bitcoin anchors.`
}

/**
 * Prefer Web Share API; fall back to clipboard.
 * @returns {'shared'|'copied'|'failed'}
 */
export async function shareProofLink(proof) {
  const url = buildVerifyUrl(proof)
  const title = 'Satohash proof'
  const text = buildShareText(proof)

  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title, text, url })
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

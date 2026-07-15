import { normalizeSha256 } from './hashUtils'

/**
 * Browser-side OpenTimestamps structural checks.
 * Full Bitcoin attestation verify requires server or opentimestamps CLI (Node).
 * Aligns with MotoPass vaultVerify.ts for cross-project consistency.
 */
export async function verifyOtsStructurally(file, expectedHash) {
  const hash = normalizeSha256(expectedHash)
  const hashOptional = !expectedHash || !String(expectedHash).trim()
  if (!hash && !hashOptional) {
    return {
      verified: false,
      hash: String(expectedHash || '').trim(),
      mode: 'failed',
      message: 'Invalid SHA-256 — expected 64 hex characters'
    }
  }

  let bytes
  if (file instanceof Uint8Array) {
    bytes = file
  } else if (file instanceof ArrayBuffer) {
    bytes = new Uint8Array(file)
  } else if (typeof file?.arrayBuffer === 'function') {
    bytes = new Uint8Array(await file.arrayBuffer())
  } else {
    return {
      verified: false,
      hash: hash || null,
      mode: 'failed',
      message: 'Could not read OTS file bytes'
    }
  }

  if (bytes.length < 32) {
    return {
      verified: false,
      hash,
      mode: 'structural',
      message: 'OTS file too small — file may be corrupt'
    }
  }

  const looksLikeOts = bytes.length >= 64 && bytes[0] !== 0x7b

  if (!looksLikeOts) {
    return {
      verified: false,
      hash,
      mode: 'structural',
      message: 'File does not look like a valid .ots timestamp'
    }
  }

  return {
    verified: true,
    hash: hash || null,
    mode: 'structural',
    message: hash
      ? `OTS file loaded (${file.size} bytes) — structural check passed; Bitcoin attestation requires API or opentimestamps.org`
      : `OTS file loaded (${file.size} bytes) — paste SHA-256 hash to pair with this proof`
  }
}

/** Byte-compare uploaded OTS against a hosted proof URL (static hosting). */
export async function compareOtsToHosted(file, hostedUrl, expectedHash) {
  const base = await verifyOtsStructurally(file, expectedHash)
  if (!base.verified || !hostedUrl) return base

  try {
    const res = await fetch(hostedUrl)
    if (!res.ok) {
      return { ...base, message: `${base.message} · hosted proof not found (${res.status})` }
    }
    const hosted = new Uint8Array(await res.arrayBuffer())
    const uploaded = new Uint8Array(await file.arrayBuffer())
    if (hosted.length !== uploaded.length) {
      return {
        verified: false,
        hash: base.hash,
        mode: 'structural',
        message: 'Uploaded OTS size differs from hosted proof — may be outdated'
      }
    }
    const match = hosted.every((b, i) => b === uploaded[i])
    return {
      verified: match,
      hash: base.hash,
      mode: 'structural',
      message: match
        ? 'Uploaded OTS matches hosted proof byte-for-byte'
        : 'Uploaded OTS differs from hosted proof'
    }
  } catch {
    return base
  }
}

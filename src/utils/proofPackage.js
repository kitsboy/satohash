import JSZip from 'jszip'
import { downloadCertificate } from './certificate'
import { getApiUrl } from '../config/constants'
import { shareOrDownloadFile } from './shareProof'

/**
 * Build a portable proof package: metadata JSON + optional .ots + README.
 * Certificate PDF is triggered separately via downloadCertificate (jspdf).
 */
export async function buildProofPackage(proof, { includeOts = true } = {}) {
  const zip = new JSZip()
  const id = proof?.id || proof?.hash?.slice(0, 16) || 'proof'
  const safeName = String(proof?.filename || 'document')
    .replace(/[^\w.-]+/g, '_')
    .slice(0, 80)

  const meta = {
    schema: 'satohash.proof-package.v1',
    generated_at: new Date().toISOString(),
    product: 'satohash',
    id: proof?.id || null,
    hash: proof?.hash || null,
    filename: proof?.filename || null,
    status: proof?.status || 'pending',
    bitcoin_block_height: proof?.bitcoin_block_height || null,
    created_at: proof?.created_at || null,
    confirmed_at: proof?.confirmed_at || null,
    source: proof?.source || null,
    verify_path: proof?.id
      ? `/verify/${proof.id}`
      : proof?.hash
        ? `/verify/${proof.hash}`
        : '/verify',
    notes: [
      'Pending ≠ Bitcoin confirmed. Only status=confirmed means the fingerprint is anchored.',
      'Verify independently with OpenTimestamps tooling when you have the .ots file.',
      'API: https://api.satohash.io'
    ]
  }
  zip.file('proof.json', JSON.stringify(meta, null, 2))
  zip.file(
    'README.txt',
    [
      'Satohash proof package',
      '======================',
      '',
      `File: ${proof?.filename || '—'}`,
      `SHA-256: ${proof?.hash || '—'}`,
      `Status: ${proof?.status || 'pending'}`,
      `Stamp id: ${proof?.id || '—'}`,
      '',
      'Open proof.json for machine-readable metadata.',
      'If present, proof.ots is the OpenTimestamps receipt.',
      'You can re-check at https://satohash.io/verify without trusting Satohash alone.',
      ''
    ].join('\n')
  )

  if (
    includeOts &&
    proof?.id &&
    proof?.source !== 'browser-ots' &&
    !String(proof.id).startsWith('ots-')
  ) {
    try {
      const res = await fetch(
        `${getApiUrl()}/api/stamps/${encodeURIComponent(proof.id)}?download=true`
      )
      if (res.ok) {
        const buf = await res.arrayBuffer()
        zip.file(`${safeName || 'proof'}.ots`, buf)
      }
    } catch {
      /* package still useful without ots */
    }
  } else if (proof?.otsFileBase64) {
    try {
      const bin = atob(proof.otsFileBase64)
      const bytes = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
      zip.file(`${safeName || 'proof'}.ots`, bytes)
    } catch {
      /* skip */
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  return new File([blob], `satohash-proof-${id}.zip`, { type: 'application/zip' })
}

export async function downloadProofPackage(proof) {
  const file = await buildProofPackage(proof)
  return shareOrDownloadFile(file, file.name)
}

/** Convenience: package + optional PDF certificate side-by-side */
export async function exportProofBundle(proof, { certificate = true } = {}) {
  const result = await downloadProofPackage(proof)
  if (certificate) {
    try {
      downloadCertificate({
        id: proof?.id || 'pending',
        name: proof?.filename || 'Document',
        fullHash: proof?.hash,
        hash: proof?.hash,
        date: new Date().toISOString().split('T')[0],
        status: proof?.status === 'confirmed' ? 'confirmed' : 'pending'
      })
    } catch {
      /* non-fatal */
    }
  }
  return result
}

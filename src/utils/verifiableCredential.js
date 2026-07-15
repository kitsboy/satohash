import { getVerifyUrl } from '../config/constants'
import { normalizeSha256 } from './hashUtils'

/** W3C Verifiable Credential JSON-LD export (client-side, no server). */
export function buildVerifiableCredential(proof) {
  const hash = normalizeSha256(proof.hash)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://satohash.io'
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://w3id.org/security/data-integrity/v1'
    ],
    type: ['VerifiableCredential', 'SatohashProofCredential'],
    issuer: {
      id: `${origin}/trust`,
      name: 'Satohash'
    },
    issuanceDate: proof.created_at || new Date().toISOString(),
    credentialSubject: {
      id: `urn:sha256:${hash}`,
      proofHash: hash,
      filename: proof.filename || proof.label,
      status: proof.status || 'pending',
      verifyUrl: `${getVerifyUrl()}/${proof.id || hash}`
    },
    proof: {
      type: 'DataIntegrityProof',
      proofPurpose: 'assertionMethod',
      verificationMethod: `${origin}/.well-known/nostr.json`,
      created: proof.created_at || new Date().toISOString()
    }
  }
}

export function downloadVerifiableCredential(proof) {
  const vc = buildVerifiableCredential(proof)
  const blob = new Blob([JSON.stringify(vc, null, 2)], { type: 'application/ld+json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `satohash-vc-${(proof.id || proof.hash || 'proof').slice(0, 12)}.jsonld`
  a.click()
  URL.revokeObjectURL(url)
}

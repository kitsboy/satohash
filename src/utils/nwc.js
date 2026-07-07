/**
 * Nostr Wallet Connect (NWC) Utility for Satohash Protocol.
 * Enables automated micropayments for notarization services.
 */

import { pseudoHash } from './id'

export const parseNwcUrl = (url) => {
  try {
    const parsed = new URL(url.replace('nostr+walletconnect:', 'http:'))
    return {
      pubkey: parsed.hostname,
      relay: parsed.searchParams.get('relay'),
      secret: parsed.searchParams.get('secret'),
      lud16: parsed.searchParams.get('lud16')
    }
  } catch {
    return null
  }
}

/** Demo NWC settlement — deterministic preimage; production uses NIP-47 relay. */
export const sendPaymentRequest = async (nwcUrl, invoiceRef = 'demo') => {
  const connection = parseNwcUrl(nwcUrl)
  if (!connection) throw new Error('Invalid NWC connection string.')

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        preimage: `demo_preimage_${pseudoHash(invoiceRef + connection.pubkey, 16)}`,
        demo: true
      })
    }, 1500)
  })
}

import { nip19, nip05 } from 'nostr-tools'

const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social',
  'wss://relay.nostr.band'
]

/** Decode npub or 64-char hex to lowercase hex pubkey. */
export function resolvePubkeyHex(input) {
  if (!input) return null
  const trimmed = input.trim()
  if (/^[a-f0-9]{64}$/i.test(trimmed)) return trimmed.toLowerCase()
  if (trimmed.startsWith('npub1')) {
    try {
      const decoded = nip19.decode(trimmed)
      if (decoded.type === 'npub') return decoded.data.toLowerCase()
    } catch {
      return null
    }
  }
  return null
}

/** Verify a NIP-05 identifier against an expected hex pubkey. */
export async function verifyNip05(handle, pubkeyHex) {
  if (!handle?.includes('@')) {
    throw new Error('Enter a valid NIP-05 handle (user@domain.com)')
  }
  const pk = resolvePubkeyHex(pubkeyHex)
  if (!pk) {
    throw new Error('Connect your Nostr extension or paste a valid npub first')
  }
  const ok = await nip05.verify(handle.trim().toLowerCase(), pk)
  if (!ok) throw new Error('NIP-05 mismatch — pubkeys do not match')
  return { handle: handle.trim().toLowerCase(), pubkeyHex: pk, verified: true }
}

/** Resolve LNURL-pay metadata for a Lightning Address (LUD-16). */
export async function verifyLightningAddress(address) {
  if (!address?.includes('@')) {
    throw new Error('Enter a valid Lightning Address (user@domain.com)')
  }
  const [local, domain] = address.trim().toLowerCase().split('@')
  const res = await fetch(`https://${domain}/.well-known/lnurlp/${local}`)
  if (!res.ok) throw new Error('Lightning Address not found')
  const data = await res.json()
  if (data.status === 'ERROR') throw new Error(data.reason || 'LNURL resolution failed')
  return { address: `${local}@${domain}`, callback: data.callback, metadata: data }
}

/** Register a satohash.io NIP-05 name when the Express API is available. */
export async function registerSatohashNip05(name, pubkeyHex, npub) {
  const apiBase = import.meta.env.VITE_API_URL || ''
  if (!apiBase) return null
  const res = await fetch(`${apiBase}/api/identity/nip05`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-npub': npub
    },
    body: JSON.stringify({ nip05_name: name, pubkey_hex: pubkeyHex })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Registration failed')
  }
  return res.json()
}

export { RELAYS }

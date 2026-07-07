/** Encrypted vault export — passphrase-protected JSON backup of local proofs */
export async function exportEncryptedVault(passphrase) {
  if (!passphrase || passphrase.length < 8) {
    throw new Error('Passphrase must be at least 8 characters')
  }
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    stamps: JSON.parse(localStorage.getItem('satohash_stamps') || '[]'),
    contracts: JSON.parse(localStorage.getItem('satohash_contracts') || '[]'),
    queue: JSON.parse(localStorage.getItem('satohash_offline_queue') || '[]')
  }
  const json = JSON.stringify(payload)
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(json))
  const bundle = {
    alg: 'AES-GCM-PBKDF2',
    salt: btoa(String.fromCharCode(...salt)),
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(cipher)))
  }
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `satohash-vault-${Date.now()}.vault.json`
  a.click()
  URL.revokeObjectURL(url)
  return { count: payload.stamps.length + payload.contracts.length }
}

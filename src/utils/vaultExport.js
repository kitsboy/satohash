/** Encrypted vault export — passphrase-protected JSON backup of local proofs */

function b64ToBytes(b64) {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function bytesToB64(bytes) {
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}

async function deriveAesKey(passphrase, salt, usages) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    usages
  )
}

export async function exportEncryptedVault(passphrase) {
  if (!passphrase || passphrase.length < 8) {
    throw new Error('Passphrase must be at least 8 characters')
  }
  const payload = {
    version: 2,
    appVersion: '5.0.0-ELITE',
    exportedAt: new Date().toISOString(),
    stamps: JSON.parse(localStorage.getItem('satohash_stamps') || '[]'),
    contracts: JSON.parse(localStorage.getItem('satohash_contracts') || '[]'),
    queue: JSON.parse(localStorage.getItem('satohash_offline_queue') || '[]')
  }
  const json = JSON.stringify(payload)
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveAesKey(passphrase, salt, ['encrypt'])
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(json))
  const bundle = {
    format: 'satohash-vault',
    alg: 'AES-GCM-PBKDF2',
    version: 2,
    appVersion: '5.0.0-ELITE',
    salt: bytesToB64(salt),
    iv: bytesToB64(iv),
    data: bytesToB64(new Uint8Array(cipher))
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

/**
 * Decrypt a satohash vault backup bundle and restore localStorage keys.
 * Accepts AES-GCM-PBKDF2 bundles from exportEncryptedVault (v1/v2).
 */
export async function importEncryptedVault(bundle, passphrase) {
  if (!passphrase || passphrase.length < 8) {
    throw new Error('Passphrase must be at least 8 characters')
  }
  if (!bundle || typeof bundle !== 'object') {
    throw new Error('Invalid backup file')
  }

  // Modern AES-GCM-PBKDF2 bundle (exportEncryptedVault)
  if (bundle.alg === 'AES-GCM-PBKDF2' && bundle.data && bundle.salt && bundle.iv) {
    const salt = b64ToBytes(bundle.salt)
    const iv = b64ToBytes(bundle.iv)
    const data = b64ToBytes(bundle.data)
    const key = await deriveAesKey(passphrase, salt, ['decrypt'])
    let plain
    try {
      plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    } catch {
      throw new Error('Decryption failed — wrong passphrase or corrupt file')
    }
    const payload = JSON.parse(new TextDecoder().decode(plain))
    const stamps = Array.isArray(payload.stamps) ? payload.stamps : []
    const contracts = Array.isArray(payload.contracts) ? payload.contracts : []
    const queue = Array.isArray(payload.queue) ? payload.queue : []
    localStorage.setItem('satohash_stamps', JSON.stringify(stamps))
    localStorage.setItem('satohash_contracts', JSON.stringify(contracts))
    localStorage.setItem('satohash_offline_queue', JSON.stringify(queue))
    return {
      stamps: stamps.length,
      contracts: contracts.length,
      queue: queue.length,
      version: payload.version || bundle.version || 2
    }
  }

  // Legacy XOR envelope (pre-v5 backups): { version: '4.1.0-ELITE', payload: b64 }
  if (bundle.payload && (bundle.version === '4.1.0-ELITE' || bundle.version === '5.0.0-ELITE')) {
    const rawBase64 = decodeURIComponent(escape(atob(bundle.payload)))
    let decryptedStr = ''
    for (let i = 0; i < rawBase64.length; i++) {
      const charCode = rawBase64.charCodeAt(i) ^ passphrase.charCodeAt(i % passphrase.length)
      decryptedStr += String.fromCharCode(charCode)
    }
    const stamps = JSON.parse(decryptedStr)
    if (!Array.isArray(stamps)) throw new Error('Decryption mismatch')
    localStorage.setItem('satohash_stamps', JSON.stringify(stamps))
    return { stamps: stamps.length, contracts: 0, queue: 0, version: bundle.version }
  }

  throw new Error('Unrecognized vault backup format')
}

/** True if JSON object looks like an encrypted vault backup we can import */
export function isEncryptedVaultBundle(data) {
  if (!data || typeof data !== 'object') return false
  if (data.alg === 'AES-GCM-PBKDF2' && data.data && data.salt && data.iv) return true
  if (data.payload && (data.version === '4.1.0-ELITE' || data.version === '5.0.0-ELITE'))
    return true
  return false
}

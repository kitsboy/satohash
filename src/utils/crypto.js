/**
 * Calculate SHA-256 hash of a file or string
 */
export const calculateHash = async (input) => {
  let data

  if (input instanceof File) {
    const arrayBuffer = await input.arrayBuffer()
    data = arrayBuffer
  } else if (typeof input === 'string') {
    data = new TextEncoder().encode(input)
  } else {
    throw new Error('Unsupported input type for hashing')
  }

  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Generate a random cryptographic ID
 */
export const generateId = () => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
/**
 * Calculate Merkle Root from an array of hashes
 */
export const calculateMerkleRoot = async (hashes) => {
  if (hashes.length === 0) return null
  if (hashes.length === 1) return hashes[0]

  const nextLevel = []
  for (let i = 0; i < hashes.length; i += 2) {
    const left = hashes[i]
    const right = hashes[i + 1] || left // If odd, duplicate the last hash
    const combined = left + right
    const hash = await calculateHash(combined)
    nextLevel.push(hash)
  }

  return calculateMerkleRoot(nextLevel)
}

/**
 * Client-side Zero-Knowledge Encryption for the Satohash "Dark Vault".
 * Uses AES-GCM 256-bit encryption.
 */
export const encryptFile = async (dataBuffer, password) => {
  const enc = new TextEncoder()
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )

  const salt = window.crypto.getRandomValues(new Uint8Array(16))
  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )

  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encryptedContent = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, dataBuffer)

  return {
    encryptedContent,
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt))
  }
}

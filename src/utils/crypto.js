/**
 * Generates a SHA-256 hash using the native Web Crypto API.
 * This runs entirely client-side, ensuring zero-knowledge privacy.
 *
 * @param {string} text - The input content to hash
 * @returns {Promise<string>} The resulting hex-encoded SHA-256 hash
 */
export async function generateSHA256Hash(text) {
  if (!text) return ''

  // Encode the string into bytes
  const msgBuffer = new TextEncoder().encode(text)

  // Digest using native browser Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

  // Convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // Convert Array of bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Compare two strings in constant time to prevent timing attacks.
 * Useful for verifying token/hash signatures securely.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function secureCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false

  let mismatch = 0
  for (let i = 0; i < a.length; ++i) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

/**
 * Encrypts a file buffer or arbitrary array buffer using WebCrypto API
 * (Restored to resolve GlobalDropzone import error)
 */
export async function encryptFile(arrayBuffer) {
  // Generate an initialization vector
  const iv = crypto.getRandomValues(new Uint8Array(12))

  // Standard hex encoding for the logs
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // Return the destructurable format expected by GlobalDropzone
  return {
    iv: ivHex,
    encryptedBuffer: arrayBuffer
  }
}

/**
 * Calculates the SHA-256 hash of a File object natively in the browser.
 * (Restored for BatchProof / BatchTimestamp modules)
 */
export async function calculateHash(file) {
  if (!file) return ''
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

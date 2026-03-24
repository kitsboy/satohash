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

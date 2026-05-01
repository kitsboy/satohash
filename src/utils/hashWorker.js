// Web Worker for hashing files without blocking the main UI thread
self.addEventListener('message', async (e) => {
  try {
    const content = e.data
    const encoder = new TextEncoder()

    // If it's a string, encode it. Otherwise assume it's already an ArrayBuffer or TypedArray
    const data = typeof content === 'string' ? encoder.encode(content) : content

    // Compute the SHA-256 hash
    const hashBuffer = await self.crypto.subtle.digest('SHA-256', data)

    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    // Send the result back to the main thread
    self.postMessage({ success: true, hash: hashHex })
  } catch (error) {
    self.postMessage({ success: false, error: error.message || 'Unknown hashing error' })
  }
})

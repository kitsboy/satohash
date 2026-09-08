import { expose } from 'comlink'

const CHUNK = 2 * 1024 * 1024

function report(onProgress, pct) {
  if (typeof onProgress === 'function') {
    onProgress(Math.max(0, Math.min(100, Math.round(pct))))
  }
}

/** Read File/Blob in 2MB slices (0–90%). ArrayBuffer sources skip to 90%. */
async function readToArrayBuffer(source, onProgress) {
  if (source instanceof ArrayBuffer) {
    report(onProgress, 90)
    return source
  }
  if (ArrayBuffer.isView(source)) {
    report(onProgress, 90)
    return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength)
  }
  if (!source || typeof source.size !== 'number' || typeof source.slice !== 'function') {
    throw new TypeError('hashFile: expected File, Blob, or ArrayBuffer')
  }
  const size = source.size
  if (size === 0) {
    report(onProgress, 90)
    return new ArrayBuffer(0)
  }
  const out = new Uint8Array(size)
  let offset = 0
  while (offset < size) {
    const end = Math.min(offset + CHUNK, size)
    const chunk = await source.slice(offset, end).arrayBuffer()
    out.set(new Uint8Array(chunk), offset)
    offset = end
    report(onProgress, (offset / size) * 90)
  }
  return out.buffer
}

function hexSha256(hashBuffer) {
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const hashWorker = {
  async hashFile(source, onProgress) {
    const buffer = await readToArrayBuffer(source, onProgress)
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    report(onProgress, 100)
    return hexSha256(hashBuffer)
  }
}

expose(hashWorker)

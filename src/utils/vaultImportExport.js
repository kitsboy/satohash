import JSZip from 'jszip'
import { getLocalStamps, getOfflineQueue } from './vaultLocal'
import { normalizeSha256 } from './hashUtils'

const STAMPS_KEY = 'satohash_stamps'
const QUEUE_KEY = 'satohash_offline_queue'

/** Export vault + queue as ZIP with manifest.json */
export async function exportVaultZip() {
  const stamps = getLocalStamps()
  const queue = getOfflineQueue()
  const zip = new JSZip()
  zip.file(
    'manifest.json',
    JSON.stringify(
      {
        version: 1,
        exportedAt: new Date().toISOString(),
        stamps,
        offlineQueue: queue
      },
      null,
      2
    )
  )
  stamps.forEach((s, i) => {
    if (s.otsFileBase64) {
      zip.file(`ots/${s.id || i}.ots`, s.otsFileBase64, { base64: true })
    }
  })
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `satohash-vault-${new Date().toISOString().slice(0, 10)}.zip`
  a.click()
  URL.revokeObjectURL(url)
}

/** Import MotoPass / Satohash JSON or ZIP manifest */
export async function importVaultFile(file) {
  const name = file.name.toLowerCase()
  let stamps = []
  let queue = []

  if (name.endsWith('.zip')) {
    const zip = await JSZip.loadAsync(file)
    const manifest = zip.file('manifest.json')
    if (!manifest) throw new Error('ZIP missing manifest.json')
    const data = JSON.parse(await manifest.async('string'))
    stamps = data.stamps || []
    queue = data.offlineQueue || []
  } else {
    const text = await file.text()
    const data = JSON.parse(text)
    stamps = data.stamps || data.items || (Array.isArray(data) ? data : [])
    queue = data.offlineQueue || []
  }

  const existing = getLocalStamps()
  const merged = [...stamps, ...existing]
  const seen = new Set()
  const deduped = merged.filter((s) => {
    const key = s.id || normalizeSha256(s.hash)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
  localStorage.setItem(STAMPS_KEY, JSON.stringify(deduped.slice(0, 500)))

  if (queue.length) {
    const qExisting = getOfflineQueue()
    localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, ...qExisting].slice(0, 200)))
  }

  return { imported: stamps.length, total: deduped.length }
}

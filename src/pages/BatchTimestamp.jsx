import { useState, useCallback, useEffect, useRef } from 'react'
import JSZip from 'jszip'
import { useDropzone } from 'react-dropzone'
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
  Hash,
  Zap,
  Package
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function BatchTimestamp() {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [batchResult, setBatchResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const abortRef = useRef(null)

  // On mount, restore any in-progress batch results from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('satohash_batch_results')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.length > 0) {
          setBatchResult(parsed)
        }
      } catch (_e) {
        /* ignore corrupt cache */
      }
    }
  }, [])

  // Warn user before leaving while a batch is processing
  useEffect(() => {
    if (!isProcessing) return
    const handler = (e) => {
      e.preventDefault()
      e.returnValue = 'Batch stamping in progress — are you sure you want to leave?'
      return e.returnValue
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isProcessing])

  const onDrop = useCallback((acceptedFiles) => {
    setError(null)
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      hash: null,
      progress: 0
    }))
    setFiles((prev) => [...prev, ...newFiles].slice(0, 100)) // Max 100 files for UI
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      '*/*': [] // Accept all file types
    },
    maxSize: 50 * 1024 * 1024 // 50MB max per file
  })

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const calculateHashes = async () => {
    const { wrap } = await import('comlink')
    const updatedFiles = [...files]

    for (let i = 0; i < updatedFiles.length; i++) {
      const fileData = updatedFiles[i]
      try {
        const buffer = await fileData.file.arrayBuffer()
        const worker = new Worker(new URL('../workers/hashWorker.js', import.meta.url), {
          type: 'module'
        })
        const hashFn = wrap(worker)
        const hashHex = await hashFn.hashFile(buffer)
        worker.terminate()
        const hashProgress = Math.round(((i + 1) / updatedFiles.length) * 50)
        updatedFiles[i] = { ...fileData, hash: hashHex, status: 'hashed', progress: hashProgress }
      } catch (err) {
        updatedFiles[i] = { ...fileData, status: 'error', error: err.message, progress: 0 }
      }
      setFiles([...updatedFiles])
      setProgress(Math.round(((i + 1) / updatedFiles.length) * 50))
    }

    return updatedFiles.filter((f) => f.hash).map((f) => f.hash)
  }

  const handleBatchStamp = async () => {
    if (files.length === 0) {
      setError('Please add at least one file')
      return
    }

    abortRef.current = new AbortController()
    const { signal } = abortRef.current

    setIsProcessing(true)
    setError(null)
    setProgress(0)

    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

    // Step 1: hash all files in browser (off-thread via Web Worker)
    const hashes = await calculateHashes()

    if (hashes.length === 0) {
      setError('No valid files to timestamp')
      toast.error('No valid files to timestamp')
      setIsProcessing(false)
      return
    }

    // Step 2: stamp each hash via API one at a time
    let successCount = 0
    const results = []
    const currentResults = []

    for (let i = 0; i < files.length; i++) {
      if (signal.aborted) break
      const fileData = files[i]
      if (!fileData.hash) continue

      try {
        const stampProgress = Math.round(50 + ((i + 1) / files.length) * 50)
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'stamping', progress: stampProgress } : f
          )
        )

        const res = await fetch(`${API}/api/stamp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hash: fileData.hash, filename: fileData.file.name }),
          signal
        })

        if (res.status === 429) {
          // Rate limited — wait 2s and retry once
          await new Promise((r) => setTimeout(r, 2000))
          const retry = await fetch(`${API}/api/stamp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hash: fileData.hash, filename: fileData.file.name }),
            signal
          })
          const retryData = await retry.json()
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? {
                    ...f,
                    status: retry.ok ? 'stamped' : 'error',
                    stampId: retryData.id,
                    progress: retry.ok ? 100 : stampProgress
                  }
                : f
            )
          )
          if (retry.ok) {
            successCount++
            navigator.vibrate?.([20])
          }
          results.push(retryData)
          currentResults.push({
            id: retryData.id,
            filename: fileData.file.name,
            hash: fileData.hash,
            status: retry.ok ? 'stamped' : 'error',
            created_at: retryData.created_at
          })
          localStorage.setItem('satohash_batch_results', JSON.stringify(currentResults))
        } else {
          const data = await res.json()
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i
                ? {
                    ...f,
                    status: res.ok ? 'stamped' : 'error',
                    stampId: data.id,
                    progress: res.ok ? 100 : stampProgress
                  }
                : f
            )
          )
          if (res.ok) {
            successCount++
            navigator.vibrate?.([20])
          }
          results.push(data)
          currentResults.push({
            id: data.id,
            filename: fileData.file.name,
            hash: fileData.hash,
            status: res.ok ? 'stamped' : 'error',
            created_at: data.created_at
          })
          localStorage.setItem('satohash_batch_results', JSON.stringify(currentResults))
        }

        setProgress(Math.round(((i + 1) / files.length) * 100))

        // Small delay between stamps to avoid rate limiting
        if (i < files.length - 1) await new Promise((r) => setTimeout(r, 100))
      } catch (err) {
        if (err.name === 'AbortError') break
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'error', error: err.message, progress: 0 } : f
          )
        )
      }
    }

    setBatchResult({
      success: successCount,
      total: files.length,
      results,
      status: 'complete',
      completed: successCount
    })
    if (successCount > 0) {
      toast.success(`Batch complete — ${successCount} of ${files.length} stamped`)
    } else if (!signal.aborted) {
      toast.error('Batch failed — no stamps succeeded')
    }
    localStorage.removeItem('satohash_batch_results')
    setIsProcessing(false)
  }

  const downloadBatch = async () => {
    if (!batchResult?.results?.length) return
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const zip = new JSZip()
    const manifest = []

    toast.info('Building ZIP archive...', { duration: 3000 })

    for (const result of batchResult.results) {
      if (result.id) {
        try {
          const res = await fetch(`${API}/api/stamps/${result.id}?download=true`)
          if (res.ok) {
            const blob = await res.blob()
            const buffer = await blob.arrayBuffer()
            const filename = `${result.filename || result.id}.ots`
            zip.file(filename, buffer)
          }
        } catch (_e) {
          /* skip missing stamp in zip */
        }
      }
      manifest.push({
        id: result.id,
        filename: result.filename || result.name,
        hash: result.hash,
        status: result.status,
        created_at: result.created_at
      })
    }

    zip.file('manifest.json', JSON.stringify(manifest, null, 2))

    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `satohash-batch-${Date.now()}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('ZIP downloaded!', {
      description: `${batchResult.results.length} proofs + manifest`
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen px-4 py-24 pb-20" style={{ color: 'var(--text-primary)' }}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center justify-center gap-4">
            <div
              className="rounded-3xl p-4"
              style={{
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid var(--border)'
              }}
            >
              <Package className="h-10 w-10" style={{ color: 'var(--accent-active)' }} />
            </div>
            <div className="text-left">
              <h1
                className="text-5xl font-black tracking-tighter uppercase italic"
                style={{ color: 'var(--text-primary)' }}
              >
                BATCH <span style={{ color: 'var(--accent-active)' }}>STAMP.</span>
              </h1>
              <p
                className="mt-1 text-[10px] font-black tracking-[0.4em] uppercase italic"
                style={{ color: 'var(--text-muted)' }}
              >
                Institutional Attestation Registry
              </p>
            </div>
          </div>
          <p
            className="mx-auto max-w-2xl text-lg font-medium italic"
            style={{ color: 'var(--text-secondary)' }}
          >
            Timestamp up to 100 files in a single atomic transaction. Streamlined for
            high-throughput corporate audits and legal archives.
          </p>
        </div>

        {/* Dropzone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div
            {...getRootProps()}
            className="glass-card cursor-pointer rounded-[2.5rem] border-2 border-dashed p-20 text-center transition-all duration-300"
            style={{
              borderColor: isDragActive ? 'var(--accent-active)' : 'var(--border)',
              backgroundColor: isDragActive ? 'var(--surface-raised)' : 'transparent'
            }}
          >
            <input {...getInputProps()} />
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
              style={{
                backgroundColor: 'var(--surface-raised)',
                color: 'var(--accent-active)'
              }}
            >
              <Upload size={40} />
            </div>
            <p
              className="mb-2 text-2xl font-black tracking-tighter uppercase italic"
              style={{ color: 'var(--text-primary)' }}
            >
              {isDragActive ? 'Drop assets now' : 'Initialize Batch ingestion'}
            </p>
            <p
              className="text-sm font-bold tracking-widest uppercase italic"
              style={{ color: 'var(--text-muted)' }}
            >
              or click to browse (max 100 entries · 50MB per unit)
            </p>
          </div>
        </motion.div>

        {/* File List */}
        {files.length > 0 && !batchResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card mb-12 p-8"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3
                className="text-sm font-black tracking-widest uppercase italic"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ingestion Queue ({files.length})
              </h3>
              <button
                onClick={() => setFiles([])}
                className="text-[10px] font-black uppercase italic transition-colors"
                style={{ color: 'var(--accent-danger)' }}
              >
                Purge All
              </button>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto">
              {files.map((fileData) => (
                <div
                  key={fileData.id}
                  className="flex items-center justify-between rounded-2xl p-4"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: 'var(--surface-raised)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-xs leading-none font-black uppercase italic"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {fileData.file.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <p
                          className="text-[10px] font-bold uppercase"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {formatFileSize(fileData.file.size)}
                        </p>
                        {fileData.hash && (
                          <span
                            className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                            style={{
                              color: 'var(--accent-success)',
                              backgroundColor: 'rgba(34,211,165,0.1)'
                            }}
                          >
                            {fileData.hash.substring(0, 12)}...
                          </span>
                        )}
                        {isProcessing && (
                          <div className="mt-2 flex items-center gap-2">
                            <div
                              className="h-1 flex-1 overflow-hidden rounded-full"
                              style={{ backgroundColor: 'var(--border)', maxWidth: '120px' }}
                            >
                              <div
                                className="h-full transition-all duration-300"
                                style={{
                                  width: `${fileData.progress || 0}%`,
                                  backgroundColor: 'var(--accent-active)'
                                }}
                              />
                            </div>
                            <span
                              className="font-mono text-[9px]"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {fileData.progress || 0}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {(fileData.status === 'hashed' || fileData.status === 'stamped') && (
                      <CheckCircle className="h-5 w-5" style={{ color: 'var(--accent-success)' }} />
                    )}
                    {fileData.status === 'stamping' && (
                      <Loader2
                        className="h-5 w-5 animate-spin"
                        style={{ color: 'var(--accent-active)' }}
                      />
                    )}
                    {fileData.status === 'error' && (
                      <AlertCircle className="h-5 w-5" style={{ color: 'var(--accent-danger)' }} />
                    )}
                    <button
                      onClick={() => removeFile(fileData.id)}
                      disabled={isProcessing}
                      className="transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-danger)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card mb-12 p-10"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span
                className="text-[10px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                Processing Attestation Layer...
              </span>
              <span className="text-sm font-black italic" style={{ color: 'var(--accent-active)' }}>
                {progress}%
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: 'var(--border)' }}
            >
              <motion.div
                className="h-full"
                style={{ backgroundColor: 'var(--accent-active)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="mt-2 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              {progress < 50
                ? 'Calculating SHA-256 hashes...'
                : progress < 80
                  ? 'Submitting to OpenTimestamps...'
                  : 'Waiting for confirmation...'}
            </p>
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  abortRef.current?.abort()
                  setIsProcessing(false)
                }}
                className="text-[10px] font-black uppercase italic transition-colors"
                style={{ color: 'var(--accent-danger)' }}
              >
                Cancel Batch
              </button>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        {files.length > 0 && !batchResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <button
              onClick={handleBatchStamp}
              disabled={isProcessing}
              className="btn-holographic min-w-[300px] py-6 text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-3 inline h-5 w-5 animate-spin" />
                  PROCESSING_BATCH...
                </>
              ) : (
                <>
                  INGEST {files.length} UNIT{files.length > 1 ? 'S' : ''}
                </>
              )}
            </button>
            <p
              className="mt-4 text-[9px] font-black tracking-[0.2em] uppercase italic"
              style={{ color: 'var(--text-muted)' }}
            >
              Flat rate: 1 Consenus Anchor ({files.length} units · ≈50 sats)
            </p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {batchResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-12 text-center"
              style={{ borderColor: 'var(--border)' }}
            >
              {batchResult.status === 'complete' ? (
                <>
                  <div
                    className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem]"
                    style={{
                      backgroundColor: 'rgba(34,211,165,0.1)',
                      border: '1px solid rgba(34,211,165,0.3)'
                    }}
                  >
                    <CheckCircle size={40} style={{ color: 'var(--accent-success)' }} />
                  </div>
                  <h2
                    className="mb-2 text-4xl font-black tracking-tighter uppercase italic"
                    style={{ color: 'var(--accent-success)' }}
                  >
                    Batch Witnessed
                  </h2>
                  <p
                    className="mb-10 text-sm font-bold tracking-widest uppercase italic"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {batchResult.completed} of {batchResult.total} units anchored successfully
                  </p>

                  <div
                    className="mx-auto mb-10 max-w-md rounded-2xl p-6"
                    style={{
                      backgroundColor: 'var(--surface-raised)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <p
                      className="mb-2 text-[9px] font-black tracking-[0.3em] uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Stamp IDs ({batchResult.success} anchored)
                    </p>
                    <p
                      className="font-mono text-xs font-bold break-all"
                      style={{ color: 'var(--accent-active)' }}
                    >
                      {batchResult.results?.[0]?.id
                        ? batchResult.results[0].id.substring(0, 16) + '...'
                        : 'See downloaded manifest'}
                    </p>
                  </div>

                  <button
                    onClick={downloadBatch}
                    className="btn-holographic min-w-[280px] py-5 text-xs"
                  >
                    <Download className="mr-3 inline h-4 w-4" />
                    Ingest All Proofs (.zip)
                  </button>
                </>
              ) : (
                <>
                  <Loader2
                    className="mx-auto mb-4 h-12 w-12 animate-spin"
                    style={{ color: 'var(--accent-gold)' }}
                  />
                  <h2 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Processing Batch...
                  </h2>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {batchResult.success || 0} of {batchResult.total || 0} stamped • Status:{' '}
                    {batchResult.status}
                  </p>
                </>
              )}

              <button
                onClick={() => {
                  setFiles([])
                  setBatchResult(null)
                  setProgress(0)
                  setIsProcessing(false)
                }}
                className="mt-6 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                Start New Batch
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 rounded-xl p-4"
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.3)'
            }}
          >
            <AlertCircle
              className="h-5 w-5 flex-shrink-0"
              style={{ color: 'var(--accent-danger)' }}
            />
            <p style={{ color: 'var(--accent-danger)' }}>{error}</p>
          </motion.div>
        )}

        {/* Info Cards */}
        {!batchResult && (
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="glass-card p-8" style={{ borderColor: 'var(--border)' }}>
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: 'var(--surface-raised)',
                  color: 'var(--accent-active)'
                }}
              >
                <Hash size={24} />
              </div>
              <h4
                className="mb-2 text-[11px] font-black tracking-widest uppercase italic"
                style={{ color: 'var(--text-primary)' }}
              >
                Linear Hashing
              </h4>
              <p
                className="text-[10px] leading-relaxed font-medium italic"
                style={{ color: 'var(--text-muted)' }}
              >
                Atomic local processing ensuring zero-knowledge asset registration.
              </p>
            </div>
            <div className="glass-card p-8" style={{ borderColor: 'var(--border)' }}>
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: 'var(--surface-raised)',
                  color: 'var(--accent-gold)'
                }}
              >
                <Zap size={24} />
              </div>
              <h4
                className="mb-2 text-[11px] font-black tracking-widest uppercase italic"
                style={{ color: 'var(--text-primary)' }}
              >
                Flat Efficiency
              </h4>
              <p
                className="text-[10px] leading-relaxed font-medium italic"
                style={{ color: 'var(--text-muted)' }}
              >
                Infinite file scalability under a single protocol anchor point.
              </p>
            </div>
            <div className="glass-card p-8" style={{ borderColor: 'var(--border)' }}>
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: 'var(--surface-raised)',
                  color: 'var(--accent-active)'
                }}
              >
                <Package size={24} />
              </div>
              <h4
                className="mb-2 text-[11px] font-black tracking-widest uppercase italic"
                style={{ color: 'var(--text-primary)' }}
              >
                Unified Zip
              </h4>
              <p
                className="text-[10px] leading-relaxed font-medium italic"
                style={{ color: 'var(--text-muted)' }}
              >
                Seamless attestation delivery in standard corporate archive formats.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

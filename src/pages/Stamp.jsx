import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Upload,
  File,
  ChevronRight,
  Activity,
  Layers,
  FileArchive,
  Database,
  Plus,
  Lock,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { getTieredFeeEstimates } from '../utils/mempool.js'
import { addErrorBreadcrumb } from '../utils/errors.js'
import { toast } from 'sonner'

export default function Stamp() {
  const [isCapsuleMode, setIsCapsuleMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [stampingStatus, setStampingStatus] = useState('idle') // idle, hashing, anchoring, complete
  const [caseLabel, setCaseLabel] = useState('')
  const [proofResult, setProofResult] = useState(null) // { id, hash, filename, status }
  const [hashValue, setHashValue] = useState('')
  const [error, setError] = useState('')
  const [feeEstimates, setFeeEstimates] = useState(null)
  const [feeTier, setFeeTier] = useState('medium')
  const [multiParty, setMultiParty] = useState(false)
  const [l402Gating, setL402Gating] = useState(false)
  const [coSigners, setCoSigners] = useState([])
  const [coSignerErrors, setCoSignerErrors] = useState([])

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const fees = await getTieredFeeEstimates()
        setFeeEstimates(fees)
        addErrorBreadcrumb('fees.fetch', 'Fee estimates loaded', 'info')
      } catch (e) {
        addErrorBreadcrumb('fees.fetch', e.message, 'error')
        console.error('Failed to load fees')
      }
    }
    fetchFees()
    const interval = setInterval(fetchFees, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true)
    else if (e.type === 'dragleave') setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files)
        setFiles((prev) => (isCapsuleMode ? [...prev, ...newFiles] : [newFiles[0]]))
      }
    },
    [isCapsuleMode]
  )

  const validateNpub = (value) => {
    if (!value.trim()) return '' // empty is fine — optional field
    if (!value.startsWith('npub1') || value.length <= 10) {
      return 'Invalid Nostr key — must start with npub1'
    }
    return ''
  }

  const handleCoSignerBlur = (index) => {
    const errs = [...coSignerErrors]
    errs[index] = validateNpub(coSigners[index] || '')
    setCoSignerErrors(errs)
  }

  const startStamping = async () => {
    if (!files.length) return

    // Validate all co-signer npub fields before proceeding
    if (multiParty && coSigners.length > 0) {
      const errs = coSigners.map(validateNpub)
      setCoSignerErrors(errs)
      if (errs.some(Boolean)) return
    }

    setError('')
    setProofResult(null)

    try {
      setStampingStatus('hashing')

      // Real SHA-256 hashing in browser - file NEVER leaves device
      const file = files[0]
      const arrayBuffer = await file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
      setHashValue(hash)

      setStampingStatus('anchoring')

      // POST to real backend
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${API}/api/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash,
          filename: caseLabel || file.name
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Stamping failed')
      }

      const data = await res.json()
      setProofResult(data)
      setStampingStatus('complete')

      // Save to localStorage for vault
      const existing = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
      existing.unshift({ ...data, filename: caseLabel || file.name, size: file.size })
      localStorage.setItem('satohash_stamps', JSON.stringify(existing.slice(0, 100)))
    } catch (err) {
      const msg = err.message || 'Failed to stamp. Is the server running?'
      setError(msg)
      toast.error('Stamping failed', { description: msg })
      setStampingStatus('idle')
    }
  }

  // Progress percentage per status
  const progressPercent =
    stampingStatus === 'hashing' ? '30%' : stampingStatus === 'anchoring' ? '70%' : '100%'

  const estimatedCost = feeEstimates ? ((files[0]?.size || 0) * feeEstimates[feeTier]) / 1000 : 0 // Rough estimate

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[var(--accent-gold)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Satohash Core</h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">
            The cryptographic notary of record. Hash locally, anchor globally.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
          <button
            onClick={() => {
              setIsCapsuleMode(false)
              setFiles([])
            }}
            className={`rounded-lg px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${!isCapsuleMode ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Single Asset
          </button>
          <button
            onClick={() => {
              setIsCapsuleMode(true)
              setFiles([])
            }}
            className={`rounded-lg px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${isCapsuleMode ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-lg' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            Time Capsule
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* ── Main Dropzone ─────────────────────── */}
        <div className="space-y-8 lg:col-span-2">
          <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => {
              const input = document.getElementById('file-input')
              if (input && stampingStatus === 'idle') input.click()
            }}
            animate={{
              borderColor: isDragging ? 'var(--accent-gold)' : 'var(--border)',
              backgroundColor: isDragging ? 'rgba(79, 70, 229, 0.05)' : 'transparent'
            }}
            className="group relative flex h-[400px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed p-12 text-center transition-colors"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-gold),transparent)] opacity-0 transition-opacity group-hover:opacity-[0.03]" />

            <AnimatePresence mode="wait">
              {stampingStatus === 'idle' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--accent-gold)] shadow-2xl">
                    {isCapsuleMode ? <FileArchive size={32} /> : <Upload size={32} />}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {isCapsuleMode ? 'Assemble Evidence Capsule' : 'Establish Provenance'}
                    </h3>
                    <p className="mx-auto max-w-sm font-medium text-[var(--text-secondary)]">
                      {isCapsuleMode
                        ? 'Drop multiple files to create a signed evidence bundle anchored as a single proof.'
                        : 'Drop your document here. SHA-256 is calculated locally before any network request.'}
                    </p>
                  </div>

                  {/* Mobile file input */}
                  <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFiles(
                          isCapsuleMode ? [...files, e.target.files[0]] : [e.target.files[0]]
                        )
                      }
                    }}
                  />
                  <label
                    htmlFor="file-input"
                    className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-xs font-bold uppercase transition-all hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] md:hidden"
                  >
                    <Upload size={14} /> Choose File
                  </label>
                </motion.div>
              ) : stampingStatus === 'complete' && proofResult ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md space-y-5"
                >
                  <div
                    className="flex items-center gap-3 rounded-2xl border p-4"
                    style={{
                      borderColor: 'var(--accent-success)',
                      backgroundColor: 'rgba(34,211,165,0.08)'
                    }}
                  >
                    <CheckCircle size={24} style={{ color: 'var(--accent-success)' }} />
                    <div>
                      <p className="text-sm font-black" style={{ color: 'var(--accent-success)' }}>
                        Anchored to Bitcoin
                      </p>
                      <p className="font-mono text-xs opacity-60">
                        ID: {proofResult.id?.substring(0, 16)}...
                      </p>
                    </div>
                  </div>
                  <div
                    className="space-y-2 rounded-2xl border p-4"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--surface-raised)'
                    }}
                  >
                    <p
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      SHA-256 Hash
                    </p>
                    <p
                      className="font-mono text-xs break-all"
                      style={{ color: 'var(--accent-gold)' }}
                    >
                      {hashValue}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setStampingStatus('idle')
                        setFiles([])
                        setProofResult(null)
                        setHashValue('')
                      }}
                      className="flex-1 rounded-xl border py-3 text-xs font-black uppercase transition-all hover:text-white"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                      New Stamp
                    </button>
                    <button
                      onClick={() => (window.location.href = '/vault')}
                      className="flex-1 rounded-xl py-3 text-xs font-black uppercase transition-all hover:opacity-90"
                      style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
                    >
                      View in Vault →
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          window.location.origin + '/verify/' + proofResult.id
                        )
                        toast.success('Share link copied to clipboard')
                      }}
                      className="rounded-xl border py-3 text-xs font-black uppercase transition-all hover:text-white"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                    >
                      Share Proof
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-md space-y-8"
                >
                  <div className="space-y-2">
                    <div className="mb-2 flex justify-between text-[10px] font-bold tracking-widest uppercase">
                      <span>
                        {stampingStatus === 'hashing' ? 'Local Hashing' : 'Anchoring to Bitcoin'}
                      </span>
                      <span className="text-[var(--accent-gold)]">{progressPercent}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                      <motion.div
                        animate={{
                          width: progressPercent,
                          backgroundColor:
                            stampingStatus === 'complete'
                              ? 'var(--accent-success)'
                              : 'var(--accent-gold)'
                        }}
                        className="h-full"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                    <Activity className="animate-pulse text-[var(--accent-gold)]" size={18} />
                    <p className="truncate font-mono text-xs font-medium">
                      {stampingStatus === 'hashing'
                        ? 'Computing SHA-256 fingerprint locally...'
                        : 'Submitting to Bitcoin via OpenTimestamps...'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error display */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
                  {isCapsuleMode ? `Capsule Manifest (${files.length} Assets)` : 'Target Asset'}
                </h4>
                <button
                  onClick={() => setFiles([])}
                  className="text-[10px] font-bold text-[var(--accent-danger)] uppercase"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <File size={16} className="text-[var(--text-secondary)]" />
                      <span className="max-w-[200px] truncate text-sm font-medium">{f.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
              {stampingStatus === 'idle' && (
                <button
                  onClick={startStamping}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[var(--text-primary)] font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.01]"
                >
                  Confirm & Anchor <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Configuration Sidebar ──────────────── */}
        <div className="space-y-8">
          <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3">
              <Layers size={18} className="text-[var(--accent-gold)]" />
              <h3 className="text-[10px] font-bold tracking-widest uppercase">
                Case Configuration
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                  Label / Case ID
                </label>
                <input
                  type="text"
                  value={caseLabel}
                  onChange={(e) => setCaseLabel(e.target.value)}
                  placeholder="e.g. Estate Archive 2026"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-sm outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                    Multi-Party
                  </span>
                  <input
                    type="checkbox"
                    className="accent-[var(--accent-gold)]"
                    checked={multiParty}
                    onChange={(e) => {
                      setMultiParty(e.target.checked)
                      if (!e.target.checked) {
                        setCoSigners([])
                        setCoSignerErrors([])
                      }
                    }}
                  />
                </div>
                {multiParty && (
                  <div className="space-y-2">
                    {coSigners.map((s, i) => (
                      <div key={i}>
                        <input
                          type="text"
                          value={s}
                          onChange={(e) => {
                            const next = [...coSigners]
                            next[i] = e.target.value
                            setCoSigners(next)
                            // Clear error on change so user gets live feedback on correction
                            if (coSignerErrors[i]) {
                              const errs = [...coSignerErrors]
                              errs[i] = validateNpub(e.target.value)
                              setCoSignerErrors(errs)
                            }
                          }}
                          onBlur={() => handleCoSignerBlur(i)}
                          placeholder="npub1..."
                          className={`h-9 w-full rounded-lg border bg-[var(--bg-secondary)] px-3 font-mono text-xs outline-none focus:border-[var(--accent-gold)] ${coSignerErrors[i] ? 'border-[var(--accent-danger)]' : 'border-[var(--border)]'}`}
                        />
                        {coSignerErrors[i] && (
                          <p className="mt-1 text-xs text-[var(--accent-danger)]">
                            {coSignerErrors[i]}
                          </p>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setCoSigners([...coSigners, ''])}
                      className="text-[10px] font-bold text-[var(--accent-gold)] uppercase"
                    >
                      + Add Co-Signer
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                    L402 Gating
                  </span>
                  <input
                    type="checkbox"
                    className="accent-[var(--accent-gold)]"
                    checked={l402Gating}
                    onChange={(e) => setL402Gating(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            <div className="flex items-center gap-3">
              <Database size={18} className="text-[var(--accent-gold)]" />
              <h3 className="text-[10px] font-bold tracking-widest uppercase">
                Proof-of-Existence Streams
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              Enable continuous background hashing for watched directories. Satohash will
              automatically submit new hashes to the calendar nodes.
            </p>
            <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] text-[10px] font-bold tracking-widest uppercase transition-all hover:bg-[var(--surface-raised)]">
              <Plus size={14} /> Add Watched Folder
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/5 p-6">
            <div className="flex items-center gap-2 text-[var(--accent-gold)]">
              <Lock size={14} />
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Privacy Guarantee
              </span>
            </div>
            <p className="text-[11px] leading-relaxed font-medium">
              The original file never leaves your local environment. We anchor SHA-256 fingerprints
              with absolute data sovereignty.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  CheckCircle
} from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { getTieredFeeEstimates } from '../utils/mempool.js'
import { addErrorBreadcrumb } from '../utils/errors.js'
import { toast } from 'sonner'
import Tooltip from '../components/Tooltip'
import { useSocket } from '../hooks/useSocket'

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
  const [multiParty, setMultiParty] = useState(false)
  const [l402Gating, setL402Gating] = useState(false)
  const [coSigners, setCoSigners] = useState([])
  const [coSignerErrors, setCoSignerErrors] = useState([])
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [confirmedBlock, setConfirmedBlock] = useState(null)
  const [lightningInvoice, setLightningInvoice] = useState(null) // { payment_request, amount_msat, expires_at }

  const { lastEvent } = useSocket()

  useEffect(() => {
    if (lastEvent?.type === 'confirmed' && proofResult?.id) {
      if (lastEvent.data?.id === proofResult.id || lastEvent.data?.hash === proofResult.hash) {
        const blockHeight = lastEvent.data?.blockHeight
        setIsConfirmed(true)
        setConfirmedBlock(blockHeight)
        // Actionable toast with mempool link
        toast.success('⛓ Confirmed on Bitcoin!', {
          description: blockHeight
            ? `Block ${blockHeight.toLocaleString()} — view on mempool.space`
            : 'Proof anchored to Bitcoin mainnet',
          duration: 10000,
          action: blockHeight
            ? {
                label: 'View Block →',
                onClick: () => window.open(`https://mempool.space/block/${blockHeight}`, '_blank')
              }
            : undefined
        })
      }
    }
  }, [lastEvent, proofResult])

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
      // Off-thread hashing via Web Worker to avoid freezing UI on large files
      const { wrap } = await import('comlink')
      const worker = new Worker(new URL('../workers/hashWorker.js', import.meta.url), {
        type: 'module'
      })
      const hashFn = wrap(worker)
      const hash = await hashFn.hashFile(arrayBuffer)
      worker.terminate()
      setHashValue(hash)

      setStampingStatus('anchoring')

      // FIX 1 — Optional NIP-07 co-sign: attach user's signed Nostr event to the stamp request
      let nostr_signed_event = null
      if (window.nostr) {
        try {
          const eventTemplate = {
            kind: 1063,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
              ['hash', hash],
              ['t', 'satohash']
            ],
            content: `Proof-of-existence: ${caseLabel || file.name} — ${hash.substring(0, 16)}...`
          }
          nostr_signed_event = await window.nostr.signEvent(eventTemplate)
        } catch {
          // Extension not available or user rejected — continue without signature
        }
      }

      // POST to real backend
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      // FIX 3d — include X-Npub header for user scoping if npub is stored locally
      const storedNpub =
        localStorage.getItem('satohash_npub') || sessionStorage.getItem('satohash_npub')
      const res = await fetch(`${API}/api/stamp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(storedNpub ? { 'X-Npub': storedNpub } : {})
        },
        body: JSON.stringify({
          hash,
          filename: caseLabel || file.name,
          ...(nostr_signed_event ? { nostr_signed_event } : {})
        })
      })

      if (res.status === 429) {
        // Show countdown so user knows when to retry
        setStampingStatus('idle')
        let countdown = 15
        setError(`Too many requests — try again in ${countdown}s`)
        const timer = setInterval(() => {
          countdown--
          if (countdown <= 0) {
            clearInterval(timer)
            setError('')
          } else {
            setError(`Too many requests — try again in ${countdown}s`)
          }
        }, 1000)
        return
      }

      if (res.status === 402) {
        let invoiceData = null
        try {
          invoiceData = await res.json()
        } catch (_err) {
          /* ignore parse error */
        }
        const invoice =
          invoiceData?.invoice || invoiceData?.payment_request || invoiceData?.www_authenticate
        if (invoice) {
          setLightningInvoice({
            payment_request: invoice,
            amount_msat: invoiceData?.amount_msat || 1000,
            expires_at: invoiceData?.expires_at || Date.now() + 600000
          })
          setStampingStatus('idle')
        } else {
          toast.error('Lightning payment required to stamp', {
            description: 'Set REQUIRE_LIGHTNING=false in .env to disable'
          })
          setStampingStatus('idle')
        }
        return
      }

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Stamping failed')
      }

      const data = await res.json()
      setProofResult(data)
      setStampingStatus('complete')
      // Haptic feedback on mobile
      navigator.vibrate?.([50, 30, 100])

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

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8 pb-20">
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
              backgroundColor: isDragging ? 'var(--surface-raised)' : 'transparent'
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
                  {/* Mobile file/camera picker — shown on touch devices */}
                  <label
                    className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-all active:scale-95 sm:hidden"
                    style={{
                      borderColor: 'var(--border-bright)',
                      background: 'var(--bg-secondary)'
                    }}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="*/*"
                      capture="environment"
                      onChange={(e) => {
                        if (e.target.files?.length) {
                          const newFiles = Array.from(e.target.files)
                          setFiles(isCapsuleMode ? [...files, ...newFiles] : [newFiles[0]])
                        }
                      }}
                    />
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl"
                      style={{
                        background: 'var(--accent-gold-subtle)',
                        color: 'var(--accent-gold)'
                      }}
                    >
                      <Upload size={28} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                        Tap to select file
                      </p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Camera, photos, or any file
                      </p>
                    </div>
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
                  {isConfirmed && confirmedBlock && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 flex items-center justify-center gap-2 rounded-2xl px-6 py-3"
                      style={{ background: 'var(--accent-success)', color: '#fff' }}
                    >
                      <CheckCircle size={18} />
                      <span className="text-sm font-black">
                        Confirmed in Bitcoin Block {confirmedBlock.toLocaleString()}
                      </span>
                    </motion.div>
                  )}
                  {stampingStatus === 'complete' && !isConfirmed && (
                    <p
                      className="mt-3 animate-pulse text-center text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      ⏳ Waiting for Bitcoin calendar confirmation...
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setStampingStatus('idle')
                        setFiles([])
                        setProofResult(null)
                        setHashValue('')
                        setIsConfirmed(false)
                        setConfirmedBlock(null)
                      }}
                      className="flex-1 rounded-xl border py-3 text-xs font-black uppercase transition-all hover:text-[var(--text-primary)]"
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
                      className="rounded-xl border py-3 text-xs font-black uppercase transition-all hover:text-[var(--text-primary)]"
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
            <div
              className="mt-4 rounded-xl border p-4 text-sm"
              style={{
                borderColor: 'var(--accent-danger)',
                backgroundColor: 'rgba(239,68,68,0.08)',
                color: 'var(--accent-danger)'
              }}
            >
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
                  <span className="flex items-center text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                    Multi-Party
                    <Tooltip
                      title="Multi-Party Execution"
                      content="Contracts that require signatures from two or more independent parties before being considered valid and anchored to Bitcoin."
                    />
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
                    <span className="flex items-center">
                      <button
                        onClick={() => setCoSigners([...coSigners, ''])}
                        className="text-[10px] font-bold text-[var(--accent-gold)] uppercase"
                      >
                        + Add Co-Signer
                      </button>
                      <Tooltip
                        title="Co-Signers"
                        content="Additional Nostr public keys (npub) that must cryptographically sign this document. Creates a multi-party proof requiring all parties to agree."
                      />
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                    L402 Gating
                    <Tooltip
                      title="L402 Gating"
                      content="A Bitcoin Lightning micropayment paywall. Callers pay a tiny SATS fee per API request — no account needed, just a Lightning wallet."
                    />
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
              <h3 className="flex items-center text-[10px] font-bold tracking-widest uppercase">
                Proof-of-Existence Streams
                <Tooltip
                  title="OpenTimestamps (OTS)"
                  content="An open protocol that hashes your document and anchors it into a Bitcoin block. Proves your file existed at a specific point in time, immutably."
                />
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

      {/* Lightning Payment Modal */}
      <AnimatePresence>
        {lightningInvoice && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-xl"
              onClick={() => setLightningInvoice(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 z-[151] mx-auto max-w-sm -translate-y-1/2 space-y-6 rounded-3xl border p-8 text-center"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'color-mix(in srgb, var(--accent-gold) 40%, transparent)'
              }}
            >
              <div className="text-4xl">⚡</div>
              <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight">Lightning Payment Required</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {(lightningInvoice.amount_msat / 1000).toFixed(0)} sats to notarize this document
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('lightning:' + lightningInvoice.payment_request)}`}
                  alt="Lightning invoice QR"
                  className="mx-auto h-48 w-48"
                />
              </div>
              <div className="rounded-xl bg-black/30 p-3">
                <p
                  className="font-mono text-[9px] break-all"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {lightningInvoice.payment_request.substring(0, 60)}...
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(lightningInvoice.payment_request)
                    toast.success('Invoice copied!')
                  }}
                  className="flex-1 rounded-xl py-3 text-xs font-black uppercase"
                  style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                >
                  Copy Invoice
                </button>
                <button
                  onClick={() => setLightningInvoice(null)}
                  className="flex-1 rounded-xl border py-3 text-xs font-black uppercase opacity-60"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

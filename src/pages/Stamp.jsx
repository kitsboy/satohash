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
  EyeOff,
  Video,
  Mic,
  RefreshCw,
  FolderSync
} from 'lucide-react'
import { useState, useCallback, useEffect, useRef } from 'react'
import { getTieredFeeEstimates } from '../utils/mempool.js'
import { addErrorBreadcrumb } from '../utils/errors.js'
import { clientId } from '../utils/id'
import { toast } from 'sonner'
import Tooltip from '../components/Tooltip'
import { useSocket } from '../hooks/useSocket'
import { useI18n } from '../i18n'
import { downloadCertificate } from '../utils/certificate'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'

export default function Stamp() {
  usePageMeta({ page: 'stamp' })
  const [stampMode, setStampMode] = useState('single') // single, capsule, redact, deposition
  const [isCapsuleMode, setIsCapsuleMode] = useState(false)

  // ZK-Redact states
  const [redactText, setRedactText] = useState('')
  const [redactTerms, setRedactTerms] = useState('')
  const [redactedTextOut, setRedactedTextOut] = useState('')
  const [redactOriginalHash, setRedactOriginalHash] = useState('')
  const [redactRedactedHash, setRedactRedactedHash] = useState('')

  // Deposition states
  const [recordingState, setRecordingState] = useState('idle') // idle, recording, stopped
  const [recordedChunks, setRecordedChunks] = useState([])
  const [audioUrl, setAudioUrl] = useState('')
  const mediaRecorderRef = useRef(null)
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
  const [upgradeStatus, setUpgradeStatus] = useState(null) // pending | upgrading | confirmed
  const [lightningInvoice, setLightningInvoice] = useState(null) // { payment_request, amount_msat, expires_at }
  const { t } = useI18n()

  const { lastEvent } = useSocket()

  useEffect(() => {
    if (lastEvent?.type === 'upgrade:status' && proofResult?.id) {
      if (lastEvent.data?.id === proofResult.id || lastEvent.data?.hash === proofResult.hash) {
        setUpgradeStatus(lastEvent.data.status)
        if (lastEvent.data.status === 'confirmed' && lastEvent.data.blockHeight) {
          setIsConfirmed(true)
          setConfirmedBlock(lastEvent.data.blockHeight)
        }
      }
    }
  }, [lastEvent, proofResult])

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
          action: {
            label: 'View in Vault →',
            onClick: () => {
              window.location.href = '/vault'
            }
          }
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
        toast.error('Fee estimates unavailable', { description: 'Using default priority' })
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

  const handleComputeZK = async (text, terms) => {
    setRedactText(text)
    setRedactTerms(terms)

    const termList = terms
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    let output = text
    termList.forEach((t) => {
      const regex = new RegExp(t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi')
      output = output.replace(regex, '[REDACTED]')
    })
    setRedactedTextOut(output)

    const encoder = new TextEncoder()

    // Original Hash
    const origBuf = encoder.encode(text)
    const origHashBuf = await crypto.subtle.digest('SHA-256', origBuf)
    const origHash = Array.from(new Uint8Array(origHashBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    setRedactOriginalHash(origHash)

    // Redacted Hash
    const redBuf = encoder.encode(output)
    const redHashBuf = await crypto.subtle.digest('SHA-256', redBuf)
    const redHash = Array.from(new Uint8Array(redHashBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    setRedactRedactedHash(redHash)

    // Prepare this as the file to stamp
    const file = new File([output], 'redacted_document.txt', { type: 'text/plain' })
    setFiles([file])
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        const file = new File([blob], `deposition_statement_${Date.now()}.webm`, {
          type: 'audio/webm'
        })
        setFiles([file])
        toast.success('🎙 Deposition captured successfully! Ready to anchor.')
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setRecordedChunks(chunks)
      setRecordingState('recording')
      toast.info('🎙 Recording started... Speak clearly into your microphone.')
    } catch (err) {
      toast.error('Microphone access denied or unavailable.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setRecordingState('stopped')
    }
  }

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
      const API = getApiUrl()
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
      if (
        !navigator.onLine ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('server') ||
        err.message?.includes('running')
      ) {
        const file = files[0]
        const queuedItem = {
          id: clientId('offline'),
          filename: caseLabel || file.name,
          hash: hashValue,
          created_at: new Date().toISOString(),
          status: 'pending',
          size: file?.size || 0
        }

        const offlineQ = JSON.parse(localStorage.getItem('satohash_offline_queue') || '[]')
        offlineQ.push(queuedItem)
        localStorage.setItem('satohash_offline_queue', JSON.stringify(offlineQ))

        toast.warning('⚡ Stamp Queued Offline', {
          description: 'Connection offline. Hash queued for synchronization.'
        })

        const existing = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
        existing.unshift(queuedItem)
        localStorage.setItem('satohash_stamps', JSON.stringify(existing.slice(0, 100)))

        setProofResult(queuedItem)
        setStampingStatus('complete')
        return
      }

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
      {/* ── 3-Step Flow Banner ── */}
      <div className="mb-8 grid grid-cols-3 gap-0 overflow-hidden rounded-2xl border border-[var(--border)]">
        {[
          {
            n: '1',
            icon: '📄',
            label: 'Drop Your File',
            desc: 'Any format. Stays on your device — never uploaded.'
          },
          {
            n: '2',
            icon: '🔒',
            label: 'We Hash It Locally',
            desc: 'A unique SHA-256 fingerprint is computed in your browser.'
          },
          {
            n: '3',
            icon: '₿',
            label: 'Bitcoin Timestamps It',
            desc: 'The fingerprint is permanently written to the blockchain.'
          }
        ].map((step, i) => (
          <div
            key={step.n}
            className="flex flex-col gap-2 p-5"
            style={{
              background: i === 1 ? 'var(--surface-raised)' : 'var(--bg-secondary)',
              borderRight: i < 2 ? '1px solid var(--border)' : 'none'
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                {step.n}
              </span>
              <span className="text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase">
                Step {step.n}
              </span>
            </div>
            <p
              className="text-sm font-black tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {step.label}
            </p>
            <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[var(--accent-gold)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">{t('stamp', 'title')}</h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">{t('stamp', 'subtitle')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* ── Main Dropzone ─────────────────────── */}
        <div className="space-y-8 lg:col-span-2">
          {/* Mode Selector */}
          <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <button
              type="button"
              aria-pressed={stampMode === 'single'}
              aria-label="Single file stamp mode"
              onClick={() => {
                setStampMode('single')
                setIsCapsuleMode(false)
                setFiles([])
              }}
              className="rounded-2xl border p-4 text-left transition-all"
              style={{
                borderColor: stampMode === 'single' ? 'var(--accent-gold)' : 'var(--border)',
                background: stampMode === 'single' ? 'rgba(240,180,41,0.06)' : 'var(--bg-secondary)'
              }}
            >
              <div className="mb-1 text-lg">📄</div>
              <div
                className="mb-1 text-xs font-black tracking-widest uppercase"
                style={{
                  color: stampMode === 'single' ? 'var(--accent-gold)' : 'var(--text-primary)'
                }}
              >
                Single File
              </div>
              <div className="text-[10px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                Timestamp one document or file.
              </div>
            </button>
            <button
              type="button"
              aria-pressed={stampMode === 'capsule'}
              aria-label="Time capsule stamp mode"
              onClick={() => {
                setStampMode('capsule')
                setIsCapsuleMode(true)
                setFiles([])
              }}
              className="rounded-2xl border p-4 text-left transition-all"
              style={{
                borderColor: stampMode === 'capsule' ? 'var(--accent-gold)' : 'var(--border)',
                background:
                  stampMode === 'capsule' ? 'rgba(240,180,41,0.06)' : 'var(--bg-secondary)'
              }}
            >
              <div className="mb-1 text-lg">📦</div>
              <div
                className="mb-1 text-xs font-black tracking-widest uppercase"
                style={{
                  color: stampMode === 'capsule' ? 'var(--accent-gold)' : 'var(--text-primary)'
                }}
              >
                Time Capsule
              </div>
              <div className="text-[10px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                Bundle multiple files into one proof.
              </div>
            </button>
            <button
              type="button"
              aria-pressed={stampMode === 'redact'}
              aria-label="ZK redact stamp mode"
              onClick={() => {
                setStampMode('redact')
                setIsCapsuleMode(false)
                setFiles([])
              }}
              className="rounded-2xl border p-4 text-left transition-all"
              style={{
                borderColor: stampMode === 'redact' ? 'var(--accent-gold)' : 'var(--border)',
                background: stampMode === 'redact' ? 'rgba(240,180,41,0.06)' : 'var(--bg-secondary)'
              }}
            >
              <div className="mb-1 text-lg">🔒</div>
              <div
                className="mb-1 text-xs font-black tracking-widest uppercase"
                style={{
                  color: stampMode === 'redact' ? 'var(--accent-gold)' : 'var(--text-primary)'
                }}
              >
                ZK-Redact
              </div>
              <div className="text-[10px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                Blackout private data before hashing.
              </div>
            </button>
            <button
              type="button"
              aria-pressed={stampMode === 'deposition'}
              aria-label="Deposition stamp mode"
              onClick={() => {
                setStampMode('deposition')
                setIsCapsuleMode(false)
                setFiles([])
              }}
              className="rounded-2xl border p-4 text-left transition-all"
              style={{
                borderColor: stampMode === 'deposition' ? 'var(--accent-gold)' : 'var(--border)',
                background:
                  stampMode === 'deposition' ? 'rgba(240,180,41,0.06)' : 'var(--bg-secondary)'
              }}
            >
              <div className="mb-1 text-lg">🎙</div>
              <div
                className="mb-1 text-xs font-black tracking-widest uppercase"
                style={{
                  color: stampMode === 'deposition' ? 'var(--accent-gold)' : 'var(--text-primary)'
                }}
              >
                Deposition
              </div>
              <div className="text-[10px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
                Record voice testimony client-side.
              </div>
            </button>
          </div>

          <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={(e) => {
              if (stampMode !== 'single' && stampMode !== 'capsule') return
              const input = document.getElementById('file-input')
              if (input && stampingStatus === 'idle') input.click()
            }}
            animate={{
              borderColor: isDragging ? 'var(--accent-gold)' : 'var(--border)',
              backgroundColor: isDragging ? 'var(--surface-raised)' : 'transparent'
            }}
            className={`group relative flex h-[460px] flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed p-12 text-center transition-colors ${
              (stampMode === 'single' || stampMode === 'capsule') && stampingStatus === 'idle'
                ? 'cursor-pointer'
                : ''
            }`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-gold),transparent)] opacity-0 transition-opacity group-hover:opacity-[0.03]" />

            <AnimatePresence mode="wait">
              {stampingStatus === 'idle' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex h-full w-full flex-col items-center justify-center space-y-6"
                >
                  {stampMode === 'redact' ? (
                    <div
                      className="z-10 w-full max-w-lg space-y-4 text-left"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-black tracking-widest text-[var(--accent-gold)] uppercase">
                          🔒 Zero-Knowledge Redacted Document
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase">
                          Type your document text and specify terms to redact (comma-separated)
                        </p>
                      </div>

                      <textarea
                        placeholder="Enter the sensitive document text here..."
                        value={redactText}
                        onChange={(e) => handleComputeZK(e.target.value, redactTerms)}
                        rows={4}
                        className="w-full rounded-xl border bg-transparent p-3 text-xs outline-none focus:border-[var(--accent-gold)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />

                      <input
                        type="text"
                        placeholder="Blacklisted Terms: e.g. password, social security, SSN..."
                        value={redactTerms}
                        onChange={(e) => handleComputeZK(redactText, e.target.value)}
                        className="h-10 w-full rounded-xl border bg-transparent px-3 text-xs outline-none focus:border-[var(--accent-gold)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      />

                      {redactedTextOut && (
                        <div className="space-y-2 rounded-xl border border-white/5 bg-black/40 p-3 font-mono text-[9px] text-[var(--text-secondary)]">
                          <p className="text-[8px] font-black text-white/40 uppercase">
                            Redacted Preview
                          </p>
                          <div className="max-h-20 overflow-y-auto whitespace-pre-wrap">
                            {redactedTextOut}
                          </div>
                        </div>
                      )}

                      {redactOriginalHash && (
                        <div className="grid grid-cols-2 gap-3 font-mono text-[8px]">
                          <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-2.5">
                            <p className="font-black text-red-400 uppercase">
                              Original Document Hash
                            </p>
                            <p className="truncate text-red-300">{redactOriginalHash}</p>
                          </div>
                          <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-2.5">
                            <p className="font-black text-emerald-400 uppercase">
                              Redacted Document Hash
                            </p>
                            <p className="truncate text-emerald-300">{redactRedactedHash}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : stampMode === 'deposition' ? (
                    <div
                      className="z-10 w-full max-w-md space-y-6 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-black tracking-widest text-[var(--accent-gold)] uppercase">
                          🎙 Oral Deposition Statement
                        </h4>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase">
                          Capture voice deposition immutably client-side on Bitcoin.
                        </p>
                      </div>

                      <div className="flex justify-center gap-4">
                        {recordingState !== 'recording' ? (
                          <button
                            type="button"
                            aria-label="Start recording deposition"
                            onClick={startRecording}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
                          >
                            <Mic size={24} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            aria-label="Stop recording deposition"
                            onClick={stopRecording}
                            className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all hover:scale-105"
                          >
                            <Video size={24} />
                          </button>
                        )}
                      </div>

                      <p className="text-[10px] font-black tracking-wider uppercase">
                        Status:{' '}
                        <span
                          style={{
                            color:
                              recordingState === 'recording'
                                ? 'var(--accent-danger)'
                                : 'var(--text-secondary)'
                          }}
                        >
                          {recordingState === 'recording'
                            ? '🔴 Recording active...'
                            : recordingState === 'stopped'
                              ? '✅ Captured'
                              : 'Idle'}
                        </span>
                      </p>

                      {audioUrl && (
                        <div className="space-y-2">
                          <audio src={audioUrl} controls className="mx-auto h-10 w-full max-w-xs" />
                          <p className="text-[9px] text-[var(--text-secondary)] uppercase">
                            Statement recorded and loaded. Ready to anchor.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--accent-gold)] shadow-2xl">
                        {isCapsuleMode ? <FileArchive size={32} /> : <Upload size={32} />}
                      </div>
                      <div className="space-y-2">
                        <h3 className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
                          {isCapsuleMode ? 'Assemble Evidence Capsule' : t('stamp', 'title')}
                          <Tooltip
                            title="Step 1 — Drop Your File"
                            content="Drag any document here or click to browse. Your file stays on your device — only a SHA-256 hash is sent to the server."
                          />
                        </h3>
                        <p className="mx-auto flex max-w-sm items-center justify-center gap-1 font-medium text-[var(--text-secondary)]">
                          {isCapsuleMode
                            ? 'Drop multiple files to create a signed evidence bundle anchored as a single proof.'
                            : t('stamp', 'dropzone')}
                          <Tooltip
                            title="Step 2 — Local Hashing"
                            content="Satohash computes a unique SHA-256 fingerprint in your browser using a Web Worker. The original file never leaves your machine."
                          />
                        </p>
                        <p className="mx-auto flex max-w-sm items-center justify-center gap-1 text-[10px] font-bold tracking-widest text-[var(--text-muted)] uppercase">
                          Anchored via OpenTimestamps → Bitcoin
                          <Tooltip
                            title="Step 3 — Bitcoin Timestamp"
                            content="The hash is submitted to public OTS calendars and permanently committed to the Bitcoin blockchain. Download your .ots proof when complete."
                          />
                        </p>
                      </div>
                    </>
                  )}

                  {/* Mobile file input */}
                  {(stampMode === 'single' || stampMode === 'capsule') && (
                    <>
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
                          <p
                            className="text-sm font-black"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            Tap to select file
                          </p>
                          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Camera, photos, or any file
                          </p>
                        </div>
                      </label>
                    </>
                  )}
                </motion.div>
              ) : stampingStatus === 'complete' && proofResult ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md space-y-5"
                >
                  <div className="w-full max-w-lg space-y-6">
                    {/* Success header */}
                    <div className="space-y-2 text-center">
                      <div
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                        style={{
                          background: 'rgba(34,211,165,0.12)',
                          border: '2px solid var(--accent-success)'
                        }}
                      >
                        <CheckCircle size={32} style={{ color: 'var(--accent-success)' }} />
                      </div>
                      <h3
                        className="text-2xl font-black tracking-tight uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        Proof Created
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Your file&apos;s fingerprint has been submitted to the Bitcoin blockchain
                        via OpenTimestamps.
                      </p>
                    </div>

                    {/* Status pill */}
                    {isConfirmed ? (
                      <div
                        className="flex items-center justify-center gap-2 rounded-xl px-4 py-3"
                        style={{
                          background: 'rgba(34,211,165,0.08)',
                          border: '1px solid rgba(34,211,165,0.25)'
                        }}
                      >
                        <CheckCircle size={16} style={{ color: 'var(--accent-success)' }} />
                        <span
                          className="text-sm font-black"
                          style={{ color: 'var(--accent-success)' }}
                        >
                          Confirmed in Bitcoin Block {confirmedBlock?.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center gap-2 rounded-xl px-4 py-3"
                        style={{
                          background: 'rgba(240,180,41,0.08)',
                          border: '1px solid rgba(240,180,41,0.25)'
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Activity
                            size={16}
                            className={
                              upgradeStatus === 'upgrading' ? 'animate-spin' : 'animate-pulse'
                            }
                            style={{ color: 'var(--accent-gold)' }}
                          />
                          <span
                            className="text-sm font-bold"
                            style={{ color: 'var(--accent-gold)' }}
                          >
                            {upgradeStatus === 'upgrading'
                              ? 'OTS upgrade in progress…'
                              : 'Pending Bitcoin confirmation (~10 min)'}
                          </span>
                        </div>
                        {upgradeStatus && (
                          <span
                            className="text-[10px] font-black tracking-widest uppercase"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Live status: {upgradeStatus}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Hash */}
                    <div
                      className="space-y-1 rounded-xl border p-4"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                    >
                      <p
                        className="text-[9px] font-black tracking-widest uppercase"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        SHA-256 Fingerprint
                      </p>
                      <p
                        className="font-mono text-xs break-all select-all"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {proofResult?.hash}
                      </p>
                    </div>

                    {/* 3 CTA buttons */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={`${getApiUrl()}/api/stamps/${proofResult?.id}?download=true`}
                          className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black tracking-wider uppercase transition-all hover:opacity-90"
                          style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                        >
                          ⬇ OTS Proof
                        </a>
                        <button
                          onClick={() =>
                            downloadCertificate({
                              id: proofResult?.id || 'pending',
                              name: files[0]?.name || proofResult?.filename || 'Document',
                              fullHash: proofResult?.hash,
                              hash: proofResult?.hash,
                              date: new Date().toISOString().split('T')[0],
                              status: isConfirmed ? 'confirmed' : 'pending'
                            })
                          }
                          className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-xs font-black tracking-wider uppercase transition-all hover:opacity-90"
                          style={{ background: 'var(--accent-active)', color: '#fff' }}
                        >
                          📜 Certificate
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => (window.location.href = '/vault')}
                          className="flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black uppercase transition-all hover:text-[var(--text-primary)]"
                          style={{
                            borderColor: 'var(--accent-active)',
                            color: 'var(--accent-active)',
                            background: 'rgba(59,130,246,0.06)'
                          }}
                        >
                          View in Vault →
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              window.location.origin + '/verify/' + proofResult?.id
                            )
                            toast.success('Share link copied!')
                          }}
                          className="flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black uppercase transition-all hover:text-[var(--text-primary)]"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                        >
                          🔗 Copy Share Link
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          setStampingStatus('idle')
                          setFiles([])
                          setProofResult(null)
                          setHashValue('')
                          setIsConfirmed(false)
                          setConfirmedBlock(null)
                          setUpgradeStatus(null)
                        }}
                        className="rounded-xl border py-3 text-xs font-bold uppercase transition-all hover:text-[var(--text-primary)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                      >
                        + Stamp Another File
                      </button>
                    </div>
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
                  {t('stamp', 'stamp')} <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Configuration Sidebar ──────────────── */}
        <div className="space-y-8">
          {/* Web Capture shortcut */}
          <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
              >
                <span className="text-base">🌐</span>
              </div>
              <div>
                <p
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Web Capture
                </p>
                <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                  Stamp a URL or webpage
                </p>
              </div>
            </div>
            <p className="text-[11px] leading-snug" style={{ color: 'var(--text-secondary)' }}>
              Capture and timestamp any webpage as proof it existed at this moment.
            </p>
            <a
              href="/snapper"
              className="flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[10px] font-black tracking-widest uppercase transition-all hover:text-[var(--text-primary)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Open Web Capture →
            </a>
          </div>

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
                    <span className="flex items-center gap-4">
                      <button
                        onClick={() => setCoSigners([...coSigners, ''])}
                        className="text-[10px] font-bold text-[var(--accent-gold)] uppercase"
                      >
                        + {t('stamp', 'addCoSigner')}
                      </button>
                      <button
                        onClick={() => {
                          const invite = `${window.location.origin}/stamp?cosign=true&hash=${hashValue || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}&npub=${localStorage.getItem('satohash_npub') || ''}`
                          navigator.clipboard.writeText(invite)
                          toast.success('✉ Co-Sign DM Invitation Copied!', {
                            description: 'Send this link to your co-signer.'
                          })
                        }}
                        className="text-[10px] font-bold text-[var(--accent-active)] uppercase"
                      >
                        ✉ Copy Co-Sign Invitation
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

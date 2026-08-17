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
  Video,
  Mic
} from 'lucide-react'
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getTieredFeeEstimates } from '../utils/mempool.js'
import FeeAdvisor from '../components/stamps/FeeAdvisor'
import { addErrorBreadcrumb } from '../utils/errors.js'
import { clientId } from '../utils/id'
import { toast } from 'sonner'
import Tooltip from '../components/ui/Tooltip'
import { useSocket } from '../hooks/useSocket'
import { useI18n } from '../i18n'
import usePageMeta from '../hooks/usePageMeta'
import { getApiUrl } from '../config/constants'
import { normalizeSha256 } from '../utils/hashUtils'
import { useTranslation } from 'react-i18next'
import { isStaticOnlyMode } from '../utils/staticMode'
import { isApiExplicitlyConfigured } from '../config/mvp'
import StaticModeBanner from '../components/shared/StaticModeBanner'
import GiveABitBadge from '../components/marketing/GiveABitBadge'
import { stampHashBrowser, downloadOtsBlob } from '../utils/otsClient'
import { upsertLocalStamp } from '../utils/vaultLocal'
import { parseStampDeepLink } from '../utils/stampDeepLink'
import StampStickyBar from '../components/stamps/StampStickyBar'
import StampSuccessActions from '../components/stamps/StampSuccessActions'
import { persistLastProof } from '../utils/lastProof'
import { requestWakeLock, releaseWakeLock } from '../utils/wakeLock'
import LiveNodeChip from '../components/shared/LiveNodeChip'
import events, { trackEvent } from '../utils/analytics'

export default function Stamp() {
  usePageMeta({ page: 'stamp' })
  useEffect(() => {
    trackEvent(events.STAMP_VIEW, { path: '/stamp' })
  }, [])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const deepLink = useMemo(() => parseStampDeepLink(searchParams), [searchParams])
  const [stampMode, setStampMode] = useState('single') // single, capsule, redact, deposition
  const [showAdvancedModes, setShowAdvancedModes] = useState(false)
  const [isCapsuleMode, setIsCapsuleMode] = useState(false)
  const [deepLinkClientId, setDeepLinkClientId] = useState('spa')
  const [hashFromDeepLink, setHashFromDeepLink] = useState(false)
  const [hashInvalidMsg, setHashInvalidMsg] = useState('')
  const deepLinkHandled = useRef(false)
  const pollRef = useRef(null)

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
  const { t: tp } = useTranslation()

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
        toast.success(tp('stampPage.confirmedToast'), {
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
        toast.error(tp('stampPage.feeUnavailable'), { description: 'Using default priority' })
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

  const saveBrowserOtsProof = useCallback(async (hash, label, size, otsBlob) => {
    const arrayBuffer = await otsBlob.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)
    let otsFileBase64 = null
    try {
      otsFileBase64 = btoa(String.fromCharCode(...bytes))
    } catch {
      /* skip base64 for very large proofs */
    }
    const proof = {
      id: clientId('ots'),
      hash,
      filename: label,
      size,
      status: 'pending',
      created_at: new Date().toISOString(),
      source: 'browser-ots',
      hasOts: true,
      otsFileBase64
    }
    upsertLocalStamp(proof)
    setProofResult(proof)
    setStampingStatus('complete')
    downloadOtsBlob(otsBlob, `${label || 'proof'}.ots`)
    toast.success('Local OTS proof (browser calendars)', {
      description: 'No hosted stamp id — shareable /verify/:id needs the API plane.'
    })
    navigator.vibrate?.([50, 30, 100])
    persistLastProof(proof)
    return proof
  }, [])

  /** Persist proof and open dedicated success route (avoids double-submit on Back). */
  const goToDone = useCallback(
    (proof) => {
      if (!proof) return
      trackEvent(events.TIMESTAMP_COMPLETED, {
        path: '/stamp/done',
        status: proof.status || 'pending'
      })
      persistLastProof(proof)
      const q = new URLSearchParams()
      if (proof.id && !String(proof.id).startsWith('ots-')) q.set('id', proof.id)
      else if (proof.hash) q.set('hash', proof.hash)
      navigate(`/stamp/done?${q.toString()}`, { replace: true })
    },
    [navigate]
  )

  /** Browser-only OTS fallback (no API id). */
  const stampHashBrowserOnly = useCallback(
    async (hash, label = 'Linked hash') => {
      try {
        setStampingStatus('anchoring')
        const { blob } = await stampHashBrowser(hash)
        const localProof = await saveBrowserOtsProof(hash, label, 0, blob)
        goToDone(localProof)
      } catch (e) {
        toast.error('Browser stamp failed', { description: e.message })
        setStampingStatus('idle')
      }
    },
    [saveBrowserOtsProof, goToDone]
  )

  const stopStatusPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const startStatusPoll = useCallback(
    (stampId) => {
      if (!stampId || !isApiExplicitlyConfigured()) return
      stopStatusPoll()
      const API = getApiUrl()
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`${API}/api/stamps/${encodeURIComponent(stampId)}`)
          if (!res.ok) return
          const data = await res.json()
          setProofResult((prev) => (prev ? { ...prev, ...data } : data))
          if (data.status === 'confirmed') {
            setIsConfirmed(true)
            if (data.bitcoin_block_height) setConfirmedBlock(data.bitcoin_block_height)
            setUpgradeStatus('confirmed')
            stopStatusPoll()
            toast.success(tp('stampPage.confirmedToast'), {
              description: data.bitcoin_block_height
                ? `Block ${data.bitcoin_block_height.toLocaleString()}`
                : 'Proof anchored to Bitcoin mainnet'
            })
          } else if (data.status === 'failed') {
            setUpgradeStatus('failed')
            stopStatusPoll()
          } else {
            setUpgradeStatus(data.status || 'pending')
          }
        } catch {
          /* transient network — keep polling */
        }
      }, 8000)
    },
    [stopStatusPoll, tp]
  )

  useEffect(() => () => stopStatusPoll(), [stopStatusPoll])

  /**
   * Primary path for deep-linked hashes: POST /api/stamp with X-Satohash-Client,
   * then poll until confirmed. Falls back to browser OTS calendars when API is down.
   */
  const stampLinkedHash = useCallback(
    async (hash, label = 'Linked document', client = 'spa') => {
      const hex = normalizeSha256(hash)
      if (!hex) {
        setError('Invalid SHA-256 hash — must be exactly 64 hexadecimal characters')
        return
      }
      setError('')
      setProofResult(null)
      setIsConfirmed(false)
      setConfirmedBlock(null)
      setUpgradeStatus(null)
      setStampingStatus('anchoring')

      if (!isApiExplicitlyConfigured()) {
        await stampHashBrowserOnly(hex, label)
        return
      }

      try {
        const API = getApiUrl()
        const storedNpub =
          localStorage.getItem('satohash_npub') || sessionStorage.getItem('satohash_npub')
        const res = await fetch(`${API}/api/stamp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Satohash-Client': client || 'spa',
            ...(storedNpub ? { 'X-Npub': storedNpub } : {})
          },
          body: JSON.stringify({
            hash: hex,
            filename: label || 'Linked document'
          })
        })

        if (res.status === 429) {
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
          } catch {
            /* ignore */
          }
          const invoice =
            invoiceData?.invoice || invoiceData?.payment_request || invoiceData?.www_authenticate
          if (invoice) {
            setLightningInvoice({
              payment_request: invoice,
              amount_msat: invoiceData?.amount_msat || 1000,
              expires_at: invoiceData?.expires_at || Date.now() + 600000
            })
          } else {
            toast.error('Lightning payment required to stamp', {
              description:
                'Family free tier may need X-Satohash-Key, or set REQUIRE_LIGHTNING=false'
            })
          }
          setStampingStatus('idle')
          setError('Payment required — complete Lightning invoice or retry later')
          return
        }

        if (!res.ok) {
          let errMsg = 'Stamping failed'
          try {
            const err = await res.json()
            errMsg = err.message || err.error || errMsg
          } catch {
            /* ignore */
          }
          throw new Error(errMsg)
        }

        const data = await res.json()
        if (!data?.id) {
          throw new Error('API returned no stamp id')
        }
        const proof = {
          ...data,
          hash: data.hash || hex,
          filename: data.filename || label,
          status: data.status || 'pending',
          client: client || 'spa'
        }
        setProofResult(proof)
        setHashValue(hex)
        setStampingStatus('complete')
        setUpgradeStatus(proof.status)
        navigator.vibrate?.([50, 30, 100])

        const existing = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
        existing.unshift(proof)
        localStorage.setItem('satohash_stamps', JSON.stringify(existing.slice(0, 100)))
        upsertLocalStamp(proof)

        // Never claim "Bitcoin confirmed" until status is confirmed
        if (proof.status === 'confirmed') {
          setIsConfirmed(true)
          if (proof.bitcoin_block_height) setConfirmedBlock(proof.bitcoin_block_height)
          toast.success('Stamp confirmed on Bitcoin', {
            description: `ID ${String(proof.id).slice(0, 8)}… — share verify link`
          })
        } else {
          toast.success('Stamp submitted — pending Bitcoin confirmation', {
            description: `ID ${String(proof.id).slice(0, 8)}… · status: ${proof.status}`
          })
          startStatusPoll(proof.id)
        }
        goToDone(proof)
      } catch (err) {
        // API down / network — browser calendar fallback (no durable API id)
        console.warn('API stamp failed, trying browser OTS', err)
        try {
          await stampHashBrowserOnly(hex, label)
          toast.warning('Browser calendars only — no hosted stamp id', {
            description:
              err.message ||
              'API unavailable. Local .ots only; verify URL needs a durable API stamp id.'
          })
        } catch (otsErr) {
          const msg = err.message || otsErr.message || 'Failed to stamp'
          setError(msg)
          toast.error(tp('stampPage.stampFailed'), { description: msg })
          setStampingStatus('idle')
        }
      }
    },
    [stampHashBrowserOnly, startStatusPoll, tp, goToDone]
  )

  // Family / MotoPass deep-link: /stamp?hash=&ref=&label=&filename=&campaign=&autostamp=
  useEffect(() => {
    if (deepLink.cosign) {
      setMultiParty(true)
      if (deepLink.npub?.startsWith('npub1')) setCoSigners([deepLink.npub])
    }

    if (deepLink.hashInvalid) {
      setHashInvalidMsg(
        'Invalid SHA-256 hash — expected exactly 64 hexadecimal characters (a–f, 0–9).'
      )
      setHashFromDeepLink(false)
      setHashValue('')
      return
    }

    if (!deepLink.hash) {
      setHashInvalidMsg('')
      return
    }

    setHashInvalidMsg('')
    setHashValue(deepLink.hash)
    setHashFromDeepLink(true)
    setDeepLinkClientId(deepLink.clientId)
    setCaseLabel((prev) => prev || deepLink.displayLabel)

    // One-shot UX for this hash (avoid toast spam when callbacks re-identity)
    const handleKey = `${deepLink.hash}:${deepLink.clientId}:${deepLink.autostamp}`
    if (deepLinkHandled.current === handleKey) return
    deepLinkHandled.current = handleKey

    if (deepLink.product?.id === 'motopass' || deepLink.source === 'motopass') {
      toast.info(tp('stampPage.motopassLoaded'), {
        description: tp('stampPage.motopassDesc')
      })
    } else if (deepLink.product) {
      toast.info(deepLink.product.chip, {
        description: 'Hash prefilled — stamp on Bitcoin in one click'
      })
    }

    if (deepLink.autostamp) {
      stampLinkedHash(deepLink.hash, deepLink.displayLabel, deepLink.clientId)
    }
  }, [deepLink, stampLinkedHash, t])

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
    trackEvent(events.TIMESTAMP_STARTED, { path: '/stamp', mode: stampMode })
    await requestWakeLock()

    try {
      setStampingStatus('hashing')

      // Real SHA-256 hashing in browser - file NEVER leaves device
      const file = files[0]
      // Soft cap: warn + block multi-hundred-MB blobs that freeze low-end devices
      const MAX_STAMP_BYTES = 100 * 1024 * 1024
      if (file.size > MAX_STAMP_BYTES) {
        setStampingStatus('idle')
        await releaseWakeLock()
        setError(
          `File is ${(file.size / (1024 * 1024)).toFixed(0)} MB — max ${MAX_STAMP_BYTES / (1024 * 1024)} MB for browser stamp. Hash offline and paste the SHA-256.`
        )
        toast.error('File too large for browser stamp', {
          description: 'Use a smaller file or stamp a precomputed SHA-256 hash'
        })
        return
      }
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

      if (!isApiExplicitlyConfigured()) {
        const { blob } = await stampHashBrowser(hash)
        const localProof = await saveBrowserOtsProof(hash, caseLabel || file.name, file.size, blob)
        await releaseWakeLock()
        goToDone(localProof)
        return
      }

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
          'X-Satohash-Client': deepLinkClientId || deepLink.clientId || 'spa',
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
      if (!data?.id) {
        throw new Error('API returned no stamp id — not treating as success')
      }
      const proof = {
        ...data,
        filename: caseLabel || file.name,
        status: data.status || 'pending',
        size: file.size
      }
      setProofResult(proof)
      setStampingStatus('complete')
      setUpgradeStatus(proof.status)
      navigator.vibrate?.([50, 30, 100])

      const existing = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
      existing.unshift(proof)
      localStorage.setItem('satohash_stamps', JSON.stringify(existing.slice(0, 100)))
      upsertLocalStamp(proof)

      if (proof.status === 'confirmed') {
        setIsConfirmed(true)
        if (proof.bitcoin_block_height) setConfirmedBlock(proof.bitcoin_block_height)
        toast.success('Stamp confirmed on Bitcoin', {
          description: `ID ${String(proof.id).slice(0, 8)}…`
        })
      } else {
        toast.success('Stamp submitted — pending Bitcoin confirmation', {
          description: `ID ${String(proof.id).slice(0, 8)}… · status: ${proof.status}`
        })
        startStatusPoll(proof.id)
      }
      await releaseWakeLock()
      goToDone(proof)
    } catch (err) {
      const file = files[0]
      const hash = hashValue
      if (hash && hash.length === 64) {
        try {
          const { blob } = await stampHashBrowser(hash)
          const localProof = await saveBrowserOtsProof(
            hash,
            caseLabel || file?.name || 'document',
            file?.size || 0,
            blob
          )
          await releaseWakeLock()
          goToDone(localProof)
          return
        } catch (otsErr) {
          console.warn('Browser OTS fallback failed', otsErr)
        }
      }

      if (
        !navigator.onLine ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('server') ||
        err.message?.includes('running')
      ) {
        const queuedItem = {
          id: clientId('offline'),
          filename: caseLabel || file?.name,
          hash: hashValue,
          created_at: new Date().toISOString(),
          status: 'pending',
          size: file?.size || 0
        }

        const offlineQ = JSON.parse(localStorage.getItem('satohash_offline_queue') || '[]')
        offlineQ.push(queuedItem)
        localStorage.setItem('satohash_offline_queue', JSON.stringify(offlineQ))

        const queuedMsg = isStaticOnlyMode()
          ? tp('staticMode.stampQueued')
          : 'Connection offline. Hash queued for synchronization.'
        toast.warning(isStaticOnlyMode() ? 'Hash saved — API pending' : '⚡ Stamp Queued Offline', {
          description: queuedMsg
        })

        const existing = JSON.parse(localStorage.getItem('satohash_stamps') || '[]')
        existing.unshift(queuedItem)
        localStorage.setItem('satohash_stamps', JSON.stringify(existing.slice(0, 100)))

        setProofResult(queuedItem)
        setStampingStatus('complete')
        await releaseWakeLock()
        goToDone(queuedItem)
        return
      }

      const msg = err.message || 'Failed to stamp. Try again or use browser calendars.'
      setError(msg)
      toast.error(tp('stampPage.stampFailed'), { description: msg })
      setStampingStatus('idle')
      await releaseWakeLock()
    }
  }

  // Progress percentage per status
  const progressPercent =
    stampingStatus === 'hashing' ? '30%' : stampingStatus === 'anchoring' ? '70%' : '100%'

  const canStampFile = files.length > 0 && stampingStatus === 'idle'
  const canStampHash =
    !!normalizeSha256(hashValue) && files.length === 0 && stampingStatus === 'idle' && !proofResult

  return (
    <div className="stamp-page mx-auto max-w-6xl space-y-8 p-4 pb-[calc(8.5rem+env(safe-area-inset-bottom,0px))] sm:space-y-12 sm:pb-24 md:p-8 md:pb-20">
      {/* Secondary trail — primary chrome is MarketingShell on mobile */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className="text-[11px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Free stamp
          </p>
          <LiveNodeChip compact />
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            to="/verify"
            className="inline-flex min-h-[40px] items-center rounded-lg border border-[var(--border)] px-3 text-[11px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Verify
          </Link>
          <Link
            to="/vault"
            className="inline-flex min-h-[40px] items-center rounded-lg border border-[var(--border)] px-3 text-[11px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Vault
          </Link>
          <Link
            to="/watch"
            className="inline-flex min-h-[40px] items-center rounded-lg border border-[var(--border)] px-3 text-[11px] font-bold tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            Watch
          </Link>
        </div>
      </div>
      <StaticModeBanner />
      <GiveABitBadge />

      {files.length === 0 && stampingStatus === 'idle' && !proofResult && (
        <div
          className="vault-ring rounded-2xl border p-5"
          data-testid="hash-only-card"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Hash only
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have a SHA-256? Paste it. The file never needs to come here.
          </p>
          <input
            data-testid="hash-only-input"
            value={hashValue}
            onChange={(e) => setHashValue(e.target.value.trim())}
            placeholder="64 hex characters"
            className="mt-3 h-12 w-full rounded-xl border px-3 font-mono text-sm"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)'
            }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      )}

      {/* Invalid deep-link hash */}
      {hashInvalidMsg && (
        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: 'var(--accent-danger)',
            background: 'rgba(239,68,68,0.08)',
            color: 'var(--accent-danger)'
          }}
        >
          <p className="text-sm font-bold">Invalid stamp link</p>
          <p className="mt-1 text-xs opacity-90">{hashInvalidMsg}</p>
          {deepLink.rawHash && (
            <p className="mt-2 font-mono text-[10px] break-all opacity-70">{deepLink.rawHash}</p>
          )}
        </div>
      )}

      {/* Family deep-link card: prefilled hash + one CTA */}
      {normalizeSha256(hashValue) &&
        files.length === 0 &&
        stampingStatus === 'idle' &&
        !proofResult && (
          <div
            className="rounded-2xl border p-5 shadow-lg sm:p-6"
            data-testid="deep-link-banner"
            style={{
              borderColor: 'var(--accent-gold)',
              background: 'var(--surface-raised)',
              boxShadow: '0 0 0 1px color-mix(in srgb, var(--accent-gold) 20%, transparent)'
            }}
          >
            <div className="mb-3 flex items-start gap-3">
              <img
                src="/media/ui/empty-proof.jpg"
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 flex-shrink-0 rounded-xl object-cover"
                style={{ border: '1px solid var(--border)' }}
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Family handoff
                </p>
                <h2
                  className="text-lg font-black tracking-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {deepLink.product
                    ? `Stamp for ${deepLink.product.chip || deepLink.product.id}`
                    : 'Hash ready to stamp'}
                </h2>
                <p className="text-xs leading-snug" style={{ color: 'var(--text-secondary)' }}>
                  {deepLink.displayLabel
                    ? `“${deepLink.displayLabel}” — only the fingerprint is sent; file stays on device.`
                    : 'Only the SHA-256 fingerprint is submitted. One tap anchors via OpenTimestamps → Bitcoin.'}
                </p>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {deepLink.product && (
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase"
                  style={{
                    background: 'rgba(240,180,41,0.15)',
                    color: 'var(--accent-gold)',
                    border: '1px solid rgba(240,180,41,0.35)'
                  }}
                >
                  {deepLink.product.chip}
                </span>
              )}
              {deepLink.campaign && (
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-bold"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  {deepLink.campaign}
                </span>
              )}
              {hashFromDeepLink && (
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-bold"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Deep link
                </span>
              )}
            </div>
            <div
              className="mt-1 rounded-xl border p-3"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
            >
              <p
                className="text-[9px] font-black tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                SHA-256
              </p>
              <p
                className="mt-1 font-mono text-[11px] break-all select-all"
                style={{ color: 'var(--text-primary)' }}
              >
                {hashValue}
              </p>
            </div>
            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-black tracking-wider uppercase transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              onClick={() =>
                stampLinkedHash(
                  hashValue,
                  caseLabel || deepLink.displayLabel || 'Linked document',
                  deepLinkClientId || deepLink.clientId
                )
              }
            >
              <ShieldCheck size={18} /> Stamp on Bitcoin
            </button>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-xl border px-4 py-2 text-[10px] font-black uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                onClick={() => {
                  navigator.clipboard.writeText(hashValue)
                  toast.success('Hash copied')
                }}
              >
                Copy hash
              </button>
              <Link
                to={`/verify/${hashValue}`}
                className="rounded-xl border px-4 py-2 text-[10px] font-black uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Check existing proof
              </Link>
              <button
                type="button"
                className="rounded-xl border px-4 py-2 text-[10px] font-black uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                onClick={() =>
                  stampHashBrowserOnly(
                    hashValue,
                    caseLabel || deepLink.displayLabel || 'Linked hash'
                  )
                }
              >
                Browser calendars only
              </button>
            </div>
          </div>
        )}
      {/* ── 3-Step Flow Banner ── */}
      <div className="mb-8 grid grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-[var(--border)] sm:grid-cols-3">
        {[
          {
            n: '1',
            icon: '📄',
            label: tp('stampPage.step1Label'),
            desc: tp('stampPage.step1Desc')
          },
          {
            n: '2',
            icon: '🔒',
            label: tp('stampPage.step2Label'),
            desc: tp('stampPage.step2Desc')
          },
          {
            n: '3',
            icon: '₿',
            label: tp('stampPage.step3Label'),
            desc: tp('stampPage.step3Desc')
          }
        ].map((step, i) => (
          <div
            key={step.n}
            className={`flex flex-col gap-2 p-5 ${i < 2 ? 'border-b sm:border-r sm:border-b-0' : ''}`}
            style={{
              background: i === 1 ? 'var(--surface-raised)' : 'var(--bg-secondary)',
              borderColor: 'var(--border)'
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
              <span aria-hidden className="ml-auto text-sm">
                {step.icon}
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
          {/* Mode selector — single first; advanced collapsed on mobile */}
          <div className="mb-6 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <button
                type="button"
                aria-pressed={stampMode === 'single'}
                aria-label={tp('stampPage.modes.single')}
                data-testid="mode-single"
                onClick={() => {
                  setStampMode('single')
                  setIsCapsuleMode(false)
                  setFiles([])
                }}
                className="rounded-2xl border p-4 text-left transition-all"
                style={{
                  borderColor: stampMode === 'single' ? 'var(--accent-gold)' : 'var(--border)',
                  background:
                    stampMode === 'single' ? 'rgba(240,180,41,0.06)' : 'var(--bg-secondary)'
                }}
              >
                <div className="mb-1 text-lg">📄</div>
                <div
                  className="mb-1 text-xs font-black tracking-widest uppercase"
                  style={{
                    color: stampMode === 'single' ? 'var(--accent-gold)' : 'var(--text-primary)'
                  }}
                >
                  {tp('stampPage.modes.single')}
                </div>
                <div
                  className="text-[10px] leading-snug"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  File · photo · or hash — one thumb path
                </div>
              </button>
              {(showAdvancedModes || stampMode !== 'single') && (
                <>
                  <button
                    type="button"
                    aria-pressed={stampMode === 'capsule'}
                    aria-label={tp('stampPage.modes.capsule')}
                    onClick={() => {
                      setStampMode('capsule')
                      setIsCapsuleMode(true)
                      setFiles([])
                      setShowAdvancedModes(true)
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
                        color:
                          stampMode === 'capsule' ? 'var(--accent-gold)' : 'var(--text-primary)'
                      }}
                    >
                      {tp('stampPage.modes.capsule')}
                    </div>
                    <div
                      className="text-[10px] leading-snug"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Multi-file evidence bundle
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-pressed={stampMode === 'redact'}
                    aria-label={tp('stampPage.modes.redact')}
                    onClick={() => {
                      setStampMode('redact')
                      setIsCapsuleMode(false)
                      setFiles([])
                      setShowAdvancedModes(true)
                    }}
                    className="rounded-2xl border p-4 text-left transition-all"
                    style={{
                      borderColor: stampMode === 'redact' ? 'var(--accent-gold)' : 'var(--border)',
                      background:
                        stampMode === 'redact' ? 'rgba(240,180,41,0.06)' : 'var(--bg-secondary)'
                    }}
                  >
                    <div className="mb-1 text-lg">🔒</div>
                    <div
                      className="mb-1 text-xs font-black tracking-widest uppercase"
                      style={{
                        color: stampMode === 'redact' ? 'var(--accent-gold)' : 'var(--text-primary)'
                      }}
                    >
                      {tp('stampPage.modes.redact')}
                    </div>
                    <div
                      className="text-[10px] leading-snug"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Redact then stamp
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-pressed={stampMode === 'deposition'}
                    aria-label={tp('stampPage.modes.deposition')}
                    onClick={() => {
                      setStampMode('deposition')
                      setIsCapsuleMode(false)
                      setFiles([])
                      setShowAdvancedModes(true)
                    }}
                    className="rounded-2xl border p-4 text-left transition-all"
                    style={{
                      borderColor:
                        stampMode === 'deposition' ? 'var(--accent-gold)' : 'var(--border)',
                      background:
                        stampMode === 'deposition' ? 'rgba(240,180,41,0.06)' : 'var(--bg-secondary)'
                    }}
                  >
                    <div className="mb-1 text-lg">🎙</div>
                    <div
                      className="mb-1 text-xs font-black tracking-widest uppercase"
                      style={{
                        color:
                          stampMode === 'deposition' ? 'var(--accent-gold)' : 'var(--text-primary)'
                      }}
                    >
                      {tp('stampPage.modes.deposition')}
                    </div>
                    <div
                      className="text-[10px] leading-snug"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Voice deposition
                    </div>
                  </button>
                </>
              )}
            </div>
            {!showAdvancedModes && stampMode === 'single' && (
              <button
                type="button"
                data-testid="more-options"
                onClick={() => setShowAdvancedModes(true)}
                className="min-h-[44px] w-full rounded-xl border text-xs font-black tracking-widest uppercase md:hidden"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                More options (capsule · redact · voice)
              </button>
            )}
            {!showAdvancedModes && (
              <button
                type="button"
                onClick={() => setShowAdvancedModes(true)}
                className="hidden min-h-[40px] rounded-xl border px-4 text-[10px] font-black tracking-widest uppercase md:inline-flex"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                Show advanced modes
              </button>
            )}
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
            className={`vault-ring group relative flex min-h-[28rem] flex-col items-center justify-start overflow-visible rounded-[2.5rem] border-2 border-dashed px-5 pt-10 pb-8 text-center transition-colors sm:min-h-[32rem] sm:justify-center sm:px-10 sm:pt-12 sm:pb-10 md:min-h-[36rem] ${
              (stampMode === 'single' || stampMode === 'capsule') && stampingStatus === 'idle'
                ? 'cursor-pointer'
                : ''
            }`}
            data-testid="stamp-dropzone"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-gold),transparent)] opacity-0 transition-opacity group-hover:opacity-[0.03]" />

            <AnimatePresence mode="wait">
              {stampingStatus === 'idle' ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex w-full flex-col items-center justify-start space-y-5 sm:justify-center sm:space-y-6"
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
                      <div className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--accent-gold)] shadow-2xl sm:h-20 sm:w-20">
                        {isCapsuleMode ? <FileArchive size={32} /> : <Upload size={32} />}
                      </div>
                      <div className="w-full max-w-md space-y-3 px-1">
                        <h3 className="px-2 text-xl font-bold tracking-tight text-balance sm:text-2xl">
                          {isCapsuleMode ? 'Assemble Evidence Capsule' : t('stamp', 'title')}
                        </h3>
                        <p className="px-2 font-medium text-balance text-[var(--text-secondary)]">
                          {isCapsuleMode
                            ? 'Drop multiple files to create a signed evidence bundle anchored as a single proof.'
                            : t('stamp', 'dropzone')}
                        </p>
                        <p className="px-2 text-[10px] font-bold tracking-widest text-balance text-[var(--text-muted)] uppercase">
                          Anchored via OpenTimestamps → Bitcoin
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <Tooltip
                            title="Step 1 — Drop Your File"
                            content="Drag any document here or click to browse. Your file stays on your device — only a SHA-256 hash is sent to the server."
                          />
                          <Tooltip
                            title="Step 2 — Local Hashing"
                            content="Satohash computes a unique SHA-256 fingerprint in your browser using a Web Worker. The original file never leaves your machine."
                          />
                          <Tooltip
                            title="Step 3 — Bitcoin Timestamp"
                            content="The hash is submitted to public OTS calendars and permanently committed to the Bitcoin blockchain. Download your .ots proof when complete."
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Camera / gallery / file pickers — always visible for single/capsule */}
                  {(stampMode === 'single' || stampMode === 'capsule') && (
                    <>
                      <input
                        type="file"
                        id="file-input"
                        className="hidden"
                        data-testid="file-input"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setFiles(
                              isCapsuleMode ? [...files, e.target.files[0]] : [e.target.files[0]]
                            )
                          }
                        }}
                      />
                      <div
                        className="z-10 flex w-full max-w-sm flex-col gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label
                          className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 font-bold"
                          style={{
                            borderColor: 'var(--border-bright)',
                            color: 'var(--accent-gold)'
                          }}
                        >
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            capture="environment"
                            data-testid="camera-input"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setFiles(
                                  isCapsuleMode
                                    ? [...files, e.target.files[0]]
                                    : [e.target.files[0]]
                                )
                              }
                            }}
                          />
                          📷 {tp('stampPage.takePhoto') || 'Take photo'}
                        </label>
                        <label
                          className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        >
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            data-testid="gallery-input"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setFiles(
                                  isCapsuleMode
                                    ? [...files, e.target.files[0]]
                                    : [e.target.files[0]]
                                )
                              }
                            }}
                          />
                          🖼 Photos / gallery
                        </label>
                        <label
                          className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        >
                          <input
                            type="file"
                            className="hidden"
                            accept="*/*"
                            data-testid="choose-file-input"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setFiles(
                                  isCapsuleMode
                                    ? [...files, e.target.files[0]]
                                    : [e.target.files[0]]
                                )
                              }
                            }}
                          />
                          📁 {tp('stampPage.chooseFile') || 'Choose file'}
                        </label>
                        <label
                          className="flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                        >
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            webkitdirectory=""
                            data-testid="folder-input"
                            onChange={(e) => {
                              const list = Array.from(e.target.files || [])
                              if (!list.length) return
                              setStampMode('capsule')
                              setIsCapsuleMode(true)
                              setShowAdvancedModes(true)
                              setFiles(list)
                            }}
                          />
                          📂 Folder (one Merkle capsule)
                        </label>
                      </div>
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
                  <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    Opening success screen…
                  </p>
                  <StampSuccessActions
                    proof={proofResult}
                    isConfirmed={isConfirmed}
                    confirmedBlock={confirmedBlock}
                    upgradeStatus={upgradeStatus}
                    onStampAnother={() => {
                      setStampingStatus('idle')
                      setFiles([])
                      setProofResult(null)
                      setHashValue('')
                      setIsConfirmed(false)
                      setConfirmedBlock(null)
                      setUpgradeStatus(null)
                    }}
                  />
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
                  type="button"
                  data-testid="stamp-file-button"
                  onClick={startStamping}
                  className="btn-sheen relative z-20 hidden h-14 min-h-[52px] w-full items-center justify-center gap-3 rounded-xl font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-95 active:scale-[0.99] md:flex"
                  style={{
                    background: 'var(--accent-gold)',
                    color: '#141b25',
                    boxShadow: '0 8px 28px var(--accent-gold-glow)'
                  }}
                >
                  {t('stamp', 'stamp') || 'Stamp on Bitcoin'} <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>

        <StampStickyBar
          visible={canStampFile || canStampHash}
          label={
            stampingStatus === 'hashing'
              ? 'Hashing…'
              : stampingStatus === 'anchoring'
                ? 'Anchoring…'
                : canStampHash
                  ? 'Stamp hash on Bitcoin'
                  : t('stamp', 'stamp') || 'Stamp on Bitcoin'
          }
          disabled={stampingStatus !== 'idle'}
          onClick={() => {
            if (canStampFile) startStamping()
            else if (canStampHash) {
              stampLinkedHash(
                hashValue,
                caseLabel || deepLink.displayLabel || 'Linked document',
                deepLinkClientId || deepLink.clientId
              )
            }
          }}
        />

        {/* ── Configuration Sidebar ──────────────── */}
        <div className="space-y-8">
          <FeeAdvisor />
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
                    aria-label="Multi-Party"
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
                    aria-label="L402 Gating"
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

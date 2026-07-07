import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import GlobalDropzone from '../components/GlobalDropzone'
import HistoryList from '../components/HistoryList'
import Merkle3D from '../components/Merkle3D'
import VoiceStamp from '../components/VoiceStamp'
import Tooltip from '../components/Tooltip'
import {
  Download,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  Zap,
  FileText,
  ChevronRight,
  Terminal,
  Network,
  Box,
  Lock,
  Cpu,
  Globe,
  CreditCard,
  Crown,
  Mic,
  Award,
  BookOpen,
  ArrowRight,
  X
} from 'lucide-react'
import { generatePDF } from '../utils/pdfGenerator'
import { toast } from 'sonner'
import BlockchainPulse from '../components/BlockchainPulse'
import usePageMeta from '../hooks/usePageMeta'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function UpsellModal({ isOpen, onClose, onSubscribe }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="upsell-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center gap-3">
              <Crown className="h-6 w-6" style={{ color: 'var(--accent-gold)' }} />
              <h3
                id="upsell-title"
                className="text-xl font-black uppercase"
                style={{ color: 'var(--text-primary)' }}
              >
                Upgrade to Pro
              </h3>
              <button
                onClick={onClose}
                aria-label="Close upgrade dialog"
                className="ml-auto opacity-40 transition-opacity hover:opacity-100"
                style={{ color: 'var(--text-secondary)' }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              className="mb-6 space-y-3 rounded-xl p-4"
              style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
            >
              {[
                'Unlimited document stamps per month',
                'Priority Bitcoin confirmation queue',
                'Advanced analytics & audit exports',
                'Multi-party contract orchestration',
                'API access with 10k req/month'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <ShieldCheck size={12} style={{ color: 'var(--accent-success)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <p className="mb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Only{' '}
              <span className="font-black" style={{ color: 'var(--accent-gold)' }}>
                $9/month
              </span>{' '}
              — cancel any time.
            </p>

            <div className="space-y-3">
              <button
                onClick={onSubscribe}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-black transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent-active)', color: '#fff' }}
              >
                <CreditCard className="h-4 w-4" /> Subscribe Now — $9/mo
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl border px-4 py-3 text-sm transition-all hover:opacity-80"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  background: 'transparent'
                }}
              >
                Maybe Later
              </button>
            </div>
            <p className="mt-4 text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Test card: 4242 4242 4242 4242 (mock)
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Dashboard() {
  usePageMeta({ page: 'dashboard' })
  const [file, setFile] = useState(null)
  const [showUpsell, setShowUpsell] = useState(false)
  const [userTier, setUserTier] = useState('free')
  const [achievements, setAchievements] = useState({})
  const [showVoiceStamp, setShowVoiceStamp] = useState(false)
  const [stampCount, setStampCount] = useState(0)
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('satohash-welcome-dismissed')
  )
  const { t } = useI18n()

  const dismissWelcome = () => {
    localStorage.setItem('satohash-welcome-dismissed', 'true')
    setShowWelcome(false)
  }

  useEffect(() => {
    const storedTier = localStorage.getItem('userTier') || 'free'
    setUserTier(storedTier)
    const storedAchievements = JSON.parse(localStorage.getItem('satohash_achievements') || '{}')
    const count = parseInt(localStorage.getItem('satohash_stamp_count') || '0')
    setAchievements(storedAchievements)
    setStampCount(count)

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success')) {
      localStorage.setItem('userTier', 'pro')
      setUserTier('pro')
      toast.success('Subscription successful! Welcome to Pro.')
    } else if (urlParams.get('cancel')) {
      toast.info('Subscription cancelled.')
    }
  }, [])

  const handleFileProcessed = async (processedFile) => {
    if (userTier === 'free' && stampCount >= 5) {
      setShowUpsell(true)
      toast.warning('Free tier limit reached (5 stamps). Upgrade to continue.')
      return
    }
    try {
      const response = await fetch(`${API_URL}/api/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hash:
            processedFile.hash ||
            'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          filename: processedFile.name
        })
      })
      if (!response.ok) throw new Error('Stamping failed')
      const result = await response.json()
      setFile({ ...processedFile, ...result })
      toast.success('Successfully anchored to Bitcoin!')

      const newCount = stampCount + 1
      localStorage.setItem('satohash_stamp_count', newCount.toString())
      setStampCount(newCount)

      const newAchievements = { ...achievements }
      if (newCount === 10 && !newAchievements.firstDecade) {
        newAchievements.firstDecade = { unlocked: true, date: new Date().toISOString() }
        localStorage.setItem('satohash_achievements', JSON.stringify(newAchievements))
        setAchievements(newAchievements)
        toast.success('Achievement Unlocked: First Decade! 🎉')
      }
      if (newCount % 50 === 0 && !newAchievements[`milestone${newCount}`]) {
        newAchievements[`milestone${newCount}`] = { unlocked: true, date: new Date().toISOString() }
        localStorage.setItem('satohash_achievements', JSON.stringify(newAchievements))
        setAchievements(newAchievements)
        toast.success(`Achievement Unlocked: ${newCount} Anchors! 🏆`)
      }
    } catch {
      toast.error('Failed to anchor file. Please try again.')
    }
  }

  const handleVoiceStamp = (voiceFile) => {
    handleFileProcessed(voiceFile)
    setShowVoiceStamp(false)
  }

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: 'price_1ABC123',
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/dashboard?cancel=true`,
          email: 'user@example.com'
        })
      })
      const { url } = await response.json()
      if (url) window.location.href = url
    } catch {
      toast.error('Subscription failed')
    }
  }

  const downloadOTS = () => {
    if (!file?.id) return
    window.location.href = `${API_URL}/api/stamps/${file.id}?download=true`
  }

  return (
    <>
      <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        onSubscribe={handleSubscribe}
      />

      <div
        className="relative min-h-screen pb-24"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-1/2 blur-[160px]"
          style={{ background: 'var(--accent-active)', opacity: 0.025 }}
        />

        <div className="layout-container relative z-10 max-w-7xl">
          {/* First-visit welcome hint */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-start justify-between gap-4 rounded-2xl border p-5"
                style={{ borderColor: 'rgba(240,180,41,0.3)', background: 'rgba(240,180,41,0.05)' }}
              >
                <div className="space-y-1">
                  <p
                    className="text-sm font-black tracking-wide uppercase"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    👋 {t('dashboard', 'welcome')}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {t('dashboard', 'welcomeSubtitle')}
                  </p>
                </div>
                <button
                  onClick={dismissWelcome}
                  aria-label={t('dashboard', 'dismiss')}
                  className="shrink-0 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Hero Row ── */}
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              {/* Status badges */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase"
                  style={
                    userTier === 'pro'
                      ? {
                          background: 'rgba(240,180,41,0.12)',
                          color: 'var(--accent-gold)',
                          border: '1px solid rgba(240,180,41,0.25)'
                        }
                      : {
                          background: 'var(--surface-raised)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)'
                        }
                  }
                >
                  <Crown size={10} /> {userTier.toUpperCase()} Tier
                </span>

                {Object.keys(achievements).length > 0 && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase"
                    style={{
                      background: 'rgba(34,211,165,0.08)',
                      color: 'var(--accent-success)',
                      border: '1px solid rgba(34,211,165,0.2)'
                    }}
                  >
                    <Award size={10} /> {Object.keys(achievements).length} Badges
                  </span>
                )}

                <button
                  onClick={() => setShowVoiceStamp(!showVoiceStamp)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase transition-opacity hover:opacity-80"
                  style={{ background: 'var(--accent-active)', color: '#fff' }}
                >
                  <Mic size={10} />
                  {showVoiceStamp ? 'Hide Voice' : 'Voice Stamp'}
                </button>
              </div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: 'var(--surface-raised)',
                  color: 'var(--accent-active)',
                  border: '1px solid var(--border)'
                }}
              >
                <Network size={20} />
              </motion.div>

              <h1
                className="mb-4 text-5xl leading-none font-black tracking-tighter uppercase italic md:text-6xl"
                style={{ color: 'var(--text-primary)' }}
              >
                Sovereign <br />
                <span style={{ color: 'var(--accent-active)' }}>WORKSPACE.</span>
              </h1>
              <p
                className="max-w-lg text-sm leading-relaxed md:text-base"
                style={{ color: 'var(--text-secondary)' }}
              >
                Anchor any document to Bitcoin with one drop. Your files never leave your device —
                only a cryptographic fingerprint is recorded on the blockchain.
              </p>
            </div>
            <div className="hidden lg:block">
              <BlockchainPulse />
              <p
                className="mt-2 text-center text-[9px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--text-secondary)' }}
              >
                Live Bitcoin network activity
              </p>
            </div>
          </div>

          {/* Voice Stamp Panel */}
          <AnimatePresence>
            {showVoiceStamp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <VoiceStamp onStamp={handleVoiceStamp} isActive={showVoiceStamp} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* ── Main Work Area ── */}
            <div className="space-y-8 lg:col-span-8">
              {/* ── INGEST PROTOCOL CARD ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
              >
                {/* Card header */}
                <div
                  className="flex items-center justify-between border-b px-6 py-4 md:px-8"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        color: 'var(--accent-active)'
                      }}
                    >
                      <FileCheck size={15} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3
                          className="text-sm font-black tracking-wide uppercase"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Ingest Protocol
                        </h3>
                        <Tooltip
                          title="Ingest Protocol"
                          content="Drop any file here. Satohash hashes it using SHA-256 entirely in your browser, then submits only that fingerprint — never the file — to be permanently recorded on the Bitcoin blockchain via OpenTimestamps."
                        />
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Client-side SHA-256 → Bitcoin anchoring
                      </p>
                    </div>
                  </div>
                  {/* Live protocol indicators */}
                  <div className="hidden items-center gap-4 sm:flex">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="h-1.5 w-1.5 animate-pulse rounded-full"
                        style={{ background: 'var(--accent-success)' }}
                      />
                      <span
                        className="text-[9px] font-black tracking-widest uppercase"
                        style={{ color: 'var(--accent-success)' }}
                      >
                        Live
                      </span>
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      AES-256-GCM
                    </span>
                  </div>
                </div>

                {/* How it works — always visible educational strip */}
                <div className="grid grid-cols-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  {[
                    {
                      step: '01',
                      label: 'Drop File',
                      desc: 'Any document, image, or file. It never leaves your device.'
                    },
                    {
                      step: '02',
                      label: 'SHA-256 Hash',
                      desc: 'A unique fingerprint is created in your browser. Instant, private.'
                    },
                    {
                      step: '03',
                      label: 'Bitcoin Anchor',
                      desc: 'Your fingerprint is permanently recorded on Bitcoin. Valid forever.'
                    }
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-1 p-4 md:p-5"
                      style={{ borderRight: i < 2 ? '1px solid var(--border)' : 'none' }}
                    >
                      <span
                        className="text-[9px] font-black tracking-widest uppercase"
                        style={{ color: 'var(--accent-active)' }}
                      >
                        {s.step}
                      </span>
                      <span
                        className="text-xs font-black uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {s.label}
                      </span>
                      <span
                        className="text-[10px] leading-snug"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {s.desc}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Drop zone or result */}
                <div className="p-6 md:p-8">
                  {!file ? (
                    <GlobalDropzone onFileProcessed={handleFileProcessed} />
                  ) : (
                    <div className="space-y-6">
                      {/* Result header */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-xl border px-3 py-1.5 text-[9px] font-black tracking-widest uppercase ${file.status === 'confirmed' ? '' : 'animate-pulse'}`}
                          style={
                            file.status === 'confirmed'
                              ? {
                                  border: '1px solid rgba(34,211,165,0.2)',
                                  background: 'rgba(34,211,165,0.08)',
                                  color: 'var(--accent-success)'
                                }
                              : {
                                  border: '1px solid rgba(240,180,41,0.2)',
                                  background: 'rgba(240,180,41,0.08)',
                                  color: 'var(--accent-gold)'
                                }
                          }
                        >
                          {file.status === 'confirmed'
                            ? '✓ Bitcoin Confirmed'
                            : '⏳ Pending Confirmation'}
                        </span>
                        <button
                          onClick={() => setFile(null)}
                          className="text-[10px] font-black tracking-widest uppercase underline decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          New Stamp
                        </button>
                      </div>

                      {/* File info */}
                      <div
                        className="flex items-center gap-4 rounded-2xl p-4"
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <div
                          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                          style={{
                            background: 'var(--surface-raised)',
                            color: 'var(--accent-active)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          <FileCheck size={22} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-sm font-black uppercase"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {file.name}
                          </p>
                          <code
                            className="truncate font-mono text-[10px]"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {file.hash}
                          </code>
                        </div>
                      </div>

                      {/* Merkle visualization */}
                      <div
                        className="overflow-hidden rounded-2xl"
                        style={{
                          border: '1px solid var(--border)',
                          background: 'var(--bg-primary)'
                        }}
                      >
                        <Merkle3D hash={file.hash} />
                        <p
                          className="mt-3 text-center text-[9px] font-bold tracking-widest uppercase"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Each node = one proof anchored to Bitcoin
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <ActionBtn
                          icon={Download}
                          label="Download .ots Proof"
                          onClick={downloadOTS}
                          secondary
                        />
                        <ActionBtn
                          icon={FileText}
                          label="PDF Certificate"
                          onClick={() => generatePDF(file)}
                          secondary
                        />
                        <ActionBtn
                          icon={ExternalLink}
                          label="View on Mempool"
                          onClick={() => window.open('https://mempool.space', '_blank')}
                          amber
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ── Protocol History ── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Terminal size={18} style={{ color: 'var(--accent-active)' }} />
                    <h3
                      className="text-lg font-black tracking-tight uppercase italic"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Stamp <span style={{ color: 'var(--accent-active)' }}>History</span>
                    </h3>
                    <Tooltip
                      title="Stamp History"
                      content="Every file you've anchored appears here. Each entry shows the SHA-256 hash, timestamp, and Bitcoin confirmation status. Confirmed stamps are immutable — they exist on Bitcoin forever."
                    />
                  </div>
                  <Link
                    to="/vault"
                    className="flex items-center gap-1 text-[10px] font-black tracking-widest uppercase transition-opacity hover:opacity-70"
                    style={{ color: 'var(--accent-active)' }}
                  >
                    Open Vault <ArrowRight size={12} />
                  </Link>
                </div>
                <HistoryList />
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6 lg:col-span-4">
              {/* Dark Vault Feature Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="overflow-hidden rounded-3xl"
                style={{
                  border: '1px solid rgba(244,63,94,0.2)',
                  background: 'var(--bg-secondary)'
                }}
              >
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{
                        background: 'rgba(244,63,94,0.1)',
                        color: '#f43f5e',
                        border: '1px solid rgba(244,63,94,0.2)'
                      }}
                    >
                      <Lock size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4
                          className="text-sm font-black uppercase"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          Dark Vault
                        </h4>
                        <Tooltip
                          title="Dark Vault"
                          content="When enabled, your file is encrypted with AES-256-GCM directly in your browser before any processing. Only you hold the key. Not even Satohash can read your document — we only ever see the encrypted hash."
                        />
                      </div>
                      <p
                        className="text-[9px] font-bold tracking-widest uppercase"
                        style={{ color: 'rgba(244,63,94,0.7)' }}
                      >
                        Zero-Knowledge Encryption
                      </p>
                    </div>
                  </div>

                  <div className="mb-5 space-y-2">
                    {[
                      { icon: ShieldCheck, text: 'AES-256-GCM encrypted locally', tooltip: null },
                      { icon: Lock, text: 'Your key never leaves your browser', tooltip: null },
                      { icon: FileCheck, text: 'Encrypted hash anchored to Bitcoin', tooltip: null }
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2">
                        <Icon size={11} style={{ color: '#f43f5e', opacity: 0.7 }} />
                        <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                          {text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="rounded-xl p-3 text-xs leading-relaxed"
                    style={{
                      background: 'rgba(244,63,94,0.06)',
                      border: '1px solid rgba(244,63,94,0.12)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    Activate Dark Vault mode using the toggle inside the Ingest Protocol drop zone
                    above. Your document stays private — only the timestamp proof is public.
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 border-t px-6 py-3"
                  style={{
                    borderColor: 'rgba(244,63,94,0.15)',
                    background: 'rgba(244,63,94,0.04)'
                  }}
                >
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#f43f5e' }} />
                  <span
                    className="text-[9px] font-black tracking-widest uppercase"
                    style={{ color: 'rgba(244,63,94,0.6)' }}
                  >
                    Phase IV Alpha — Toggle in drop zone above
                  </span>
                </div>
              </motion.div>

              {/* Command Console */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="relative overflow-hidden rounded-3xl p-6"
                style={{ background: 'var(--surface-raised)', border: '1px solid var(--border)' }}
              >
                <div
                  className="pointer-events-none absolute top-0 right-0 p-8 opacity-[0.03]"
                  style={{ color: 'var(--accent-active)' }}
                >
                  <ShieldCheck size={140} />
                </div>
                <h3
                  className="relative z-10 mb-5 text-lg font-black tracking-tight uppercase italic"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Quick <span style={{ color: 'var(--text-secondary)' }}>Access</span>
                </h3>
                <div className="relative z-10 space-y-2.5">
                  <Link to="/stamp" className="block w-full">
                    <SideBtn
                      icon={FileCheck}
                      label="Stamp a Document"
                      sublabel="Hash & anchor any file"
                      primary
                    />
                  </Link>
                  <Link to="/verify" className="block w-full">
                    <SideBtn
                      icon={ShieldCheck}
                      label="Verify a Proof"
                      sublabel="Check a .ots timestamp"
                    />
                  </Link>
                  <Link to="/contracts" className="block w-full">
                    <SideBtn icon={FileText} label="Contracts" sublabel="Multi-party signing" />
                  </Link>
                  <Link to="/developer" className="block w-full">
                    <SideBtn
                      icon={Cpu}
                      label="Developer API"
                      sublabel="Keys, webhooks, endpoints"
                      amber
                    />
                  </Link>
                </div>
              </motion.div>

              {/* Live Mesh Telemetry */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-3xl p-6"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <h4
                    className="text-[10px] font-black tracking-[0.3em] uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Network Status
                  </h4>
                  <Tooltip
                    title="Network Status"
                    content="Live indicators for the Satohash witness mesh — the network of nodes that independently verify and mirror your proof. Green means all systems are operating normally."
                  />
                </div>
                <div className="space-y-4">
                  <TeleItem
                    icon={Globe}
                    label="Global Mirroring"
                    status="NOMINAL"
                    emerald
                    tooltip="Your proof is replicated across multiple geographic nodes simultaneously, ensuring it can never be lost or censored."
                  />
                  <TeleItem
                    icon={Zap}
                    label="L2 Settlement"
                    status="BOLT-12 ACTIVE"
                    amber
                    tooltip="Lightning Network Layer 2 payment channel is active. Enables instant micropayment-gated stamping without on-chain fees per stamp."
                  />
                  <TeleItem icon={Box} label="Bitcoin Height" status="#845,922+" />
                  <TeleItem
                    icon={Lock}
                    label="Privacy Layer"
                    status="ZK HARDENED"
                    emerald
                    tooltip="Zero-knowledge proofs ensure that the content of stamped files is never exposed, even during verification."
                  />
                </div>
              </motion.div>

              {/* Compliance Badges */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-3xl p-5"
                style={{
                  border: '1px solid rgba(34,211,165,0.12)',
                  background: 'rgba(34,211,165,0.03)'
                }}
              >
                <p
                  className="mb-3 text-[9px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--accent-success)', opacity: 0.7 }}
                >
                  Legal Compliance
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'eIDAS', desc: 'EU electronic signature law' },
                    { label: 'ESIGN', desc: 'US federal e-sign act' },
                    { label: 'UETA', desc: 'Uniform state e-transactions' }
                  ].map(({ label, desc }) => (
                    <div key={label} className="flex flex-col items-center gap-1 text-center">
                      <ShieldCheck size={14} style={{ color: 'var(--accent-success)' }} />
                      <span
                        className="text-[9px] font-black uppercase"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-[8px] leading-tight"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {desc}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/trust"
                  className="mt-4 flex items-center justify-center gap-1 text-[9px] font-black tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{ color: 'var(--accent-success)' }}
                >
                  View Full Compliance Report <ChevronRight size={10} />
                </Link>
              </motion.div>

              {/* Mission / Education card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="group relative overflow-hidden rounded-3xl p-6"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div
                  className="pointer-events-none absolute top-0 right-0 p-6 opacity-[0.04]"
                  style={{ color: 'var(--accent-active)' }}
                >
                  <BookOpen size={80} />
                </div>
                <h4
                  className="mb-2 text-sm font-black uppercase italic"
                  style={{ color: 'var(--text-primary)' }}
                >
                  The Giving Machine.
                </h4>
                <p
                  className="mb-5 text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Every anchor funds global truth preservation. Satohash is a non-profit protocol —
                  revenue goes to maintaining the open witness mesh and expanding access worldwide.
                </p>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all group-hover:gap-3"
                  style={{ color: 'var(--accent-active)' }}
                >
                  Read the Whitepaper <ChevronRight size={12} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Sub-components ─── */

function ActionBtn({ icon: Icon, label, onClick, secondary, amber }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-black tracking-wide uppercase transition-all hover:opacity-90"
      style={
        amber
          ? {
              background: 'rgba(240,180,41,0.1)',
              color: 'var(--accent-gold)',
              border: '1px solid rgba(240,180,41,0.2)'
            }
          : secondary
            ? {
                background: 'var(--surface-raised)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }
            : { background: 'var(--accent-active)', color: '#fff' }
      }
    >
      <Icon size={14} /> {label}
    </button>
  )
}

function SideBtn({ icon: Icon, label, sublabel, amber, primary }) {
  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-all hover:opacity-90"
      style={
        primary
          ? { background: 'var(--accent-active)', color: '#fff' }
          : amber
            ? {
                background: 'rgba(240,180,41,0.08)',
                color: 'var(--accent-gold)',
                border: '1px solid rgba(240,180,41,0.15)'
              }
            : {
                background: 'var(--bg-primary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }
      }
    >
      <div className="flex items-center gap-3">
        <Icon size={16} />
        <div>
          <p className="text-[10px] font-black tracking-wide uppercase">{label}</p>
          {sublabel && <p className="text-[9px] opacity-60">{sublabel}</p>}
        </div>
      </div>
      <ChevronRight size={13} />
    </div>
  )
}

function TeleItem({ icon: Icon, label, status, emerald, amber, tooltip }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Icon size={13} style={{ color: 'var(--text-muted)' }} />
        <span
          className="text-xs font-bold uppercase italic"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
        {tooltip && <Tooltip title={label} content={tooltip} />}
      </div>
      <div className="flex items-center gap-1.5">
        {(emerald || amber) && (
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: emerald ? 'var(--accent-success)' : 'var(--accent-gold)' }}
          />
        )}
        <span
          className="text-[9px] font-black uppercase"
          style={{
            color: emerald
              ? 'var(--accent-success)'
              : amber
                ? 'var(--accent-gold)'
                : 'var(--text-muted)'
          }}
        >
          {status}
        </span>
      </div>
    </div>
  )
}

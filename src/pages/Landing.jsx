import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  Lock,
  Zap,
  Globe,
  Check,
  Copy,
  ArrowRight,
  Clock,
  Scale,
  Award,
  X,
  Fingerprint,
  ChevronRight
} from 'lucide-react'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
import MarketingDesktopNav from '../components/layout/MarketingDesktopNav'
import OtsVerifyPanel from '../components/stamps/OtsVerifyPanel'
import { getBitcoinNetworkStats } from '../utils/mempool'
import { BTC_ADDRESS, getApiUrl } from '../config/constants'
import { ParticleStampCanvas } from './v5/V5Pages'
import { buildStampPathFromSearch } from '../utils/stampDeepLink'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
  })
}

const USE_CASE_EMOJI = {
  legal: '📝',
  creative: '🎨',
  medical: '🏥',
  corporate: '🏢',
  research: '🔬',
  government: '🏛️'
}

export default function Landing() {
  usePageMeta({ page: 'landing' })
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  // Family handoff: /?hash=&ref= → /stamp?hash=&ref= (Sherpa sc-core opens home today)
  const stampRedirect = useMemo(() => buildStampPathFromSearch(searchParams), [searchParams])

  const featureCards = useMemo(
    () => [
      { icon: Lock, key: 'noServer', delay: 0 },
      { icon: Clock, key: 'anchored', delay: 0.1 },
      { icon: Scale, key: 'court', delay: 0.2 },
      { icon: Globe, key: 'noMiddleman', delay: 0.3 }
    ],
    []
  )

  const howSteps = useMemo(
    () => [
      { num: '01', icon: Fingerprint, key: 'upload', delay: 0 },
      { num: '02', icon: Zap, key: 'anchor', delay: 0.1 },
      { num: '03', icon: Award, key: 'certificate', delay: 0.2 }
    ],
    []
  )

  const useCaseKeys = useMemo(
    () => ['legal', 'creative', 'medical', 'corporate', 'research', 'government'],
    []
  )

  const [donationOpen, setDonationOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [proofCount, setProofCount] = useState(null)
  const [blockHeight, setBlockHeight] = useState(null)
  const defaultNetworkStats = useMemo(
    () => ({
      blockHeight: 895441,
      difficultyChange: 0.12,
      difficultyProgress: 52.4,
      remainingBlocks: 980,
      fees: { high: 25, medium: 18, low: 12, minimum: 2 }
    }),
    []
  )
  const [networkStats, setNetworkStats] = useState(defaultNetworkStats)
  const [pwaPrompt, setPwaPrompt] = useState(null)
  const [pwaDismissed, setPwaDismissed] = useState(
    () => localStorage.getItem('pwa-dismissed') === 'true'
  )

  useEffect(() => {
    const API = getApiUrl()
    Promise.all([
      fetch(`${API}/api/history`)
        .then((r) => r.json())
        .catch(() => []),
      getBitcoinNetworkStats()
    ]).then(([stamps, stats]) => {
      if (Array.isArray(stamps)) setProofCount(stamps.length)
      if (!stats || typeof stats !== 'object') return
      const merged = {
        ...defaultNetworkStats,
        ...stats,
        fees: { ...defaultNetworkStats.fees, ...(stats.fees || {}) }
      }
      setNetworkStats(merged)
      if (merged.blockHeight) setBlockHeight(merged.blockHeight)
    })
  }, [defaultNetworkStats])

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setPwaPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const installPWA = async () => {
    if (!pwaPrompt) return
    pwaPrompt.prompt()
    const { outcome } = await pwaPrompt.userChoice
    if (outcome === 'accepted') setPwaPrompt(null)
  }

  const dismissPWA = () => {
    localStorage.setItem('pwa-dismissed', 'true')
    setPwaDismissed(true)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (stampRedirect) {
    return <Navigate to={stampRedirect} replace />
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <MarketingDesktopNav onDonate={() => setDonationOpen(true)} />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-14">
        {/* v5 particle network — gold confirmed / blue pending stamps */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <ParticleStampCanvas />
        </div>
        {/* Precision Cryptographic Blueprint Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ opacity: 0.22 }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="bgGradNoir" cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.35" />
                <stop offset="60%" stopColor="#0f172a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#030712" stopOpacity="1" />
              </radialGradient>
              <linearGradient id="gridLines" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            <rect width="1200" height="800" fill="url(#bgGradNoir)" />

            {/* Precision Blueprint Grid */}
            <g stroke="url(#gridLines)" strokeWidth="0.5">
              {/* Horizontal subdivision grid */}
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="1200" y2={i * 50} />
              ))}
              {/* Vertical subdivision grid */}
              {Array.from({ length: 24 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="800" />
              ))}
            </g>

            {/* Sophisticated Cryptographic Time-Anchor Blueprint */}
            <g
              transform="translate(600, 300)"
              stroke="var(--accent-gold)"
              fill="none"
              strokeWidth="0.75"
            >
              {/* Concentric orbital rings with dashed patterns */}
              <circle r="280" strokeOpacity="0.04" strokeDasharray="4 8" />
              <circle r="220" strokeOpacity="0.08" />
              <circle r="160" strokeOpacity="0.05" strokeDasharray="12 6" />
              <circle r="100" strokeOpacity="0.12" />
              <circle r="40" strokeOpacity="0.2" strokeDasharray="2 2" />

              {/* Angle axis measurements */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI) / 4
                const x1 = Math.cos(angle) * 320
                const y1 = Math.sin(angle) * 320
                return <line key={`axis-${i}`} x1="0" y1="0" x2={x1} y2={y1} strokeOpacity="0.03" />
              })}

              {/* Precision Crosshair markers */}
              <g stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.3">
                <line x1="-300" y1="0" x2="-280" y2="0" />
                <line x1="280" y1="0" x2="300" y2="0" />
                <line x1="0" y1="-240" x2="0" y2="-220" />
                <line x1="0" y1="220" x2="0" y2="240" />
              </g>

              {/* Dynamic Merkle tree network overlay (thin, premium) */}
              <g stroke="var(--accent-gold)" strokeWidth="0.75" strokeOpacity="0.25">
                {/* Node coordinates */}
                <line x1="-120" y1="-80" x2="-60" y2="-120" />
                <line x1="-60" y1="-120" x2="0" y2="-140" />
                <line x1="120" y1="-80" x2="60" y2="-120" />
                <line x1="60" y1="-120" x2="0" y2="-140" />
                <line x1="-140" y1="60" x2="-80" y2="100" />
                <line x1="-80" y1="100" x2="0" y2="120" />
                <line x1="140" y1="60" x2="80" y2="100" />
                <line x1="80" y1="100" x2="0" y2="120" />

                {/* Node nodes */}
                {[
                  [-120, -80],
                  [-60, -120],
                  [120, -80],
                  [60, -120],
                  [-140, 60],
                  [-80, 100],
                  [140, 60],
                  [80, 100],
                  [0, -140],
                  [0, 120]
                ].map(([cx, cy], i) => (
                  <g key={`node-${i}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill="#0f172a"
                      stroke="var(--accent-gold)"
                      strokeOpacity="0.6"
                    />
                    <circle cx={cx} cy={cy} r="1" fill="var(--accent-gold)" />
                  </g>
                ))}
              </g>
            </g>

            {/* monospaced Telemetry Markings (Forensic/Professional HUD) */}
            <g fontFamily="monospace" fontSize="8" fill="#94a3b8" fillOpacity="0.35">
              <text x="35" y="70">
                ALGORITHM: SHA-256 CLIENT SECURE
              </text>
              <text x="35" y="85">
                ZERO-KNOWLEDGE INPUT MODE: ENABLED
              </text>
              <text x="35" y="100">
                CLIENT ENGINE: WEB CRYPTO API
              </text>

              <text x="965" y="70" textAnchor="end">
                ANCHOR STATE: OPEN TIMESTAMPS v2.4
              </text>
              <text x="965" y="85" textAnchor="end">
                CALENDARS: ALICE | BOB | FINNEY
              </text>
              <text x="965" y="100" textAnchor="end">
                PEER SIGNAL MESH: ACTIVE [3/3]
              </text>

              {/* Math indicators */}
              <text x="35" y="730">
                commit_hash_func() =&gt; f(x) = sha256(preimage)
              </text>
              <text x="35" y="745">
                merkle_root_proof =&gt; node_l + node_r =&gt; parent_hash
              </text>
              <text x="35" y="760">
                anchored_block_proof_ots =&gt; bitcoin_merkle_path
              </text>

              <text x="965" y="730" textAnchor="end">
                eIDAS COMPLIANCE: SECTION IV ART. 26
              </text>
              <text x="965" y="745" textAnchor="end">
                UETA DIGITAL CONTRACT NOTARIZATION
              </text>
              <text x="965" y="760" textAnchor="end">
                ESIGN VALID TIMESTAMP AUTHORITY
              </text>
            </g>
          </svg>
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(240,180,41,0.06), transparent 70%)'
          }}
        />

        <div className="layout-container relative z-10 py-24 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black tracking-widest uppercase"
            style={{
              borderColor: 'var(--border-gold)',
              backgroundColor: 'var(--accent-gold-subtle)',
              color: 'var(--accent-gold)'
            }}
          >
            <Zap size={12} /> {t('landingPage.hero.badge')}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="font-display mb-6 text-4xl leading-[1.05] font-black tracking-tighter sm:text-5xl md:text-7xl lg:text-8xl"
          >
            {t('landingPage.hero.titleLine1')}
            <br />
            {t('landingPage.hero.titleLine2')}{' '}
            <span className="gold-text">{t('landingPage.hero.titleHighlight')}</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mx-auto mb-6 max-w-2xl text-xl leading-relaxed font-medium md:text-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('landingPage.hero.subtitle')}
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mx-auto mb-10 max-w-xl text-base leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {t('landingPage.hero.description')}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              to="/stamp"
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all hover:scale-105 hover:opacity-90 sm:w-auto"
              style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('landingPage.hero.ctaStamp')} <ArrowRight size={16} />
            </Link>
            <Link
              to="/templates"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border px-8 py-4 text-base font-bold transition-all hover:text-white sm:w-auto"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              {t('landingPage.hero.ctaTemplates')} <ArrowRight size={16} />
            </Link>
            <a
              href="#verify-ots"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border px-8 py-4 text-base font-bold transition-all hover:text-white sm:w-auto"
              style={{
                borderColor: 'var(--border-gold, var(--accent-gold))',
                color: 'var(--accent-gold)'
              }}
            >
              Confirm .ots <ChevronRight size={16} />
            </a>
          </motion.div>

          {/* Social proof + template link */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="mb-10 flex flex-col items-center gap-3"
          >
            {/* Avatar row + count */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  { initials: 'AK', bg: '#6366f1' },
                  { initials: 'SM', bg: '#0d9488' },
                  { initials: 'JL', bg: '#f59e0b' },
                  { initials: 'PR', bg: '#ec4899' },
                  { initials: 'DW', bg: '#3b82f6' }
                ].map(({ initials, bg }) => (
                  <div
                    key={initials}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black text-white ring-2"
                    style={{ backgroundColor: bg, ringColor: 'var(--bg-primary)' }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {t('landingPage.hero.socialProof', { count: '2,400+' })}
              </p>
            </div>
            <Link
              to="/templates"
              className="flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('landingPage.hero.tryTemplate')} <ArrowRight size={13} />
            </Link>
          </motion.div>

          {/* Sovereign Bitcoin Network HUD Console */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="mx-auto mt-12 max-w-4xl rounded-3xl border p-6 backdrop-blur-md"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'rgba(20, 27, 37, 0.75)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
            }}
          >
            <div
              className="mb-4 flex items-center justify-between border-b pb-4 text-[10px] font-black tracking-widest uppercase"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400">{t('landingPage.telemetry.title')}</span>
              </div>
              <a
                href="https://mempool.space"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sky-400 hover:underline"
              >
                mempool.space <ChevronRight size={10} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 text-left sm:grid-cols-4 sm:gap-4">
              {/* Block Height */}
              <div
                className="min-w-0 overflow-hidden rounded-2xl p-3 sm:p-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              >
                <span
                  className="mb-1 block truncate text-[9px] font-bold tracking-wider uppercase sm:text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t('landingPage.telemetry.tipHeight')}
                </span>
                <span className="block truncate font-mono text-base font-black text-white sm:text-lg md:text-xl">
                  #{blockHeight ? Number(blockHeight).toLocaleString() : '895,441'}
                </span>
              </div>

              {/* Recommended Fees */}
              <div
                className="min-w-0 overflow-hidden rounded-2xl p-3 sm:p-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              >
                <span
                  className="mb-1 block truncate text-[9px] font-bold tracking-wider uppercase sm:text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t('landingPage.telemetry.fastestFee')}
                </span>
                <span
                  className="flex min-w-0 flex-wrap items-baseline gap-x-1 font-mono text-base font-black sm:text-lg md:text-xl"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  <span className="truncate">{networkStats.fees?.high ?? '—'}</span>
                  <span className="shrink-0 text-[10px] font-normal opacity-80 sm:text-xs">
                    {t('landingPage.telemetry.satPerVb')}
                  </span>
                </span>
              </div>

              {/* Difficulty Adjust — clamp long floats */}
              <div
                className="min-w-0 overflow-hidden rounded-2xl p-3 sm:p-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              >
                <span
                  className="mb-1 block truncate text-[9px] font-bold tracking-wider uppercase sm:text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t('landingPage.telemetry.difficultyAdjust')}
                </span>
                <span
                  className="block truncate font-mono text-base font-black sm:text-lg md:text-xl"
                  style={{
                    color:
                      Number(networkStats.difficultyChange) > 0
                        ? 'var(--accent-success, #4ade80)'
                        : Number(networkStats.difficultyChange) < 0
                          ? 'var(--accent-pending, #fbbf24)'
                          : 'white'
                  }}
                  title={`${networkStats.difficultyChange}%`}
                >
                  {(() => {
                    const n = Number(networkStats.difficultyChange)
                    if (!Number.isFinite(n)) return '—'
                    const sign = n > 0 ? '+' : ''
                    return `${sign}${n.toFixed(2)}%`
                  })()}
                </span>
              </div>

              {/* Epoch Progress — value above bar so they never collide */}
              <div
                className="min-w-0 overflow-hidden rounded-2xl p-3 sm:p-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
              >
                <span
                  className="mb-1 block truncate text-[9px] font-bold tracking-wider uppercase sm:text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t('landingPage.telemetry.epochProgress')}
                </span>
                <span className="mb-1.5 block font-mono text-base font-black text-white sm:text-lg md:text-xl">
                  {(() => {
                    const n = Number(networkStats.difficultyProgress)
                    if (!Number.isFinite(n)) return '—'
                    return `${Math.min(100, Math.max(0, n)).toFixed(1)}%`
                  })()}
                </span>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-1.5 max-w-full rounded-full bg-sky-400 transition-[width] duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, Number(networkStats.difficultyProgress) || 0))}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t pt-4 text-center text-xs"
              style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
            >
              <span>🔐 {t('landingPage.telemetry.zeroKnowledge')}</span>
              <span>⚡ {t('landingPage.telemetry.compliance')}</span>
              <span>
                📁{' '}
                {t('landingPage.telemetry.proofsConfirmed', {
                  count: proofCount !== null ? proofCount.toLocaleString() : '—'
                })}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BITCOIN'S HIDDEN SUPERPOWER ──────────────────────────── */}
      <section id="features" className="py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="layout-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black tracking-widest uppercase"
              style={{
                borderColor: 'var(--border-gold)',
                backgroundColor: 'var(--accent-gold-subtle)',
                color: 'var(--accent-gold)'
              }}
            >
              {t('landingPage.features.badge')}
            </div>
            <h2 className="font-display text-4xl font-black tracking-tighter md:text-5xl">
              {t('landingPage.features.titleLine1')}
              <br />
              <span className="gold-text">{t('landingPage.features.titleLine2')}</span>
            </h2>
            <p
              className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('landingPage.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {featureCards.map(({ icon: Icon, key, delay }) => (
              <motion.div
                key={key}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={delay}
                className="surface-card surface-card-hover rounded-3xl p-8"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: 'var(--accent-gold-subtle)',
                    color: 'var(--accent-gold)'
                  }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="font-display mb-3 text-xl font-black tracking-tight">
                  {t(`landingPage.features.cards.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {t(`landingPage.features.cards.${key}.body`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28">
        <div className="layout-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-4xl font-black tracking-tighter md:text-5xl">
              {t('landingPage.howItWorks.titleLine1')}{' '}
              <span className="gold-text">{t('landingPage.howItWorks.titleHighlight')}</span>
            </h2>
            <p
              className="mx-auto mt-4 max-w-xl text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('landingPage.howItWorks.subtitle')}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {howSteps.map(({ num, icon: Icon, key, delay }) => (
              <motion.div
                key={num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={delay}
                className="step-card text-left"
              >
                <div className="step-number mb-6" style={{ marginLeft: 0, marginRight: 'auto' }}>
                  {num}
                </div>
                <div className="mb-4" style={{ color: 'var(--accent-gold)' }}>
                  <Icon size={24} />
                </div>
                <h3 className="font-display mb-3 text-lg font-black tracking-tight">
                  {t(`landingPage.howItWorks.steps.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {t(`landingPage.howItWorks.steps.${key}.body`)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.3}
            className="mt-10 text-center"
          >
            <Link
              to="/stamp"
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('landingPage.howItWorks.cta')} <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.4}
            className="mx-auto mt-12 max-w-2xl rounded-2xl border p-6 text-center"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-raised)' }}
          >
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              🔒 {t('landingPage.howItWorks.privacyTitle')}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {t('landingPage.howItWorks.privacyBody')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FREE MODEL + FUTURE PRICING ───────────────────────────── */}
      <section
        id="free-and-fees"
        className="py-24"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="layout-container max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <p
              className="mb-3 text-[11px] font-bold tracking-[0.25em] uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              {t('landingPage.freeModel.eyebrow')}
            </p>
            <h2 className="font-display text-3xl font-black tracking-tighter md:text-4xl">
              {t('landingPage.freeModel.titleLine1')}{' '}
              <span className="gold-text">{t('landingPage.freeModel.titleHighlight')}</span>
            </h2>
            <p
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('landingPage.freeModel.explainer')}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('landingPage.freeModel.chainNote')}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="mb-8 text-center"
          >
            <p
              className="mb-2 text-[11px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'var(--text-muted, var(--text-secondary))' }}
            >
              {t('landingPage.freeModel.futureEyebrow')}
            </p>
            <h3 className="font-display text-xl font-black tracking-tight md:text-2xl">
              {t('landingPage.freeModel.futureTitle')}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('landingPage.freeModel.futureSubtitle')}
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { id: 'free', live: true },
              { id: 'sats', live: false },
              { id: 'pro', live: false }
            ].map(({ id, live }, i) => (
              <motion.div
                key={id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.12 + i * 0.08}
                className="relative rounded-2xl border p-6 text-left"
                style={{
                  borderColor: live ? 'var(--accent-gold)' : 'var(--border)',
                  backgroundColor: 'var(--surface-raised)'
                }}
              >
                <span
                  className="absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase"
                  style={{
                    backgroundColor: live ? 'var(--accent-gold)' : 'var(--bg-primary)',
                    color: live ? '#141b25' : 'var(--text-secondary)',
                    border: live ? 'none' : '1px solid var(--border)'
                  }}
                >
                  {t(`landingPage.freeModel.tiers.${id}.badge`)}
                </span>
                <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                  {t(`landingPage.freeModel.tiers.${id}.name`)}
                </p>
                <p className="font-display mt-2 text-3xl font-black tracking-tight">
                  {t(`landingPage.freeModel.tiers.${id}.price`)}
                </p>
                <p className="mt-1 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {t(`landingPage.freeModel.tiers.${id}.period`)}
                </p>
                <p
                  className="mt-4 text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t(`landingPage.freeModel.tiers.${id}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.35}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/stamp"
              className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('landingPage.freeModel.ctaStamp')} <ArrowRight size={16} />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-bold transition-colors hover:border-[var(--accent-gold)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              {t('landingPage.freeModel.ctaPricing')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── VERIFY .OTS ──────────────────────────────────────────── */}
      <section id="verify-ots" className="py-20" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="layout-container max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="font-display text-3xl font-black tracking-tighter md:text-4xl">
              Already have a proof? <span className="gold-text">Confirm it here</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: 'var(--text-secondary)' }}>
              Independent recovery paths if Satohash is offline, calendars are slow, or you only
              have a hash, .ots file, or vault backup.
            </p>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
          >
            <OtsVerifyPanel />
          </motion.div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────────── */}
      <section id="use-cases" className="py-28">
        <div className="layout-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-4xl font-black tracking-tighter md:text-5xl">
              {t('landingPage.useCases.title')}
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {useCaseKeys.map((key, idx) => (
              <motion.div
                key={key}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.05}
                className="surface-card surface-card-hover rounded-3xl p-7"
              >
                <div className="mb-4 text-3xl">{USE_CASE_EMOJI[key]}</div>
                <h3 className="font-display mb-2 text-lg font-black tracking-tight">
                  {t(`landingPage.useCases.cards.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {t(`landingPage.useCases.cards.${key}.body`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="layout-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl border p-8 text-center md:p-16"
            style={{
              borderColor: 'var(--border-gold)',
              background:
                'linear-gradient(135deg, rgba(240,180,41,0.05) 0%, rgba(14,165,233,0.03) 100%)'
            }}
          >
            <h2 className="font-display mb-4 text-4xl font-black tracking-tighter md:text-5xl">
              {t('landingPage.finalCta.titleLine1')}
              <br />
              <span className="gold-text">{t('landingPage.finalCta.titleHighlight')}</span>
            </h2>
            <p
              className="mx-auto mb-10 max-w-lg text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('landingPage.finalCta.subtitle')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/stamp"
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl px-10 py-5 text-lg font-black transition-all hover:scale-105 hover:opacity-90 sm:w-auto"
                style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
              >
                {t('landingPage.finalCta.ctaStamp')} <ArrowRight size={20} />
              </Link>
              <Link
                to="/pitch"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border px-8 py-5 text-sm font-black tracking-widest uppercase transition-all hover:opacity-80 sm:w-auto"
                style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
              >
                {t('landingPage.finalCta.ctaPitch')} <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <Footer />

      {/* ── LEGAL LINKS ──────────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 text-xs"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
      >
        <Link to="/legal/terms" className="transition-opacity hover:opacity-70">
          {t('landingPage.legal.terms')}
        </Link>
        <Link to="/legal/privacy" className="transition-opacity hover:opacity-70">
          {t('landingPage.legal.privacy')}
        </Link>
        <Link to="/legal/crypto-notice" className="transition-opacity hover:opacity-70">
          {t('landingPage.legal.cryptoNotice')}
        </Link>
        <Link to="/trust" className="transition-opacity hover:opacity-70">
          {t('landingPage.legal.trustCenter')}
        </Link>
      </div>

      {/* PWA Install Banner — mobile only */}
      <AnimatePresence>
        {pwaPrompt && !pwaDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed right-4 bottom-20 left-4 z-50 flex items-center gap-3 rounded-2xl p-4 shadow-2xl sm:hidden"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-bright)' }}
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'var(--accent-gold-subtle)' }}
            >
              <span className="text-lg">⚡</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black" style={{ color: 'var(--text-primary)' }}>
                {t('landingPage.pwa.title')}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {t('landingPage.pwa.subtitle')}
              </p>
            </div>
            <button
              onClick={installPWA}
              className="flex-shrink-0 rounded-xl px-3 py-2 text-[10px] font-black tracking-wider uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('landingPage.pwa.install')}
            </button>
            <button onClick={dismissPWA} className="flex-shrink-0 p-1 opacity-40 hover:opacity-100">
              <span style={{ color: 'var(--text-secondary)' }}>✕</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DONATION MODAL ───────────────────────────────────────── */}
      <AnimatePresence>
        {donationOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDonationOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-sm rounded-3xl border p-8 text-center"
              style={{
                borderColor: 'var(--border-gold)',
                backgroundColor: 'var(--surface-raised)'
              }}
            >
              <button
                onClick={() => setDonationOpen(false)}
                className="absolute top-4 right-4 rounded-xl border p-2 transition-colors hover:text-white"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
              <div className="mx-auto mb-4 flex justify-center">
                <img
                  src="/Bitcoin120x120.png"
                  alt="Bitcoin Donation"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <h3 className="font-display mb-1 text-xl font-black">
                {t('landingPage.donation.title')}
              </h3>
              <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {t('landingPage.donation.subtitle')}
              </p>
              <div
                className="mx-auto mb-6 inline-block rounded-2xl border p-4"
                style={{
                  borderColor: 'var(--border-gold)',
                  backgroundColor: 'rgba(240,180,41,0.05)'
                }}
              >
                <QRCodeSVG
                  value={BTC_ADDRESS}
                  size={180}
                  bgColor="transparent"
                  fgColor="#F0B429"
                  level="M"
                />
              </div>
              <p
                className="mb-4 rounded-xl border px-3 py-2 font-mono text-xs break-all"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                {BTC_ADDRESS}
              </p>
              <button
                onClick={copyAddress}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-black transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? t('landingPage.donation.copied') : t('landingPage.donation.copy')}
              </button>
              <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                {t('landingPage.donation.thanks')}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

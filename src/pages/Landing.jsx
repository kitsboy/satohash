import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import {
  Shield,
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
  CheckCircle,
  Menu,
  ChevronRight
} from 'lucide-react'
import Footer from '../components/Footer'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { getBlockHeight } from '../utils/mempool'
import { BTC_ADDRESS } from '../config/constants'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
  })
}

export default function Landing() {
  const [navOpen, setNavOpen] = useState(false)
  const [donationOpen, setDonationOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [proofCount, setProofCount] = useState(null)
  const [blockHeight, setBlockHeight] = useState(null)
  const [pwaPrompt, setPwaPrompt] = useState(null)
  const [pwaDismissed, setPwaDismissed] = useState(
    () => localStorage.getItem('pwa-dismissed') === 'true'
  )

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    Promise.all([
      fetch(`${API}/api/history`)
        .then((r) => r.json())
        .catch(() => []),
      getBlockHeight()
    ]).then(([stamps, height]) => {
      if (Array.isArray(stamps)) setProofCount(stamps.length)
      if (height) setBlockHeight(height)
    })
  }, [])

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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* ── NAVBAR ───────────────────────────────────────────────── */}
      <nav
        className="fixed inset-x-0 top-0 z-[100] border-b"
        style={{
          borderColor: 'var(--border)',
          backgroundColor: 'rgba(20,27,37,0.85)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="layout-container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Satohash" className="h-8 w-8 object-contain" />
            <span
              className="text-lg font-black tracking-tighter uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              Satohash
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {[
              ['Features', '#features'],
              ['How It Works', '#how-it-works'],
              ['Legal', '/trust']
            ].map(([label, href]) =>
              href.startsWith('/') ? (
                <Link
                  key={label}
                  to={href}
                  className="text-sm font-semibold transition-colors hover:text-white"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="text-sm font-semibold transition-colors hover:text-white"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {label}
                </a>
              )
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <button
              onClick={() => setDonationOpen(true)}
              className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all hover:text-yellow-400"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              ₿ Donate
            </button>
            <Link
              to="/stamp"
              className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-black transition-all hover:scale-105 hover:opacity-90"
              style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
            >
              Start Free <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              className="rounded-lg border p-2"
              style={{ borderColor: 'var(--border)' }}
              onClick={() => setNavOpen(!navOpen)}
            >
              {navOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {navOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t md:hidden"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="layout-container flex flex-col gap-4 py-6">
                {[
                  ['Features', '#features'],
                  ['How It Works', '#how-it-works'],
                  ['Legal', '/trust']
                ].map(([label, href]) =>
                  href.startsWith('/') ? (
                    <Link
                      key={label}
                      to={href}
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setNavOpen(false)}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      key={label}
                      href={href}
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={() => setNavOpen(false)}
                    >
                      {label}
                    </a>
                  )
                )}
                <button
                  onClick={() => {
                    setDonationOpen(true)
                    setNavOpen(false)
                  }}
                  className="rounded-xl border py-3 text-sm font-bold"
                  style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
                >
                  ₿ Donate Bitcoin
                </button>
                <Link
                  to="/stamp"
                  className="rounded-xl py-3 text-center text-sm font-black"
                  style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
                >
                  Start Notarizing Free →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
        {/* Hero Background SVG — Bitcoin Network Mesh */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ opacity: 0.35 }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F0B429" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F0B429" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="bgGrad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#F0B429" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#141b25" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background glow */}
            <rect width="1200" height="800" fill="url(#bgGrad)" />

            {/* Grid lines - horizontal */}
            {[100, 200, 300, 400, 500, 600, 700].map((y) => (
              <line
                key={`h${y}`}
                x1="0"
                y1={y}
                x2="1200"
                y2={y}
                stroke="#F0B429"
                strokeOpacity="0.04"
                strokeWidth="1"
              />
            ))}
            {/* Grid lines - vertical */}
            {[120, 240, 360, 480, 600, 720, 840, 960, 1080].map((x) => (
              <line
                key={`v${x}`}
                x1={x}
                y1="0"
                x2={x}
                y2="800"
                stroke="#F0B429"
                strokeOpacity="0.04"
                strokeWidth="1"
              />
            ))}

            {/* Connection lines between nodes */}
            {[
              [150, 150, 300, 200],
              [300, 200, 500, 150],
              [500, 150, 700, 200],
              [700, 200, 900, 150],
              [900, 150, 1050, 200],
              [300, 200, 300, 350],
              [500, 150, 500, 300],
              [700, 200, 700, 350],
              [900, 150, 900, 300],
              [150, 150, 150, 300],
              [1050, 200, 1050, 350],
              [150, 300, 300, 350],
              [300, 350, 500, 300],
              [500, 300, 700, 350],
              [700, 350, 900, 300],
              [900, 300, 1050, 350],
              [300, 350, 300, 500],
              [700, 350, 700, 500],
              [150, 450, 300, 500],
              [300, 500, 500, 450],
              [500, 450, 700, 500],
              [700, 500, 900, 450],
              [200, 600, 400, 650],
              [400, 650, 600, 600],
              [600, 600, 800, 650],
              [800, 650, 1000, 600]
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#F0B429"
                strokeOpacity="0.12"
                strokeWidth="1"
              />
            ))}

            {/* Main nodes */}
            {[
              [150, 150, 6],
              [300, 200, 8],
              [500, 150, 5],
              [700, 200, 7],
              [900, 150, 6],
              [1050, 200, 5],
              [150, 300, 5],
              [300, 350, 9],
              [500, 300, 6],
              [700, 350, 8],
              [900, 300, 5],
              [1050, 350, 6],
              [300, 500, 7],
              [500, 450, 5],
              [700, 500, 8],
              [900, 450, 6],
              [150, 450, 4],
              [400, 650, 5],
              [600, 600, 6],
              [800, 650, 5],
              [1000, 600, 4],
              [200, 600, 3],
              [1050, 500, 4]
            ].map(([cx, cy, r], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r + 8} fill="#F0B429" fillOpacity="0.05" />
                <circle cx={cx} cy={cy} r={r} fill="#F0B429" fillOpacity="0.5" />
                <circle cx={cx} cy={cy} r={r - 2} fill="#F0B429" fillOpacity="0.9" />
              </g>
            ))}

            {/* Large central Bitcoin symbol hint */}
            <text
              x="580"
              y="430"
              fontSize="180"
              fontFamily="serif"
              fill="#F0B429"
              fillOpacity="0.03"
              textAnchor="middle"
            >
              ₿
            </text>

            {/* Hash text decorations */}
            <text
              x="50"
              y="50"
              fontSize="9"
              fontFamily="monospace"
              fill="#F0B429"
              fillOpacity="0.2"
            >
              SHA-256: a3f8c2d1...
            </text>
            <text
              x="800"
              y="750"
              fontSize="9"
              fontFamily="monospace"
              fill="#F0B429"
              fillOpacity="0.2"
            >
              BLOCK: #895441
            </text>
            <text
              x="50"
              y="750"
              fontSize="9"
              fontFamily="monospace"
              fill="#0EA5E9"
              fillOpacity="0.2"
            >
              OTS: verified ✓
            </text>
            <text
              x="900"
              y="50"
              fontSize="9"
              fontFamily="monospace"
              fill="#0EA5E9"
              fillOpacity="0.2"
            >
              MERKLE ROOT: 7bc3...
            </text>
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
            <Zap size={12} /> Bitcoin&apos;s Most Underused Feature
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="font-display mb-6 text-4xl leading-[1.05] font-black tracking-tighter sm:text-5xl md:text-7xl lg:text-8xl"
          >
            Bitcoin Does More
            <br />
            Than Move <span className="gold-text">Money.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mx-auto mb-6 max-w-2xl text-xl leading-relaxed font-medium md:text-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            It proves your documents existed. Permanently.
            <br />
            Without lawyers, notaries, or trust.
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="mx-auto mb-10 max-w-xl text-base leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            Satohash anchors the cryptographic fingerprint of any file to the Bitcoin blockchain via
            OpenTimestamps. The result is mathematical, immutable proof — valid in court, forever
            verifiable, owned by no one.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              to="/stamp"
              className="flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all hover:scale-105 hover:opacity-90 sm:w-auto"
              style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
            >
              Notarize a Document Free <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border px-8 py-4 text-base font-bold transition-all hover:text-white sm:w-auto"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              See How It Works <ChevronRight size={16} />
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {[
              `${proofCount !== null ? proofCount.toLocaleString() : '847,293'} Documents Notarized`,
              `Bitcoin Block #${blockHeight ? blockHeight.toLocaleString() : '895,441'}`,
              'Zero Data Stored — Ever'
            ].map((s) => (
              <div
                key={s}
                className="rounded-full border px-4 py-1.5 text-xs font-bold"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface-raised)',
                  color: 'var(--text-secondary)'
                }}
              >
                {s}
              </div>
            ))}
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
              What Most People Don&apos;t Know
            </div>
            <h2 className="font-display text-4xl font-black tracking-tighter md:text-5xl">
              You Already Trust Bitcoin With Value.
              <br />
              <span className="gold-text">Now Trust It With Truth.</span>
            </h2>
            <p
              className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              When Satoshi Nakamoto launched Bitcoin in 2009, he embedded a newspaper headline in
              the genesis block — proof it wasn&apos;t pre-mined. That same power is now yours, for
              any document, in minutes.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: Lock,
                title: 'No Server Required',
                body: 'Your document never leaves your device. We only see a cryptographic hash — like a fingerprint, not the actual file. Zero-knowledge by design.',
                delay: 0
              },
              {
                icon: Clock,
                title: 'Anchored in 60 Minutes',
                body: 'Within one Bitcoin block, your proof is woven into the chain. Every node on Earth validates it. It cannot be altered, backdated, or deleted.',
                delay: 0.1
              },
              {
                icon: Scale,
                title: 'Court-Ready Evidence',
                body: 'Satohash proofs satisfy ESIGN Act (US), UETA, and eIDAS (EU) requirements. Your timestamp is mathematically non-repudiable.',
                delay: 0.2
              },
              {
                icon: Globe,
                title: 'No Middleman. Ever.',
                body: "Unlike traditional notaries, there's no company to shut down, no server to hack. Bitcoin itself is the notary — 18,000 full nodes strong.",
                delay: 0.3
              }
            ].map(({ icon: Icon, title, body, delay }) => (
              <motion.div
                key={title}
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
                <h3 className="font-display mb-3 text-xl font-black tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {body}
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
              Three Steps. <span className="gold-text">Permanent Proof.</span>
            </h2>
            <p
              className="mx-auto mt-4 max-w-xl text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              From file to Bitcoin in under an hour. No account required to try it.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: '01',
                icon: Fingerprint,
                title: 'Upload or Hash Your File',
                body: 'Drag any document into Satohash. We instantly generate a SHA-256 fingerprint in your browser. Your file never leaves your device.',
                delay: 0
              },
              {
                num: '02',
                icon: Zap,
                title: 'Anchor to Bitcoin',
                body: 'Your fingerprint is submitted to the Bitcoin blockchain via OpenTimestamps. Embedded in the next block — typically within 60 minutes.',
                delay: 0.1
              },
              {
                num: '03',
                icon: Award,
                title: 'Download Your Certificate',
                body: 'Receive a portable proof certificate. Independently verifiable anywhere, anytime — even if Satohash ceases to exist.',
                delay: 0.2
              }
            ].map(({ num, icon: Icon, title, body, delay }) => (
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
                <h3 className="font-display mb-3 text-lg font-black tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {body}
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
              Try It Now — Free <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FACTS & STATS TABLE ───────────────────────────────────── */}
      <section id="stats" className="py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="layout-container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-4xl font-black tracking-tighter md:text-5xl">
              The Numbers Behind <span className="gold-text">Immutable Truth</span>
            </h2>
            <p
              className="mx-auto mt-4 max-w-xl text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              Bitcoin&apos;s blockchain has been running without interruption since January 3, 2009.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="overflow-x-auto rounded-3xl border"
            style={{ borderColor: 'var(--border-gold)', backgroundColor: 'var(--surface-raised)' }}
          >
            <table className="w-full">
              <tbody>
                {[
                  ['Bitcoin blocks produced since 2009', '895,000+'],
                  ['Probability of blockchain rewrite', '< 0.00001%'],
                  ['OTS proof file size', '~350 bytes'],
                  ['Average time to anchor', '~60 minutes'],
                  ['Cost per timestamp', 'Fractions of a cent'],
                  ['Legal frameworks supported', 'ESIGN, UETA, eIDAS, Swiss eIDAS'],
                  ['File types you can timestamp', 'Any — PDF, JPG, ZIP, DOCX...'],
                  ['Data stored about your document', 'Zero bytes of content']
                ].map(([fact, value], i) => (
                  <tr
                    key={fact}
                    className="border-b last:border-0"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                    }}
                  >
                    <td
                      className="px-6 py-5 text-sm font-semibold md:px-8"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {fact}
                    </td>
                    <td
                      className="px-6 py-5 text-right font-mono text-sm font-bold md:px-8"
                      style={{ color: 'var(--accent-gold)' }}
                    >
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              Who Needs Proof <span className="gold-text">That Can&apos;t Be Faked?</span>
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: '📝',
                title: 'Legal Contracts',
                body: 'Prove your contract existed before a dispute. No he-said-she-said in court.',
                delay: 0
              },
              {
                emoji: '🎨',
                title: 'Creative Work',
                body: 'Photographers, writers, designers — timestamp before you publish. Your priority is proven.',
                delay: 0.05
              },
              {
                emoji: '🏥',
                title: 'Medical Records',
                body: 'Immutable audit trails for patient documents and treatment history.',
                delay: 0.1
              },
              {
                emoji: '🏢',
                title: 'Corporate Compliance',
                body: 'Board resolutions, financials, audit logs — cryptographic integrity, always.',
                delay: 0.15
              },
              {
                emoji: '🔬',
                title: 'Research & IP',
                body: 'Scientists and inventors prove discovery dates with mathematical certainty.',
                delay: 0.2
              },
              {
                emoji: '🏛️',
                title: 'Government & Archives',
                body: 'Public records that can never be altered or backdated — ever.',
                delay: 0.25
              }
            ].map(({ emoji, title, body, delay }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={delay}
                className="surface-card surface-card-hover rounded-3xl p-7"
              >
                <div className="mb-4 text-3xl">{emoji}</div>
                <h3 className="font-display mb-2 text-lg font-black tracking-tight">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ZERO KNOWLEDGE EXPLAINER ─────────────────────────────── */}
      <section id="privacy" className="py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="layout-container">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black tracking-widest uppercase"
                style={{
                  borderColor: 'var(--border-gold)',
                  backgroundColor: 'var(--accent-gold-subtle)',
                  color: 'var(--accent-gold)'
                }}
              >
                <Shield size={12} /> Privacy by Design
              </div>
              <h2 className="font-display mb-6 text-4xl font-black tracking-tighter md:text-5xl">
                Your Privacy Is
                <br />
                <span className="gold-text">Mathematically Guaranteed</span>
              </h2>
              <p
                className="mb-5 text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                In traditional notarization, you hand your document to someone who reads it. You
                trust that person — and every system they use.
              </p>
              <p
                className="mb-8 text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                With Satohash, your document is converted to a SHA-256 fingerprint in your browser.
                We never see, store, or transmit your actual document. Only the fingerprint goes to
                Bitcoin. This is zero-knowledge architecture: we prove your document existed without
                ever knowing what&apos;s in it.
              </p>
              <div
                className="rounded-2xl border p-5"
                style={{
                  borderColor: 'var(--border-gold)',
                  backgroundColor: 'var(--accent-gold-subtle)'
                }}
              >
                <p
                  className="text-sm leading-relaxed font-semibold"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  Even if our servers were seized tomorrow, your proof is already embedded in
                  Bitcoin — independently verifiable by anyone, forever.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
            >
              <div className="terminal-card overflow-x-auto p-8">
                <div className="mb-6 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                  <span className="ml-2 font-mono text-xs opacity-40">satohash-proof.sh</span>
                </div>
                <div className="space-y-5 font-mono text-sm">
                  <div>
                    <p className="mb-1 text-xs tracking-widest uppercase opacity-40">
                      Your Document
                    </p>
                    <p className="text-white/80">contract_draft_v3.pdf</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-30">
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
                    <span className="text-xs">SHA-256</span>
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs tracking-widest uppercase opacity-40">
                      Fingerprint Sent to Bitcoin
                    </p>
                    <p className="text-xs break-all" style={{ color: 'var(--accent-gold)' }}>
                      3a7bc8f2e194d05f8c29a3e6b1d44f92c8...
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-30">
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
                    <span className="text-xs">OpenTimestamps</span>
                    <div className="h-px flex-1" style={{ backgroundColor: 'var(--border)' }} />
                  </div>
                  <div>
                    <p className="mb-1 text-xs tracking-widest uppercase opacity-40">
                      Bitcoin Block
                    </p>
                    <p className="text-white/80">#895,441 — Confirmed</p>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-xl p-3"
                    style={{
                      backgroundColor: 'rgba(34,211,165,0.1)',
                      border: '1px solid rgba(34,211,165,0.2)'
                    }}
                  >
                    <CheckCircle size={16} style={{ color: 'var(--accent-success)' }} />
                    <span className="font-bold" style={{ color: 'var(--accent-success)' }}>
                      Immutable Proof Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
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
              Every Document Has a Story.
              <br />
              <span className="gold-text">Make Yours Undeniable.</span>
            </h2>
            <p
              className="mx-auto mb-10 max-w-lg text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              No account required. No credit card. Your first proof is free. Anchored to Bitcoin in
              under an hour.
            </p>
            <Link
              to="/stamp"
              className="inline-flex w-full items-center justify-center gap-3 rounded-2xl px-10 py-5 text-lg font-black transition-all hover:scale-105 hover:opacity-90 sm:w-auto"
              style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
            >
              Notarize Your First Document — Free <ArrowRight size={20} />
            </Link>
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
          Terms of Service
        </Link>
        <Link to="/legal/privacy" className="transition-opacity hover:opacity-70">
          Privacy Policy
        </Link>
        <Link to="/legal/crypto-notice" className="transition-opacity hover:opacity-70">
          Cryptographic Notice
        </Link>
        <Link to="/trust" className="transition-opacity hover:opacity-70">
          Trust Center
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
                Add Satohash to Home Screen
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                Instant access, works offline
              </p>
            </div>
            <button
              onClick={installPWA}
              className="flex-shrink-0 rounded-xl px-3 py-2 text-[10px] font-black tracking-wider uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              Install
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
              <div className="mb-2 text-3xl">₿</div>
              <h3 className="font-display mb-1 text-xl font-black">Support Satohash</h3>
              <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Keep timestamps free for everyone
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
                {copied ? 'Address Copied!' : 'Copy Bitcoin Address'}
              </button>
              <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                Every satoshi helps keep timestamps free. Thank you. 🙏
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useMemo, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Fingerprint,
  Shield,
  Zap,
  Clock,
  Scale,
  Globe,
  Lock,
  Check,
  Bitcoin,
  Sparkles,
  Smartphone
} from 'lucide-react'
import MarketingDesktopNav from '../components/layout/MarketingDesktopNav'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
const SummaryCharts = lazy(() => import('../components/charts/SummaryCharts'))

const fade = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }
  })
}

const USE_CASES = [
  { name: 'Creators & IP', value: 28, color: '#F0B429' },
  { name: 'Legal / Courts', value: 22, color: '#38BDF8' },
  { name: 'Journalism', value: 16, color: '#A78BFA' },
  { name: 'Enterprise audit', value: 18, color: '#34D399' },
  { name: 'AI provenance', value: 16, color: '#FB7185' }
]

const FRICTION = [
  { label: 'Paper notary', days: 14, fill: '#64748B' },
  { label: 'Legal filing', days: 30, fill: '#94A3B8' },
  { label: 'Email “proof”', days: 0.5, fill: '#475569' },
  { label: 'Satohash', days: 0.01, fill: '#F0B429' }
]

const DAILY = [
  { day: 'Mon', stamps: 12 },
  { day: 'Tue', stamps: 18 },
  { day: 'Wed', stamps: 15 },
  { day: 'Thu', stamps: 22 },
  { day: 'Fri', stamps: 28 },
  { day: 'Sat', stamps: 9 },
  { day: 'Sun', stamps: 11 }
]

const STEPS = [
  {
    icon: Fingerprint,
    title: 'Hash on your phone',
    body: 'SHA-256 runs in the browser. Your file never leaves the device.',
    color: '#F0B429'
  },
  {
    icon: Zap,
    title: 'Stamp for free',
    body: 'Only the fingerprint goes to OpenTimestamps calendars. No wallet needed today.',
    color: '#38BDF8'
  },
  {
    icon: Bitcoin,
    title: 'Bitcoin seals it',
    body: 'Calendars batch many proofs into one Bitcoin commitment. Permanent.',
    color: '#F7931A'
  },
  {
    icon: Shield,
    title: 'Verify anywhere',
    body: 'Share a .ots proof. Anyone can check it without trusting Satohash.',
    color: '#34D399'
  }
]

const REASONS = [
  {
    icon: Clock,
    title: 'Seconds, not weeks',
    body: 'Stamp contracts, screenshots, and AI outputs before the argument starts.'
  },
  {
    icon: Lock,
    title: 'Private by design',
    body: 'Zero-knowledge hashing. We never need the document — only the fingerprint.'
  },
  {
    icon: Scale,
    title: 'Independently verifiable proofs',
    body: 'OpenTimestamps + Bitcoin PoW is independent math, not a company promise.'
  },
  {
    icon: Globe,
    title: 'Works offline-first',
    body: 'Hash anywhere. Sync when you’re back online. Portable forever.'
  }
]

export default function ExecutiveSummary() {
  usePageMeta({
    title: 'Executive Summary — Satohash',
    description:
      'Why Satohash: free Bitcoin-anchored proof of existence via OpenTimestamps. Hash locally, stamp in seconds, verify forever.'
  })

  const pieData = useMemo(() => USE_CASES, [])
  const barData = useMemo(
    () =>
      FRICTION.map((r) => ({
        ...r,
        days: r.days < 0.05 ? 0.15 : r.days // visible bar for near-zero
      })),
    []
  )

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <MarketingDesktopNav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden pt-[calc(3.5rem+env(safe-area-inset-top,0px)+var(--satohash-health-banner-h,0px))] md:pt-[calc(5rem+var(--satohash-health-banner-h,0px))]"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(240,180,41,0.16), transparent 55%), var(--bg-primary)'
        }}
      >
        <div className="layout-container max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
          <motion.div initial="hidden" animate="visible" variants={fade} className="text-center">
            <p
              className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.2em] uppercase sm:text-[11px]"
              style={{
                borderColor: 'rgba(240,180,41,0.35)',
                color: 'var(--accent-gold)',
                background: 'rgba(240,180,41,0.08)'
              }}
            >
              <Sparkles size={12} /> Free today · Bitcoin forever
            </p>
            <h1 className="font-display text-[1.75rem] leading-[1.15] font-black tracking-tight sm:text-4xl md:text-5xl">
              Prove it existed.
              <br />
              <span className="gold-text">In under a minute.</span>
            </h1>
            <p
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-base"
              style={{ color: 'var(--text-secondary)' }}
            >
              Satohash free-timestamps a fingerprint of your file using OpenTimestamps on Bitcoin.
              The free base tier is the permanent, never-paywalled trust anchor. Optional premium
              tiers (Professional ~2,100 sats/mo, Business ~21,000 sats/mo) and a pay-per-use API
              are built and staged; they launch paid only once the Lightning rails are funded and
              tested — the proof still anchors to Bitcoin either way.
            </p>
            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                to="/stamp"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black uppercase transition-transform active:scale-[0.98]"
                style={{ background: 'var(--accent-gold)', color: '#141b25' }}
              >
                Stamp a file free <ArrowRight size={16} />
              </Link>
              <Link
                to="/#verify-ots"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border px-6 text-sm font-bold"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                Verify a proof
              </Link>
            </div>
            <p
              className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium sm:text-xs"
              style={{ color: 'var(--text-muted, var(--text-secondary))' }}
            >
              <Smartphone size={14} className="opacity-70" /> Built for one-hand mobile · Pixel
              &amp; iPhone ready
            </p>
          </motion.div>

          {/* KPI strip */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            custom={1}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { k: '0 sats', v: 'User cost today' },
              { k: '< 60s', v: 'To get a pending proof' },
              { k: 'SHA-256', v: 'Local hash only' },
              { k: 'BTC', v: 'Chain of record' }
            ].map((item) => (
              <div
                key={item.v}
                className="rounded-2xl border p-3 text-center sm:p-4"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--surface-raised)'
                }}
              >
                <p
                  className="text-lg font-black sm:text-xl"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {item.k}
                </p>
                <p
                  className="mt-1 text-[10px] font-bold tracking-wide uppercase sm:text-[11px]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.v}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── EXECUTIVE BRIEF (formal prose) ───────────────────── */}
      <section
        className="border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
        aria-labelledby="exec-brief-heading"
      >
        <div className="layout-container max-w-3xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            className="mb-8 text-center sm:mb-10"
          >
            <p
              className="mb-2 text-[10px] font-black tracking-[0.28em] uppercase sm:text-[11px]"
              style={{ color: 'var(--accent-gold)' }}
            >
              For leadership · counsel · compliance
            </p>
            <h2
              id="exec-brief-heading"
              className="font-display text-2xl font-black tracking-tight sm:text-3xl"
            >
              Executive <span className="gold-text">brief</span>
            </h2>
            <div
              className="mx-auto mt-4 h-px w-16"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)'
              }}
            />
          </motion.div>

          <div className="space-y-8 sm:space-y-10">
            {[
              {
                label: '01 — What we do',
                title: 'What we do',
                body: (
                  <>
                    <p>
                      Satohash provides{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>
                        independent, cryptographic proof of existence
                      </strong>{' '}
                      for any digital file—contracts, photographs, source code, AI model outputs,
                      web captures, or audit packages. We do not store or review the underlying
                      content. Instead, we enable organizations and individuals to bind a
                      mathematical fingerprint of that content to the Bitcoin blockchain via the
                      open OpenTimestamps protocol, producing a portable proof that third parties
                      can verify without trusting Satohash as a custodian of truth.
                    </p>
                    <p className="mt-4">
                      In practical terms: when a document, delivery package, or digital artifact
                      must later withstand scrutiny—from counterparties, regulators, courts, or
                      internal audit—Satohash supplies a durable, non-repudiable record that the
                      artifact existed in a specific form at a specific time. The service is
                      designed for everyday use at the edge of work (legal, creative, investigative,
                      and operational), not as a one-off novelty.
                    </p>
                  </>
                )
              },
              {
                label: '02 — How it works',
                title: 'How it works',
                body: (
                  <>
                    <p>
                      The process is deliberately simple and privacy-preserving. First, the user’s
                      browser (or approved client) computes a{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>SHA-256 hash</strong> of the
                      file using standard web cryptography; the original bytes need never leave the
                      device. Second, only that 64-character hash is submitted to OpenTimestamps
                      calendars, which aggregate many hashes into a Merkle tree and periodically
                      commit the root into a Bitcoin transaction. Third, once a Bitcoin block
                      confirms that commitment, the resulting{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>.ots proof</strong> can be
                      downloaded, archived, and independently verified with open-source tools and
                      public chain data.
                    </p>
                    <p className="mt-4">
                      Today, stamping is offered at no charge to the user. The economic model for
                      Bitcoin network fees is absorbed at the calendar and protocol layer through
                      batching; Satohash’s product cost is hosting and operations. When commercial
                      tiers are introduced, settlement is expected via Lightning to Satohash—not a
                      change of ledger. The proof remains anchored to Bitcoin either way.
                    </p>
                  </>
                )
              },
              {
                label: '03 — Truth',
                title: 'Why this matters for truth',
                body: (
                  <>
                    <p>
                      In an environment of generative media, deepfakes, disputed emails, and
                      rewritten “sources of record,” the hardest question is often not <em>what</em>{' '}
                      someone claims, but <em>when</em> a specific digital state first existed and
                      whether it has been altered since. Institutional trust—brand statements,
                      screenshots, and “our system says so”—is increasingly insufficient for
                      adversarial settings. Cryptographic timestamping does not decide guilt or
                      innocence; it restores a shared, machine-checkable baseline of{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>temporal truth</strong>: this
                      exact fingerprint was committed to a public, high-cost-to-rewrite ledger at
                      this block height.
                    </p>
                    <p className="mt-4">
                      That baseline is essential for free expression, journalism, intellectual
                      property priority, and civil process. Without it, history is negotiable. With
                      it, parties may still disagree on meaning—but not on whether the bytes were
                      present in the past. Satohash exists to make that property of Bitcoin
                      available to non-specialists as a daily instrument of integrity.
                    </p>
                  </>
                )
              },
              {
                label: '04 — Enterprises',
                title: 'For companies and institutional metrics',
                body: (
                  <>
                    <p>
                      Enterprises adopt Satohash where audit trails, vendor disputes, regulatory
                      examinations, and multi-party workflows demand evidence that is portable
                      outside any single SaaS silo. Typical patterns include stamping executed
                      agreements and board materials at signature; sealing software releases and
                      configuration snapshots for change-control; anchoring investigative exports
                      and customer communications; and instrumenting APIs so automated systems emit
                      proofs as first-class artifacts. Because verification does not require ongoing
                      access to Satohash infrastructure, the organization retains resilience if
                      vendors change—or if Satohash itself is unavailable.
                    </p>
                    <p className="mt-4">
                      From a metrics perspective, leadership can treat proof coverage as an
                      operational KPI: percentage of high-risk documents stamped within SLA; median
                      time from document finalization to confirmed Bitcoin anchor; share of disputes
                      closed with a verifiable .ots package; and family-product attribution of stamp
                      volume by business unit or client system. These indicators align legal
                      readiness with engineering practice—turning “we keep records” into “we can
                      prove, independently, what existed when.”
                    </p>
                  </>
                )
              }
            ].map((block, i) => (
              <motion.article
                key={block.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fade}
                custom={i}
                className="relative rounded-2xl border px-5 py-6 sm:px-8 sm:py-8"
                style={{
                  borderColor: 'var(--border)',
                  background:
                    'linear-gradient(165deg, color-mix(in srgb, var(--surface-raised) 100%, transparent) 0%, color-mix(in srgb, var(--bg-secondary) 80%, transparent) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(240,180,41,0.06)'
                }}
              >
                <div
                  className="absolute top-0 bottom-0 left-0 w-[3px] rounded-l-2xl"
                  style={{
                    background: 'linear-gradient(180deg, var(--accent-gold), transparent 85%)'
                  }}
                  aria-hidden
                />
                <p
                  className="mb-2 pl-1 text-[10px] font-black tracking-[0.22em] uppercase sm:text-[11px]"
                  style={{ color: 'var(--accent-gold)' }}
                >
                  {block.label}
                </p>
                <h3 className="font-display mb-4 pl-1 text-lg font-black tracking-tight sm:text-xl">
                  {block.title}
                </h3>
                <div
                  className="pl-1 text-[15px] leading-[1.75] sm:text-base sm:leading-[1.8]"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body, ui-sans-serif, system-ui, sans-serif)',
                    textAlign: 'left',
                    maxWidth: '42rem'
                  }}
                >
                  {block.body}
                </div>
              </motion.article>
            ))}
          </div>

          <p
            className="mt-8 text-center text-[11px] font-medium tracking-wide sm:text-xs"
            style={{ color: 'var(--text-muted, var(--text-secondary))' }}
          >
            Confidential product overview · Satohash by Give A Bit · Not legal advice
          </p>
        </div>
      </section>

      {/* ── WHY EVERY DAY ────────────────────────────────────── */}
      <section
        className="border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
              Make proof a <span className="gold-text">daily habit</span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
              Every contract, draft, photo, AI export, or screenshot can be sealed before trust
              becomes a problem.
            </p>
          </motion.div>
          <div className="grid gap-3 sm:grid-cols-2">
            {REASONS.map((r, i) => {
              const Icon = r.icon
              return (
                <motion.div
                  key={r.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fade}
                  custom={i}
                  className="flex gap-3 rounded-2xl border p-4 sm:p-5"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(240,180,41,0.12)', color: 'var(--accent-gold)' }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black sm:text-base">{r.title}</h3>
                    <p
                      className="mt-1 text-xs leading-relaxed sm:text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {r.body}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CHARTS ───────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
              Where proof <span className="gold-text">matters most</span>
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: 'var(--text-secondary)' }}>
              Illustrative demand mix and time-to-proof vs traditional paths (illustrative product
              story — not live billing metrics).
            </p>
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Suspense
              fallback={
                <div
                  className="h-[540px] rounded-2xl border"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                />
              }
            >
              <SummaryCharts pieData={pieData} barData={barData} dailyData={DAILY} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        className="border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <h2 className="font-display mb-8 text-center text-2xl font-black tracking-tight sm:text-3xl">
            How free stamping <span className="gold-text">actually works</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fade}
                  custom={i}
                  className="relative overflow-hidden rounded-2xl border p-4 sm:p-5"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                >
                  <div
                    className="absolute top-0 left-0 h-full w-1"
                    style={{ background: s.color }}
                  />
                  <div className="flex items-start gap-3 pl-2">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${s.color}22`, color: s.color }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest uppercase opacity-60">
                        Step 0{i + 1}
                      </p>
                      <h3 className="text-sm font-black sm:text-base">{s.title}</h3>
                      <p
                        className="mt-1 text-xs leading-relaxed sm:text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {s.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PLANES ───────────────────────────────────────────── */}
      <section className="py-12 sm:py-16">
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <h2 className="font-display mb-2 text-center text-2xl font-black tracking-tight sm:text-3xl">
            Four planes · <span className="gold-text">one Bitcoin base</span>
          </h2>
          <p
            className="mx-auto mb-8 max-w-lg text-center text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Higher planes can evolve. Plane 1 proofs stay valid forever.
          </p>
          <div className="space-y-2">
            {[
              {
                n: '4',
                name: 'Atlas',
                desc: 'Live chain intel, mempool, network health',
                c: '#A78BFA'
              },
              {
                n: '3',
                name: 'Settlement',
                desc: 'Lightning / L402 when paywall flips on',
                c: '#38BDF8'
              },
              {
                n: '2',
                name: 'Identity',
                desc: 'Nostr signers, multi-party provenance',
                c: '#34D399'
              },
              {
                n: '1',
                name: 'Proof',
                desc: 'SHA-256 + OpenTimestamps → Bitcoin PoW',
                c: '#F0B429'
              }
            ].map((p) => (
              <div
                key={p.n}
                className="flex items-center gap-3 rounded-xl border px-3 py-3 sm:gap-4 sm:px-5 sm:py-4"
                style={{
                  borderColor: 'var(--border)',
                  background: `linear-gradient(90deg, ${p.c}18 0%, var(--surface-raised) 40%)`
                }}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black sm:h-10 sm:w-10"
                  style={{ background: p.c, color: '#0b0f14' }}
                >
                  {p.n}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black">{p.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREE + FUTURE ────────────────────────────────────── */}
      <section
        id="pricing-sketch"
        className="border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="layout-container max-w-5xl px-4 sm:px-6">
          <h2 className="font-display mb-2 text-center text-2xl font-black sm:text-3xl">
            Pricing <span className="gold-text">clarity</span>
          </h2>
          <p
            className="mx-auto mb-8 max-w-xl text-center text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Live free tier now. Future Lightning fees pay us — not a different chain.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                name: 'Free',
                price: '0 sats',
                tag: 'Live now',
                live: true,
                points: ['OTS on Bitcoin', 'Local hash', 'Verify forever', 'No account', 'Never paywalled']
              },
              {
                name: 'Professional',
                price: '~2,100 sats',
                tag: 'Built, staged',
                live: false,
                points: ['~$29/mo', 'Unlimited stamping', 'Full vault', 'API + PDF exports']
              },
              {
                name: 'Business / Studio',
                price: '~21,000 sats',
                tag: 'Built, staged',
                live: false,
                points: ['~$299/mo', 'Teams & studios', 'White-label', 'SLA + volume']
              }
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border p-5"
                style={{
                  borderColor: t.live ? 'var(--accent-gold)' : 'var(--border)',
                  background: 'var(--surface-raised)'
                }}
              >
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase"
                  style={{
                    background: t.live ? 'var(--accent-gold)' : 'var(--bg-primary)',
                    color: t.live ? '#141b25' : 'var(--text-secondary)'
                  }}
                >
                  {t.tag}
                </span>
                <p className="mt-3 text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                  {t.name}
                </p>
                <p className="text-2xl font-black">{t.price}</p>
                <ul className="mt-4 space-y-2">
                  {t.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <Check size={14} style={{ color: 'var(--accent-gold)' }} /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="px-4 py-14 sm:px-6 sm:py-20">
        <div
          className="layout-container max-w-3xl rounded-3xl border px-5 py-10 text-center sm:px-10 sm:py-14"
          style={{
            borderColor: 'rgba(240,180,41,0.35)',
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(240,180,41,0.14), transparent 60%), var(--surface-raised)'
          }}
        >
          <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
            Your next file deserves a <span className="gold-text">Bitcoin receipt</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
            No account. No card. Hash locally, stamp free, verify for life.
          </p>
          <Link
            to="/stamp"
            className="mt-6 inline-flex min-h-[52px] w-full max-w-xs items-center justify-center gap-2 rounded-2xl text-sm font-black uppercase sm:w-auto sm:px-10"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            Start free now <ArrowRight size={16} />
          </Link>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-[11px] font-bold tracking-wide uppercase">
            <Link
              to="/pricing"
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              Pricing
            </Link>
            <span style={{ color: 'var(--border)' }}>·</span>
            <Link
              to="/docs"
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              All docs
            </Link>
            <span style={{ color: 'var(--border)' }}>·</span>
            <Link
              to="/comparison"
              className="underline-offset-2 hover:underline"
              style={{ color: 'var(--accent-gold)' }}
            >
              Compare
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

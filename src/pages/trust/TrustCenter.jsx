import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Scale,
  Globe,
  Clock,
  Link2,
  Eye,
  EyeOff,
  Database,
  Bitcoin,
  FileCheck,
  Mail,
  ArrowRight,
  Cpu,
  ShieldCheck
} from 'lucide-react'

/* ─── Animation Variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

/* ─── Data ────────────────────────────────────────────────── */
const COMPLIANCE_ROWS = [
  {
    framework: 'ESIGN Act',
    jurisdiction: 'United States',
    status: 'Compliant',
    standard: 'Electronic Signature'
  },
  {
    framework: 'UETA',
    jurisdiction: 'United States (47 states)',
    status: 'Compliant',
    standard: 'Uniform Electronic Transactions'
  },
  {
    framework: 'eIDAS Regulation',
    jurisdiction: 'European Union',
    status: 'Compatible',
    standard: 'Electronic Identification'
  },
  {
    framework: 'Swiss eIDAS',
    jurisdiction: 'Switzerland',
    status: 'Compatible',
    standard: 'Federal Act on Electronic Signatures'
  },
  {
    framework: 'GDPR',
    jurisdiction: 'European Union',
    status: 'By Design',
    standard: 'Zero personal data stored'
  },
  {
    framework: 'Common Law',
    jurisdiction: 'UK / Commonwealth',
    status: 'Evidentiary',
    standard: 'Hash-based evidence admissible'
  }
]

const BITCOIN_FACTS = [
  {
    icon: Link2,
    text: 'Bitcoin has operated without downtime since January 3, 2009',
    color: 'var(--accent-active)'
  },
  {
    icon: Globe,
    text: '~18,000 full nodes globally validate every transaction',
    color: 'var(--accent-purple)'
  },
  {
    icon: Lock,
    text: 'Rewriting a Bitcoin block would require 51% of global mining power — economically impossible',
    color: 'var(--accent-success)'
  },
  {
    icon: Clock,
    text: 'Each block is timestamped by global consensus — not by any single server',
    color: 'var(--accent-pending)'
  },
  {
    icon: FileCheck,
    text: 'OpenTimestamps (opentimestamps.org) is an open protocol — not a Satohash product',
    color: 'var(--text-secondary)'
  }
]

/* ─── Component ──────────────────────────────────────────── */
export default function TrustCenter() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-[var(--accent-active)] opacity-[0.06] blur-[160px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-[var(--accent-purple)] opacity-[0.04] blur-[140px]" />
      </div>

      <div className="layout-container relative z-10 pt-36 pb-32">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="mb-32 text-center">
          {/* Top status bar */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 flex flex-wrap items-center justify-center gap-6 text-[10px] font-black tracking-[0.3em] text-[var(--text-secondary)] uppercase"
          >
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]" />
              Network Active
            </span>
            <span className="text-[var(--border-bright)]">·</span>
            <span>Effective Date: May 1, 2025</span>
            <span className="text-[var(--border-bright)]">·</span>
            <span>v2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 text-6xl leading-[0.9] font-extrabold tracking-tighter uppercase md:text-8xl lg:text-9xl"
          >
            Built on Math.
            <br />
            <span className="bg-gradient-to-r from-[var(--accent-active)] via-[var(--accent-purple)] to-[var(--accent-success)] bg-clip-text text-transparent">
              Not Trust.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl"
          >
            Satohash uses cryptographic proof — not contracts or promises — to guarantee document
            integrity. Here&apos;s exactly how it works and what it means for you legally.
          </motion.p>

          {/* Pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <HeroPill icon={Cpu} label="Zero-Knowledge Architecture" />
            <HeroPill icon={Bitcoin} label="Bitcoin-Anchored Proof" gold />
          </motion.div>
        </section>

        {/* ── Section 1: ZK Explainer ───────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={EyeOff} label="Zero-Knowledge Architecture" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-6 text-3xl font-bold tracking-tight md:text-4xl"
          >
            What Is Zero-Knowledge?{' '}
            <span className="text-[var(--text-secondary)]">Why Does It Matter?</span>
          </motion.h2>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Explainer text */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 leading-relaxed text-[var(--text-secondary)]"
            >
              <p className="mb-5 text-base">
                In traditional notarization, you hand your document to someone who reads it and
                stamps it. You&apos;re trusting that person — and every system they use.
              </p>
              <p className="mb-5 text-base">
                With Satohash, we use a mathematical technique called a{' '}
                <strong className="text-[var(--text-primary)]">cryptographic hash</strong>. Your
                document is converted to a unique 64-character fingerprint (SHA-256). We never see,
                store, or transmit your actual document. Only the fingerprint is sent to Bitcoin.
              </p>
              <p className="text-base">
                This is called{' '}
                <strong className="text-[var(--text-primary)]">Zero-Knowledge architecture</strong>:
                we can prove your document existed at a specific time without ever knowing
                what&apos;s in it.
              </p>
            </motion.div>

            {/* Hash demo */}
            <motion.div variants={fadeUp} className="flex flex-col justify-between gap-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                <p className="mb-3 text-[10px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                  Example SHA-256 fingerprint
                </p>
                <code className="block font-mono text-xs leading-relaxed break-all text-[var(--accent-active)]">
                  a3f8d2c1e9b4756f0a1d3e7c2b5f8a9d0e6c3b2a1f4e7d8c9b0a2e5f1d3c6b4
                </code>
                <p className="mt-3 text-xs text-[var(--text-secondary)]">
                  This 64-character string is all we ever receive. Your document itself never leaves
                  your device.
                </p>
              </div>

              {/* Flow diagram */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
                <p className="mb-5 text-[10px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                  How it flows
                </p>
                <FlowDiagram />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Section 2: Legal Compliance Table ────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={Scale} label="Legal Compliance" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-2 text-3xl font-bold tracking-tight md:text-4xl"
          >
            International Standards
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-8 text-[var(--text-secondary)]">
            Satohash proofs are designed to meet the requirements of major global legal frameworks.
          </motion.p>

          {/* Horizontal scroll wrapper keeps desktop layout intact on mobile */}
          <motion.div variants={fadeUp} className="-mx-4 sm:mx-0">
            <div className="overflow-x-auto px-4 sm:px-0">
              <div className="min-w-[560px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                {/* Table header */}
                <div className="grid grid-cols-4 border-b border-[var(--border)] bg-[var(--surface-raised)] px-6 py-4 text-[10px] font-black tracking-[0.2em] text-[var(--text-secondary)] uppercase">
                  <span>Framework</span>
                  <span>Jurisdiction</span>
                  <span>Status</span>
                  <span>Standard Met</span>
                </div>

                {COMPLIANCE_ROWS.map((row, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 items-center border-b border-[var(--border)] px-6 py-5 transition-colors last:border-0 hover:bg-[var(--surface-raised)]"
                  >
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {row.framework}
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">{row.jurisdiction}</span>
                    <span>
                      <StatusBadge label={row.status} />
                    </span>
                    <span className="text-sm text-[var(--text-secondary)]">{row.standard}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-4 text-sm leading-relaxed text-[var(--text-secondary)]"
          >
            <AlertCircle size={14} className="mr-2 inline-block text-[var(--accent-pending)]" />
            Satohash proofs provide cryptographic evidence meeting international standards. They do
            not constitute legal advice. For legal proceedings, consult qualified counsel.
          </motion.p>
        </motion.section>

        {/* ── Section 3: Privacy by Architecture ───────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={Lock} label="Privacy by Architecture" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-2 text-3xl font-bold tracking-tight md:text-4xl"
          >
            We Can&apos;t See Your Documents.{' '}
            <span className="text-[var(--text-secondary)]">That&apos;s the Point.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-8 text-[var(--text-secondary)]">
            Our architecture is designed so that privacy isn&apos;t a policy decision — it&apos;s a
            mathematical impossibility to violate it.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-3">
            <PrivacyColumn
              index={0}
              icon={Eye}
              title="What We Receive"
              color="var(--accent-active)"
              items={[
                'SHA-256 hash only (64 hex chars)',
                'No file bytes',
                'No metadata from the file itself',
                'No identifying information'
              ]}
            />
            <PrivacyColumn
              index={1}
              icon={Database}
              title="What We Store"
              color="var(--accent-purple)"
              items={[
                'Hash string',
                'Filename (you provide)',
                'Timestamp of submission',
                'Proof ID',
                'No file content — ever'
              ]}
            />
            <PrivacyColumn
              index={2}
              icon={Bitcoin}
              title="What Bitcoin Stores"
              color="var(--accent-pending)"
              items={[
                'Your hash, embedded in a block',
                'Publicly visible forever',
                'Immutable and tamper-proof',
                'Verifiable by anyone, anywhere'
              ]}
            />
          </div>

          <motion.div
            variants={fadeUp}
            className="mt-6 rounded-2xl border border-[var(--accent-success)]/20 bg-[var(--accent-success)]/5 p-6"
          >
            <ShieldCheck size={18} className="mb-3 text-[var(--accent-success)]" />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">GDPR Article 11 compliance:</strong> We
              cannot identify you from a hash alone. There is no personal data to delete, breach, or
              sell. Your privacy is not a promise — it is a cryptographic constraint.
            </p>
          </motion.div>
        </motion.section>

        {/* ── Section 4: Why Bitcoin ────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={Globe} label="Permanence" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-2 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Why Bitcoin?{' '}
            <span className="text-[var(--text-secondary)]">Because No One Controls It.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-8 text-[var(--text-secondary)]">
            Any central server can be hacked, shut down, or pressured to delete records. Bitcoin
            cannot be.
          </motion.p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {BITCOIN_FACTS.map((fact, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-colors hover:border-[var(--border-bright)]"
              >
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${fact.color} 12%, transparent)`,
                    color: fact.color
                  }}
                >
                  <fact.icon size={18} />
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{fact.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Section 5: Is / Is Not ────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-28"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <SectionLabel icon={AlertCircle} label="Scope of Service" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mb-8 text-3xl font-bold tracking-tight md:text-4xl"
          >
            What Our Service Is{' '}
            <span className="text-[var(--text-secondary)]">(And Isn&apos;t)</span>
          </motion.h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* IS */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[var(--accent-success)]/25 bg-[var(--bg-secondary)] p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-success)]/10 text-[var(--accent-success)]">
                  <CheckCircle size={20} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                  Satohash IS
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Cryptographic timestamping service',
                  'Evidence-generation tool',
                  'Privacy-preserving document notarization',
                  'Bitcoin blockchain anchoring'
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <CheckCircle
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--accent-success)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* IS NOT */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[var(--accent-danger)]/20 bg-[var(--bg-secondary)] p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-danger)]/10 text-[var(--accent-danger)]">
                  <AlertCircle size={20} />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                  Satohash IS NOT
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  'A legal services firm',
                  'A substitute for legal counsel',
                  'A guarantor of document authenticity (only existence)',
                  'Liable for how proofs are used'
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <AlertCircle
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--accent-danger)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* ── Section 6: Contact ────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-3xl border border-[var(--border-bright)] bg-[var(--bg-secondary)]"
        >
          {/* Dot grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(var(--text-secondary) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />

          <div className="relative grid gap-px md:grid-cols-2">
            <ContactCard
              icon={Mail}
              title="Questions About a Proof?"
              description="Reach our legal team for any questions about proof validity, court submissions, or compliance documentation."
              cta="legal@satohash.com"
              href="mailto:legal@satohash.com"
              color="var(--accent-active)"
            />
            <ContactCard
              icon={Shield}
              title="Data Deletion Requests"
              description="To request deletion of your metadata (hashes and filenames), contact our privacy team. Note: Bitcoin-anchored data is permanent by nature."
              cta="privacy@satohash.com"
              href="mailto:privacy@satohash.com"
              color="var(--accent-purple)"
              border
            />
          </div>
        </motion.section>

        {/* ── Legal Documents Footer ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/legal/terms"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent-active)' }}
          >
            Terms of Service
          </Link>
          <span style={{ color: 'var(--border-bright)' }}>·</span>
          <Link
            to="/legal/privacy"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent-active)' }}
          >
            Privacy Policy
          </Link>
          <span style={{ color: 'var(--border-bright)' }}>·</span>
          <Link
            to="/legal/crypto-notice"
            className="text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: 'var(--accent-active)' }}
          >
            Cryptographic Notice
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Sub-components ──────────────────────────────────────── */

function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-pending)]/30 bg-[var(--accent-pending)]/8 px-4 py-1.5">
      <Icon size={12} className="text-[var(--accent-pending)]" />
      <span className="text-[10px] font-black tracking-[0.2em] text-[var(--accent-pending)] uppercase">
        {label}
      </span>
    </div>
  )
}

function HeroPill({ icon: Icon, label, gold }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-bold tracking-wide"
      style={{
        borderColor: gold ? 'var(--accent-pending)' : 'var(--border-bright)',
        backgroundColor: gold
          ? 'color-mix(in srgb, var(--accent-pending) 10%, transparent)'
          : 'var(--surface-raised)',
        color: gold ? 'var(--accent-pending)' : 'var(--text-secondary)'
      }}
    >
      <Icon size={13} />
      {label}
    </div>
  )
}

function FlowDiagram() {
  const steps = [
    { label: 'Your Document', sub: 'Stays on your device', color: 'var(--text-secondary)' },
    { label: 'SHA-256 Hash', sub: '64-char fingerprint', color: 'var(--accent-active)' },
    { label: 'Bitcoin', sub: 'Anchored in a block', color: 'var(--accent-pending)' },
    { label: 'Immutable Proof', sub: 'Forever verifiable', color: 'var(--accent-success)' }
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-center">
            <div className="text-xs font-bold" style={{ color: step.color }}>
              {step.label}
            </div>
            <div className="text-[10px] text-[var(--text-secondary)]">{step.sub}</div>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight size={14} className="shrink-0 text-[var(--text-secondary)]" />
          )}
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ label }) {
  const colorMap = {
    Compliant: { bg: 'var(--accent-success)', text: '#fff' },
    Compatible: { bg: 'var(--accent-active)', text: '#fff' },
    'By Design': { bg: 'var(--accent-purple)', text: '#fff' },
    Evidentiary: { bg: 'var(--accent-pending)', text: '#000' }
  }
  const c = colorMap[label] ?? { bg: 'var(--surface-raised)', text: 'var(--text-secondary)' }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-wide uppercase"
      style={{ backgroundColor: `color-mix(in srgb, ${c.bg} 18%, transparent)`, color: c.bg }}
    >
      <CheckCircle size={10} />
      {label}
    </span>
  )
}

function PrivacyColumn({ index, icon: Icon, title, color, items }) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-7"
    >
      <div
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
          color
        }}
      >
        <Icon size={20} />
      </div>
      <h3 className="mb-4 text-base font-bold text-[var(--text-primary)]">{title}</h3>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function ContactCard({ icon: Icon, title, description, cta, href, color, border }) {
  return (
    <div className={`p-10 ${border ? 'border-l border-[var(--border)]' : ''}`}>
      <div
        className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
          color
        }}
      >
        <Icon size={20} />
      </div>
      <h3 className="mb-3 text-lg font-bold tracking-tight text-[var(--text-primary)]">{title}</h3>
      <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
      <a
        href={href}
        className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
        style={{ color }}
      >
        {cta}
        <ArrowRight size={14} />
      </a>
    </div>
  )
}

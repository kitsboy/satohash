import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
/* eslint-disable react/no-unescaped-entities -- legal prose */
import usePageMeta from '../../hooks/usePageMeta'
import {
  ArrowLeft,
  EyeOff,
  Database,
  Lock,
  Globe,
  Cookie,
  RefreshCw,
  Shield,
  User,
  BarChart2,
  Trash2,
  Mail,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

/* ─── Animation ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }
  })
}

/* ─── Sections data ───────────────────────────────────────── */
const SECTIONS = [
  {
    id: '01',
    icon: Database,
    color: 'var(--accent-active)',
    title: 'What We Collect',
    content: (
      <>
        <p className="mb-4">
          We collect the absolute minimum necessary to provide the service. Here's the complete list
          — nothing is hidden in sub-clauses:
        </p>
        <ul className="space-y-3">
          {[
            {
              label: 'Cryptographic hashes',
              detail:
                'The SHA-256 fingerprint of your document. This is a 64-character string that cannot be reversed into your original file.'
            },
            {
              label: 'IP addresses',
              detail:
                'Collected temporarily for rate-limiting and abuse prevention. Not stored beyond 24 hours. Not linked to your proofs.'
            },
            {
              label: 'Usage analytics',
              detail:
                'Anonymised page-view counts and feature usage (e.g., "Stamp page visited 400 times today"). No individual user is identifiable.'
            },
            {
              label: 'Filename (optional)',
              detail:
                "If you provide a filename when creating a proof, we store it alongside the hash so you can find your proof later. You can use any label — it doesn't have to be the real filename."
            }
          ].map((item, i) => (
            <li
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
            >
              <div className="mb-1 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                <CheckCircle size={13} className="text-[var(--accent-active)]" />
                {item.label}
              </div>
              <p className="pl-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.detail}
              </p>
            </li>
          ))}
        </ul>
      </>
    )
  },
  {
    id: '02',
    icon: EyeOff,
    color: 'var(--accent-success)',
    title: "What We Don't Collect",
    content: (
      <>
        <p className="mb-4">
          This matters as much as what we do collect. Satohash is architecturally incapable of
          collecting the following because hashing happens entirely in your browser:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            "Your document's contents",
            'Your name or email address',
            'Your wallet address or cryptocurrency holdings',
            'Biometric data of any kind',
            'Precise geolocation',
            'Contact lists or social graph',
            'Financial information',
            'Device identifiers beyond IP'
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-[var(--accent-success)]/15 bg-[var(--accent-success)]/5 px-4 py-3 text-sm text-[var(--text-secondary)]"
            >
              <EyeOff size={13} className="shrink-0 text-[var(--accent-success)]" />
              {item}
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: '03',
    icon: BarChart2,
    color: 'var(--accent-purple)',
    title: 'How We Use Data',
    content: (
      <div className="space-y-4">
        {[
          {
            title: 'Proof generation',
            body: 'Your hash is relayed to the Bitcoin network via OpenTimestamps to create a permanent, verifiable timestamp.'
          },
          {
            title: 'Service improvement',
            body: 'Aggregate, anonymised analytics help us understand which features are useful and where the product can be improved.'
          },
          {
            title: 'Security and rate limiting',
            body: 'IP addresses are used to prevent abuse (e.g., bulk spamming the API). This data is not stored beyond 24 hours and is never used for identification.'
          },
          {
            title: 'No advertising. Ever.',
            body: 'We do not sell, rent, trade, or share your data with advertising networks or data brokers. This is not in our business model.'
          }
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-5"
          >
            <h4 className="mb-1.5 text-sm font-bold text-[var(--text-primary)]">{item.title}</h4>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.body}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: '04',
    icon: Database,
    color: 'var(--accent-pending)',
    title: 'Data Retention',
    content: (
      <>
        <p className="mb-4 leading-relaxed text-[var(--text-secondary)]">
          Our retention policy is designed around a simple principle:{' '}
          <strong className="text-[var(--text-primary)]">
            we keep only what's necessary for the proof to function
          </strong>
          .
        </p>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          {[
            {
              item: 'Document hashes',
              period: 'Indefinitely',
              reason: 'The proof record must persist for verification',
              keep: true
            },
            {
              item: 'Proof IDs & timestamps',
              period: 'Indefinitely',
              reason: 'Required to reconstruct verification history',
              keep: true
            },
            {
              item: 'Filenames / labels',
              period: 'Until deleted by you',
              reason: 'Convenience metadata — deletable on request',
              keep: null
            },
            {
              item: 'IP addresses',
              period: '24 hours',
              reason: 'Rate-limiting only',
              keep: false
            },
            {
              item: 'Analytics data',
              period: '90 days (aggregated)',
              reason: 'Anonymised, no user linkage',
              keep: false
            }
          ].map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 items-start border-b border-[var(--border)] px-5 py-4 last:border-0"
            >
              <span className="text-sm font-bold text-[var(--text-primary)]">{row.item}</span>
              <span
                className="text-sm font-bold"
                style={{
                  color:
                    row.keep === true
                      ? 'var(--accent-pending)'
                      : row.keep === false
                        ? 'var(--accent-success)'
                        : 'var(--text-secondary)'
                }}
              >
                {row.period}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">{row.reason}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          Hashes stored on the Bitcoin blockchain itself are permanent and outside our control —
          this is a fundamental property of the protocol, not a policy choice.
        </p>
      </>
    )
  },
  {
    id: '05',
    icon: User,
    color: 'var(--accent-active)',
    title: 'Your Rights',
    content: (
      <>
        <p className="mb-5 leading-relaxed text-[var(--text-secondary)]">
          Under GDPR (if you're in the EU) and similar laws in other jurisdictions, you have the
          following rights regarding your data. Because we store so little, most requests can be
          fulfilled quickly.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              right: 'Right of Access',
              desc: 'Request a copy of everything we hold associated with your proof IDs.'
            },
            {
              right: 'Right to Deletion',
              desc: 'Request deletion of metadata (filename, proof ID). Note: hashes on Bitcoin cannot be deleted.'
            },
            {
              right: 'Right to Portability',
              desc: 'Receive your proof records in a machine-readable format (JSON).'
            },
            {
              right: 'Right to Object',
              desc: 'Object to any processing beyond what is strictly necessary.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
            >
              <div className="mb-1.5 flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                <Shield size={13} className="text-[var(--accent-active)]" />
                {item.right}
              </div>
              <p className="pl-5 text-sm text-[var(--text-secondary)]">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-4 text-sm text-[var(--text-secondary)]">
          To exercise any of these rights, email{' '}
          <a
            href="mailto:privacy@satohash.com"
            className="font-bold text-[var(--accent-active)] hover:underline"
          >
            privacy@satohash.com
          </a>
          . We respond within 30 days.
        </p>
      </>
    )
  },
  {
    id: '06',
    icon: Cookie,
    color: 'var(--accent-purple)',
    title: 'Cookies',
    content: (
      <>
        <p className="mb-5 leading-relaxed text-[var(--text-secondary)]">
          We use minimal cookies — only what's necessary for the application to function. No
          tracking pixels. No fingerprinting. No third-party advertising cookies.
        </p>
        <div className="space-y-3">
          {[
            {
              name: 'session_token',
              purpose: 'Keeps you logged in during a session',
              tracking: false
            },
            {
              name: 'theme_preference',
              purpose: 'Remembers your light/dark mode preference',
              tracking: false
            },
            {
              name: 'Analytics (anonymised)',
              purpose: 'Counts page views with no user identifier attached',
              tracking: false
            }
          ].map((cookie, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-4"
            >
              <div>
                <code className="text-xs font-bold text-[var(--accent-purple)]">{cookie.name}</code>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{cookie.purpose}</p>
              </div>
              <span className="shrink-0 rounded-full border border-[var(--accent-success)]/25 bg-[var(--accent-success)]/8 px-3 py-1 text-[10px] font-black tracking-wide text-[var(--accent-success)] uppercase">
                Not tracking
              </span>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: '07',
    icon: RefreshCw,
    color: 'var(--text-secondary)',
    title: 'Changes to This Policy',
    content: (
      <p className="leading-relaxed text-[var(--text-secondary)]">
        When we make material changes to this policy, we will update the effective date at the top
        of this document and post a notice in the application. For significant changes affecting
        your rights, we will provide at least 30 days notice before the new policy takes effect.
        Continued use of the service after the effective date constitutes acceptance of the updated
        policy. We will never retroactively expand data collection on data we've already collected.
      </p>
    )
  }
]

/* ─── Component ──────────────────────────────────────────── */
export default function PrivacyPolicy() {
  usePageMeta({ page: 'legalPrivacy' })
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-32 text-[var(--text-primary)]">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[var(--accent-success)] opacity-[0.04] blur-[130px]" />
      </div>

      <div className="layout-container relative z-10 max-w-4xl">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 flex items-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[11px] font-black tracking-[0.25em] text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <Link
            to="/trust"
            className="text-[11px] font-black tracking-[0.25em] text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--accent-active)]"
          >
            ← Back to Trust Center
          </Link>
        </motion.div>

        {/* Document paper */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="document-paper"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 right-0 left-0 h-1 rounded-t-[1.5rem] bg-gradient-to-r from-[var(--accent-success)] via-[var(--accent-active)] to-[var(--accent-purple)]" />

          <div className="document-content">
            {/* Header */}
            <header className="mb-14 border-b-2 border-[#0f172a] pb-10">
              <div className="mb-6 flex items-start justify-between gap-6">
                <div>
                  <p className="mb-3 text-[10px] font-black tracking-[0.35em] text-slate-400 uppercase">
                    Satohash Inc. · Legal Document
                  </p>
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                    Privacy Policy
                  </h1>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                  <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Effective
                  </span>
                  <span className="text-sm font-bold text-slate-700">May 1, 2025</span>
                  <span className="mt-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Version
                  </span>
                  <span className="text-sm font-bold text-slate-700">2.0</span>
                </div>
              </div>

              {/* Privacy commitment callout */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="mb-1.5 flex items-center gap-2">
                  <Lock size={14} className="text-emerald-700" />
                  <span className="text-xs font-black tracking-[0.15em] text-emerald-700 uppercase">
                    Our Core Commitment
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-emerald-900/80">
                  Satohash is built on zero-knowledge architecture. Your documents never leave your
                  device. We are mathematically incapable of reading, storing, or leaking your
                  document contents — not as a policy choice, but as a hard technical constraint.
                </p>
              </div>
            </header>

            {/* Sections */}
            <div className="space-y-12">
              {SECTIONS.map((section, i) => (
                <motion.section
                  key={section.id}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  <div className="mb-5 flex items-center gap-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${section.color} 12%, transparent)`,
                        color: section.color
                      }}
                    >
                      <section.icon size={17} />
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span
                        className="text-[10px] font-black tracking-[0.25em] uppercase"
                        style={{ color: section.color }}
                      >
                        {section.id}
                      </span>
                      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className="pl-[3.25rem] text-slate-700">{section.content}</div>
                </motion.section>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-14 border-t-2 border-slate-100 pt-10">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-1 text-xs font-bold tracking-widest text-slate-400 uppercase">
                    Questions or requests?
                  </p>
                  <a
                    href="mailto:privacy@satohash.com"
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline"
                  >
                    <Mail size={14} />
                    privacy@satohash.com
                  </a>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-500">
                  <AlertCircle size={13} />
                  Not legal advice — consult qualified counsel for your jurisdiction.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

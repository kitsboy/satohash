/* eslint-disable react/no-unescaped-entities -- legal prose */
import { useTranslation } from 'react-i18next'
import usePageMeta from '../../hooks/usePageMeta'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  FileText,
  CheckCircle,
  Lock,
  Copyright,
  AlertTriangle,
  Globe,
  XCircle,
  Mail,
  AlertCircle,
  Scale,
  Gavel
} from 'lucide-react'
import Footer from '../../components/layout/Footer'

/* ─── Animation ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.065 }
  })
}

/* ─── Sections ────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: '01',
    icon: FileText,
    color: 'var(--accent-active)',
    title: 'Acceptance of Terms',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          By accessing or using Satohash (the "Service"), you agree to be bound by these Terms of
          Service. If you do not agree, please do not use the Service.
        </p>
        <p className="leading-relaxed">
          These Terms apply to all users, including visitors, registered accounts, and API
          integrators. Use of the Service constitutes full acceptance. Satohash reserves the right
          to update these Terms with reasonable notice (see Section 7 for details).
        </p>
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900">
          <strong>Plain language:</strong> By using Satohash, you're agreeing to these rules. If
          anything is unclear, email us at{' '}
          <a href="mailto:legal@satohash.com" className="font-bold underline">
            legal@satohash.com
          </a>{' '}
          and we'll explain it.
        </div>
      </div>
    )
  },
  {
    id: '02',
    icon: Shield,
    color: 'var(--accent-purple)',
    title: 'Service Description',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          Satohash provides cryptographic document timestamping via the Bitcoin blockchain. Using
          the SHA-256 hashing algorithm and the OpenTimestamps protocol, we generate an immutable
          proof that a specific document existed in its current form at a specific point in time.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: 'What we do',
              items: [
                'Hash your document client-side',
                'Relay the hash to Bitcoin via OpenTimestamps',
                'Generate a verifiable proof record',
                'Store your hash and timestamp'
              ]
            },
            {
              label: 'What we never do',
              items: [
                "Read or store your document's contents",
                'Provide legal advice or representation',
                'Guarantee legal outcomes in any jurisdiction',
                'Act as a custodian of your original files'
              ]
            }
          ].map((col, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${i === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}
            >
              <p
                className={`mb-3 text-[10px] font-black tracking-[0.2em] uppercase ${i === 0 ? 'text-emerald-700' : 'text-rose-600'}`}
              >
                {col.label}
              </p>
              <ul className="space-y-2">
                {col.items.map((item, j) => (
                  <li
                    key={j}
                    className={`flex items-start gap-2 text-sm ${i === 0 ? 'text-emerald-900/80' : 'text-rose-900/70'}`}
                  >
                    {i === 0 ? (
                      <CheckCircle size={13} className="mt-0.5 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle size={13} className="mt-0.5 shrink-0 text-rose-500" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: '03',
    icon: CheckCircle,
    color: 'var(--accent-success)',
    title: 'What You Agree To',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">By using Satohash, you represent and warrant that:</p>
        <div className="space-y-3">
          {[
            {
              icon: CheckCircle,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50 border-emerald-200',
              text: 'You are using the Service for lawful purposes only.'
            },
            {
              icon: CheckCircle,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50 border-emerald-200',
              text: 'You own or have the right to timestamp the documents you submit.'
            },
            {
              icon: CheckCircle,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50 border-emerald-200',
              text: 'You are at least 18 years of age or have parental consent.'
            },
            {
              icon: XCircle,
              color: 'text-rose-500',
              bg: 'bg-rose-50 border-rose-100',
              text: 'You will not timestamp documents that contain illegal content (CSAM, classified government material, etc.).'
            },
            {
              icon: XCircle,
              color: 'text-rose-500',
              bg: 'bg-rose-50 border-rose-100',
              text: 'You will not use the Service to fabricate, backdate, or misrepresent document provenance.'
            },
            {
              icon: XCircle,
              color: 'text-rose-500',
              bg: 'bg-rose-50 border-rose-100',
              text: 'You will not attempt to reverse-engineer, flood, or disrupt the Service.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${item.bg}`}
            >
              <item.icon size={15} className={`mt-0.5 shrink-0 ${item.color}`} />
              <span className="text-sm leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-slate-500">
          Violations may result in immediate suspension of access and, where required by law,
          reporting to relevant authorities.
        </p>
      </div>
    )
  },
  {
    id: '04',
    icon: Copyright,
    color: 'var(--accent-pending)',
    title: 'Intellectual Property',
    content: (
      <div className="space-y-4 text-slate-700">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-bold text-amber-900">Your documents are yours. Full stop.</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
            Using Satohash does not transfer any rights in your documents to us. We claim no
            license, ownership, or interest in the content of anything you timestamp.
          </p>
        </div>
        <p className="leading-relaxed">
          The Satohash platform, interface, branding, and software are owned by Satohash Inc. and
          protected by copyright, trademark, and other intellectual property laws. You may not copy,
          modify, distribute, or create derivative works from our platform without written
          permission.
        </p>
        <p className="leading-relaxed">
          The underlying cryptographic protocols (SHA-256, OpenTimestamps) are open standards and
          are not owned by Satohash. They remain freely available for independent use and
          verification.
        </p>
      </div>
    )
  },
  {
    id: '05',
    icon: AlertTriangle,
    color: 'var(--accent-danger)',
    title: 'Limitation of Liability',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          Satohash provides a <strong>technical tool for generating cryptographic evidence</strong>.
          We do not provide legal services, and our proofs do not constitute legal advice.
        </p>
        <div className="space-y-3">
          {[
            'Satohash is not responsible for the legal admissibility of proofs in any specific jurisdiction. Laws vary, and you should consult counsel for legal proceedings.',
            'We are not liable for loss of your original files. Without the original file, a Bitcoin-anchored hash cannot be verified. Keep secure backups.',
            'Our total liability to you for any claim arising from use of the Service is limited to the amount you paid us in the preceding 12 months.',
            'We are not liable for indirect, incidental, special, or consequential damages — including lost profits, lost data, or reputational harm.'
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <AlertCircle size={14} className="mt-0.5 shrink-0 text-slate-400" />
              <span className="text-sm leading-relaxed text-slate-600">{item}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
          <p className="mb-1 text-sm font-bold tracking-wide text-rose-800 uppercase">Important</p>
          <p className="text-sm leading-relaxed text-rose-700/80">
            The Service is provided "as is" without warranties of any kind, express or implied,
            including merchantability, fitness for a particular purpose, or non-infringement.
          </p>
        </div>
      </div>
    )
  },
  {
    id: '06',
    icon: Globe,
    color: 'var(--accent-active)',
    title: 'Governing Law',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          These Terms are governed by and construed in accordance with the laws of the{' '}
          <strong>State of Delaware, United States</strong>, without regard to its conflict of law
          provisions.
        </p>
        <p className="leading-relaxed">
          Any legal action or proceeding arising from these Terms shall be brought exclusively in
          the state or federal courts located in Delaware. By using the Service, you consent to the
          personal jurisdiction of those courts.
        </p>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
          <Scale size={18} className="shrink-0 text-slate-400" />
          <p className="text-sm text-slate-600">
            If any provision of these Terms is found to be unenforceable, the remaining provisions
            will continue in full force and effect.
          </p>
        </div>
      </div>
    )
  },
  {
    id: '07',
    icon: XCircle,
    color: 'var(--text-secondary)',
    title: 'Termination',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          You may stop using Satohash at any time. No cancellation process is required.
        </p>
        <p className="leading-relaxed">
          Satohash may suspend or terminate your access if you breach these Terms, without prior
          notice. We will attempt to provide notice where legally required or practically feasible.
        </p>
        <p className="leading-relaxed">
          Upon termination, provisions that by their nature should survive will survive — including
          limitation of liability, intellectual property rights, and governing law.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
          Note: Any proofs already anchored to Bitcoin are permanent and exist independently of your
          Satohash account. Termination does not affect Bitcoin-level records.
        </div>
      </div>
    )
  }
]

/* ─── Component ──────────────────────────────────────────── */
export default function TermsOfService() {
  usePageMeta({ page: 'legalTerms' })
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-16 text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/3 h-[400px] w-[400px] rounded-full bg-[var(--accent-gold)] opacity-[0.04] blur-[130px]" />
      </div>

      <div className="layout-container relative z-10 max-w-4xl px-4 pt-8 sm:px-6 sm:pt-10">
        <nav
          aria-label="Legal navigation"
          className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-bold tracking-wide uppercase"
        >
          <Link to="/trust" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            Trust center
          </Link>
          <span className="text-[var(--border-bright)]" aria-hidden>
            ·
          </span>
          <Link
            to="/legal/privacy"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
            Privacy
          </Link>
          <span className="text-[var(--border-bright)]" aria-hidden>
            ·
          </span>
          <Link
            to="/legal/crypto-notice"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
            Crypto notice
          </Link>
          <span className="text-[var(--border-bright)]" aria-hidden>
            ·
          </span>
          <Link to="/stamp" className="text-[var(--accent-gold)] hover:underline">
            Free stamp
          </Link>
        </nav>

        {/* Document paper */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="document-paper"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 right-0 left-0 h-1 rounded-t-[1.5rem] bg-gradient-to-r from-[var(--accent-active)] via-[var(--accent-purple)] to-[var(--accent-pending)]" />

          <div className="document-content">
            {/* Header */}
            <header className="mb-14 border-b-2 border-[#0f172a] pb-10">
              <div className="mb-6 flex items-start justify-between gap-6">
                <div>
                  <p className="mb-3 text-[10px] font-black tracking-[0.35em] text-slate-400 uppercase">
                    Satohash Inc. · Legal Document
                  </p>
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                    {t('legalPages.termsTitle')}
                  </h1>
                  <p className="mt-3 text-sm text-slate-600">{t('legalPages.disclaimer')}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                  <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Effective
                  </span>
                  <span className="text-sm font-bold text-slate-700">May 1, 2025</span>
                  <span className="mt-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Version
                  </span>
                  <span className="text-sm font-bold text-slate-700">3.0</span>
                </div>
              </div>

              {/* Governing law banner */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <Gavel size={13} className="text-slate-400" />
                  <span className="text-[10px] font-black tracking-[0.15em] text-slate-500 uppercase">
                    Delaware, USA
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <Scale size={13} className="text-slate-400" />
                  <span className="text-[10px] font-black tracking-[0.15em] text-slate-500 uppercase">
                    English Language Governs
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <Lock size={13} className="text-slate-400" />
                  <span className="text-[10px] font-black tracking-[0.15em] text-slate-500 uppercase">
                    Non-Custodial Service
                  </span>
                </div>
              </div>
            </header>

            {/* Quick summary box */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-12 rounded-2xl border border-indigo-200 bg-indigo-50 p-6"
            >
              <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-indigo-500 uppercase">
                Summary — Plain Language
              </p>
              <p className="text-sm leading-relaxed text-indigo-900/80">
                You keep full ownership of your documents. We provide a tool to create cryptographic
                proof that your document existed at a certain time. We are a software provider, not
                a law firm. Use the Service legally and responsibly. Delaware law governs any
                disputes.
              </p>
            </motion.div>

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
                  <div className="pl-[3.25rem]">{section.content}</div>
                </motion.section>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-14 border-t-2 border-slate-100 pt-10">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-1 text-xs font-black tracking-widest text-slate-400 uppercase">
                    Questions about these terms?
                  </p>
                  <a
                    href="mailto:legal@satohash.com"
                    className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline"
                  >
                    <Mail size={14} />
                    legal@satohash.com
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
      <Footer />
    </div>
  )
}

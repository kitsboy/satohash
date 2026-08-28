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
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900/80">
          <strong className="text-emerald-800">Current status: a free, non-commercial service.</strong>{' '}
          Satohash is currently provided free of charge as a non-commercial service in public beta.
          No subscription is billed and no payment is accepted today. The commercial (paid) terms
          described in this document are forward-looking proposals that will apply only if and when
          paid services launch; they are not in effect now.
        </div>
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
    icon: Shield,
    color: 'var(--accent-danger)',
    title: 'Indemnification',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          You agree to indemnify, defend, and hold harmless Satohash, Give A Bit, and their
          respective officers, directors, employees, agents, and contributors from and against any
          claims, liabilities, damages, losses, costs, and expenses (including reasonable
          attorneys' fees) arising out of or relating to:
        </p>
        <div className="space-y-3">
          {[
            'Your use of the Service, including any document, hash, or content you submit or timestamp.',
            'Your breach of these Terms, including the representations and warranties in the "What You Agree To" section.',
            'Any claim that your timestamped content or your use of the Service infringes the rights of a third party or violates applicable law.',
            'Your reliance on any proof or output of the Service in a manner inconsistent with these Terms or our published educational materials.'
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3"
            >
              <Shield size={14} className="mt-0.5 shrink-0 text-rose-500" />
              <span className="text-sm leading-relaxed text-rose-800/80">{item}</span>
            </div>
          ))}
        </div>
        <p className="leading-relaxed">
          This indemnification survives termination of your use of the Service. We may, at our
          option, assume the exclusive defense and control of any matter subject to
          indemnification; if we do, you agree to cooperate with us and not settle any such matter
          without our prior written consent.
        </p>
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-700/80">
          <strong className="text-rose-800">Plain language:</strong> If your use of Satohash causes
          a problem for someone else, you take responsibility for it — not us.
        </div>
      </div>
    )
  },
  {
    id: '05',
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
          The Satohash platform, interface, branding, and software are owned by [ENTITY TBD] (the
          Satohash operator) and protected by copyright, trademark, and other intellectual property
          laws. You may not copy,
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
    id: '06',
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
            'We are not liable for indirect, incidental, special, or consequential damages — including lost profits, lost data, or reputational harm.',
            'We do not warrant that any stamp will be confirmed in Bitcoin by any particular time, or at all. Pending means submitted to OpenTimestamps calendars; Confirmed means a Bitcoin block includes the attestation. Confirmation depends on third-party calendars and the Bitcoin network, which are outside our control.',
            'Because a Bitcoin-anchored proof is only as strong as the original file, we are not liable for your failure to preserve the original document bytes or your .ots proof file.',
            'We are not responsible for the acts or omissions of third-party OpenTimestamps calendars, Bitcoin miners, nodes, or network participants.',
            'Our proofs are not guaranteed to be accepted as evidence by any court, tribunal, or regulator in any jurisdiction. We provide a technical tool, not a legal service.'
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
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
          <p className="mb-1 text-sm font-bold tracking-wide text-rose-800 uppercase">No Warranty</p>
          <p className="text-sm leading-relaxed text-rose-700/80">
            To the maximum extent permitted by law, the Service is provided "as is" and "as
            available," without warranties of any kind, whether express, implied, or statutory,
            including without limitation warranties of merchantability, fitness for a particular
            purpose, non-infringement, accuracy, or that the Service will be uninterrupted,
            error-free, or that stamps will confirm in a particular time. The entire risk arising
            out of use of the Service remains with you. Some jurisdictions do not allow the
            exclusion of certain warranties, so some of the above exclusions may not apply to you.
          </p>
        </div>
      </div>
    )
  },
  {
    id: '07',
    icon: FileText,
    color: 'var(--accent-purple)',
    title: 'Paid Tiers, Billing & Refunds (Forward-Looking)',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          <strong>Forward-looking only.</strong> The pricing below describes how paid tiers would
          operate if and when commercial services launch. Satohash is currently a free,
          non-commercial service: no subscription is billed and no payment is accepted today. These
          paid-tier provisions are not in effect until paid services actually launch.
        </p>
        <p className="leading-relaxed">
          Satohash offers a permanent Free tier plus optional paid tiers. Prices are quoted in
          satoshis (sats) with approximate US-dollar equivalents for convenience. The current tier
          model is set out below.
        </p>
        {[
          {
            h: 'Free — permanent trust anchor',
            p: 'Unlimited stamping, verification, and .ots downloads with client-side hashing, subject to a 10-stamps-per-day cap. The Free tier is the permanent trust anchor of the Service and is NEVER paywalled: it will not be removed, made conditional on payment, or otherwise reduced to a degraded marketing hook.'
          },
          {
            h: 'Professional',
            p: '~2,100 sats/month (approximately $29). For individual, high-volume stamping. Billed on the periodic basis shown at sign-up (monthly unless otherwise agreed).'
          },
          {
            h: 'Business / Studio',
            p: '~21,000 sats/month (approximately $299). For teams and studios. Billed on the periodic basis shown at sign-up (monthly unless otherwise agreed).'
          },
          {
            h: 'Enterprise',
            p: 'Custom pricing, partner-gated, and not marketed at this time. Contact hello@giveabit.io to discuss.'
          },
          {
            h: 'Pay-per-use API',
            p: 'Developer / programmatic access priced at 1–5 sats per stamp via Lightning (L402). The final per-stamp rate is published in the application.'
          }
        ].map((b, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-sm font-bold text-slate-800">{b.h}</p>
            <p className="text-sm leading-relaxed text-slate-600">{b.p}</p>
          </div>
        ))}
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm text-amber-900/80">
          <strong>Lightning dependency:</strong> Paid tiers are priced in sats, but collection
          depends on the Lightning Network (L402 / LND) being funded and operational. Until
          Lightning channels are funded and tested, paid tiers may not be activatable. The Free
          tier remains live regardless.
        </div>
        {[
          {
            h: 'Automatic renewal',
            p: 'Unless you cancel before the end of the current billing period, your subscription renews automatically at the then-current price. You may cancel at any time in your account settings or by contacting hello@giveabit.io; cancellation takes effect at the end of the current paid period and does not entitle you to a pro-rated refund except as required by law.'
          },
          {
            h: 'Price changes',
            p: 'We may change prices for paid tiers with at least 30 days notice. Continued use after the price change takes effect constitutes acceptance of the new price.'
          },
          {
            h: 'Refunds',
            p: 'If a paid Service feature fails materially and we cannot remedy it within 30 days of written notice, you may request a refund of the fees paid for the then-current period for the affected feature. All refund requests are handled at our discretion unless required by law. Nothing in this section limits any statutory consumer rights you may have.'
          },
          {
            h: 'Payments & Lightning',
            p: 'Where a payment is made via Lightning Network (L402 / BOLT-12), the transaction is final and irreversible by design of the Bitcoin network. Refunds, where available, are issued as new payments, not chargebacks.'
          },
          {
            h: 'Taxes',
            p: 'You are responsible for any taxes applicable to your use of the Service.'
          }
        ].map((b, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-sm font-bold text-slate-800">{b.h}</p>
            <p className="text-sm leading-relaxed text-slate-600">{b.p}</p>
          </div>
        ))}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm text-indigo-900/80">
          <strong>Plain language:</strong> Free stamps stay free, forever — that&apos;s the trust
          anchor. Paid plans quote a price in sats and auto-renew until you cancel. If a paid
          feature breaks and we can&apos;t fix it in 30 days, we&apos;ll consider a refund. Lightning
          payments can&apos;t be reversed — that&apos;s the point.
        </div>
      </div>
    )
  },
  {
    id: '08',
    icon: CheckCircle,
    color: 'var(--accent-success)',
    title: 'Enterprise Service Level Agreement (Forward-Looking)',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          For Enterprise accounts, we offer a best-efforts service availability target of{' '}
          <strong>99.5% monthly uptime</strong>, measured against the public status of the core
          stamping and verification endpoints, excluding scheduled maintenance and force majeure.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="mb-1 text-sm font-bold text-slate-800">Remedy</p>
          <p className="text-sm leading-relaxed text-slate-600">
            If we fail to meet the availability target in a calendar month, you may request a
            service credit equal to 5% of that month&apos;s Enterprise fee for each full percentage
            point (or partial) below the target, up to a maximum of 20% of the monthly fee.
            Service credits are applied as a discount to the next billing cycle and are your sole
            and exclusive remedy for availability failures. This SLA does not guarantee
            confirmation times for individual stamps, which depend on third-party calendars and the
            Bitcoin network.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-900/80">
          <strong>Plain language:</strong> Enterprise gets a 99.5% uptime promise. If we miss it,
          you get a discount off the next month — but not cash for any individual stamp delay.
        </div>
      </div>
    )
  },
  {
    id: '09',
    icon: Gavel,
    color: 'var(--text-secondary)',
    title: 'Governing Law',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          These Terms are governed by and construed in accordance with the laws of{' '}
          <strong>[GOVERNING LAW TBD — pending legal-entity confirmation]</strong>, without regard
          to its conflict of law provisions.
        </p>
        <p className="leading-relaxed">
          Any legal action or proceeding arising from these Terms shall be brought exclusively in
          the state or federal courts located in [JURISDICTION TBD — pending legal-entity
          confirmation]. By using the Service, you consent to the personal jurisdiction of those
          courts.
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
    id: '10',
    icon: Scale,
    color: 'var(--accent-active)',
    title: 'Dispute Resolution',
    content: (
      <div className="space-y-4 text-slate-700">
        {[
          {
            h: 'Informal resolution first',
            p: 'Before filing any claim, you agree to notify us in writing at hello@giveabit.io and give us 30 days to resolve the dispute informally.'
          },
          {
            h: 'Governing law & forum',
            p: 'These Terms are governed by the laws of [GOVERNING LAW TBD — pending legal-entity confirmation], without regard to conflict-of-law principles. Subject to the informal-resolution step, any claim not resolved informally shall be brought exclusively in the state or federal courts located in [JURISDICTION TBD — pending legal-entity confirmation], and you consent to the personal jurisdiction of those courts.'
          },
          {
            h: 'Small claims',
            p: 'Either party may bring an individual claim in small-claims court if it qualifies, rather than through the courts referenced above.'
          },
          {
            h: 'No class actions',
            p: 'To the extent permitted by law, disputes shall be resolved on an individual basis; you waive the right to participate in any class or representative action against us.'
          },
          {
            h: 'Survival',
            p: 'This section survives termination of these Terms.'
          }
        ].map((b, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="mb-1 text-sm font-bold text-slate-800">{b.h}</p>
            <p className="text-sm leading-relaxed text-slate-600">{b.p}</p>
          </div>
        ))}
      </div>
    )
  },
  {
    id: '11',
    icon: Globe,
    color: 'var(--accent-purple)',
    title: 'International Use & Data',
    content: (
      <div className="space-y-4 text-slate-700">
        <p className="leading-relaxed">
          The Service may be used from any jurisdiction where such use is lawful. You are
          responsible for complying with the laws of your jurisdiction, including any
          export-control or sanctions requirements that may apply to your use.
        </p>
        <p className="leading-relaxed">
          Satohash processes only the minimal metadata described in our Privacy Policy (primarily
          hashes and optional labels). It does not process document contents. For Enterprise
          customers who require a data-processing agreement, we will provide a short DPA confirming
          this posture on request at hello@giveabit.io.
        </p>
        <p className="leading-relaxed">
          Blockchain data (Bitcoin) is public by nature. Once a hash is committed, it is permanent
          and outside our control.
        </p>
      </div>
    )
  },
  {
    id: '12',
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
          <Link
            to="/trust"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
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
              <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
                <div>
                  <p className="mb-3 text-[10px] font-black tracking-[0.35em] text-slate-400 uppercase">
                    [ENTITY TBD] · Legal Document
                  </p>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
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
                    Last reviewed
                  </span>
                  <span className="text-sm font-bold text-slate-700">August 16, 2026</span>
                  <span className="mt-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Version
                  </span>
                  <span className="text-sm font-bold text-slate-700">5.0.0-ELITE</span>
                </div>
              </div>

              {/* Governing law banner */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
                  <Gavel size={13} className="text-slate-400" />
                  <span className="text-[10px] font-black tracking-[0.15em] text-slate-500 uppercase">
                    [ENTITY TBD] · Jurisdiction pending
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
                a law firm. Use the Service legally and responsibly. [GOVERNING LAW TBD] governs
                any disputes.
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

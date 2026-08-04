import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Fingerprint,
  Bitcoin,
  AlertTriangle,
  FileText,
  ArrowRight,
  Scale,
  Lock
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import usePageMeta from '../../hooks/usePageMeta'
import Footer from '../../components/layout/Footer'

const PROVES = [
  {
    title: 'Integrity',
    body: 'Mathematical proof the document has not changed by even a single bit since the timestamp was created.'
  },
  {
    title: 'Existence',
    body: 'Proof the document existed in its current form at or before a certain time (calendar commit, then Bitcoin block time).'
  },
  {
    title: 'Independent verification',
    body: 'Anyone with the original file and the .ots proof can re-verify without trusting Satohash to stay online forever.'
  }
]

export default function CryptoNotice() {
  usePageMeta({ page: 'legalCrypto' })
  const { t } = useTranslation()

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <section className="border-b px-4 pt-8 pb-12 sm:px-6 sm:pt-12" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-wrap gap-3 text-[11px] font-bold tracking-wide uppercase">
            <Link to="/legal/terms" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
              Terms
            </Link>
            <span style={{ color: 'var(--border-bright)' }}>·</span>
            <Link to="/legal/privacy" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
              Privacy
            </Link>
            <span style={{ color: 'var(--border-bright)' }}>·</span>
            <Link to="/trust" className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
              Trust center
            </Link>
          </div>
          <p className="mb-2 text-[10px] font-black tracking-[0.22em] uppercase" style={{ color: 'var(--accent-gold)' }}>
            Legal · Cryptographic notice
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t('legalPages.cryptoTitle', { defaultValue: 'Cryptographic notice' })}
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('legalPages.disclaimer', {
              defaultValue: 'Educational reference — not legal advice. Laws vary by jurisdiction.'
            })}
          </p>
          <p className="mt-2 text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-tertiary)' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
        <div
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            borderColor: 'color-mix(in srgb, var(--accent-gold) 30%, transparent)',
            background: 'color-mix(in srgb, var(--accent-gold) 8%, var(--surface-raised))'
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={20} style={{ color: 'var(--accent-gold)' }} />
            <h2 className="text-lg font-black">What a Satohash stamp proves</h2>
          </div>
          <ul className="space-y-4">
            {PROVES.map((p) => (
              <li key={p.title} className="flex gap-3">
                <Fingerprint size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-gold)' }} />
                <div>
                  <p className="text-sm font-bold">{p.title}</p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <article className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-black" style={{ color: 'var(--text-primary)' }}>
              <Bitcoin size={18} style={{ color: 'var(--accent-gold)' }} /> OpenTimestamps + Bitcoin
            </h2>
            <p>
              Satohash uses the OpenTimestamps (OTS) protocol. Document hashes are aggregated into a
              Merkle tree and committed through public calendars, then anchored toward the Bitcoin
              blockchain. You receive a portable <strong style={{ color: 'var(--text-primary)' }}>.ots</strong> proof
              file.
            </p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-black" style={{ color: 'var(--text-primary)' }}>
              <Lock size={18} style={{ color: 'var(--accent-gold)' }} /> Privacy by design
            </h2>
            <p>
              Hashing happens on your device. We do not receive your original file — only the SHA-256
              fingerprint (and metadata you choose to attach, such as a filename label).
            </p>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-base font-black" style={{ color: 'var(--text-primary)' }}>
              <Scale size={18} style={{ color: 'var(--accent-gold)' }} /> Legal weight
            </h2>
            <p>
              Many jurisdictions recognize electronic records and cryptographic integrity evidence
              (e.g. ESIGN/UETA, eIDAS discussions). The weight of a blockchain timestamp depends on
              procedure, custody, and counsel. See our educational{' '}
              <Link to="/evidence-admissibility" className="font-bold text-[var(--accent-gold)] underline-offset-2 hover:underline">
                evidence admissibility
              </Link>{' '}
              matrix.
            </p>
          </section>

          <section
            className="rounded-2xl border p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
          >
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: 'var(--accent-gold)' }} />
              <h2 className="text-base font-black" style={{ color: 'var(--text-primary)' }}>
                Crucial reminder
              </h2>
            </div>
            <p>
              The .ots proof is useless without the original document bytes. Keep the original file
              exactly as timestamped. Changing a single bit changes the hash and verification fails.
            </p>
          </section>
        </article>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/stamp"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl px-5 py-3 text-xs font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            Free stamp <ArrowRight size={14} />
          </Link>
          <Link
            to="/legal/terms"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border px-5 py-3 text-xs font-black uppercase"
            style={{ borderColor: 'var(--border)' }}
          >
            <FileText size={14} /> Terms
          </Link>
          <Link
            to="/security"
            className="inline-flex min-h-[48px] items-center rounded-xl border px-5 py-3 text-xs font-black uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Security
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}

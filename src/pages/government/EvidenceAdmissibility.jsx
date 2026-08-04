import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Scale,
  Shield,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Fingerprint,
  Globe2,
  FileCheck,
  Info
} from 'lucide-react'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'

const ROWS = [
  {
    framework: 'ESIGN Act',
    region: 'United States',
    status: 'Hash evidence admissible',
    tone: 'good',
    note: 'Electronic records with integrity proof'
  },
  {
    framework: 'UETA',
    region: 'US (47 states)',
    status: 'Compatible',
    tone: 'good',
    note: 'Uniform electronic transactions'
  },
  {
    framework: 'eIDAS',
    region: 'European Union',
    status: 'Supporting evidence',
    tone: 'amber',
    note: 'Qualified timestamps may need TSA; OTS strengthens the package'
  },
  {
    framework: 'UK civil evidence',
    region: 'United Kingdom',
    status: 'Evidentiary',
    tone: 'good',
    note: 'Hash logs with proper chain of custody'
  },
  {
    framework: 'ZertES',
    region: 'Switzerland',
    status: 'Compatible',
    tone: 'good',
    note: 'Federal Act on Electronic Signatures'
  },
  {
    framework: 'Hague Apostille',
    region: 'Cross-border',
    status: 'Companion',
    tone: 'amber',
    note: 'Hash companion for notarized documents'
  },
  {
    framework: 'GDPR',
    region: 'EU',
    status: 'By design',
    tone: 'good',
    note: 'Zero document bytes stored on Satohash'
  }
]

const PILLARS = [
  {
    icon: Fingerprint,
    title: 'Integrity, not ownership of truth',
    body: 'A SHA-256 fingerprint proves a specific byte stream existed at a point in time. Courts still weigh relevance, custody, and testimony — the hash does not replace a judge.'
  },
  {
    icon: Globe2,
    title: 'Public calendars + Bitcoin',
    body: 'OpenTimestamps commits to public calendars first, then Bitcoin. Anyone can re-verify without trusting Satohash to stay online forever.'
  },
  {
    icon: FileCheck,
    title: 'Portable .ots proofs',
    body: 'Keep the proof file with the archive. Independent tools and browser structural checks work even if our UI changes.'
  }
]

const PRACTICAL = [
  'Stamp before dispute windows open (tenders, filings, media drops).',
  'Export and store .ots beside the original package; do not rely on screenshots alone.',
  'Document who held the file (chain of custody) — hash + process beats hash alone.',
  'Use batch hash for folders; one commitment per migration cutover is easier to explain.',
  'Never present this matrix as legal advice — brief counsel with primary sources.'
]

function statusColor(tone) {
  if (tone === 'amber') return 'var(--accent-gold)'
  if (tone === 'warn') return 'var(--accent-danger)'
  return 'var(--accent-success)'
}

export default function EvidenceAdmissibility() {
  usePageMeta({ page: 'evidenceAdmissibility' })
  const { t } = useTranslation()

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="border-b px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-3xl text-center">
          <Scale size={32} className="mx-auto mb-4" style={{ color: 'var(--accent-gold)' }} />
          <p
            className="mb-2 text-[10px] font-black tracking-[0.22em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Government · Evidence
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            {t('evidenceAdmissibilityPage.title', { defaultValue: 'Evidence admissibility' })}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('evidenceAdmissibilityPage.subtitle', {
              defaultValue:
                'How hash-based proofs fit common electronic-evidence frameworks'
            })}{' '}
            — <strong style={{ color: 'var(--text-primary)' }}>educational reference only</strong>, not
            legal advice.
          </p>
          <div
            className="mx-auto mt-6 flex max-w-lg items-start gap-2 rounded-xl border px-4 py-3 text-left text-[11px] leading-relaxed"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-gold) 35%, transparent)',
              background: 'color-mix(in srgb, var(--accent-gold) 8%, transparent)',
              color: 'var(--text-secondary)'
            }}
          >
            <Info size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-gold)' }} />
            <span>
              Satohash never stores your document — only fingerprints and optional .ots proofs. That
              privacy posture helps GDPR-style discussions; it does not auto-qualify as a regulated
              timestamp authority in every jurisdiction.
            </span>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-center text-lg font-black tracking-tight sm:text-xl">
          What a Bitcoin-anchored hash actually proves
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PILLARS.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.title}
                className="rounded-2xl border p-5"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(240,180,41,0.12)', color: 'var(--accent-gold)' }}
                >
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {p.body}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Matrix */}
      <section className="border-y px-4 py-12 sm:px-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: 'var(--accent-gold)' }}>
                Framework matrix
              </p>
              <h2 className="text-lg font-black sm:text-xl" style={{ color: 'var(--text-primary)' }}>
                High-level orientation
              </h2>
            </div>
            <p className="max-w-sm text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              Status labels are simplified for product education. Always confirm with counsel and
              primary legislation.
            </p>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {ROWS.map((row) => (
              <div
                key={row.framework}
                className="rounded-2xl border p-4"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                    {row.framework}
                  </p>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase"
                    style={{
                      color: statusColor(row.tone),
                      background: `color-mix(in srgb, ${statusColor(row.tone)} 15%, transparent)`
                    }}
                  >
                    {row.status}
                  </span>
                </div>
                <p className="mt-1 text-[10px] font-bold tracking-wide uppercase" style={{ color: 'var(--text-tertiary)' }}>
                  {row.region}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {row.note}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div
            className="hidden overflow-hidden rounded-2xl border md:block"
            style={{ borderColor: 'var(--border)' }}
          >
            <table className="w-full text-left text-xs">
              <thead>
                <tr style={{ background: 'var(--surface-raised)' }}>
                  {['Framework', 'Region', 'Status', 'Notes'].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-[10px] font-black tracking-widest uppercase"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr
                    key={row.framework}
                    className="border-t"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
                  >
                    <td className="px-4 py-3.5 font-bold" style={{ color: 'var(--text-primary)' }}>
                      {row.framework}
                    </td>
                    <td className="px-4 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                      {row.region}
                    </td>
                    <td className="px-4 py-3.5 font-bold" style={{ color: statusColor(row.tone) }}>
                      {row.status}
                    </td>
                    <td className="px-4 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Practical + caveats */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div
            className="rounded-2xl border p-5 sm:p-6"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
          >
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} style={{ color: 'var(--accent-success)' }} />
              <h2 className="text-base font-black">Practical playbook</h2>
            </div>
            <ul className="space-y-3">
              {PRACTICAL.map((line) => (
                <li key={line} className="flex gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-2xl border p-5 sm:p-6"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-gold) 30%, transparent)',
              background: 'color-mix(in srgb, var(--accent-gold) 6%, var(--surface-raised))'
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle size={18} style={{ color: 'var(--accent-gold)' }} />
              <h2 className="text-base font-black">What this is not</h2>
            </div>
            <ul className="space-y-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <li>Not a substitute for qualified electronic signatures where law requires a QTSA/QES.</li>
              <li>Not proof of who created a file — only that content matching the hash existed by a time bound.</li>
              <li>Not automatic court admission; custody, authenticity, and relevance remain human questions.</li>
              <li>Not legal advice from Satohash or Give A Bit.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="border-t px-4 py-12 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Shield size={28} className="mb-3" style={{ color: 'var(--accent-gold)' }} />
          <h2 className="text-xl font-black">Build the evidence package</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Stamp free, keep the .ots, and pair with chain-of-custody notes when it matters.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/stamp"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 py-3 text-xs font-black uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              Free stamp <ArrowRight size={14} />
            </Link>
            <Link
              to="/chain-of-custody"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              Chain of custody
            </Link>
            <Link
              to="/government"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <BookOpen size={14} /> Government hub
            </Link>
            <Link
              to="/security"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Security model
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

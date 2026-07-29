import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'

const ROWS = [
  {
    framework: 'ESIGN Act',
    region: 'United States',
    status: 'Hash evidence admissible',
    note: 'Electronic records with integrity proof'
  },
  {
    framework: 'UETA',
    region: 'US (47 states)',
    status: 'Compatible',
    note: 'Uniform electronic transactions'
  },
  {
    framework: 'eIDAS',
    region: 'European Union',
    status: 'Compatible',
    note: 'Qualified timestamps may need TSA; OTS is supporting evidence'
  },
  {
    framework: 'UK Evidence Act',
    region: 'United Kingdom',
    status: 'Evidentiary',
    note: 'Hash logs admissible with proper chain of custody'
  },
  {
    framework: 'ZertES',
    region: 'Switzerland',
    status: 'Compatible',
    note: 'Federal Act on Electronic Signatures'
  },
  {
    framework: 'Hague Apostille',
    region: 'Cross-border',
    status: 'Supporting',
    note: 'Companion hash for notarized documents'
  },
  {
    framework: 'GDPR',
    region: 'EU',
    status: 'By design',
    note: 'Zero document bytes stored on Satohash'
  }
]

export default function EvidenceAdmissibility() {
  usePageMeta({ page: 'evidenceAdmissibility' })
  const { t } = useTranslation()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
        <Link
          to="/government"
          className="text-sm font-bold"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('governmentPage.backGovernment')}
        </Link>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-black">{t('evidenceAdmissibilityPage.title')}</h1>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('evidenceAdmissibilityPage.subtitle')} — Educational reference only, not legal advice.
        </p>

        {/* Mobile: card layout */}
        <div className="mt-8 space-y-3 md:hidden">
          {ROWS.map((row) => (
            <div
              key={row.framework}
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
            >
              <p className="text-sm font-black">{row.framework}</p>
              <p className="mt-1 text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {row.region}
              </p>
              <p className="mt-2 text-xs font-bold" style={{ color: 'var(--accent-success)' }}>
                {row.status}
              </p>
              <p className="mt-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                {row.note}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div
          className="mt-8 hidden overflow-x-auto rounded-2xl border md:block"
          style={{ borderColor: 'var(--border)' }}
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ background: 'var(--surface-raised)' }}>
                {['Framework', 'Region', 'Status', 'Notes'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
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
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-4 py-3 font-bold">{row.framework}</td>
                  <td className="px-4 py-3">{row.region}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--accent-success)' }}>
                    {row.status}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  )
}

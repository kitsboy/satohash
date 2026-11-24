import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, X as XIcon, FileText, Download, ExternalLink } from 'lucide-react'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
import { getPublicBaseUrl } from '../config/constants'

const ROW_IDS = [
  'zeroKnowledge',
  'bitcoinAnchored',
  'freeBasic',
  'noAccount',
  'noGas',
  'uiNonDev',
  'nip05',
  'bolt12',
  'courtAdmissible',
  'survivesShutdown',
  'snapper',
  'apiWebhooks',
  'monthlyCost'
]

const COLUMN_KEYS = ['satohash', 'docuSign', 'diyOTS']

export default function Comparison() {
  usePageMeta({ page: 'comparison' })
  const { t } = useTranslation()

  const columns = useMemo(
    () =>
      COLUMN_KEYS.map((key) => ({
        key,
        label: t(`comparisonPage.columns.${key}`, { defaultValue: key }),
        color: key === 'satohash' ? 'var(--accent-gold)' : 'var(--text-secondary)'
      })),
    [t]
  )

  const rows = useMemo(
    () =>
      ROW_IDS.map((id) => {
        const row = t(`comparisonPage.rows.${id}`, { returnObjects: true })
        const resolve = (val) => {
          if (val === true || val === false) return val
          if (val === 'planned') {
            return t('comparisonPage.cellValues.planned', { defaultValue: 'Planned' })
          }
          return val
        }
        return {
          id,
          feature: row.label,
          satohash: resolve(row.satohash),
          docuSign: resolve(row.docuSign),
          diyOTS: resolve(row.diyOTS),
          planned: {
            satohash: row.satohash === 'planned',
            docuSign: row.docuSign === 'planned',
            diyOTS: row.diyOTS === 'planned'
          }
        }
      }),
    [t]
  )

  return (
    <div className="comparison-page min-h-screen bg-[var(--bg-primary)]">
      <style>{`
        @media print {
          .comparison-page header,
          .comparison-page footer,
          .comparison-page .print\\:hidden { display: none !important; }
          .comparison-table { font-size: 10px; }
          .comparison-table th,
          .comparison-table td { padding: 6px !important; }
        }
      `}</style>
      <section className="border-b border-[var(--border)] px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            {t('comparisonPage.hero.eyebrow')}
          </p>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            {t('comparisonPage.hero.title')}{' '}
            <span className="text-[var(--accent-gold)]">
              {t('comparisonPage.hero.titleHighlight')}
            </span>
          </h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('comparisonPage.hero.subtitle')}
          </p>
          <div className="-mx-3 overflow-hidden rounded-2xl border border-[var(--border)] sm:mx-0 print:block">
            <table className="comparison-table w-full table-fixed text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="w-[28%] bg-[var(--surface-raised)] px-2 py-2 text-[11px] leading-snug font-bold break-words text-[var(--text-primary)] md:w-1/3 md:p-4 md:text-sm">
                    {t('comparisonPage.hero.feature')}
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-0.5 py-2 text-center text-[clamp(8px,2.5vw,13px)] leading-tight font-bold break-normal md:p-4 md:text-sm"
                      style={{ color: col.color }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-[var(--border)] ${i % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)]'}`}
                  >
                    <td
                      className={`px-2 py-2 text-[11px] leading-snug font-bold break-words text-[var(--text-primary)] md:p-4 md:text-xs ${
                        i % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)]'
                      }`}
                    >
                      {row.feature}
                    </td>
                    {COLUMN_KEYS.map((key) => {
                      const val = row[key]
                      const planned = row.planned?.[key] === true
                      return (
                        <td
                          key={key}
                          className="px-0.5 py-2 text-center text-[11px] leading-tight break-normal md:p-4 md:text-xs"
                        >
                          {val === true ? (
                            <Check size={16} className="mx-auto text-[var(--accent-success)]" />
                          ) : val === false ? (
                            <XIcon size={16} className="mx-auto text-[var(--text-tertiary)]" />
                          ) : (
                            <span
                              className="text-[var(--text-secondary)]"
                              data-testid={planned ? `compare-planned-${row.id}` : undefined}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 print:hidden">
        <div className="mx-auto max-w-xl text-center">
          <FileText size={24} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">
            {t('comparisonPage.download.title')}
          </h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            {t('comparisonPage.download.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`${getPublicBaseUrl()}/Satohash_Executive_Pitch.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90"
            >
              <Download size={16} /> {t('comparisonPage.download.downloadPdf')}
            </a>
            <Link
              to="/pitch"
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl border border-[var(--border)] px-8 text-sm font-bold tracking-wider text-[var(--text-secondary)] uppercase transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]"
            >
              {t('comparisonPage.download.viewOnline')} <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer compact />
    </div>
  )
}

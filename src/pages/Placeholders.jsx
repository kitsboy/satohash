import { ShieldCheck, FileText, ArrowRight, Plus } from 'lucide-react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import usePageMeta from '../hooks/usePageMeta'

/** Legacy export — /snapper routes to WebCapture; redirect any stale imports. */
export function Snapper() {
  return <Navigate to="/snapper" replace />
}

export function Certificates() {
  const { t } = useTranslation()
  usePageMeta({
    title: t('certificatesPage.metaTitle'),
    description: t('certificatesPage.metaDescription')
  })
  const navigate = useNavigate()

  const templates = [
    {
      name: t('certificatesPage.copName'),
      id: 'COP_V4',
      desc: t('certificatesPage.copDesc'),
      recommended: true,
      action: () => navigate('/stamp'),
      actionLabel: t('certificatesPage.copCta')
    },
    {
      name: t('certificatesPage.evrName'),
      id: 'EVR_V1',
      desc: t('certificatesPage.evrDesc'),
      action: () => navigate('/vault'),
      actionLabel: t('certificatesPage.evrCta')
    },
    {
      name: t('certificatesPage.casName'),
      id: 'CAS_V2',
      desc: t('certificatesPage.casDesc'),
      action: () => navigate('/contracts'),
      actionLabel: t('certificatesPage.casCta')
    }
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[var(--accent-active)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">
              {t('certificatesPage.title')}
            </h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">{t('certificatesPage.lede')}</p>
          <p className="max-w-xl text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            {t('certificatesPage.honesty')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/stamp')}
          className="flex items-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 py-3 text-xs font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]"
        >
          <Plus size={14} /> {t('certificatesPage.newStamp')}
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="group flex flex-col space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 transition-all hover:border-[var(--border-bright)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                <FileText size={24} />
              </div>
              {tpl.recommended && (
                <span className="rounded-full bg-[var(--accent-active)]/10 px-3 py-1 text-[9px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                  {t('certificatesPage.standard')}
                </span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold tracking-tight">{tpl.name}</h4>
              </div>
              <p className="font-mono text-[11px] text-[var(--text-secondary)] opacity-50">
                {tpl.id}
              </p>
              <p className="text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
                {tpl.desc}
              </p>
            </div>
            <button
              type="button"
              onClick={tpl.action}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all group-hover:border-[var(--border-bright)] hover:border-[var(--accent-active)] hover:text-[var(--accent-active)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {tpl.actionLabel}
              <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

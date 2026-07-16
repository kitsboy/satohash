import { Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isStaticOnlyMode } from '../utils/staticMode'

/** Shown on stamp/verify/vault when production build has no VITE_API_URL. */
export default function StaticModeBanner({ compact = false }) {
  const { t } = useTranslation()
  if (!isStaticOnlyMode()) return null

  if (compact) {
    return (
      <p
        className="rounded-xl border px-4 py-3 text-[11px] leading-relaxed"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent-gold) 25%, transparent)',
          background: 'color-mix(in srgb, var(--accent-gold) 6%, transparent)',
          color: 'var(--text-secondary)'
        }}
        role="status"
      >
        <strong style={{ color: 'var(--accent-gold)' }}>{t('staticMode.title')}.</strong>{' '}
        {t('staticMode.body')}
      </p>
    )
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent-gold) 30%, transparent)',
        background: 'color-mix(in srgb, var(--accent-gold) 8%, transparent)'
      }}
      role="status"
    >
      <div className="flex gap-3">
        <Info size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--accent-gold)' }} />
        <div>
          <p
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            {t('staticMode.title')}
          </p>
          <p
            className="mt-1 text-[11px] leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('staticMode.body')}
          </p>
        </div>
      </div>
      <Link
        to="/trust"
        className="shrink-0 text-[10px] font-black tracking-widest uppercase underline"
        style={{ color: 'var(--accent-active)' }}
      >
        {t('staticMode.trustLink')}
      </Link>
    </div>
  )
}

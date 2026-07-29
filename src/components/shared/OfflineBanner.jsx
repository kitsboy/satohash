import { useTranslation } from 'react-i18next'

export default function OfflineBanner() {
  const { t } = useTranslation()

  return (
    <div
      className="fixed top-0 right-0 left-0 z-[200] flex items-center justify-center gap-2 py-2 text-xs font-black tracking-widest uppercase"
      style={{ background: 'var(--accent-pending)', color: '#141b25' }}
      role="status"
      aria-live="polite"
    >
      ⚡ {t('appPage.offlineBanner')}
    </div>
  )
}

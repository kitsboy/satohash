import { useTranslation } from 'react-i18next'

export default function OfflineBanner({ queueCount = 0 }) {
  const { t } = useTranslation()
  const msg =
    queueCount > 0
      ? t('appPage.offlineBannerQueued', { count: queueCount })
      : t('appPage.offlineBanner')

  return (
    <div
      className="fixed top-0 right-0 left-0 z-[200] flex items-center justify-center gap-2 py-2 text-xs font-black tracking-widest uppercase"
      style={{ background: 'var(--accent-pending)', color: '#141b25' }}
      role="status"
      aria-live="polite"
    >
      ⚡ {msg}
    </div>
  )
}

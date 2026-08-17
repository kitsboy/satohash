import { useTranslation } from 'react-i18next'

export default function SkipToContent() {
  const { t } = useTranslation()

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        {t('appPage.skipToContent')}
      </a>
      <a href="#stamp-cta" className="skip-to-content">
        Skip to stamp
      </a>
    </>
  )
}

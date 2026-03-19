import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import Button from './Button'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
]

export default function LanguagePicker({ isOpen, onClose }) {
  const { i18n } = useTranslation()

  const handleLanguageSelect = (languageCode) => {
    i18n.changeLanguage(languageCode)
    localStorage.setItem('satohash_language', languageCode)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={i18n.t('welcome.language')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            variant={i18n.language === lang.code ? 'primary' : 'secondary'}
            onClick={() => handleLanguageSelect(lang.code)}
            style={{ justifyContent: 'flex-start', fontSize: 'var(--text-lg)' }}
          >
            <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
            {lang.name}
          </Button>
        ))}
      </div>
    </Modal>
  )
}

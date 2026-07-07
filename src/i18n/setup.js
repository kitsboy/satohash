import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './translations/en.json'
import es from './translations/es.json'
import fr from './translations/fr.json'
import de from './translations/de.json'
import pt from './translations/pt.json'
import sw from './translations/sw.json'
import zh from './translations/zh.json'
import { getInitialLang, LANG_CODES, STORAGE_KEY } from './language.js'

const initialLang = getInitialLang()

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    pt: { translation: pt },
    sw: { translation: sw },
    zh: { translation: zh }
  },
  lng: initialLang,
  fallbackLng: 'en',
  supportedLngs: LANG_CODES,
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  interpolation: { escapeValue: false }
})

i18n.on('languageChanged', (lng) => {
  const code = lng?.split('-')[0]?.toLowerCase() || 'en'
  localStorage.setItem(STORAGE_KEY, code)
})

export default i18n

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './translations/en.json'
import es from './translations/es.json'
import fr from './translations/fr.json'
import de from './translations/de.json'
import pt from './translations/pt.json'
import sw from './translations/sw.json'
import zh from './translations/zh.json'

const STORAGE_KEY = 'satohash_lang'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      pt: { translation: pt },
      sw: { translation: sw },
      zh: { translation: zh }
    },
    fallbackLng: 'en',
    lng: localStorage.getItem(STORAGE_KEY) || 'en',
    supportedLngs: ['en', 'es', 'fr', 'de', 'pt', 'sw', 'zh'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage']
    }
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
})

export default i18n

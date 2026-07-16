import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getInitialLang, LANG_CODES, STORAGE_KEY } from './language.js'
import { loadLocaleBundle } from './loadLocale.js'

const initialLang = getInitialLang()

const enBundle = await loadLocaleBundle('en')

i18n.use(initReactI18next).init({
  resources: { en: { translation: enBundle } },
  lng: initialLang,
  fallbackLng: 'en',
  supportedLngs: LANG_CODES,
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  returnObjects: true
})

async function ensureLocaleLoaded(code) {
  if (code === 'en' || i18n.hasResourceBundle(code, 'translation')) return
  const bundle = await loadLocaleBundle(code)
  i18n.addResourceBundle(code, 'translation', bundle, true, true)
}

if (initialLang !== 'en') {
  ensureLocaleLoaded(initialLang)
}

i18n.on('languageChanged', (lng) => {
  const code = lng?.split('-')[0]?.toLowerCase() || 'en'
  localStorage.setItem(STORAGE_KEY, code)
  ensureLocaleLoaded(code)
})

export default i18n

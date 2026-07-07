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
import { buildTranslationBundle, marketingByLang } from './marketing/index.js'

const initialLang = getInitialLang()

const bundles = {
  en: buildTranslationBundle(en, marketingByLang.en.landing, marketingByLang.en.faq),
  es: buildTranslationBundle(es, marketingByLang.es.landing, marketingByLang.es.faq),
  fr: buildTranslationBundle(fr, marketingByLang.fr.landing, marketingByLang.fr.faq),
  de: buildTranslationBundle(de, marketingByLang.de.landing, marketingByLang.de.faq),
  pt: buildTranslationBundle(pt, marketingByLang.pt.landing, marketingByLang.pt.faq),
  sw: buildTranslationBundle(sw, marketingByLang.sw.landing, marketingByLang.sw.faq),
  zh: buildTranslationBundle(zh, marketingByLang.zh.landing, marketingByLang.zh.faq)
}

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(LANG_CODES.map((code) => [code, { translation: bundles[code] }])),
  lng: initialLang,
  fallbackLng: 'en',
  supportedLngs: LANG_CODES,
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  returnObjects: true
})

i18n.on('languageChanged', (lng) => {
  const code = lng?.split('-')[0]?.toLowerCase() || 'en'
  localStorage.setItem(STORAGE_KEY, code)
})

export default i18n

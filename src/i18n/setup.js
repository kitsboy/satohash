import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getInitialLang, LANG_CODES, STORAGE_KEY, normalizeLang } from './language.js'
import { loadLocaleBundle } from './loadLocale.js'

const initialLang = getInitialLang()

const enBundle = await loadLocaleBundle('en')

i18n.use(initReactI18next).init({
  resources: { en: { translation: enBundle } },
  // Always register EN first; hydrate preferred locale after bundle load (below)
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: LANG_CODES,
  nonExplicitSupportedLngs: true,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  returnObjects: true,
  react: { useSuspense: false }
})

/** Load locale JSON before switching so UI never flashes missing keys. */
export async function ensureLocaleLoaded(code) {
  const c = normalizeLang(code)
  if (c === 'en') return
  if (i18n.hasResourceBundle(c, 'translation')) return
  const bundle = await loadLocaleBundle(c)
  i18n.addResourceBundle(c, 'translation', bundle, true, true)
}

/** Preferred path for language switches (LanguageSwitcher, ?lang=). */
export async function switchAppLanguage(code) {
  const c = normalizeLang(code)
  await ensureLocaleLoaded(c)
  localStorage.setItem(STORAGE_KEY, c)
  if (normalizeLang(i18n.language) !== c) {
    await i18n.changeLanguage(c)
  }
  return c
}

// Hydrate non-English boot language after en is ready
if (initialLang !== 'en') {
  await switchAppLanguage(initialLang)
}

i18n.on('languageChanged', (lng) => {
  const code = normalizeLang(lng)
  localStorage.setItem(STORAGE_KEY, code)
  // Safety net if something calls changeLanguage without ensureLocaleLoaded
  ensureLocaleLoaded(code)
})

export default i18n

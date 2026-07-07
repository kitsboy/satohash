/** Single source of truth for supported UI languages. */
export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr', native: 'English' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr', native: 'Spanish' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr', native: 'French' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', dir: 'ltr', native: 'German' },
  { code: 'pt', label: 'Português', flag: '🇵🇹', dir: 'ltr', native: 'Portuguese' },
  { code: 'sw', label: 'Kiswahili', flag: '🇰🇪', dir: 'ltr', native: 'Swahili' },
  { code: 'zh', label: '中文', flag: '🇨🇳', dir: 'ltr', native: 'Chinese' }
]

export const LANG_CODES = LANGUAGES.map((l) => l.code)
export const STORAGE_KEY = 'satohash_lang'

/** Map browser/legacy codes to a supported locale (defaults to en). */
export function normalizeLang(code) {
  if (!code) return 'en'
  const base = String(code).split('-')[0].toLowerCase()
  return LANG_CODES.includes(base) ? base : 'en'
}

/** Priority: ?lang= URL param → localStorage → browser language. */
export function getInitialLang() {
  if (typeof window === 'undefined') return 'en'
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl) return normalizeLang(fromUrl)
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return normalizeLang(stored)
  return normalizeLang(navigator.language)
}

/** Keep ?lang= in sync for SEO hreflang without full reload. */
export function syncLangToUrl(code) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (code === 'en') {
    url.searchParams.delete('lang')
  } else {
    url.searchParams.set('lang', code)
  }
  window.history.replaceState({}, '', url)
}

export function getLanguageMeta(code) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0]
}

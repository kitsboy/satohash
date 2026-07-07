import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { normalizeLang } from '../i18n/language'

/** Apply ?lang= from the URL when navigating between pages. */
export default function LangUrlSync() {
  const location = useLocation()
  const { lang, setLang } = useI18n()

  useEffect(() => {
    const fromUrl = new URLSearchParams(location.search).get('lang')
    if (!fromUrl) return
    const code = normalizeLang(fromUrl)
    if (code !== lang) setLang(code)
  }, [location.search, lang, setLang])

  return null
}

import { useEffect } from 'react'
import { useI18n } from '../i18n'
import { getPageMeta, getOgLocale, HREFLANG, SUPPORTED_LOCALES } from '../seo/pageMeta'

export default function usePageMeta({ page, title, description, image, url }) {
  const { lang } = useI18n()
  const localized = page ? getPageMeta(page, lang) : null
  const resolvedTitle = title || localized?.title
  const resolvedDescription = description || localized?.description

  useEffect(() => {
    const siteName = 'Satohash'
    const fullTitle = resolvedTitle
      ? `${resolvedTitle} | ${siteName}`
      : `${siteName} — Bitcoin Document Notarization`
    const desc =
      resolvedDescription ||
      'Stamp any document on the Bitcoin blockchain. Free, private, court-admissible proof of existence using OpenTimestamps.'
    const ogImage = image || 'https://satohash.io/og-image.svg'
    const pageUrl = url || window.location.href

    document.title = fullTitle
    document.documentElement.lang = HREFLANG[lang] || 'en'

    const setMeta = (selector, attr, attrVal, content) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, attrVal)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const setLink = (rel, href, hreflang) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', rel)
        if (hreflang) el.setAttribute('hreflang', hreflang)
        document.head.appendChild(el)
      }
      el.setAttribute('href', href)
    }

    setMeta('meta[name="description"]', 'name', 'description', desc)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl)
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', siteName)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', getOgLocale(lang))
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:site"]', 'name', 'twitter:site', '@give_bit')
    setMeta('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@give_bit')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)

    // hreflang alternates for multilingual SEO
    const base = 'https://satohash.io'
    const path = window.location.pathname
    setLink('canonical', `${base}${path}`)
    SUPPORTED_LOCALES.forEach((code) => {
      setLink('alternate', `${base}${path}?lang=${code}`, HREFLANG[code])
    })
    setLink('alternate', `${base}${path}`, 'x-default')
  }, [resolvedTitle, resolvedDescription, image, url, lang, page])
}

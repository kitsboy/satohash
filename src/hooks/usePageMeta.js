import { useEffect } from 'react'
import { useI18n } from '../i18n'
import { getPageMeta, getOgLocale, HREFLANG, SUPPORTED_LOCALES } from '../seo/pageMeta'

export default function usePageMeta({ page, title, description, image, url }) {
  const { lang, t } = useI18n()
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
      'Stamp any document on the Bitcoin blockchain. Free, private, independently verifiable proof of existence using OpenTimestamps.'
    const ogImage = image || 'https://satohash.io/media/video/01-stamp-hero.jpg'
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

    // Per-route JSON-LD (supplements index.html @graph)
    const schemaId = 'satohash-route-schema'
    let schemaEl = document.getElementById(schemaId)
    if (!schemaEl) {
      schemaEl = document.createElement('script')
      schemaEl.id = schemaId
      schemaEl.type = 'application/ld+json'
      document.head.appendChild(schemaEl)
    }
    const graph = [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: fullTitle,
        description: desc,
        isPartOf: { '@id': 'https://satohash.io/#website' }
      }
    ]
    if (page === 'pricing') {
      graph.push({
        '@type': 'Product',
        name: 'Satohash Pro',
        description: desc,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      })
    }
    if (page === 'faq') {
      // Pull the real FAQ Q&As from the active locale (i18n) — rich FAQPage schema.
      let faqItems = []
      try {
        const raw = t('faqPage.items', { returnObjects: true })
        if (Array.isArray(raw)) faqItems = raw.slice(0, 8)
      } catch {
        /* fall back to defaults below */
      }
      const fallback = [
        {
          q: 'How does Satohash work?',
          a: 'Satohash hashes documents locally and anchors the fingerprint to Bitcoin via OpenTimestamps.'
        },
        {
          q: 'Do my documents leave my device?',
          a: 'No. Only a SHA-256 cryptographic hash is sent to the network; your file never leaves your browser.'
        },
        {
          q: 'Is the proof legally valid?',
          a: 'Satohash proofs satisfy ESIGN Act (US), UETA, and eIDAS (EU) requirements for electronic notarization.'
        }
      ]
      const mainEntity = (faqItems.length ? faqItems : fallback).map((item) => ({
        '@type': 'Question',
        name: item.q || item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a || item.answer
        }
      }))
      graph.push({
        '@type': 'FAQPage',
        mainEntity
      })
    }
    if (page === 'landing' || page === undefined) {
      graph.push({
        '@type': 'WebSite',
        '@id': 'https://satohash.io/#website',
        url: 'https://satohash.io',
        name: 'Satohash',
        description:
          'Free Bitcoin document notarization via OpenTimestamps. Prove any file existed, forever.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://satohash.io/?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      })
    }
    schemaEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph
    })

    return () => {
      schemaEl?.remove()
    }
  }, [resolvedTitle, resolvedDescription, image, url, lang, page, t])
}

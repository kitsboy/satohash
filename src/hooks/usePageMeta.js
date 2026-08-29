import { useEffect } from 'react'
import { useI18n } from '../i18n'
import {
  getPageMeta,
  getOgLocale,
  HREFLANG,
  SUPPORTED_LOCALES,
  ogImageForPage,
  WATCH_PLAYER_URL,
  WATCH_VIDEO_URL
} from '../seo/pageMeta'

export default function usePageMeta({ page, title, description, image, url }) {
  const { lang, t } = useI18n()
  const localized = page ? getPageMeta(page, lang) : null
  const resolvedTitle = title || localized?.title
  const resolvedDescription = description || localized?.description

  useEffect(() => {
    const siteName = 'Satohash'
    const fullTitle = resolvedTitle
      ? /satohash/i.test(resolvedTitle)
        ? resolvedTitle
        : `${resolvedTitle} | ${siteName}`
      : `${siteName} — Bitcoin Document Notarization`
    const desc =
      resolvedDescription ||
      'Stamp any document on the Bitcoin blockchain. Free, private, independently verifiable proof of existence using OpenTimestamps.'
    const path = window.location.pathname
    const ogImage = image || ogImageForPage(page, path)
    const pageUrl = url || window.location.href
    const imageType = ogImage.endsWith('.png') ? 'image/png' : 'image/jpeg'
    const isWatch = page === 'watch' || path === '/watch' || path === '/watch/'

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
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200')
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630')
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', desc.slice(0, 120))
    setMeta('meta[property="og:image:type"]', 'property', 'og:image:type', imageType)
    setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl)
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', siteName)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', getOgLocale(lang))
    // Twitter/X — @give_bit canonical. Player card on /watch; large image everywhere else.
    setMeta(
      'meta[name="twitter:card"]',
      'name',
      'twitter:card',
      isWatch ? 'player' : 'summary_large_image'
    )
    setMeta('meta[name="twitter:site"]', 'name', 'twitter:site', '@give_bit')
    setMeta('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@give_bit')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', desc.slice(0, 120))
    if (isWatch) {
      setMeta('meta[name="twitter:player"]', 'name', 'twitter:player', WATCH_PLAYER_URL)
      setMeta('meta[name="twitter:player:width"]', 'name', 'twitter:player:width', '1280')
      setMeta('meta[name="twitter:player:height"]', 'name', 'twitter:player:height', '720')
      setMeta('meta[name="twitter:player:stream"]', 'name', 'twitter:player:stream', WATCH_VIDEO_URL)
      setMeta(
        'meta[name="twitter:player:stream:content_type"]',
        'name',
        'twitter:player:stream:content_type',
        'video/mp4'
      )
      setMeta('meta[property="og:video"]', 'property', 'og:video', WATCH_VIDEO_URL)
      setMeta('meta[property="og:video:type"]', 'property', 'og:video:type', 'video/mp4')
      setMeta('meta[property="og:video:width"]', 'property', 'og:video:width', '1920')
      setMeta('meta[property="og:video:height"]', 'property', 'og:video:height', '1080')
    }
    // Generic share fallback for messengers (WhatsApp/Telegram/Signal/Nostr read OG)
    setMeta(
      'meta[property="og:image:secure_url"]',
      'property',
      'og:image:secure_url',
      ogImage.replace('http://', 'https://')
    )

    // hreflang alternates for multilingual SEO
    const base = 'https://satohash.io'
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
    const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://satohash.io/' }]
    if (path.startsWith('/docs')) {
      crumbs.push({
        '@type': 'ListItem',
        position: 2,
        name: 'Docs',
        item: 'https://satohash.io/docs'
      })
      if (path !== '/docs' && path !== '/docs/') {
        crumbs.push({
          '@type': 'ListItem',
          position: 3,
          name: resolvedTitle || 'Article',
          item: `https://satohash.io${path}`
        })
      }
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
    if (crumbs.length > 1) {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: crumbs
      })
    }
    if (isWatch) {
      graph.push({
        '@type': 'VideoObject',
        name: 'Satohash explainer',
        description: desc,
        thumbnailUrl: ogImage,
        contentUrl: WATCH_VIDEO_URL,
        embedUrl: WATCH_PLAYER_URL,
        uploadDate: '2026-08-19',
        duration: 'PT84S',
        publisher: {
          '@type': 'Organization',
          name: 'Satohash',
          url: 'https://satohash.io',
          logo: { '@type': 'ImageObject', url: 'https://satohash.io/logo.png' }
        }
      })
    }
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
          q: 'Is the proof legally relevant?',
          a: 'Satohash proofs are independently verifiable evidence of existence-at-a-time. They may support evidence-based reliance in legal settings (ESIGN, UETA, eIDAS); admissibility and weight are decided in context.'
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

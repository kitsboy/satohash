import { useEffect } from 'react'

export default function usePageMeta({ title, description, image, url }) {
  useEffect(() => {
    const siteName = 'Satohash'
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Bitcoin Document Notarization`
    const desc = description || 'Stamp any document on the Bitcoin blockchain. Free, private, court-admissible proof of existence using OpenTimestamps.'
    const ogImage = image || 'https://satohash.io/og-image.svg'
    const pageUrl = url || window.location.href

    document.title = fullTitle

    const setMeta = (selector, attr, attrVal, content) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, attrVal)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // Basic
    setMeta('meta[name="description"]', 'name', 'description', desc)

    // Open Graph
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl)
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', siteName)
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website')

    // Twitter
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:site"]', 'name', 'twitter:site', '@give_bit')
    setMeta('meta[name="twitter:creator"]', 'name', 'twitter:creator', '@give_bit')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage)

  }, [title, description, image, url])
}

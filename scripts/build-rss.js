/**
 * RSS feed generator — Satohash
 * Builds public/feed.xml from the learn-articles + key docs so the site
 * exposes an RSS subscription channel (also usable as a podcast/blog feed).
 *
 * Run as part of `npm run build` (see package.json) or standalone:
 *   node scripts/build-rss.js
 *
 * Output: dist/feed.xml (and source public/feed.xml is the canonical static).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DOCS = join(ROOT, 'public', 'docs')
const OUT = join(ROOT, 'dist')

const SITE = 'https://satohash.io'
// Refreshed on-brand channel metadata — mirrors the pageMeta copy voice (proof of
// existence, mission-v3 "proof of truth, on Bitcoin" grounded to proof-of-existence,
// FOSS civic-tool framing). Honest posture: admissible-not-presumed-accurate.
const FEED_TITLE = 'Satohash — Free Bitcoin Proof of Existence'
const FEED_DESC =
  'Prove a file existed without revealing it. Bitcoin anchors the fingerprint; OpenTimestamps makes it free and verifiable by anyone, forever. Guides, learn articles, and updates from the Give A Bit family — an open civic tool for truth.'
const FEED_LANG = 'en'

/** Non-learn core docs that are feed-relevant. Titles/descriptions mirror the
 * refreshed pageMeta copy (English feed) so the feed stays consistent with the
 * 7-language SEO refresh. Slug → /docs/<slug>. */
const CORE_DOCS = {
  'how-satohash-works': {
    title: 'How Satohash Works — Free & Technical Deep-Dive',
    description:
      'Why it is free: a million fingerprints fold into one shared Bitcoin anchor. The plain-English answer plus the full OpenTimestamps technical deep-dive.'
  },
  'support-and-guidance': {
    title: 'Request Support & Guidance — Open Civic Tool',
    description:
      'An honest request to legal, technical, and funding communities: help us harden Satohash, a free, open, Bitcoin-anchored civic tool for truth.'
  },
  'executive-summary': {
    title: 'Executive Summary — Satohash, Proof of Truth',
    description:
      'Why Satohash exists: a free, sovereign, Bitcoin-anchored proof of existence via OpenTimestamps. Hash locally, stamp in minutes, verify forever.'
  },
  marketing: {
    title: 'Marketing — Positioning the Sovereign Truth Layer',
    description:
      'Satohash marketing: positioning, the three emotional beats, channels, and assets for a free, honest, Bitcoin-anchored civic tool.'
  }
}

/** Extract the first H1 (title) and a clean plain-text description from a markdown file. */
function extractMeta(md) {
  const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() || ''
  const firstPara = md
    .split('\n')
    .map((l) => l.trim())
    .find(
      (l) =>
        l &&
        !l.startsWith('#') &&
        !l.startsWith('>') &&
        !l.startsWith('---') &&
        !l.startsWith('<!--') &&
        // Skip metadata label lines (e.g. **Version:**, **Platform:**) so the
        // feed description is real prose, not a front-matter field.
        !/^\*\*[A-Za-z][A-Za-z -]+?:\*\*/.test(l)
    )
  // Strip markdown: bold/italic, inline links, backticks, headings
  const clean = (firstPara || '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
  const desc = clean.slice(0, 200)
  return { title, desc }
}

/** RFC 822 date (required by RSS). */
function rfc822(d) {
  const date = d ? new Date(d) : new Date()
  return date.toUTCString()
}

/** Escape XML special chars. */
function esc(s = '') {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildFeed() {
  const items = []
  const docs = readdirSync(SRC_DOCS)
    .filter(
      (f) =>
        (f.startsWith('learn-') || CORE_DOCS[f.replace(/\.md$/, '')]) && f.endsWith('.md')
    )
    .filter((f, i, arr) => arr.indexOf(f) === i)

  for (const f of docs) {
    const slug = f.replace('.md', '')
    const link = `${SITE}/docs/${slug}`
    const st = statSync(join(SRC_DOCS, f))
    let title
    let desc
    if (CORE_DOCS[slug]) {
      // Curated, on-brand copy that mirrors the refreshed pageMeta (English feed).
      ;({ title, description: desc } = CORE_DOCS[slug])
    } else {
      const md = readFileSync(join(SRC_DOCS, f), 'utf8')
      ;({ title, desc } = extractMeta(md))
    }
    items.push({
      title: title || slug,
      desc,
      link,
      guid: link,
      pubDate: rfc822(st.mtime)
    })
  }

  // Sort newest-first by pubDate
  items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

  const itemXml = items
    .map(
      (it) => `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(it.link)}</link>
      <guid isPermaLink="true">${esc(it.guid)}</guid>
      <description>${esc(it.desc)}</description>
      <pubDate>${it.pubDate}</pubDate>
      <source url="${SITE}/feed.xml">${esc(FEED_TITLE)}</source>
    </item>`
    )
    .join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(FEED_TITLE)}</title>
    <link>${SITE}</link>
    <description>${esc(FEED_DESC)}</description>
    <language>${FEED_LANG}</language>
    <lastBuildDate>${rfc822()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${itemXml}
  </channel>
</rss>
`

  // Write to dist (deployed)
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true })
  writeFileSync(join(OUT, 'feed.xml'), feed, 'utf8')

  // Also keep a canonical copy in public/ so the SPA can serve /feed.xml
  const publicOut = join(ROOT, 'public', 'feed.xml')
  writeFileSync(publicOut, feed, 'utf8')

  console.log(`RSS feed written: ${items.length} items → dist/feed.xml + public/feed.xml`)
}

buildFeed()

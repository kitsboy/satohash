#!/usr/bin/env node
/**
 * Live X/OG card validator.
 *
 * Fetches satohash.io as Twitterbot (crawler prerender) and asserts
 * twitter:card + JPEG og:image, or player tags on /watch.
 *
 * Usage: node scripts/cards-validate.mjs
 *        BASE=https://satohash.io node scripts/cards-validate.mjs
 */
const BASE = (process.env.BASE || 'https://satohash.io').replace(/\/$/, '')
const METRICS = process.env.METRICS_URL || 'https://api.satohash.io/metrics.json'
const UA = process.env.CARD_UA || 'Twitterbot/1.0'
const TIMEOUT_MS = Number(process.env.CARD_TIMEOUT_MS || 20000)
const LEARN = '/docs/learn-what-is-opentimestamps'

const failures = []
const rows = []

function attr(html, name, key = 'content') {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*${key}=["']([^"']+)["']`,
    'i'
  )
  const re2 = new RegExp(
    `<meta[^>]+${key}=["']([^"']+)["'][^>]*(?:name|property)=["']${name}["']`,
    'i'
  )
  const m = html.match(re) || html.match(re2)
  return m ? m[1].trim() : ''
}

function isJpeg(url) {
  return /\.jpe?g(\?|$)/i.test(url)
}

async function fetchText(url, { ua = UA } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': ua, Accept: 'text/html,application/json' },
      signal: ctrl.signal,
      redirect: 'follow'
    })
    const text = await res.text()
    return { ok: res.ok, status: res.status, text, url }
  } finally {
    clearTimeout(t)
  }
}

function fail(path, msg) {
  failures.push(`${path}: ${msg}`)
}

function checkPage(path, html, { player = false } = {}) {
  const card = attr(html, 'twitter:card')
  const ogImage = attr(html, 'og:image')
  const ogType = attr(html, 'og:image:type')
  const playerUrl = attr(html, 'twitter:player')
  const site = attr(html, 'twitter:site')
  const row = { path, card, ogImage, ogType, player: playerUrl, site }
  rows.push(row)

  if (!html || html.length < 200) {
    fail(path, 'empty or tiny HTML')
    return row
  }

  if (player) {
    if (card !== 'player') fail(path, `twitter:card=${card || '(missing)'} (want player)`)
    if (!/watch-player\.html/i.test(playerUrl)) {
      fail(path, `twitter:player=${playerUrl || '(missing)'} (want /watch-player.html)`)
    }
    if (ogImage && !isJpeg(ogImage) && !ogType.includes('jpeg')) {
      fail(path, `player poster og:image is not jpeg: ${ogImage}`)
    }
  } else {
    if (card !== 'summary_large_image' && card !== 'player') {
      fail(path, `twitter:card=${card || '(missing)'} (want summary_large_image or player)`)
    }
    if (card === 'player') {
      if (!/watch-player\.html/i.test(playerUrl)) {
        fail(path, `player card missing watch-player.html (${playerUrl || 'none'})`)
      }
    } else if (!ogImage) {
      fail(path, 'og:image missing')
    } else if (!isJpeg(ogImage) && !/image\/jpeg/i.test(ogType)) {
      fail(path, `og:image is not jpeg: ${ogImage}${ogType ? ` type=${ogType}` : ''}`)
    }
  }

  if (site && site !== '@give_bit') {
    fail(path, `twitter:site=${site} (want @give_bit)`)
  }
  return row
}

async function last10Hash() {
  try {
    const { ok, text } = await fetchText(METRICS, { ua: 'Satohash-cards-validate/1.0' })
    if (!ok) return null
    const data = JSON.parse(text)
    const rows10 = data?.raw?.last10
    if (!Array.isArray(rows10)) return null
    const hit = rows10.find((r) => r && /^[0-9a-f]{64}$/i.test(r.hash))
    return hit ? hit.hash : null
  } catch {
    return null
  }
}

async function main() {
  const paths = ['/', '/watch', '/stamp', LEARN, '/identity', '/status', '/counsel']
  const hash = await last10Hash()
  if (hash) paths.push(`/p/${hash}`)
  else rows.push({ path: '/p/<hash>', card: '(skipped — no last10 hash)', ogImage: '' })

  for (const path of paths) {
    const url = `${BASE}${path}`
    let html = ''
    try {
      const res = await fetchText(url)
      if (!res.ok) {
        fail(path, `HTTP ${res.status}`)
        rows.push({ path, card: '', ogImage: '', status: res.status })
        continue
      }
      html = res.text
    } catch (err) {
      fail(path, err.message || String(err))
      continue
    }
    const player = path === '/watch' || path === '/watch/'
    checkPage(path, html, { player })
  }

  console.log(
    JSON.stringify(
      {
        base: BASE,
        ua: UA,
        last10_hash: hash,
        pages: rows,
        failures
      },
      null,
      2
    )
  )

  if (failures.length) {
    console.error(`\nFAIL ${failures.length}`)
    for (const f of failures) console.error(`  - ${f}`)
    process.exit(1)
  }
  console.error(`\nOK ${rows.filter((r) => r.card && r.card !== '(skipped — no last10 hash)').length} pages`)
}

main().catch((err) => {
  console.error('cards-validate failed:', err.message)
  process.exit(1)
})

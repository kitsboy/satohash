#!/usr/bin/env node
/**
 * generate-og-images.js — render on-brand 1200x630 social-share (OG) images.
 *
 * Social scrapers (WhatsApp/Telegram/Signal/X/Nostr/LinkedIn) read og:image from
 * raw HTML. Each prerendered Satohash page points at a distinct on-brand image
 * here so every share shows a compelling per-page preview.
 *
 * Output: public/og/<slug>.png  (committed static assets, shipped via CF Pages)
 * Requires: Playwright Chromium (devDep; browser cached at ~/.cache/ms-playwright).
 *   Run:  node scripts/generate-og-images.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUT = path.join(ROOT, 'public', 'og')

const W = 1200
const H = 630

// Brand tokens (match _headers CSS / existing og-image.svg)
const GOLD = '#f0b429'
const GOLD2 = '#d97706'
const BG = '#0d1117'
const BG2 = '#141b25'
const INK = '#f8fafc'
const MUTED = '#94a3b8'

// Per-section image configs. title should stay ~<= 2 lines at 52px within 830px.
const SECTIONS = [
  {
    slug: 'home',
    kicker: 'Bitcoin Document Notarization',
    title: 'Prove any file existed. Forever.',
    tagline: 'Free \u00b7 Private \u00b7 Zero-knowledge \u00b7 OpenTimestamps',
  },
  {
    slug: 'faq',
    kicker: 'FAQ',
    title: 'Bitcoin document notarization \u2014 answered',
    tagline: 'Free stamps \u00b7 OpenTimestamps \u00b7 NIP-05 identity',
  },
  {
    slug: 'stamp',
    kicker: 'Stamp',
    title: 'Stamp a document on Bitcoin \u2014 free',
    tagline: 'SHA-256 in your browser \u00b7 anchored in ~60 minutes',
  },
  {
    slug: 'pricing',
    kicker: 'Pricing',
    title: 'Free forever. Optional premium tiers.',
    tagline: 'Free trust anchor \u00b7 Pro ~2,100 sats/mo \u00b7 Business ~21,000 sats/mo',
  },
  {
    slug: 'templates',
    kicker: 'Templates',
    title: 'Free legal & business templates',
    tagline: 'Stampable on Bitcoin in one click',
  },
  {
    slug: 'verify',
    kicker: 'Verify',
    title: 'Verify any .ots proof or hash',
    tagline: 'Confirmed \u00b7 pending \u00b7 invalid \u2014 plain language',
  },
  {
    slug: 'donate',
    kicker: 'Support',
    title: 'Support free Bitcoin stamping',
    tagline: 'Lightning & on-chain \u00b7 tips keep stamps free',
  },
  {
    slug: 'network',
    kicker: 'Network',
    title: 'Live Bitcoin node & OTS calendars',
    tagline: 'Own Core node \u00b7 Alice/Bob/Finney \u00b7 Nostr',
  },
  {
    slug: 'watch',
    kicker: 'Explainer',
    title: 'Watch: how Satohash proves a file existed',
    tagline: '~84 second explainer \u2014 Bitcoin-anchored proof of existence',
  },
  {
    slug: 'pitch',
    kicker: 'Pitch',
    title: 'An open civic notary for the truth era',
    tagline: 'Sovereign, verifiable, Bitcoin-anchored proof of existence',
  },
  {
    slug: 'how-satohash-works',
    kicker: 'Docs',
    title: 'How Satohash works \u2014 for free',
    tagline: 'One Merkle root anchors a million fingerprints',
  },
  {
    slug: 'support-and-guidance',
    kicker: 'Docs',
    title: 'A request for guidance & support',
    tagline: 'Open civic tool for truth \u2014 hardened by the community',
  },
]

function badge() {
  return `
  <div style="position:absolute;left:64px;top:50%;transform:translateY(-50%);width:180px;height:180px;border-radius:50%;background:rgba(240,180,41,0.12);border:3px solid transparent;border-image:linear-gradient(135deg,${GOLD},${GOLD2}) 1;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:96px;font-weight:900;background:linear-gradient(135deg,${GOLD},${GOLD2});-webkit-background-clip:text;background-clip:text;color:transparent;">\u20bf</span>
  </div>`
}

function frame({ kicker, title, tagline }) {
  return `<!doctype html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;width:${W}px;height:${H}px;background:linear-gradient(135deg,${BG} 0%,${BG2} 100%);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="position:absolute;inset:32px;border:2px solid rgba(240,180,41,0.25);border-radius:24px;"></div>
  ${badge()}
  <div style="position:absolute;left:300px;right:56px;top:50%;transform:translateY(-50%);">
    <div style="text-transform:uppercase;letter-spacing:3px;font-size:22px;font-weight:700;color:${GOLD};margin-bottom:18px;">${kicker}</div>
    <div style="font-size:54px;font-weight:900;line-height:1.08;color:${INK};letter-spacing:-1px;">${title}</div>
    <div style="margin-top:22px;font-size:26px;font-weight:500;color:${MUTED};">${tagline}</div>
  </div>
  <div style="position:absolute;left:64px;bottom:36px;font-size:20px;font-weight:800;color:${GOLD};">satohash.io</div>
</body></html>`
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })

  // Also auto-add per-learn-article images (title from each learn-*.md H1)
  const docsDir = path.join(ROOT, 'public', 'docs')
  const learnFiles = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((f) => f.startsWith('learn-') && f.endsWith('.md'))
    : []
  for (const f of learnFiles) {
    // learn-*.md stem already starts with 'learn-' — use it verbatim as the og slug
    const slug = f.replace('.md', '')
    const md = fs.readFileSync(path.join(docsDir, f), 'utf8')
    const m = md.match(/^#\s+(.+)$/m)
    const title = m ? m[1].trim() : slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    SECTIONS.push({
      slug,
      kicker: 'Learn',
      title: title.length > 64 ? title.slice(0, 61).trimEnd() + '\u2026' : title,
      tagline: 'Free Bitcoin document stamping \u00b7 OpenTimestamps',
    })
  }

  for (const s of SECTIONS) {
    await page.setContent(frame(s), { waitUntil: 'load' })
    // Give WebKit/Blink a beat to paint text before capture
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 50))))
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } })
    const p = path.join(OUT, `${s.slug}.png`)
    fs.writeFileSync(p, buf)
    console.log(`  \u2713 public/og/${s.slug}.png (${(buf.length / 1024).toFixed(0)}KB)`)
  }

  await browser.close()
  console.log(`OG images complete \u2192 ${path.relative(ROOT, OUT)}/ (${SECTIONS.length} images)`)
}

main().catch((e) => {
  console.error('generate-og-images failed:', e)
  process.exit(1)
})

#!/usr/bin/env node
/**
 * SEO prerender — generates static HTML for critical pages so Googlebot & AI
 * crawlers see full content in the raw HTML (no JS execution needed).
 *
 * Outputs (into dist/):
 *   - /prerender/landing.html          → full landing content
 *   - /prerender/faq.html              → FAQ Q&A content
 *   - /prerender/docs/learn-*.html     → each learn article, rendered from markdown
 *
 * The _redirects / _headers rules serve these to crawlers while humans keep the SPA.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const OUT = path.join(DIST, 'prerender')

const SITE = 'https://satohash.io'
const LANG = 'en'

// ---- tiny markdown → HTML (headings, paragraphs, lists, bold, links, code) ----
function mdToHtml(md) {
  const lines = md.split('\n')
  let html = ''
  let inList = false
  let inCode = false
  const closeList = () => { if (inList) { html += '</ul>\n'; inList = false } }
  const closeCode = () => { if (inCode) { html += '</code></pre>\n'; inCode = false } }

  for (let raw of lines) {
    const line = raw.trimEnd()
    // fenced code
    if (line.startsWith('```')) {
      if (!inCode) { closeList(); html += '<pre><code>'; inCode = true }
      else { html += '</code></pre>\n'; inCode = false }
      continue
    }
    if (inCode) { html += line.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '\n'; continue }
    if (line.startsWith('#')) {
      closeList()
      const m = line.match(/^(#{1,3})\s+(.*)$/)
      if (m) {
        const lvl = m[1].length
        html += `<h${lvl}>${inline(m[2])}</h${lvl}>\n`
      }
      continue
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { html += '<ul>\n'; inList = true }
      html += `<li>${inline(line.slice(2))}</li>\n`
      continue
    }
    if (/^\d+\. /.test(line)) {
      closeList()
      html += `<p>${inline(line)}</p>\n`
      continue
    }
    if (line.startsWith('|')) continue // skip tables (rare in these docs)
    if (line.trim() === '') { closeList(); continue }
    if (line.startsWith('---')) { closeList(); continue }
    html += `<p>${inline(line)}</p>\n`
  }
  closeList()
  closeCode()
  return html
}

function inline(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

const WATCH_VIDEO =
  'https://videos.giveabit.io/media/video/satohash-explainer-wise-70.mp4?v=kimi-wise-70-20261013'
const WATCH_PLAYER = `${SITE}/watch-player.html`

function shell({
  title,
  description,
  contentHtml,
  canonical,
  article = null,
  ogImage = `${SITE}/og/home.jpg?v=file-stays-20261124`,
  ogImageAlt = null,
  player = false,
  extraGraph = []
}) {
  const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  const ogAlt = ogImageAlt || description.slice(0, 120)
  const eTitle = esc(title)
  const eDesc = esc(description)
  const eAlt = esc(ogAlt)
  const ogType = /\.jpe?g(?:\?|$)/i.test(ogImage) ? 'image/jpeg' : 'image/png'
  const graph = []
  if (article) {
    const crumbs = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Docs', item: `${SITE}/docs` },
      { '@type': 'ListItem', position: 3, name: article.headline, item: canonical }
    ]
    graph.push({
      '@type': 'Article',
      headline: article.headline,
      description: article.description,
      datePublished: article.datePublished,
      dateModified: article.datePublished,
      author: { '@type': 'Organization', name: 'Satohash', url: SITE },
      publisher: { '@type': 'Organization', name: 'Satohash', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` } },
      mainEntityOfPage: canonical
    })
    graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs })
  }
  for (const node of extraGraph) graph.push(node)
  const schema = graph.length
    ? `<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
</script>`
    : ''
  const playerTags = player
    ? `<meta name="twitter:card" content="player" />
<meta name="twitter:player" content="${WATCH_PLAYER}" />
<meta name="twitter:player:width" content="1280" />
<meta name="twitter:player:height" content="720" />
<meta name="twitter:player:stream" content="${WATCH_VIDEO}" />
<meta name="twitter:player:stream:content_type" content="video/mp4" />
<meta property="og:video" content="${WATCH_VIDEO}" />
<meta property="og:video:type" content="video/mp4" />
<meta property="og:video:width" content="1920" />
<meta property="og:video:height" content="1080" />`
    : `<meta name="twitter:card" content="summary_large_image" />`
  return `<!doctype html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${eTitle}</title>
<meta name="description" content="${eDesc}" />
<link rel="canonical" href="${canonical}" />
<link rel="alternate" hreflang="en" href="${canonical}" />
<link rel="alternate" hreflang="x-default" href="${canonical}" />
<!-- Open Graph — read by WhatsApp, Telegram, Signal, LinkedIn, Facebook, Slack -->
<meta property="og:type" content="${article ? 'article' : 'website'}" />
<meta property="og:title" content="${eTitle}" />
<meta property="og:description" content="${eDesc}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:site_name" content="Satohash" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="${ogType}" />
<meta property="og:image:alt" content="${eAlt}" />
<meta property="og:image:secure_url" content="${ogImage}" />
<!-- Twitter / X Card -->
${playerTags}
<meta name="twitter:site" content="@give_bit" />
<meta name="twitter:creator" content="@give_bit" />
<meta name="twitter:title" content="${eTitle}" />
<meta name="twitter:description" content="${eDesc}" />
<meta name="twitter:image" content="${ogImage}" />
<meta name="twitter:image:alt" content="${eAlt}" />
${schema}
<style>
body{font-family:system-ui,-apple-system,sans-serif;max-width:720px;margin:0 auto;padding:24px;line-height:1.65;color:#e8e6e3;background:#0d1117}
h1{font-size:2rem;border-bottom:1px solid #333;padding-bottom:8px}
h2{font-size:1.4rem;margin-top:2rem;color:#f0b90b}
h3{font-size:1.15rem}
a{color:#f0b90b}
code{background:#1a2332;padding:2px 6px;border-radius:4px}
pre{background:#1a2332;padding:12px;border-radius:8px;overflow-x:auto}
table{border-collapse:collapse;width:100%}
td,th{border:1px solid #333;padding:8px}
.meta{color:#888;font-size:.85rem;margin-bottom:2rem}
</style>
</head>
<body>
<main>
${contentHtml}
</main>
<footer style="margin-top:3rem;padding-top:1rem;border-top:1px solid #333;color:#888;font-size:.85rem">
<p><a href="${SITE}">Satohash</a> — the file stays on your device. Only a fingerprint is stamped. Free.</p>
</footer>
</body>
</html>`
}

function write(name, html) {
  const p = path.join(OUT, name)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, html)
  console.log(`  ✓ ${path.relative(DIST, p)} (${(html.length / 1024).toFixed(1)}KB)`)
}

// ---- landing (static version of the hero + key sections) ----
const landingTitle = 'Satohash — Stamp a file on Bitcoin. Free.'
const landingDesc =
  'The file stays on your device. Only a SHA-256 fingerprint is stamped. Free. Bitcoin confirmation takes about an hour.'
const landingBody = `
<h1>Stamp a file on Bitcoin. Free.</h1>
<p>The file stays on your device. Satohash stamps only the SHA-256 fingerprint. A new stamp waits about an hour. Pending is not confirmed.</p>
<p><a href="${SITE}/stamp">Stamp a file — free</a> · <a href="${SITE}/verify">Verify a proof</a> · <a href="${SITE}/pricing">Pricing</a></p>
<h2>How it works</h2>
<ol>
<li><strong>The file stays</strong> — the browser makes a SHA-256 fingerprint. The file is not uploaded.</li>
<li><strong>Calendars write one line</strong> — OpenTimestamps asks public calendars to put that fingerprint in a Bitcoin block. That takes about an hour.</li>
<li><strong>Our node checks</strong> — when a block commits to the fingerprint, the stamp is confirmed. Download the .ots and check it yourself.</li>
</ol>
<p><a href="${SITE}/stamp">Stamp a file — free</a></p>`

// ---- FAQ (first 8 Q&As in English) ----
const faqTitle = 'FAQ — Bitcoin Document Notarization'
const faqDesc =
  'Answers about OpenTimestamps, files that stay on your device, what a proof can show, and the Satohash API.'
const faqItems = [
  ['How does Satohash work?', 'Satohash hashes your file locally in your browser (SHA-256), then submits only that fingerprint to OpenTimestamps calendars, which anchor it into the Bitcoin blockchain. You get a portable .ots proof file plus a certificate.'],
  ['Is it really free?', 'Yes — stamping is free today (REQUIRE_LIGHTNING=false). You pay no miners and no fees. Later there may be an optional Lightning fee to cover hosting, but the proof still anchors to Bitcoin.'],
  ['Does my file leave my device?', 'Your file stays in the browser. We send only a SHA-256 fingerprint. We never receive the file itself.'],
  ['Is a Bitcoin timestamp legally valid?', 'Satohash proofs are independently verifiable electronic evidence of existence-at-a-time, aligned with the framework of the ESIGN Act (US), UETA (US), and eIDAS (EU). A Bitcoin timestamp is strong evidence of when a file existed; admissibility and weight are decided by the court.'],
  ['How long does confirmation take?', 'Typically within one Bitcoin block — about 60 minutes. Pending stamps upgrade automatically as calendars gather attestations.'],
  ['What is OpenTimestamps (OTS)?', 'OpenTimestamps is a free, open-source protocol that anchors cryptographic fingerprints into the Bitcoin blockchain. It is calendar-based and independently verifiable.'],
  ['Can I verify without Satohash?', 'Yes — use opentimestamps.org, the ots CLI, or any OTS-compatible tool. Your .ots file works forever, independently of Satohash.'],
  ['What is NIP-05 identity?', 'Satohash supports Nostr NIP-05 identities (e.g. you@giveabit.io) so you can attach a Nostr public key to your proofs.'],
]
const faqBody =
  `<h1>Frequently Asked Questions</h1>\n` +
  faqItems.map(([q, a], i) => `<h2 id="q${i + 1}">${q}</h2>\n<p>${a}</p>`).join('\n')

const faqSchema = `<script type="application/ld+json">
${JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  },
  null,
  2
)}
</script>`

// ---- write outputs ----
console.log('Prerendering SEO pages…')
fs.mkdirSync(OUT, { recursive: true })

write('landing.html', shell({ title: landingTitle, description: landingDesc, contentHtml: landingBody, canonical: `${SITE}/`, ogImage: `${SITE}/og/home.jpg?v=file-stays-20261124` }))
write(
  'faq.html',
  shell({ title: faqTitle, description: faqDesc, contentHtml: faqBody, canonical: `${SITE}/faq`, ogImage: `${SITE}/og/faq.jpg` }).replace('</head>', `${faqSchema}\n</head>`)
)

// Secondary pages — concise static versions for crawlers
const secondary = {
  stamp: {
    title: 'Stamp a Document on Bitcoin — Free & Private',
    desc: 'Stamp any file on the Bitcoin blockchain for free. SHA-256 hashed in your browser, anchored via OpenTimestamps in ~60 minutes.',
    body: `<h1>Stamp a Document on Bitcoin</h1>
<p>Free. The file stays on your device. Stamp the fingerprint now. Bitcoin confirmation takes about an hour. Pending is not confirmed.</p>
<h2>Three steps</h2>
<ol><li><strong>Upload</strong> — your file is hashed locally (SHA-256); it never leaves your device.</li>
<li><strong>Anchor</strong> — the fingerprint is submitted to OpenTimestamps calendars and embedded in the next Bitcoin block (~60 min).</li>
<li><strong>Certify</strong> — download your .ots proof + PDF certificate. Independently verifiable forever.</li></ol>
<p><a href="${SITE}/stamp">Start stamping — free</a></p>`
  },
  pricing: {
    title: 'Pricing — Free Bitcoin Timestamping',
    desc: 'Stamps are free. You cannot buy a plan today. The file stays on your device. Only a fingerprint is sent.',
    body: `<h1>Stamps are free</h1>
<p>The file stays on your device. Only a fingerprint is stamped. You cannot buy a plan today. Paid prices on the page are plans, not a checkout.</p>
<p>Chain: Bitcoin only (via OpenTimestamps).</p>
<p><a href="${SITE}/stamp">Stamp free now</a></p>`
  },
  templates: {
    title: 'Free Legal & Business Templates — Stampable',
    desc: 'Free contract, agreement, and business templates you can stamp on Bitcoin instantly.',
    body: `<h1>Templates</h1>
<p>Free templates for contracts, agreements, and business documents — each one stampable on Bitcoin in one click for immutable proof of existence.</p>
<p><a href="${SITE}/templates">Browse templates</a></p>`
  },
  verify: {
    title: 'Verify a Proof — .ots & Hash Check',
    desc: 'Verify any OpenTimestamps .ots proof or SHA-256 hash against the Bitcoin blockchain. Free, private, independent.',
    body: `<h1>Verify a proof</h1>
<p>Drop an .ots proof file, paste a SHA-256 hash, or upload the original document. Satohash checks it against the Bitcoin chain and the registry and tells you clearly: confirmed, pending, or invalid — with a plain-language explanation.</p>
<p><a href="${SITE}/verify">Verify now</a> · <a href="${SITE}/verify/batch">Batch verify up to 50 hashes</a></p>`
  },
  donate: {
    title: 'Support Satohash — Lightning & Bitcoin',
    desc: 'Support Satohash with a Lightning tip or on-chain Bitcoin. Stamps stay free — tips fund the free public stamping tier.',
    body: `<h1>Support Satohash</h1>
<p>Your tips keep the free public stamping tier running. Lightning: satohash@breez.tips. On-chain: Breez deposit (non-custodial, backed by family seed).</p>
<p><a href="${SITE}/donate">Donate</a></p>`
  },
  network: {
    title: 'Network — Bitcoin Node, OTS Calendars, Nostr',
    desc: 'Live Satohash network status: own Bitcoin Core node height, OpenTimestamps calendars (Alice/Bob/Finney), Nostr relays, recent stamps.',
    body: `<h1>Network status</h1>
<p>Live: own pruned Bitcoin Core node (independent verification), OpenTimestamps calendars (Alice, Bob, Finney), Nostr relays, Lightning readiness, and recent public stamps.</p>
<p><a href="${SITE}/network">View live network</a></p>`
  }
}
for (const [slug, p] of Object.entries(secondary)) {
  const ext =
    slug === 'stamp' ||
    slug === 'verify' ||
    slug === 'pricing' ||
    slug === 'donate' ||
    slug === 'network' ||
    slug === 'templates'
      ? 'jpg'
      : 'png'
  const cache = slug === 'pricing' ? '?v=honest-20261124' : ''
  write(`${slug}.html`, shell({ title: p.title, description: p.desc, contentHtml: p.body, canonical: `${SITE}/${slug}`, ogImage: `${SITE}/og/${slug}.${ext}${cache}` }))
}

// learn articles
const LEARN_OG_JPEG = new Set([
  'learn-how-to-verify-an-ots-proof',
  'learn-what-is-opentimestamps',
  'learn-how-to-prove-a-document-existed',
  'learn-eidas-ueta-explained',
  'learn-ots-vs-docusign'
])
const docsDir = path.join(DIST, 'docs')
if (fs.existsSync(docsDir)) {
  const learns = fs.readdirSync(docsDir).filter((f) => f.startsWith('learn-') && f.endsWith('.md'))
  for (const f of learns) {
    const md = fs.readFileSync(path.join(docsDir, f), 'utf8')
    const slug = f.replace('.md', '')
    // title = first H1
    const titleMatch = md.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : slug
    const descMatch = md.match(/^([^#\n]{40,160})/m)
    const description = (descMatch ? descMatch[1].trim() : `Learn about ${title.toLowerCase()} — free Bitcoin document stamping.`).slice(0, 160)
    const body = mdToHtml(md)
    write(
      `docs/${slug}.html`,
      shell({
        title: `${title} — Satohash`,
        description,
        contentHtml: `<p class="meta">Satohash — Bitcoin document stamping</p>\n${body}\n<p><a href="${SITE}/stamp">Stamp a file — free</a>. File never leaves the device.</p>`,
        canonical: `${SITE}/docs/${slug}`,
        ogImage: `${SITE}/og/${slug}.${LEARN_OG_JPEG.has(slug) ? 'jpg' : 'png'}`,
        article: { headline: title, description, datePublished: '2026-08-20' }
      })
    )
  }
}

// Watch / Explainer — static version so video shares show rich meta
const watchTitle = 'Satohash Explainer — Watch How It Proves a File Existed'
const watchDesc =
  'Watch the ~70 second Satohash explainer: hash on your device, OpenTimestamps, prove existence on Bitcoin — free, private, independently verifiable.'
const watchBody = `
<h1>Watch the Satohash explainer</h1>
<p>Satohash hashes your file on the device, then anchors the fingerprint to Bitcoin via OpenTimestamps — independently verifiable proof that a file existed at a specific moment. Free, private, no account required.</p>
<ul>
<li><strong>The file stays</strong> — your file never leaves your device. Only a SHA-256 fingerprint goes forward.</li>
<li><strong>Free &amp; private</strong> — no account, no middleman, no trust required.</li>
<li><strong>Independently verifiable</strong> — anyone can check your proof on Bitcoin.</li>
</ul>
<p><a href="${SITE}/stamp">Stamp your first document — free</a></p>`

// Pitch — static share shell. The file stays; only a fingerprint is stamped.
const pitchTitle = 'Satohash — Stamp a file on Bitcoin'
const pitchDesc =
  'The file stays on the device. Only a fingerprint is stamped. Free. Bitcoin confirmation takes about an hour.'
const pitchBody = `
<h1>The file stays. The fingerprint goes on Bitcoin.</h1>
<p>Satohash stamps a SHA-256 fingerprint. The file stays on the device. Free. A new stamp waits about an hour. Pending is not confirmed.</p>
<p><a href="${SITE}/stamp">Stamp a file — free</a> · <a href="${SITE}/docs/support-and-guidance">Request guidance &amp; support</a></p>`

// Named docs rendered from markdown (dist/docs mirrors public/docs)
const NAMED_DOCS = [
  { slug: 'how-satohash-works', og: 'how-satohash-works', fallbackTitle: 'How Satohash Works — For Free (Technical Deep-Dive)', fallbackDesc: 'Why Satohash is free and how it really works: one Merkle root anchors a million fingerprints into a single Bitcoin transaction. Plain-English answer + implementation-level deep-dive.' },
  { slug: 'support-and-guidance', og: 'support-and-guidance', fallbackTitle: 'Satohash — A Request for Guidance, Partnership & Support', fallbackDesc: 'An honest request for guidance, review and support from the legal, technical and financial communities. An open, sovereign civic tool for truth — Bitcoin-anchored proof of existence.' }
]
for (const doc of NAMED_DOCS) {
  const mdPath = path.join(docsDir, `${doc.slug}.md`)
  if (!fs.existsSync(mdPath)) continue
  const md = fs.readFileSync(mdPath, 'utf8')
  const titleMatch = md.match(/^#\s+(.+)$/m)
  const title = (titleMatch ? titleMatch[1].trim() : doc.fallbackTitle)
    .replace(/^Satohash\s*[—–-]\s*/i, '') // drop redundant leading "Satohash — "
    .replace(/\s*[—–-]\s*Satohash.*$/i, '')
  const descMatch = md.match(/^([^#\n]{40,180})/m)
  const description = (descMatch ? descMatch[1].trim().replace(/[*_`#>]/g, '').replace(/\s+/g, ' ') : doc.fallbackDesc).slice(0, 180)
  const body = mdToHtml(md)
  write(
    `docs/${doc.slug}.html`,
    shell({
      title: `${title} — Satohash`,
      description,
      contentHtml: `<p class="meta">Satohash — Bitcoin document stamping</p>\n${body}`,
      canonical: `${SITE}/docs/${doc.slug}`,
      ogImage: `${SITE}/og/${doc.og}.jpg`,
      article: { headline: title, description, datePublished: '2026-08-20' }
    })
  )
}

// Watch + Pitch
write(
  'watch.html',
  shell({
    title: watchTitle,
    description: watchDesc,
    contentHtml: watchBody,
    canonical: `${SITE}/watch`,
    ogImage: `${SITE}/og/watch.jpg`,
    player: true,
    extraGraph: [
      {
        '@type': 'VideoObject',
        name: 'Satohash explainer',
        description: watchDesc,
        thumbnailUrl: `${SITE}/og/watch.jpg`,
        contentUrl: WATCH_VIDEO,
        embedUrl: WATCH_PLAYER,
        uploadDate: '2026-08-19',
        duration: 'PT84S',
        publisher: {
          '@type': 'Organization',
          name: 'Satohash',
          url: SITE,
          logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` }
        }
      }
    ]
  })
)
write('pitch.html', shell({ title: pitchTitle, description: pitchDesc, contentHtml: pitchBody, canonical: `${SITE}/pitch`, ogImage: `${SITE}/og/pitch.jpg?v=honest-20261124` }))

// Identity / Status / Counsel — crawler shells (Twitterbot / Googlebot)
const identityTitle = 'Satohash identity — NIP-05'
const identityDesc =
  'kimi@giveabit.io is the Give A Bit family NIP-05. Public keys live in satohash.io/.well-known/nostr.json. Voice: @give_bit.'
const identityBody = `
<h1>Satohash identity — NIP-05</h1>
<p>Satohash is part of the <strong>Give A Bit</strong> family. The human NIP-05 is <strong>kimi@giveabit.io</strong>. The public voice on X is <a href="https://x.com/give_bit">@give_bit</a> — not @satohash.</p>
<p>NIP-05 names for this product are published as static JSON at <a href="${SITE}/.well-known/nostr.json"><code>${SITE}/.well-known/nostr.json</code></a> (served from the SPA host, not the API). That file maps <code>kimi</code>, <code>satohash</code>, and <code>_</code> to the same public key.</p>
<p>Identity is optional. A stamp proves a SHA-256 fingerprint existed at a time via OpenTimestamps on Bitcoin — not who you are, and not a certificate. Stamping is free today (<code>REQUIRE_LIGHTNING=false</code>). Chain: Bitcoin only.</p>
<p><a href="${SITE}/identity">Open identity</a> · <a href="${SITE}/.well-known/nostr.json">nostr.json</a> · <a href="${SITE}/stamp">Stamp a file — free</a></p>`

const statusTitle = 'Satohash status — live node, calendars, stamps'
const statusDesc =
  'Live Satohash status: own Bitcoin node, OpenTimestamps calendars, and stamps. Source of truth is api.satohash.io /health and /metrics.json. Pending is not confirmed.'
const statusBody = `
<h1>Satohash status — live node, calendars, stamps</h1>
<p>The live dashboard is <a href="${SITE}/status">${SITE}/status</a>. It reads public endpoints; it never writes stamps and requires no account.</p>
<p>Source of truth is the API plane, not this static page:</p>
<ul>
<li><a href="https://api.satohash.io/health"><code>https://api.satohash.io/health</code></a> — API readiness, git SHA, bitcoind tip, OpenTimestamps calendars</li>
<li><a href="https://api.satohash.io/metrics.json"><code>https://api.satohash.io/metrics.json</code></a> — stamp counts and paywall flag (<code>raw.requireLightning</code> is <code>false</code> today)</li>
</ul>
<p><strong>Pending ≠ confirmed.</strong> Pending means submitted to calendars. Confirmed means a Bitcoin block includes the attestation. Do not treat a pending stamp as finality.</p>
<p>Stamps are free today. Chain: Bitcoin only, via OpenTimestamps.</p>
<p><a href="${SITE}/status">View live status</a> · <a href="${SITE}/network">Network</a></p>`

const counselTitle = 'Satohash for counsel'
const counselDesc =
  'Bitcoin-anchored proof of existence via OpenTimestamps. The file never leaves the device. Independently verifiable. Not legal advice.'
const counselBody = `
<h1>Satohash for counsel</h1>
<p>Satohash issues Bitcoin-anchored proof of existence: a SHA-256 fingerprint computed on the client, then an OpenTimestamps receipt that calendars later commit into a Bitcoin transaction. The file never leaves the device.</p>
<p>The <code>.ots</code> proof is independently verifiable with <code>ots-cli</code>, opentimestamps.org, or any OTS library against public calendars or your own Bitcoin node — even if Satohash ceases to exist.</p>
<p><strong>This is not legal advice.</strong> A stamp is evidence that a fingerprint existed at a time. It is not proof of identity, consent, authorship, truth, admissibility, or a notarial act.</p>
<p><strong>Pending is not confirmed.</strong> Pending means submitted to calendars. Confirmed means a Bitcoin block includes the attestation.</p>
<p><a href="${SITE}/counsel">Counsel one-pager</a> · <a href="${SITE}/docs/how-satohash-works">How Satohash works</a> · <a href="${SITE}/verify">Verify a proof</a></p>`

write('identity.html', shell({ title: identityTitle, description: identityDesc, contentHtml: identityBody, canonical: `${SITE}/identity`, ogImage: `${SITE}/og/home.jpg?v=file-stays-20261124` }))
write('status.html', shell({ title: statusTitle, description: statusDesc, contentHtml: statusBody, canonical: `${SITE}/status`, ogImage: `${SITE}/og/home.jpg?v=file-stays-20261124` }))
write('counsel.html', shell({ title: counselTitle, description: counselDesc, contentHtml: counselBody, canonical: `${SITE}/counsel`, ogImage: `${SITE}/og/home.jpg?v=file-stays-20261124` }))

const proofPackTitle = 'Proof Pack waitlist — free, not for sale'
const proofPackDesc =
  'Satohash Proof Pack is a free waitlist, not a paid SKU. No email form. Announcements on @give_bit. Stamp a file for free today.'
const proofPackBody = `
<h1>Proof Pack waitlist — free, not for sale</h1>
<p>Proof Pack is a future bundle idea: <code>.ots</code> receipts, a shareable proof card, and a PDF together. It is <strong>not for sale</strong>. There is no checkout and no email form.</p>
<p>Join the local waitlist on the site, or follow <a href="https://x.com/give_bit">@give_bit</a>. Stamping is free today (<code>REQUIRE_LIGHTNING=false</code>). Pending is not confirmed.</p>
<p><a href="${SITE}/proof-pack">Open the waitlist</a> · <a href="${SITE}/stamp">Stamp a file — free</a></p>`
write(
  'proof-pack.html',
  shell({
    title: proofPackTitle,
    description: proofPackDesc,
    contentHtml: proofPackBody,
    canonical: `${SITE}/proof-pack`,
    ogImage: `${SITE}/og/stamp.jpg`
  })
)

console.log('Prerender complete → dist/prerender/')

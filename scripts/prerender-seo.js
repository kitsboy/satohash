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

function shell({ title, description, contentHtml, canonical, article = null }) {
  const schema = article
    ? `<script type="application/ld+json">
${JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    author: { '@type': 'Organization', name: 'Satohash', url: SITE },
    publisher: { '@type': 'Organization', name: 'Satohash', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` } },
    mainEntityOfPage: canonical
  },
  null,
  2
)}
</script>`
    : ''
  return `<!doctype html>
<html lang="${LANG}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${canonical}" />
<link rel="alternate" hreflang="en" href="${canonical}" />
<link rel="alternate" hreflang="x-default" href="${canonical}" />
<meta property="og:type" content="${article ? 'article' : 'website'}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${canonical}" />
<meta property="og:site_name" content="Satohash" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:card" content="summary_large_image" />
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
<p><a href="${SITE}">Satohash</a> — free Bitcoin document stamping. Stamp a file, get a permanent proof of existence anchored on Bitcoin.</p>
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
const landingTitle = 'Stamp Documents on Bitcoin — Free Proof of Existence'
const landingDesc =
  'Drop any file. Get a Bitcoin-anchored proof of existence in under 60 seconds. Free, private, zero-knowledge. Your file never leaves your device. OpenTimestamps + Bitcoin = immutable, court-ready evidence.'
const landingBody = `
<h1>Prove Any File Existed. Forever.</h1>
<p>Drop any file. Get a permanent, Bitcoin-backed timestamp. Valid in court. No lawyers. No trust required.</p>
<p>Satohash hashes your file locally in your browser — your document never leaves your device. Only a cryptographic fingerprint gets written to the Bitcoin blockchain, creating immutable proof of existence for any file, contract, photo, or dataset.</p>
<p><a href="${SITE}/stamp">Stamp a File — It's Free</a> · <a href="${SITE}/verify">Verify a proof</a> · <a href="${SITE}/pricing">Pricing</a></p>
<h2>How it works</h2>
<ol>
<li><strong>Upload or hash your file</strong> — Satohash instantly generates a SHA-256 fingerprint in your browser. Your file never leaves your device.</li>
<li><strong>Anchor to Bitcoin</strong> — Your fingerprint is submitted to the Bitcoin blockchain via OpenTimestamps, embedded in the next block, typically within 60 minutes.</li>
<li><strong>Download your certificate</strong> — Receive a portable proof certificate, independently verifiable anywhere, anytime — even if Satohash ceases to exist.</li>
</ol>
<h2>Why Bitcoin timestamping</h2>
<ul>
<li><strong>No server required</strong> — zero-knowledge by design, only a hash leaves your device.</li>
<li><strong>Anchored in ~60 minutes</strong> — every node on Earth validates it; it cannot be altered, backdated, or deleted.</li>
<li><strong>Court-ready evidence</strong> — satisfies ESIGN Act (US), UETA, and eIDAS (EU); mathematically non-repudiable.</li>
<li><strong>No middleman ever</strong> — Bitcoin itself is the notary, 18,000+ full nodes strong.</li>
</ul>
<h2>Who needs proof that can't be faked</h2>
<p>Legal contracts, creative work, medical records, corporate compliance, research &amp; IP, government &amp; archives.</p>
<p><a href="${SITE}/stamp">Notarize your first document — free</a></p>`

// ---- FAQ (first 8 Q&As in English) ----
const faqTitle = 'FAQ — Bitcoin Document Notarization'
const faqDesc =
  'Answers about OpenTimestamps, zero-knowledge stamping, legal validity, NIP-05 identity, and the Satohash API.'
const faqItems = [
  ['How does Satohash work?', 'Satohash hashes your file locally in your browser (SHA-256), then submits only that fingerprint to OpenTimestamps calendars, which anchor it into the Bitcoin blockchain. You get a portable .ots proof file plus a certificate.'],
  ['Is it really free?', 'Yes — stamping is free today (REQUIRE_LIGHTNING=false). You pay no miners and no fees. Later there may be an optional Lightning fee to cover hosting, but the proof still anchors to Bitcoin.'],
  ['Does my file leave my device?', 'No. Only a cryptographic hash (fingerprint) is transmitted. The original file never leaves your browser — zero-knowledge by design.'],
  ['Is a Bitcoin timestamp legally valid?', 'Satohash proofs are designed to satisfy ESIGN Act (US), UETA (US), and eIDAS (EU) requirements. A Bitcoin timestamp is mathematically non-repudiable evidence of existence-at-a-time.'],
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

write('landing.html', shell({ title: landingTitle, description: landingDesc, contentHtml: landingBody, canonical: `${SITE}/` }))
write(
  'faq.html',
  shell({ title: faqTitle, description: faqDesc, contentHtml: faqBody, canonical: `${SITE}/faq` }).replace('</head>', `${faqSchema}\n</head>`)
)

// Secondary pages — concise static versions for crawlers
const secondary = {
  stamp: {
    title: 'Stamp a Document on Bitcoin — Free & Private',
    desc: 'Stamp any file on the Bitcoin blockchain for free. SHA-256 hashed in your browser, anchored via OpenTimestamps in ~60 minutes.',
    body: `<h1>Stamp a Document on Bitcoin</h1>
<p>Free, private, zero-knowledge. Drop a file and get a Bitcoin-anchored proof of existence in under 60 seconds.</p>
<h2>Three steps</h2>
<ol><li><strong>Upload</strong> — your file is hashed locally (SHA-256); it never leaves your device.</li>
<li><strong>Anchor</strong> — the fingerprint is submitted to OpenTimestamps calendars and embedded in the next Bitcoin block (~60 min).</li>
<li><strong>Certify</strong> — download your .ots proof + PDF certificate. Independently verifiable forever.</li></ol>
<p><a href="${SITE}/stamp">Start stamping — free</a></p>`
  },
  pricing: {
    title: 'Pricing — Free Bitcoin Timestamping',
    desc: 'Satohash is free today. 0 sats per stamp. Optional Lightning fee (21 sats) planned in the future to cover hosting.',
    body: `<h1>Simple, honest pricing</h1>
<p><strong>Live now: Free</strong> — 0 sats. Stamp &amp; verify with OpenTimestamps. No account, no Lightning invoice.</p>
<p><strong>Future (planned):</strong> Pay-per-stamp 21 sats (optional Lightning tip-through-us, covers product costs; proof still OTS on Bitcoin). Pro pack 2,100 sats (bulk stamps / API-friendly).</p>
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
  write(`${slug}.html`, shell({ title: p.title, description: p.desc, contentHtml: p.body, canonical: `${SITE}/${slug}` }))
}

// learn articles
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
        contentHtml: `<p class="meta">Satohash — Bitcoin document stamping</p>\n${body}`,
        canonical: `${SITE}/docs/${slug}`,
        article: { headline: title, description, datePublished: '2026-08-20' }
      })
    )
  }
}

console.log('Prerender complete → dist/prerender/')

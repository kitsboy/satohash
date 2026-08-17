/**
 * Zero-JS public proof card. Does not change /api/* paths.
 * SPA /p/:hash remains for interactive clients.
 */
const API = 'https://api.satohash.io'

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function onRequestGet({ params }) {
  const raw = String(params.hash || '').trim()
  const hex = /^[a-f0-9]{64}$/i.test(raw) ? raw.toLowerCase() : raw
  let proof = { hash: hex, status: 'unknown' }
  try {
    const path = /^[a-f0-9]{64}$/i.test(hex)
      ? `${API}/api/stamps/${hex}/by-hash`
      : `${API}/api/stamps/${encodeURIComponent(hex)}`
    const res = await fetch(path)
    if (res.ok) {
      const body = await res.json()
      const row = Array.isArray(body.stamps) ? body.stamps[0] : body
      if (row) proof = { ...row, hash: row.hash || hex }
    }
  } catch {
    /* render hash-only */
  }

  const status = proof.status || 'pending'
  const title = `Satohash proof ${esc(String(hex).slice(0, 12))}…`
  const desc = `Bitcoin-anchored OpenTimestamps proof. Status: ${esc(status)}. Pending is not confirmed.`
  const canon = `https://satohash.io/p/${esc(hex)}`
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  <meta name="description" content="${desc}"/>
  <link rel="canonical" href="${canon}"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${desc}"/>
  <meta property="og:url" content="${canon}"/>
  <meta property="og:image" content="https://satohash.io/og-image.svg"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${desc}"/>
  <style>
    body{margin:0;font-family:ui-sans-serif,system-ui;background:#141b25;color:#f1f5f9;padding:2rem 1rem}
    .card{max-width:36rem;margin:0 auto;border:1px solid rgba(240,180,41,.25);border-radius:1.25rem;padding:1.25rem;background:#1e2a3a}
    .k{letter-spacing:.16em;text-transform:uppercase;font-size:10px;color:#f0b429;font-weight:800}
    .h{font-family:ui-monospace,monospace;font-size:12px;word-break:break-all}
    a{color:#f0b429}
  </style>
</head>
<body>
  <article class="card">
    <p class="k">Satohash · zero-JS proof card</p>
    <p>Status: <strong>${esc(status)}</strong></p>
    <p class="h">${esc(proof.hash || hex)}</p>
    <p>Satohash recorded this fingerprint${proof.created_at ? ` at ${esc(proof.created_at)}` : ''}.
    ${status === 'confirmed' ? `Bitcoin confirmed${proof.bitcoin_block_height ? ` in block ${esc(proof.bitcoin_block_height)}` : ''}.` : 'Pending is not Bitcoin confirmed.'}</p>
    <p>Independent verify: <code>ots-cli verify proof.ots</code></p>
    <p><a href="https://satohash.io/verify/${esc(hex)}">Interactive verify</a> · <a href="https://satohash.io/stamp">Stamp a file</a></p>
  </article>
</body>
</html>`

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60'
    }
  })
}

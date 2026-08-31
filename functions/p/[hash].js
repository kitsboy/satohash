/**
 * Zero-JS public proof card. Does not change /api/* paths.
 * Hard open / refresh / share hits this Function on CF Pages.
 */
const API = 'https://api.satohash.io'
const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function utc(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return esc(String(raw))
  return esc(
    d
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d{3}Z$/, ' UTC')
  )
}

/** Real Nostr event id only — hex, note1, or nevent1. Never npub / invented. */
function realNostrEventId(...candidates) {
  for (const raw of candidates) {
    if (typeof raw !== 'string') continue
    const id = raw.trim()
    if (!id) continue
    if (/^[0-9a-f]{64}$/i.test(id)) return id.toLowerCase()
    if (/^(note|nevent)1[02-9ac-hj-np-z]+$/i.test(id)) return id
  }
  return ''
}

function pickNostrEventId(proof) {
  if (!proof || typeof proof !== 'object') return ''
  const chains = proof.chains && typeof proof.chains === 'object' ? proof.chains : {}
  return realNostrEventId(
    proof.nostr_event_id,
    proof.nostrEventId,
    proof.nostr_id,
    chains.nostr,
    chains.nostr_event_id
  )
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
    /* hash-only card */
  }

  if (proof.id && !pickNostrEventId(proof)) {
    try {
      const ch = await fetch(`${API}/api/stamps/${encodeURIComponent(proof.id)}/chains`)
      if (ch.ok) {
        const body = await ch.json()
        proof = {
          ...proof,
          nostr_event_id: body.nostr_event_id || null,
          chains: body.chains || proof.chains
        }
      }
    } catch {
      /* omit njump */
    }
  }

  const validHash = /^[a-f0-9]{64}$/i.test(hex)
  const status = proof.status || 'pending'
  const confirmed = status === 'confirmed'
  const block = proof.bitcoin_block_height
  const hash = proof.hash || hex
  const short = String(hash).slice(0, 12)
  const blockLabel =
    block != null && block !== '' && Number.isFinite(Number(block))
      ? Number(block).toLocaleString()
      : ''
  const statusLine = confirmed
    ? `CONFIRMED${blockLabel ? ` · block ${blockLabel}` : ''}`
    : String(status).toLowerCase() === 'pending'
      ? 'PENDING ≠ CONFIRMED'
      : `${String(status || 'unknown').toUpperCase()} · not confirmed`
  const njumpId = pickNostrEventId(proof)
  const njump = njumpId
    ? `<p><a class="njump" href="https://njump.me/${encodeURIComponent(njumpId)}" rel="noopener noreferrer">njump</a></p>`
    : ''
  const title = confirmed
    ? `Confirmed Bitcoin proof ${short}… — Satohash`
    : `Satohash proof ${short}… (${esc(status)})`
  const desc = confirmed
    ? `SHA-256 ${short}… is Bitcoin-confirmed via OpenTimestamps.${block ? ` Block ${block}.` : ''} Independently verifiable. File never left the device.`
    : `SHA-256 ${short}… recorded by Satohash. Status: ${esc(status)}. Pending is not Bitcoin confirmed.`
  const canon = `https://satohash.io/p/${esc(hex)}`
  const emptyNote =
    String(hash).toLowerCase() === EMPTY_SHA256
      ? '<p class="muted">This digest is the SHA-256 of an empty file — a valid fingerprint, often used as a smoke test.</p>'
      : ''
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    url: canon,
    identifier: hash,
    dateCreated: proof.created_at || undefined,
    creativeWorkStatus: confirmed ? 'Official' : 'Incomplete',
    description: desc,
    publisher: { '@type': 'Organization', name: 'Satohash', url: 'https://satohash.io' }
  })

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <meta name="format-detection" content="telephone=no"/>
  <meta name="theme-color" content="#141b25"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}"/>
  <meta name="robots" content="${validHash ? 'index,follow' : 'noindex,follow'}"/>
  <link rel="canonical" href="${canon}"/>
  <link rel="icon" href="https://satohash.io/logo.png"/>
  <link rel="apple-touch-icon" href="https://satohash.io/logo.png"/>
  <meta property="og:site_name" content="Satohash"/>
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${esc(title)}"/>
  <meta property="og:description" content="${esc(desc)}"/>
  <meta property="og:url" content="${canon}"/>
  <meta property="og:image" content="https://satohash.io/media/video/01-stamp-hero.jpg"/>
  <meta property="og:image:secure_url" content="https://satohash.io/media/video/01-stamp-hero.jpg"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:type" content="image/jpeg"/>
  <meta property="og:image:alt" content="Satohash — Bitcoin-anchored proof of existence"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="@give_bit"/>
  <meta name="twitter:creator" content="@give_bit"/>
  <meta name="twitter:title" content="${esc(title)}"/>
  <meta name="twitter:description" content="${esc(desc)}"/>
  <meta name="twitter:image" content="https://satohash.io/media/video/01-stamp-hero.jpg"/>
  <meta name="twitter:image:alt" content="Satohash — Bitcoin-anchored proof of existence"/>
  <script type="application/ld+json">${jsonLd}</script>
  <style>
    :root{--bg:#141b25;--card:#1e2a3a;--gold:#f0b429;--text:#f1f5f9;--muted:#8892a4;--ok:#22d3a5;--line:rgba(240,180,41,.28)}
    *{box-sizing:border-box}
    html,body{margin:0;min-height:100%;background:var(--bg);color:var(--text);
      font-family:"Plus Jakarta Sans",ui-sans-serif,system-ui,sans-serif}
    body{padding:max(1.25rem,env(safe-area-inset-top)) 1rem max(2rem,env(safe-area-inset-bottom))}
    .wrap{max-width:36rem;margin:0 auto}
    header{display:flex;align-items:center;gap:.7rem;margin-bottom:1.25rem}
    header img{width:36px;height:36px}
    header .brand{font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
    header .sub{font-size:11px;color:var(--muted);margin-top:.15rem}
    .card{border:1px solid var(--line);border-radius:1.25rem;padding:1.35rem 1.25rem;background:var(--card);
      box-shadow:0 0 0 1px rgba(240,180,41,.08),0 24px 48px -24px rgba(0,0,0,.7)}
    .k{letter-spacing:.16em;text-transform:uppercase;font-size:10px;color:var(--gold);font-weight:800;margin:0 0 .75rem}
    .status{display:inline-block;border-radius:.5rem;padding:.4rem .8rem;font-size:12px;font-weight:800;
      letter-spacing:.12em;text-transform:uppercase;margin:0 0 .55rem}
    .status.ok{background:rgba(34,211,165,.12);color:var(--ok);border:1px solid rgba(34,211,165,.35)}
    .status.wait{background:rgba(240,180,41,.1);color:var(--gold);border:1px solid var(--line)}
    a.njump{color:var(--gold);font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:12px}
    h1{font-size:1.35rem;line-height:1.2;margin:.7rem 0 .85rem;letter-spacing:-.03em}
    .h{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:12px;word-break:break-all;-webkit-text-size-adjust:100%;}
      background:#141b25;border:1px solid rgba(255,255,255,.06);border-radius:.75rem;padding:.75rem;margin:0 0 1rem}
    p{line-height:1.55;font-size:.95rem;margin:0 0 .75rem}
    .muted{color:var(--muted);font-size:.82rem}
    .cals{font-size:11px;color:var(--muted);margin:1rem 0 0}
    .cals strong{color:var(--gold);font-weight:800;letter-spacing:.08em}
    .actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.15rem}
    a.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.6rem 1rem;
      border-radius:.85rem;text-decoration:none;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    a.gold{background:var(--gold);color:#141b25}
    a.ghost{border:1px solid var(--line);color:var(--gold)}
    footer{margin-top:1.25rem;font-size:11px;color:var(--muted)}
    footer a{color:var(--gold)}
    @media (max-width:420px){h1{font-size:1.2rem}.actions{flex-direction:column}a.btn{width:100%}}
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <img src="https://satohash.io/logo.png" alt=""/>
      <div>
        <div class="brand">Satohash</div>
        <div class="sub">Bitcoin proof of existence</div>
      </div>
    </header>
    <article class="card">
      <p class="k">Zero-JS proof card</p>
      <p class="status ${confirmed ? 'ok' : 'wait'}" role="status">${esc(statusLine)}</p>
      <h1>${confirmed ? 'Confirmed on Bitcoin' : 'Pending is not confirmed'}</h1>
      <p class="h">${esc(hash)}</p>
      <p>Satohash recorded this fingerprint${proof.created_at ? ` at ${utc(proof.created_at)}` : ''}.
      ${
        confirmed
          ? `Bitcoin has anchored it${blockLabel ? ` in <a href="https://mempool.space/block/${esc(block)}">block ${esc(blockLabel)}</a>` : ''}.`
          : 'Calendars have the digest. A Bitcoin block has not included it yet. Pending is not confirmed.'
      }</p>
      ${emptyNote}
      <p class="muted">Only a SHA-256 fingerprint was submitted. The original file never needed to leave the device. You do not need to trust Satohash — verify with OpenTimestamps.</p>
      ${njump}
      <p><code>ots-cli verify proof.ots</code></p>
      <p class="cals"><strong>Calendars</strong> · alice · bob · finney</p>
      <div class="actions">
        <a class="btn gold" href="https://satohash.io/verify/${esc(hex)}">Interactive verify</a>
        <a class="btn ghost" href="https://satohash.io/stamp">Stamp a file</a>
        <a class="btn ghost" href="https://satohash.io/counsel">For counsel</a>
      </div>
    </article>
    <footer>
      Independent math · OpenTimestamps → Bitcoin ·
      <a href="https://satohash.io/status">Status</a>
    </footer>
  </div>
</body>
</html>`

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=60',
      'x-robots-tag': 'index, follow'
    }
  })
}

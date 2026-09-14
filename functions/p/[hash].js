/**
 * Zero-JS public proof card. Does not change /api/* paths.
 * Hard open / refresh / share hits this Function on CF Pages.
 */
import { LANGS, STRINGS } from './proof-i18n.js'

const API = 'https://api.satohash.io'
const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
/** iMessage/OG unfurl — JPEG only, never PNG/SVG. Absolute https. */
const OG_JPEG = 'https://satohash.io/media/video/01-stamp-hero.jpg'

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

function pickLang(request) {
  if (!request) return 'en'
  try {
    const url = new URL(request.url)
    const q = String(url.searchParams.get('lang') || '')
      .split('-')[0]
      .toLowerCase()
    if (LANGS.includes(q)) return q
  } catch {
    /* ignore */
  }
  const cookie = request.headers.get('Cookie') || ''
  const m = cookie.match(/(?:^|; )satohash_lang=([a-z]{2})/i)
  if (m && LANGS.includes(m[1].toLowerCase())) return m[1].toLowerCase()
  const al = request.headers.get('Accept-Language') || ''
  for (const part of al.split(',')) {
    const code = part.trim().split(';')[0].split('-')[0].toLowerCase()
    if (LANGS.includes(code)) return code
  }
  return 'en'
}

function tr(dict, key, vars = {}) {
  let s = dict[key] || STRINGS.en[key] || key
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{{${k}}}`).join(String(v ?? ''))
  }
  return s
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

function hasStampId(proof) {
  return proof?.id != null && String(proof.id) !== ''
}

function hasCreatedAt(proof) {
  return Boolean(proof?.created_at || proof?.createdAt)
}

/** unstamped | pending | confirmed | unknown — never call unstamped "Pending". */
function classifyProof(proof, validHash) {
  if (!proof) return 'unknown'
  const status = String(proof.status || '').toLowerCase()
  if (status === 'confirmed' || status === 'verified' || proof.isConfirmed) return 'confirmed'
  if (status === 'failed') return 'unknown'
  if (hasStampId(proof) || hasCreatedAt(proof) || status === 'pending') return 'pending'
  if (validHash && !hasStampId(proof) && !hasCreatedAt(proof)) return 'unstamped'
  return 'unknown'
}

export async function onRequestGet({ params, request }) {
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
  const kind = classifyProof(proof, validHash)
  const confirmed = kind === 'confirmed'
  const unstamped = kind === 'unstamped'
  const pending = kind === 'pending'
  const block = proof.bitcoin_block_height
  const hash = proof.hash || hex
  const short = String(hash).slice(0, 12)
  const blockLabel =
    block != null && block !== '' && Number.isFinite(Number(block))
      ? Number(block).toLocaleString()
      : ''
  const lang = pickLang(request)
  const L = STRINGS[lang] || STRINGS.en
  const statusLine = confirmed
    ? blockLabel
      ? tr(L, 'confirmedBlock', { block: blockLabel })
      : tr(L, 'confirmed')
    : pending
      ? tr(L, 'pendingNe')
      : unstamped
        ? tr(L, 'notStampedYet')
        : tr(L, 'notConfirmed', { status: String(proof.status || 'unknown').toUpperCase() })
  const heading = unstamped
    ? tr(L, 'notStampedYet')
    : confirmed
      ? tr(L, 'titleConfirmed')
      : pending
        ? tr(L, 'titlePending')
        : tr(L, 'notConfirmed', { status: String(proof.status || 'unknown').toUpperCase() })
  const njumpId = pickNostrEventId(proof)
  const njump = njumpId
    ? `<p><a class="njump" href="https://njump.me/${encodeURIComponent(njumpId)}" rel="noopener noreferrer">${esc(tr(L, 'njump'))}</a></p>`
    : ''
  const title = unstamped
    ? `${tr(L, 'notStampedYet')} ${short}… — Satohash`
    : confirmed
      ? `Confirmed Bitcoin proof ${short}… — Satohash`
      : `Satohash proof ${short}… (${esc(pending ? 'pending' : String(proof.status || 'unknown'))})`
  const desc = unstamped
    ? tr(L, 'notStampedBody')
    : confirmed
      ? `SHA-256 ${short}… is Bitcoin-confirmed via OpenTimestamps.${block ? ` Block ${block}.` : ''} Independently verifiable. File never left the device.`
      : pending
        ? `SHA-256 ${short}… recorded by Satohash. PENDING ≠ CONFIRMED. ${tr(L, 'waitingBlock')}`
        : tr(L, 'notStampedBody')
  const canon = `https://satohash.io/p/${esc(hex)}`
  const emptyNote =
    String(hash).toLowerCase() === EMPTY_SHA256
      ? `<p class="muted">${esc(tr(L, 'emptyFile'))}</p>`
      : ''
  const refresh = pending ? '<meta http-equiv="refresh" content="45"/>' : ''
  const bodyCopy = unstamped
    ? `<p>${esc(tr(L, 'notStampedBody'))}</p>`
    : `<p>${
        proof.created_at
          ? esc(tr(L, 'recordedAt', { time: utc(proof.created_at) }))
          : esc(tr(L, 'recorded'))
      }
      ${
        confirmed
          ? blockLabel
            ? `${esc(tr(L, 'anchoredBlock', { block: blockLabel })).replace(
                esc(blockLabel),
                `<a href="https://mempool.space/block/${esc(block)}">${esc(blockLabel)}</a>`
              )}`
            : esc(tr(L, 'anchored'))
          : pending
            ? esc(tr(L, 'waitingBlock'))
            : ''
      }</p>`
  const otsBtn =
    confirmed && hasStampId(proof)
      ? `<a class="btn gold" href="${API}/api/stamps/${esc(encodeURIComponent(proof.id))}?download=true">${esc(tr(L, 'downloadOts'))}</a>`
      : ''
  const primaryCta = unstamped
    ? `<a class="btn gold" href="https://satohash.io/stamp?hash=${esc(hex)}">${esc(tr(L, 'stampThisFingerprint'))}</a>`
    : `<a class="btn gold" href="https://satohash.io/verify/${esc(hex)}">${esc(tr(L, 'interactiveVerify'))}</a>`
  const stampFileBtn = unstamped
    ? ''
    : `<a class="btn ghost" href="https://satohash.io/stamp">${esc(tr(L, 'stampFile'))}</a>`
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    url: canon,
    identifier: hash,
    dateCreated: unstamped ? undefined : proof.created_at || undefined,
    creativeWorkStatus: confirmed ? 'Official' : 'Incomplete',
    description: desc,
    publisher: { '@type': 'Organization', name: 'Satohash', url: 'https://satohash.io' }
  })
  const sealClass = confirmed ? 'ok' : pending ? '' : 'none'
  const statusClass = confirmed ? 'ok' : 'wait'
  const statusHtml = unstamped
    ? ''
    : `<p class="status ${statusClass}" role="status">${esc(statusLine)}</p>`
  const neverLeaves = unstamped ? '' : `<p class="muted">${esc(tr(L, 'neverLeaves'))}</p>`
  const otsCli = unstamped ? '' : `<p><code>${esc(tr(L, 'otsCli'))}</code></p>`
  const cals = pending ? `<p class="cals">${esc(tr(L, 'calendarsLine'))}</p>` : ''

  const html = `<!doctype html>
<html lang="${esc(lang)}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
  <meta name="format-detection" content="telephone=no"/>
  <meta name="theme-color" content="#141b25"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
  ${refresh}
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
  <meta property="og:image" content="${OG_JPEG}"/>
  <meta property="og:image:secure_url" content="${OG_JPEG}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:image:type" content="image/jpeg"/>
  <meta property="og:image:alt" content="Satohash — Bitcoin-anchored proof of existence"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="@give_bit"/>
  <meta name="twitter:creator" content="@give_bit"/>
  <meta name="twitter:title" content="${esc(title)}"/>
  <meta name="twitter:description" content="${esc(desc)}"/>
  <meta name="twitter:image" content="${OG_JPEG}"/>
  <meta name="twitter:image:src" content="${OG_JPEG}"/>
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
    .card{position:relative;border:1px solid var(--line);border-radius:1.25rem;padding:1.35rem 1.25rem;
      background:linear-gradient(165deg,rgba(56,189,248,.08) 0%,var(--card) 55%,rgba(240,180,41,.06) 100%);
      box-shadow:0 0 0 1px rgba(240,180,41,.1),0 24px 48px -24px rgba(0,0,0,.7);overflow:hidden}
    .card:before{content:"";position:absolute;inset:0 0 auto;height:2px;background:linear-gradient(90deg,#38bdf8,#f0b429)}
    .mast{display:flex;align-items:flex-start;gap:.85rem;margin:0 0 .85rem}
    .seal{width:56px;height:56px;flex:0 0 56px;border-radius:50%;display:flex;align-items:center;justify-content:center;
      background:linear-gradient(165deg,rgba(240,180,41,.26),var(--card));
      box-shadow:0 0 0 1.15px rgba(255,255,255,.28),0 0 28px rgba(240,180,41,.28)}
    .seal.ok{background:linear-gradient(165deg,rgba(34,211,165,.26),var(--card));
      box-shadow:0 0 0 1.15px rgba(255,255,255,.28),0 0 28px rgba(34,211,165,.28)}
    .seal:after{content:"◷";font-size:1.35rem;color:var(--gold);line-height:1}
    .seal.ok:after{content:"✓";color:var(--ok)}
    .seal.none:after{content:"#";color:var(--gold)}
    .k{letter-spacing:.16em;text-transform:uppercase;font-size:10px;color:var(--gold);font-weight:800;margin:0 0 .55rem}
    .fp{letter-spacing:.16em;text-transform:uppercase;font-size:9px;color:var(--gold);font-weight:800;margin:0 0 .4rem}
    .status{display:inline-block;border-radius:.5rem;padding:.4rem .8rem;font-size:12px;font-weight:800;
      letter-spacing:.12em;text-transform:uppercase;margin:0}
    .status.ok{background:rgba(34,211,165,.12);color:var(--ok);border:1px solid rgba(34,211,165,.35)}
    .status.wait{background:rgba(240,180,41,.1);color:var(--gold);border:1px solid var(--line)}
    a.njump{color:var(--gold);font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:12px}
    a.njump:focus-visible,a.btn:focus-visible,footer a:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
    h1{font-size:1.35rem;line-height:1.2;margin:.15rem 0 .85rem;letter-spacing:-.03em}
    .h{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:12px;word-break:break-all;-webkit-text-size-adjust:100%;
      background:#141b25;border:1px solid rgba(240,180,41,.22);border-radius:.75rem;padding:.75rem;margin:0 0 1rem;-webkit-user-select:all;user-select:all}
    p{line-height:1.55;font-size:.95rem;margin:0 0 .75rem}
    .muted{color:var(--muted);font-size:.82rem}
    .cals{font-size:11px;color:var(--muted);margin:1rem 0 0}
    .cals strong{color:var(--gold);font-weight:800;letter-spacing:.08em}
    .actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1.15rem}
    a.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:.6rem 1rem;
      border-radius:.85rem;text-decoration:none;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
    a.gold{background:var(--gold);color:#141b25}
    a.ghost{border:1px solid var(--line);color:var(--gold)}
    footer{margin-top:1.25rem;font-size:11px;color:var(--muted)}
    footer a{color:var(--gold)}
    @media (max-width:420px){h1{font-size:1.2rem}.actions{flex-direction:column}a.btn{width:100%}.seal{width:48px;height:48px;flex-basis:48px}}
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <img src="https://satohash.io/logo.png" alt=""/>
      <div>
        <div class="brand">Satohash</div>
        <div class="sub">${esc(tr(L, 'brandSub'))}</div>
      </div>
    </header>
    <article class="card">
      <div class="mast">
        <div class="seal ${sealClass}" aria-hidden="true"></div>
        <div>
          <p class="k">${esc(tr(L, 'zeroJsKicker'))}</p>
          ${statusHtml}
        </div>
      </div>
      <h1>${esc(heading)}</h1>
      <p class="fp">${esc(tr(L, 'fingerprint'))}</p>
      <p class="h">${esc(hash)}</p>
      ${bodyCopy}
      ${emptyNote}
      ${neverLeaves}
      <p class="muted">${esc(tr(L, 'imessage'))}</p>
      ${njump}
      ${otsCli}
      ${cals}
      <div class="actions">
        ${primaryCta}
        ${otsBtn}
        ${stampFileBtn}
        <a class="btn ghost" href="https://satohash.io/counsel">${esc(tr(L, 'forCounsel'))}</a>
      </div>
    </article>
    <footer>
      ${esc(tr(L, 'footer'))}
      <a href="https://satohash.io/status">${esc(tr(L, 'statusLink'))}</a>
    </footer>
  </div>
</body>
</html>`

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': pending ? 'public, max-age=15' : 'public, max-age=60',
      'x-robots-tag': 'index, follow'
    }
  })
}

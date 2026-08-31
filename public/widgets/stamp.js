/**
 * Satohash family stamp widget
 * Usage:
 *   <div data-satohash-stamp data-client="katoa"></div>
 *   <script src="https://satohash.io/widgets/stamp.js" async></script>
 *
 * Optional: data-label, data-theme="noir|jewel", data-mode="api"
 * Hashes on-device (SHA-256). Never uploads the file.
 */
;(function () {
  var PRODUCTION = 'https://satohash.io'
  var API_ORIGIN = 'https://api.satohash.io'
  var SCRIPT_EL = document.currentScript

  var THEMES = {
    jewel: {
      bg: '#0e1c2a',
      card: '#16304a',
      border: 'rgba(148,197,255,0.14)',
      text: '#e8f4fb',
      muted: '#93a9bb',
      sky: '#38bdf8',
      gold: '#f0b429',
      field: '#12273a',
      shadow: '0 12px 32px rgba(4,14,26,0.55)'
    },
    noir: {
      bg: '#0a0a0b',
      card: '#141416',
      border: 'rgba(255,255,255,0.1)',
      text: '#f4f4f5',
      muted: '#a1a1aa',
      sky: '#e4e4e7',
      gold: '#f0b429',
      field: '#0a0a0b',
      shadow: '0 12px 32px rgba(0,0,0,0.7)'
    }
  }

  function spaOrigin() {
    try {
      var src = SCRIPT_EL && SCRIPT_EL.src
      if (src) {
        var u = new URL(src, PRODUCTION)
        var host = String(u.hostname || '').toLowerCase()
        if (host === 'satohash.io' || host === 'www.satohash.io') return PRODUCTION
        if (u.protocol === 'http:' || u.protocol === 'https:') return u.origin
      }
    } catch (_e) {
      /* keep production origin */
    }
    return PRODUCTION
  }

  function clientId(raw) {
    var s = String(raw || 'public')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '')
      .slice(0, 64)
    return s || 'public'
  }

  function hexFromBuffer(buf) {
    var bytes = new Uint8Array(buf)
    var out = ''
    for (var i = 0; i < bytes.length; i++) {
      var h = bytes[i].toString(16)
      out += h.length === 1 ? '0' + h : h
    }
    return out
  }

  function sha256File(file) {
    return file.arrayBuffer().then(function (ab) {
      return crypto.subtle.digest('SHA-256', ab)
    }).then(hexFromBuffer)
  }

  function openStamp(origin, hash, client, label) {
    var params = new URLSearchParams({ hash: hash, ref: client })
    if (label) params.set('label', label)
    var url = origin + '/stamp?' + params.toString()
    var win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      var a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.click()
    }
    return url
  }

  function cssFor(t) {
    return [
      ':host{all:initial;display:block;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;}',
      '.card{box-sizing:border-box;width:100%;max-width:360px;padding:16px;border-radius:16px;',
      'background:' + t.card + ';border:1px solid ' + t.border + ';color:' + t.text + ';box-shadow:' + t.shadow + ';}',
      '.head{display:flex;align-items:center;gap:8px;margin-bottom:8px;}',
      '.mark{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;',
      'background:' + t.bg + ';color:' + t.gold + ';font-size:14px;font-weight:900;}',
      '.title{font-size:13px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;}',
      '.hint{margin:0 0 12px;font-size:12px;line-height:1.4;color:' + t.muted + ';}',
      '.file{position:relative;display:flex;align-items:center;min-height:44px;padding:0 12px;margin:0 0 10px;',
      'border:1px dashed ' + t.border + ';border-radius:12px;background:' + t.field + ';cursor:pointer;}',
      '.file input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}',
      '.file span{font-size:12px;font-weight:600;color:' + t.text + ';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:44px;border:0;border-radius:12px;',
      'background:' + t.gold + ';color:#0e1c2a;font-size:13px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;}',
      '.btn:disabled{opacity:0.45;cursor:not-allowed;}',
      '.status{margin:10px 0 0;font-size:12px;line-height:1.45;color:' + t.muted + ';word-break:break-all;}',
      '.status a{color:' + t.sky + ';font-weight:700;text-decoration:none;}',
      '.status a:hover{text-decoration:underline;}',
      '.hash{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:' + t.text + ';}'
    ].join('')
  }

  function setStatus(el, html) {
    el.innerHTML = html || ''
  }

  function prefixHash(hash) {
    return hash.slice(0, 12) + '…'
  }

  function filenameFor(file, label) {
    var name = (label || (file && file.name) || 'document').replace(/[/\\]/g, '')
    return name.slice(0, 255) || 'document'
  }

  function initWidget(host) {
    var origin = spaOrigin()
    var client = clientId(host.getAttribute('data-client'))
    var labelAttr = (host.getAttribute('data-label') || '').trim()
    var themeKey = String(host.getAttribute('data-theme') || 'jewel').toLowerCase()
    var theme = THEMES[themeKey] || THEMES.jewel
    var apiMode = String(host.getAttribute('data-mode') || '').toLowerCase() === 'api'

    var root = host.attachShadow({ mode: 'open' })
    var style = document.createElement('style')
    style.textContent = cssFor(theme)
    root.appendChild(style)

    var card = document.createElement('div')
    card.className = 'card'
    card.innerHTML =
      '<div class="head"><span class="mark" aria-hidden="true">₿</span><span class="title">Stamp on Satohash</span></div>' +
      '<p class="hint">Hash stays on this device</p>' +
      '<label class="file"><input type="file"><span>Choose file</span></label>' +
      '<button class="btn" type="button" disabled>Stamp</button>' +
      '<p class="status" role="status"></p>'
    root.appendChild(card)

    var input = root.querySelector('input[type="file"]')
    var fileLabel = root.querySelector('.file span')
    var btn = root.querySelector('.btn')
    var status = root.querySelector('.status')
    var selected = null
    var busy = false

    function refresh() {
      btn.disabled = busy || !selected
      btn.textContent = busy ? 'Hashing…' : 'Stamp'
    }

    input.addEventListener('change', function () {
      selected = input.files && input.files[0] ? input.files[0] : null
      fileLabel.textContent = selected ? selected.name : 'Choose file'
      setStatus(status, '')
      refresh()
    })

    btn.addEventListener('click', function () {
      if (busy || !selected) return
      if (!window.crypto || !crypto.subtle) {
        setStatus(status, 'Needs HTTPS to hash on this device.')
        return
      }
      busy = true
      refresh()
      setStatus(status, '')
      var file = selected
      var stampLabel = filenameFor(file, labelAttr)

      sha256File(file)
        .then(function (hash) {
          var short = '<span class="hash">' + prefixHash(hash) + '</span>'
          if (!apiMode) {
            openStamp(origin, hash, client, stampLabel)
            setStatus(status, short)
            busy = false
            refresh()
            return
          }

          btn.textContent = 'Stamping…'
          return fetch(API_ORIGIN + '/api/stamp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Satohash-Client': client
            },
            body: JSON.stringify({ hash: hash, filename: stampLabel })
          })
            .then(function (res) {
              if (!res.ok) throw new Error('stamp-http')
              return res.json().catch(function () {
                return { hash: hash }
              })
            })
            .then(function (data) {
              var hex = (data && data.hash) || hash
              var proof = origin + '/p/' + hex
              setStatus(
                status,
                '<span class="hash">' +
                  prefixHash(hex) +
                  '</span> · <a href="' +
                  proof +
                  '" target="_blank" rel="noopener noreferrer">Open proof</a>'
              )
            })
            .catch(function () {
              openStamp(origin, hash, client, stampLabel)
              setStatus(status, short)
            })
            .then(function () {
              busy = false
              refresh()
            })
        })
        .catch(function () {
          setStatus(status, 'Could not hash this file.')
          busy = false
          refresh()
        })
    })

    host.setAttribute('data-satohash-stamp-init', '1')
  }

  function boot() {
    var nodes = document.querySelectorAll('[data-satohash-stamp]:not([data-satohash-stamp-init])')
    for (var i = 0; i < nodes.length; i++) {
      try {
        initWidget(nodes[i])
      } catch (_e) {
        /* skip a broken host node */
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }

  window.SatohashStamp = { init: boot }
})()

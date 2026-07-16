/**
 * Satohash Proof DNA Widget v3.0
 * Usage:
 *   <div class="satohash-dna" data-hash="SHA256_HEX"></div>
 *   <script src="/widgets/proof-dna-v3.js" async></script>
 *
 * Optional: data-size="sm|md", data-verify="URL", data-label="Badge title"
 */
(function () {
  const SIZES = { sm: 48, md: 64 }

  const THEMES = {
    noir: { bg: 'rgba(255,255,255,0.05)', mark: 'rgba(255,255,255,0.35)' },
    light: { bg: 'rgba(0,0,0,0.04)', mark: 'rgba(0,0,0,0.25)' }
  }

  function initWidget(widget) {
    const hash = widget.getAttribute('data-hash')
    if (!hash || hash.length < 18) return

    const sizeKey = widget.getAttribute('data-size') || 'md'
    const px = SIZES[sizeKey] || SIZES.md
    const themeKey = (widget.getAttribute('data-theme') || 'noir').toLowerCase()
    const theme = THEMES[themeKey] || THEMES.noir
    const domain = widget.getAttribute('data-domain') || ''
    const origin =
      (typeof window !== 'undefined' && window.location?.origin) || 'https://satohash.giveabit.io'
    const verifyUrl =
      widget.getAttribute('data-verify') || `${origin}/verify/${hash}`
    const label = widget.getAttribute('data-label') || `Satohash Proof DNA: ${hash.substring(0, 12)}…`

    const colors = [
      `#${hash.substring(0, 6)}`,
      `#${hash.substring(6, 12)}`,
      `#${hash.substring(12, 18)}`
    ]

    widget.innerHTML = ''
    widget.setAttribute('role', 'img')
    widget.setAttribute('aria-label', label)
    widget.title = label
    widget.style.cssText = [
      `width:${px}px`,
      `height:${px}px`,
      'border-radius:16px',
      'position:relative',
      'overflow:hidden',
      'cursor:pointer',
      `background:linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
      `box-shadow:0 10px 30px ${colors[0]}44`,
      'transition:transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      'display:inline-block'
    ].join(';')

    const layer = document.createElement('div')
    layer.style.cssText = [
      'position:absolute',
      'inset:4px',
      'border-radius:12px',
      `border:1px solid ${colors[2]}44`,
      `background:${theme.bg}`,
      'pointer-events:none'
    ].join(';')
    widget.appendChild(layer)

    const mark = document.createElement('span')
    mark.textContent = '₿'
    mark.style.cssText = [
      'position:absolute',
      'bottom:6px',
      'right:8px',
      'font-size:10px',
      'font-weight:900',
      `color:${theme.mark}`,
      'pointer-events:none'
    ].join(';')
    widget.appendChild(mark)

    if (domain) {
      const badge = document.createElement('span')
      badge.textContent = domain.replace(/^https?:\/\//, '').slice(0, 18)
      badge.style.cssText = [
        'position:absolute',
        'top:6px',
        'left:8px',
        'font-size:8px',
        'font-weight:800',
        'letter-spacing:0.05em',
        `color:${theme.mark}`,
        'pointer-events:none',
        'text-transform:uppercase'
      ].join(';')
      widget.appendChild(badge)
    }

    widget.addEventListener('mouseenter', () => { widget.style.transform = 'scale(1.08)' })
    widget.addEventListener('mouseleave', () => { widget.style.transform = 'scale(1)' })
    widget.addEventListener('click', () => window.open(verifyUrl, '_blank', 'noopener'))
  }

  function boot() {
    document.querySelectorAll('.satohash-dna-v3:not([data-satohash-init])').forEach((el) => {
      el.setAttribute('data-satohash-init', '1')
      initWidget(el)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot)
  } else {
    boot()
  }

  window.SatohashProofDNA = { init: boot }
})()
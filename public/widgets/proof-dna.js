/**
 * Satohash Proof DNA Widget v2.0
 * Usage:
 *   <div class="satohash-dna" data-hash="SHA256_HEX"></div>
 *   <script src="https://satohash.io/widgets/proof-dna.js" async></script>
 *
 * Optional: data-size="sm|md", data-verify="URL", data-label="Badge title"
 */
(function () {
  const SIZES = { sm: 48, md: 64 }

  function initWidget(widget) {
    const hash = widget.getAttribute('data-hash')
    if (!hash || hash.length < 18) return

    const sizeKey = widget.getAttribute('data-size') || 'md'
    const px = SIZES[sizeKey] || SIZES.md
    const verifyUrl = widget.getAttribute('data-verify') || `https://satohash.io/verify?hash=${hash}`
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
      'background:rgba(255,255,255,0.05)',
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
      'color:rgba(255,255,255,0.35)',
      'pointer-events:none'
    ].join(';')
    widget.appendChild(mark)

    widget.addEventListener('mouseenter', () => { widget.style.transform = 'scale(1.08)' })
    widget.addEventListener('mouseleave', () => { widget.style.transform = 'scale(1)' })
    widget.addEventListener('click', () => window.open(verifyUrl, '_blank', 'noopener'))
  }

  function boot() {
    document.querySelectorAll('.satohash-dna:not([data-satohash-init])').forEach((el) => {
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
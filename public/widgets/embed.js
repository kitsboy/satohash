/**
 * Satohash embed bridge — MotoPass / sister apps
 * window.postMessage({ type: 'satohash:open', hash: '...', label: '...' }, '*')
 */
;(function () {
  window.addEventListener('message', (event) => {
    const data = event.data
    if (!data || data.type !== 'satohash:open' || !data.hash) return
    const params = new URLSearchParams({
      hash: data.hash,
      source: data.source || 'embed',
      label: data.label || 'Embedded document'
    })
    window.open(`https://satohash.io/stamp?${params}`, '_blank', 'noopener')
  })
})()
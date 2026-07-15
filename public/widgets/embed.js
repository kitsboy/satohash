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
    const origin =
      (typeof window !== 'undefined' && window.location?.origin) || 'https://satohash.giveabit.io'
    window.open(`${origin}/stamp?${params}`, '_blank', 'noopener')
  })
})()
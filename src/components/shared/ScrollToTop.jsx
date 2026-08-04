import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Always land at the top of a new route (mobile SPA was preserving scrollY,
 * so /stamp and short pages opened "blank" near the previous bottom).
 * Hash links still jump to the target id after paint.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
    } catch {
      /* ignore */
    }

    if (hash && hash.length > 1) {
      const id = decodeURIComponent(hash.slice(1))
      // Defer until target section may exist in the new tree
      requestAnimationFrame(() => {
        const el =
          document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo(0, 0)
        }
      })
      return
    }

    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    const main = document.getElementById('main-content')
    if (main) main.scrollTop = 0
  }, [pathname, search, hash])

  return null
}

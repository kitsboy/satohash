import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function isTypingTarget(el) {
  if (!el || typeof el !== 'object') return false
  if (el.isContentEditable) return true
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

/**
 * Single-letter jumps when the user is not typing.
 * ⌘S / ⌘V stay in AppShellNoir (save-page / vault). These do not steal modifier combos.
 */
export default function useAppHotkeys() {
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (isTypingTarget(e.target)) return
      const k = e.key.toLowerCase()
      if (k === 's') {
        e.preventDefault()
        navigate('/stamp')
      } else if (k === 'v') {
        e.preventDefault()
        navigate('/verify')
      } else if (k === 'g') {
        e.preventDefault()
        navigate('/watch')
      } else if (k === 'd') {
        e.preventDefault()
        navigate('/docs')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])
}

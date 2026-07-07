import { useEffect, useCallback } from 'react'

/** SHA-256 hex pattern */
export const SHA256_HEX = /^[a-f0-9]{64}$/i

/** Activate element on Enter or Space (for role="button" surfaces) */
export function handleActivationKey(e, action) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    action()
  }
}

/** Close on Escape — returns cleanup-friendly handler factory */
export function useEscapeKey(isActive, onClose) {
  useEffect(() => {
    if (!isActive) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isActive, onClose])
}

/** Lock body scroll while overlay is open */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isLocked])
}

/** Focus trap: initial focus + Tab/Shift+Tab cycles within container */
export function useFocusTrap(ref, isActive) {
  useEffect(() => {
    if (!isActive || !ref.current) return undefined
    const container = ref.current
    const getFocusable = () =>
      Array.from(
        container.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
    const focusable = getFocusable()
    const first = focusable[0]
    if (first) first.focus()

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) return
      const f = items[0]
      const l = items[items.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === f) {
          e.preventDefault()
          l.focus()
        }
      } else if (document.activeElement === l) {
        e.preventDefault()
        f.focus()
      }
    }
    container.addEventListener('keydown', onKeyDown)
    return () => container.removeEventListener('keydown', onKeyDown)
  }, [isActive, ref])
}

/** Enter submits hash/search inputs */
export function useEnterSubmit(value, onSubmit) {
  return useCallback(
    (e) => {
      if (e.key === 'Enter' && value?.trim()) {
        e.preventDefault()
        onSubmit(value.trim())
      }
    },
    [value, onSubmit]
  )
}

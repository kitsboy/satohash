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

/** Focus first focusable child when dialog opens */
export function useFocusTrap(ref, isActive) {
  useEffect(() => {
    if (!isActive || !ref.current) return undefined
    const focusable = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    if (first) first.focus()
    return undefined
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

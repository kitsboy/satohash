import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, KeyRound } from 'lucide-react'
import { useFocusTrap, useBodyScrollLock } from '../utils/a11y'

/**
 * Mobile-first PIN entry modal for encrypting/restoring nsec keys.
 */
export default function PinModal({
  isOpen,
  onClose,
  onSubmit,
  title = 'Enter PIN',
  description = 'Use a 4–6 digit PIN to secure your key on this device.',
  submitLabel = 'Confirm',
  minLength = 4,
  maxLength = 6,
  variant = 'pin' // 'pin' | 'passphrase'
}) {
  const [pin, setPin] = useState('')
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  useFocusTrap(dialogRef, isOpen)
  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (isOpen) {
      setPin('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pin.length < minLength) return
    onSubmit(pin)
    setPin('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pin-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="w-full max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-noir, 0 25px 60px rgba(0,0,0,0.5))'
            }}
          >
            <div
              className="flex items-center justify-between border-b px-5 py-4"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: 'color-mix(in srgb, var(--accent-gold) 15%, transparent)',
                    color: 'var(--accent-gold)'
                  }}
                >
                  <KeyRound size={18} />
                </div>
                <h2
                  id="pin-modal-title"
                  className="text-base font-black tracking-tight uppercase"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 pb-8 sm:p-6">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>

              <input
                ref={inputRef}
                type="password"
                inputMode={variant === 'passphrase' ? 'text' : 'numeric'}
                pattern={variant === 'passphrase' ? undefined : '[0-9]*'}
                maxLength={maxLength}
                value={pin}
                onChange={(e) =>
                  setPin(
                    variant === 'passphrase'
                      ? e.target.value.slice(0, maxLength)
                      : e.target.value.replace(/\D/g, '').slice(0, maxLength)
                  )
                }
                placeholder="••••••"
                className="h-14 w-full rounded-2xl border px-4 text-center font-mono text-2xl tracking-[0.5em] outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  caretColor: 'var(--accent-gold)'
                }}
                autoComplete="off"
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-12 min-h-[44px] flex-1 rounded-xl border text-xs font-bold tracking-widest uppercase transition-colors hover:bg-white/5"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pin.length < minLength}
                  className="h-12 min-h-[44px] flex-1 rounded-xl text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
                >
                  {submitLabel}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

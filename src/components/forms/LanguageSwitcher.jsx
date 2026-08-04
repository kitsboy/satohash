import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n, languages } from '../../i18n'

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const ref = useRef(null)
  const current = languages.find((l) => l.code === lang) ?? languages[0]

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handler, true)
    return () => document.removeEventListener('pointerdown', handler, true)
  }, [])

  // Escape closes menu
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const pick = useCallback(
    async (code) => {
      if (busy) return
      setBusy(true)
      try {
        await setLang(code)
      } finally {
        setBusy(false)
        setOpen(false)
      }
    },
    [busy, setLang]
  )

  return (
    <div ref={ref} className="relative z-[120]">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        disabled={busy}
        aria-label="Select language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={
          compact
            ? 'flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-lg transition-all hover:border-[var(--border-gold)] hover:bg-[rgba(240,180,41,0.06)] disabled:opacity-60'
            : 'flex h-10 min-h-[40px] items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase transition-all hover:border-[var(--border-gold)] hover:text-[var(--text-primary)] disabled:opacity-60'
        }
      >
        <span className="leading-none" aria-hidden>
          {current.flag}
        </span>
        {!compact && <span>{current.code.toUpperCase()}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Language options"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 z-[300] mt-2 max-h-[min(70vh,360px)] w-52 overflow-y-auto rounded-2xl border border-[var(--border-bright)] bg-[var(--bg-secondary)] py-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
            style={{ backdropFilter: 'blur(16px)' }}
          >
            {languages.map((l) => {
              const isActive = lang === l.code
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  disabled={busy}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    pick(l.code)
                  }}
                  className={`flex min-h-[44px] w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-xs font-bold transition-colors hover:bg-[var(--surface-raised)] disabled:opacity-50 ${
                    isActive
                      ? 'bg-[rgba(240,180,41,0.08)] text-[var(--accent-gold)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {l.flag}
                  </span>
                  <span className="flex-1">{l.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

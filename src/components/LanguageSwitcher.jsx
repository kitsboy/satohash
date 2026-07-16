import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n, languages } from '../i18n'

export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = languages.find((l) => l.code === lang) ?? languages[0]

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Select language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={
          compact
            ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-base transition-all hover:border-[var(--border-bright)]'
            : 'flex h-8 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase transition-all hover:border-[var(--border-bright)] hover:text-[var(--text-primary)]'
        }
      >
        <span className="leading-none">{current.flag}</span>
        {!compact && <span>{current.code.toUpperCase()}</span>}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Language options"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 z-[200] mt-2 max-h-[min(70vh,320px)] w-48 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow-noir)]"
          >
            {languages.map((l) => {
              const isActive = lang === l.code
              return (
                <button
                  key={l.code}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setLang(l.code)
                    setOpen(false)
                  }}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-xs font-bold transition-colors hover:bg-[var(--surface-raised)] ${
                    isActive ? 'text-[var(--accent-active)]' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  <span className="flex-1">{l.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-active)]" />
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

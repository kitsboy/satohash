import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useI18n, languages } from '../../i18n'
import { switchAppLanguage } from '../../i18n/setup'

/**
 * Header language control — all supported locales (en/es/fr/de/pt/sw/zh).
 * Desktop: full flag strip. Mobile / compact: flag button + portaled menu
 * (avoids overflow:hidden clipping on nav bars).
 */
export default function LanguageSwitcher({ compact = false, showAllFlags = true }) {
  const { lang, setLang } = useI18n()
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const current = languages.find((l) => l.code === lang) ?? languages[0]

  const placeMenu = useCallback(() => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setMenuPos({
      top: r.bottom + 8,
      right: Math.max(8, window.innerWidth - r.right)
    })
  }, [])

  useEffect(() => {
    if (!open) return undefined
    placeMenu()
    const onScroll = () => placeMenu()
    const onResize = () => placeMenu()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [open, placeMenu])

  useEffect(() => {
    if (!open) return undefined
    const handler = (e) => {
      const t = e.target
      if (btnRef.current?.contains(t)) return
      if (menuRef.current?.contains(t)) return
      setOpen(false)
    }
    // bubble phase so option clicks fire first
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

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
      if (busy || code === lang) {
        setOpen(false)
        return
      }
      setBusy(true)
      try {
        // Prefer direct bundle load + changeLanguage (most reliable)
        await switchAppLanguage(code)
        // Sync React I18nContext (section t() + lang flag)
        await setLang(code)
      } catch (err) {
        console.error('[LanguageSwitcher] failed to switch', code, err)
        try {
          await i18n.changeLanguage(code)
        } catch (e2) {
          console.error('[LanguageSwitcher] fallback failed', e2)
        }
      } finally {
        setBusy(false)
        setOpen(false)
      }
    },
    [busy, lang, setLang, i18n]
  )

  const flagBtn = (l, { size = 'md' } = {}) => {
    const isActive = lang === l.code
    const box =
      size === 'sm'
        ? 'h-8 w-8 text-base'
        : 'h-9 w-9 min-h-[36px] min-w-[36px] text-lg sm:h-10 sm:w-10'
    return (
      <button
        key={l.code}
        type="button"
        title={`${l.label} (${l.native || l.code})`}
        aria-label={`Language: ${l.label}`}
        aria-pressed={isActive}
        disabled={busy}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          pick(l.code)
        }}
        className={`inline-flex shrink-0 items-center justify-center rounded-lg border transition-all disabled:opacity-50 ${box} ${
          isActive
            ? 'border-[var(--accent-gold)] bg-[rgba(240,180,41,0.14)] shadow-[0_0_0_1px_rgba(240,180,41,0.25)]'
            : 'border-transparent bg-transparent hover:border-[var(--border)] hover:bg-[var(--surface-raised)]'
        }`}
      >
        <span className="leading-none" aria-hidden>
          {l.flag}
        </span>
      </button>
    )
  }

  // Desktop / wide: show every flag in the menu bar
  if (showAllFlags && !compact) {
    return (
      <div
        role="group"
        aria-label="Language"
        className="flex max-w-[min(100vw-8rem,22rem)] flex-wrap items-center justify-end gap-0.5"
      >
        {languages.map((l) => flagBtn(l, { size: 'sm' }))}
      </div>
    )
  }

  // Compact header: current flag + full menu (all languages) via portal
  const menu =
    open &&
    typeof document !== 'undefined' &&
    createPortal(
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          role="listbox"
          aria-label="Language options"
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.14 }}
          className="fixed z-[5000] w-[min(18rem,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-[var(--border-bright)] py-2 shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
          style={{
            top: menuPos.top,
            right: menuPos.right,
            background: 'color-mix(in srgb, var(--bg-secondary) 96%, transparent)',
            backdropFilter: 'blur(18px)'
          }}
        >
          <p
            className="px-4 pb-2 text-[9px] font-black tracking-[0.2em] uppercase"
            style={{ color: 'var(--text-tertiary)' }}
          >
            Language · {languages.length}
          </p>
          {/* All flags row inside panel too */}
          <div className="mb-2 flex flex-wrap gap-1 border-b border-[var(--border)] px-3 pb-3">
            {languages.map((l) => flagBtn(l, { size: 'sm' }))}
          </div>
          {languages.map((l) => {
            const isActive = lang === l.code
            return (
              <button
                key={`row-${l.code}`}
                type="button"
                role="option"
                aria-selected={isActive}
                disabled={busy}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  pick(l.code)
                }}
                className={`flex min-h-[48px] w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-[var(--surface-raised)] disabled:opacity-50 ${
                  isActive
                    ? 'bg-[rgba(240,180,41,0.1)] text-[var(--accent-gold)]'
                    : 'text-[var(--text-primary)]'
                }`}
              >
                <span className="text-xl leading-none" aria-hidden>
                  {l.flag}
                </span>
                <span className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate">{l.label}</span>
                  <span
                    className="text-[10px] font-medium tracking-wide uppercase"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {l.code}
                  </span>
                </span>
                {isActive && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                )}
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>,
      document.body
    )

  return (
    <div className="relative z-[120] flex items-center gap-1">
      {/* Optional mini flag strip next to compact control on sm+ */}
      {showAllFlags && (
        <div className="mr-0.5 hidden items-center gap-0.5 lg:flex" role="group" aria-label="Languages">
          {languages.map((l) => flagBtn(l, { size: 'sm' }))}
        </div>
      )}

      <button
        ref={btnRef}
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
          placeMenu()
        }}
        disabled={busy}
        aria-label={`Language: ${current.label}. Open full list`}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={
          compact
            ? 'flex h-11 min-h-[44px] w-11 min-w-[44px] shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-xl transition-all hover:border-[var(--border-gold)] hover:bg-[rgba(240,180,41,0.06)] disabled:opacity-60'
            : 'flex h-10 min-h-[40px] items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-3 text-[10px] font-black tracking-widest text-[var(--text-secondary)] uppercase transition-all hover:border-[var(--border-gold)] hover:text-[var(--text-primary)] disabled:opacity-60'
        }
      >
        <span className="leading-none" aria-hidden>
          {current.flag}
        </span>
        {!compact && <span>{current.code.toUpperCase()}</span>}
      </button>
      {menu}
    </div>
  )
}

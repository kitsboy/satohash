import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Check, Globe2 } from 'lucide-react'
import { useI18n, languages } from '../../i18n'
import { switchAppLanguage } from '../../i18n/setup'
import { placePopover } from '../../utils/placePopover'

/**
 * Elite language control for the menu bar.
 * Single trigger (flag + code) → portaled panel with all 7 locales.
 * Never dumps a flag strip into the header (that cluttered the bar).
 */
export default function LanguageSwitcher({ compact = false }) {
  const { lang, setLang } = useI18n()
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 8, width: 280, maxHeight: 360, side: 'below' })
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const current = languages.find((l) => l.code === lang) ?? languages[0]

  const place = useCallback(() => {
    const el = btnRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const width = Math.min(280, window.innerWidth - 24)
    const height = Math.min(22 * 16, window.innerHeight * 0.62)
    setPos(placePopover(r, { width, height, gap: 10, pad: 12, prefer: 'below' }))
  }, [])

  useEffect(() => {
    if (!open) return undefined
    place()
    const reflow = () => place()
    window.addEventListener('resize', reflow)
    window.addEventListener('scroll', reflow, true)
    return () => {
      window.removeEventListener('resize', reflow)
      window.removeEventListener('scroll', reflow, true)
    }
  }, [open, place])

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (btnRef.current?.contains(e.target)) return
      if (menuRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pick = useCallback(
    async (code) => {
      if (busy) return
      if (code === lang) {
        setOpen(false)
        return
      }
      setBusy(true)
      try {
        await switchAppLanguage(code)
        await setLang(code)
      } catch (err) {
        console.error('[LanguageSwitcher]', err)
        try {
          await i18n.changeLanguage(code)
          await setLang(code)
        } catch {
          /* ignore */
        }
      } finally {
        setBusy(false)
        setOpen(false)
      }
    },
    [busy, lang, setLang, i18n]
  )

  const panel =
    open &&
    typeof document !== 'undefined' &&
    createPortal(
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          role="listbox"
          aria-label="Select language"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-[6000] overflow-hidden rounded-2xl border py-2"
          style={{
            top: pos.top,
            left: pos.left,
            width: pos.width,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: pos.maxHeight,
            borderColor: 'var(--border-bright)',
            background: 'color-mix(in srgb, var(--bg-secondary) 97%, #000)',
            boxShadow:
              '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(240,180,41,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 pt-1 pb-2.5">
            <Globe2 size={14} style={{ color: 'var(--accent-gold)' }} />
            <span
              className="text-[10px] font-black tracking-[0.16em] uppercase"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Language
            </span>
          </div>

          <div className="max-h-[min(52vh,20rem)] overflow-y-auto overscroll-contain py-1">
            {languages.map((l) => {
              const active = lang === l.code
              return (
                <button
                  key={l.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={busy}
                  onClick={() => pick(l.code)}
                  className="flex min-h-[48px] w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors disabled:opacity-50"
                  style={{
                    background: active ? 'rgba(240,180,41,0.1)' : 'transparent',
                    color: active ? 'var(--accent-gold)' : 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = 'var(--surface-raised)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = active
                      ? 'rgba(240,180,41,0.1)'
                      : 'transparent'
                  }}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xl leading-none"
                    style={{
                      background: active ? 'rgba(240,180,41,0.16)' : 'var(--bg-primary)',
                      border: `1px solid ${active ? 'rgba(240,180,41,0.35)' : 'var(--border)'}`
                    }}
                    aria-hidden
                  >
                    {l.flag}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] leading-tight font-semibold">
                      {l.label}
                    </span>
                    <span
                      className="mt-0.5 block text-[10px] font-medium tracking-wide uppercase"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {l.native || l.code.toUpperCase()}
                    </span>
                  </span>
                  {active ? (
                    <Check size={16} className="shrink-0" style={{ color: 'var(--accent-gold)' }} />
                  ) : (
                    <span
                      className="w-4 shrink-0 text-center font-mono text-[10px] font-bold uppercase"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {l.code}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    )

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        disabled={busy}
        aria-label={`Language: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((v) => !v)
          place()
        }}
        className={
          compact
            ? 'inline-flex h-10 min-h-[40px] w-10 min-w-[40px] shrink-0 items-center justify-center rounded-xl border transition-all disabled:opacity-60'
            : 'inline-flex h-10 min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl border px-2.5 transition-all disabled:opacity-60 sm:px-3'
        }
        style={{
          borderColor: open ? 'var(--accent-gold)' : 'var(--border)',
          background: open ? 'rgba(240,180,41,0.1)' : 'var(--bg-primary)',
          color: 'var(--text-primary)',
          boxShadow: open ? '0 0 0 1px rgba(240,180,41,0.2)' : 'none'
        }}
      >
        <span className="text-lg leading-none sm:text-xl" aria-hidden>
          {current.flag}
        </span>
        {!compact && (
          <>
            <span
              className="hidden text-[11px] font-bold tracking-wide uppercase sm:inline"
              style={{ color: 'var(--text-secondary)' }}
            >
              {current.code}
            </span>
            <ChevronDown
              size={14}
              className="shrink-0 opacity-60 transition-transform"
              style={{ transform: open ? 'rotate(180deg)' : 'none' }}
              aria-hidden
            />
          </>
        )}
      </button>
      {panel}
    </>
  )
}

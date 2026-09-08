import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { placePopover, canHoverFine } from '../../utils/placePopover'

/** One gold ring + i-mark. Not Lucide Info (that would be a circle inside a circle). */
function InfoMark() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden className="shrink-0">
      <circle cx="8" cy="8" r="6.6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="5.15" r="1" fill="currentColor" />
      <rect x="7.2" y="7.15" width="1.6" height="5.05" rx="0.8" fill="currentColor" />
    </svg>
  )
}

/**
 * Tooltip — info trigger. Portaled + clamped so it never opens off-screen.
 * Hover on fine pointers; tap-to-toggle on touch.
 * Single gold circle around the i. Optional `label` for a row of steps.
 */
export default function Tooltip({ title, content, className = '', label = '' }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState(null)
  const triggerRef = useRef(null)
  const cardRef = useRef(null)

  const place = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vw = window.innerWidth
    const width = Math.min(280, vw - 24)
    const estimate = Math.min(220, window.innerHeight * 0.45)
    setPos(placePopover(rect, { width, height: estimate, gap: 10, pad: 12, prefer: 'above' }))
  }, [])

  useEffect(() => {
    if (!visible) return undefined
    place()
    const onReflow = () => place()
    window.addEventListener('resize', onReflow)
    window.addEventListener('scroll', onReflow, true)
    return () => {
      window.removeEventListener('resize', onReflow)
      window.removeEventListener('scroll', onReflow, true)
    }
  }, [visible, place])

  useEffect(() => {
    if (!visible || !cardRef.current || !triggerRef.current) return
    const card = cardRef.current.getBoundingClientRect()
    const rect = triggerRef.current.getBoundingClientRect()
    const next = placePopover(rect, {
      width: Math.min(280, window.innerWidth - 24),
      height: card.height,
      gap: 10,
      pad: 12,
      prefer: 'above'
    })
    setPos((prev) => {
      if (
        prev &&
        Math.abs(prev.top - next.top) < 2 &&
        Math.abs(prev.left - next.left) < 2 &&
        prev.side === next.side
      ) {
        return prev
      }
      return next
    })
  }, [visible])

  useEffect(() => {
    if (!visible) return undefined
    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return
      if (cardRef.current?.contains(e.target)) return
      setVisible(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setVisible(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [visible])

  const show = () => {
    place()
    setVisible(true)
  }
  const hide = () => setVisible(false)
  const toggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setVisible((v) => {
      if (!v) place()
      return !v
    })
  }

  const hoverable = canHoverFine()

  const card =
    visible &&
    pos &&
    typeof document !== 'undefined' &&
    createPortal(
      <AnimatePresence>
        <motion.div
          ref={cardRef}
          role="tooltip"
          initial={{ opacity: 0, scale: 0.96, y: pos.side === 'below' ? -4 : 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          className="fixed z-[7000] rounded-xl border bg-[var(--bg-secondary)] p-3.5 shadow-[var(--shadow-noir)]"
          style={{
            top: pos.top,
            left: pos.left,
            width: pos.width,
            maxWidth: 'calc(100vw - 24px)',
            borderColor: 'color-mix(in srgb, var(--accent-gold) 28%, var(--border))'
          }}
        >
          <span
            aria-hidden
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border bg-[var(--bg-secondary)]"
            style={{
              borderColor: 'color-mix(in srgb, var(--accent-active) 30%, var(--border-bright))',
              ...(pos.side === 'below'
                ? { top: -5, borderRight: 'none', borderBottom: 'none' }
                : { bottom: -5, borderLeft: 'none', borderTop: 'none' })
            }}
          />
          {title && (
            <p className="mb-1.5 text-[10px] font-black tracking-widest text-[var(--accent-gold)] uppercase">
              {title}
            </p>
          )}
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{content}</p>
        </motion.div>
      </AnimatePresence>,
      document.body
    )

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={title ? `Info: ${title}` : 'More information'}
        aria-expanded={visible}
        className={`relative ml-0.5 inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/45 focus-visible:outline-none ${
          label
            ? 'min-h-[44px] px-1'
            : "h-4 w-4 before:absolute before:inset-[-14px] before:content-['']"
        } ${visible ? 'text-[var(--accent-gold)]' : 'text-[var(--accent-gold)]/80 hover:text-[var(--accent-gold)]'}`}
        onPointerDown={hoverable ? undefined : toggle}
        onMouseEnter={hoverable ? show : undefined}
        onMouseLeave={hoverable ? hide : undefined}
        onFocus={show}
        onBlur={(e) => {
          if (cardRef.current?.contains(e.relatedTarget)) return
          if (!hoverable) return
          hide()
        }}
      >
        <InfoMark />
        {label ? (
          <span className="max-w-[7.5rem] truncate text-[10px] font-bold tracking-wider uppercase">
            {label}
          </span>
        ) : null}
      </button>
      {card}
    </span>
  )
}

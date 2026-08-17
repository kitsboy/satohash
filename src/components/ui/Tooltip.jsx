import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { placePopover, canHoverFine } from '../../utils/placePopover'

/**
 * Tooltip — info (i) trigger. Portaled + clamped so it never opens off-screen.
 * Hover on fine pointers; tap-to-toggle on touch.
 */
export default function Tooltip({ title, content, className = '' }) {
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
          className="fixed z-[7000] rounded-xl border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-3.5 shadow-[var(--shadow-noir)]"
          style={{
            top: pos.top,
            left: pos.left,
            width: pos.width,
            maxWidth: 'calc(100vw - 24px)'
          }}
        >
          <span
            aria-hidden
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-[var(--border-bright)] bg-[var(--bg-secondary)]"
            style={
              pos.side === 'below'
                ? { top: -5, borderRight: 'none', borderBottom: 'none' }
                : { bottom: -5, borderLeft: 'none', borderTop: 'none' }
            }
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
        className="ml-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--accent-gold)] text-[10px] font-black text-[var(--accent-gold)] transition-all hover:bg-[var(--accent-gold-subtle)] focus:ring-2 focus:ring-[var(--accent-gold)]/40 focus:outline-none sm:h-5 sm:w-5 sm:text-[9px]"
        onClick={toggle}
        onMouseEnter={hoverable ? show : undefined}
        onMouseLeave={hoverable ? hide : undefined}
        onFocus={show}
        onBlur={(e) => {
          if (cardRef.current?.contains(e.relatedTarget)) return
          if (!hoverable) return
          hide()
        }}
      >
        i
      </button>
      {card}
    </span>
  )
}

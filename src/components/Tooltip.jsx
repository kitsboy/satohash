import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Tooltip — a small info tooltip triggered on hover of an (i) icon button.
 *
 * Props:
 *   title    — string, shown in accent uppercase label at top of card
 *   content  — string, the explanation body
 *   className — optional extra classes on the wrapper span
 */
export default function Tooltip({ title, content, className = '' }) {
  const [visible, setVisible] = useState(false)
  const [flipBelow, setFlipBelow] = useState(false)
  const [flipLeft, setFlipLeft] = useState(false)
  const triggerRef = useRef(null)

  // Compute flip directions in an effect (safe ref access outside render)
  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setFlipBelow(rect.top < 120)
      setFlipLeft(rect.left > window.innerWidth * 0.55)
    }
  }, [visible])

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {/* (i) trigger button */}
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Info: ${title}`}
        className="ml-1.5 flex h-4 w-4 flex-shrink-0 cursor-default items-center justify-center rounded-full border border-[var(--accent-active)] text-[9px] font-black text-[var(--accent-active)] shadow-[0_0_6px_var(--accent-active)] transition-all hover:shadow-[0_0_12px_var(--accent-active)] focus:ring-1 focus:ring-[var(--accent-active)] focus:outline-none"
      >
        i
      </button>

      {/* Tooltip card */}
      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, scale: 0.92, y: flipBelow ? -6 : 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: flipBelow ? -6 : 6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="pointer-events-none absolute z-50 w-[280px] rounded-xl border border-[var(--border-bright)] bg-[var(--bg-secondary)] p-3.5 shadow-[var(--shadow-noir)]"
            style={{
              // Horizontal: clamp to viewport when near right edge
              ...(flipLeft
                ? { right: 0, left: 'auto', transform: 'none' }
                : { left: '50%', transform: 'translateX(-50%)' }),
              // Vertical: flip above/below based on available room
              ...(flipBelow
                ? { top: 'calc(100% + 8px)', bottom: 'auto' }
                : { bottom: 'calc(100% + 8px)', top: 'auto' })
            }}
          >
            {/* Small caret — repositioned when flipped left */}
            <span
              className={`absolute border-4 border-transparent ${flipLeft ? 'right-2 -translate-x-0' : 'left-1/2 -translate-x-1/2'}`}
              style={
                flipBelow
                  ? {
                      top: -8,
                      borderBottomColor: 'var(--border-bright)'
                    }
                  : {
                      bottom: -8,
                      borderTopColor: 'var(--border-bright)'
                    }
              }
            />

            {title && (
              <p className="mb-1.5 text-[10px] font-black tracking-widest text-[var(--accent-active)] uppercase">
                {title}
              </p>
            )}
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

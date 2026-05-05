import { useState, useRef } from 'react'
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
  const triggerRef = useRef(null)

  // Flip below if trigger is within 120px of the top of the viewport
  const shouldFlipBelow = () => {
    if (!triggerRef.current) return false
    const rect = triggerRef.current.getBoundingClientRect()
    return rect.top < 120
  }

  const flipBelow = visible && shouldFlipBelow()

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
        className="ml-1.5 flex h-4 w-4 flex-shrink-0 cursor-default items-center justify-center rounded-full border border-[var(--border)] text-[9px] font-black text-[var(--text-secondary)] transition-all hover:border-[var(--accent-active)] hover:text-[var(--accent-active)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-active)]"
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
              // Position: centred horizontally under/over the button
              left: '50%',
              transform: 'translateX(-50%)',
              ...(flipBelow
                ? { top: 'calc(100% + 8px)', bottom: 'auto' }
                : { bottom: 'calc(100% + 8px)', top: 'auto' })
            }}
          >
            {/* Small caret */}
            <span
              className="absolute left-1/2 -translate-x-1/2 border-4 border-transparent"
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
              <p className="mb-1.5 text-[10px] font-black tracking-widest uppercase text-[var(--accent-active)]">
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

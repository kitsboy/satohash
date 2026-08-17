import { motion, AnimatePresence } from 'framer-motion'
import { X, Command } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['S'], label: 'Go to Stamp' },
  { keys: ['V'], label: 'Go to Verify' },
  { keys: ['G'], label: 'Watch explainer' },
  { keys: ['D'], label: 'Open docs' },
  { keys: ['⌘', 'K'], label: 'Open command palette' },
  { keys: ['⌘', 'S'], label: 'Go to Stamp' },
  { keys: ['⌘', 'V'], label: 'Go to Vault' },
  { keys: ['⌘', 'E'], label: 'Go to Explorer' },
  { keys: ['⌘', 'B'], label: 'Go to Batch Stamp' },
  { keys: ['?'], label: 'Show keyboard shortcuts' },
  { keys: ['Esc'], label: 'Close overlays' }
]

export default function KeyboardShortcutsOverlay({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border-bright)] bg-[var(--bg-secondary)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div className="flex items-center gap-2">
                <Command size={16} className="text-[var(--accent-gold)]" />
                <h2 className="text-sm font-black tracking-widest uppercase">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close keyboard shortcuts"
                className="rounded-lg p-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="divide-y divide-[var(--border)] px-6 py-2">
              {SHORTCUTS.map((shortcut) => (
                <li key={shortcut.label} className="flex items-center justify-between gap-4 py-3">
                  <span className="text-sm text-[var(--text-secondary)]">{shortcut.label}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd
                        key={key}
                        className="rounded-md border border-[var(--border-bright)] bg-[var(--bg-primary)] px-2 py-1 font-mono text-[10px] font-bold text-[var(--accent-gold)]"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <p className="border-t border-[var(--border)] px-6 py-3 text-center text-[10px] text-[var(--text-secondary)]">
              Press <kbd className="font-mono text-[var(--accent-gold)]">?</kbd> anytime to toggle
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

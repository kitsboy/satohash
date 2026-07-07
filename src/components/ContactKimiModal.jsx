import { useEffect, useRef } from 'react'
import { useFocusTrap, useBodyScrollLock } from '../utils/a11y'

export default function ContactKimiModal({ isOpen, onClose }) {
  const dialogRef = useRef(null)
  useFocusTrap(dialogRef, isOpen)
  useBodyScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-overlay)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
          aria-label="Close contact modal"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <img
            src="/kimi-avatar.png"
            alt="Kimi"
            className="mx-auto mb-3 h-16 w-16 rounded-full object-cover ring-2 ring-[var(--accent-gold)]/30"
          />
          <h3 className="text-lg font-bold text-[var(--text-primary)]" id="contact-modal-title">
            Contact Kimi
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Choose how you would like to reach me
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="mailto:kimi@giveabit.io?subject=Satohash-Front Page"
            className="flex min-h-[56px] w-full items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_20px_var(--accent-gold-glow)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-gold)]/10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-gold)"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-[var(--text-primary)]">Email</p>
              <p className="text-[11px] text-[var(--text-secondary)]">kimi@giveabit.io</p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[var(--text-tertiary)]"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="nostr:kimi@giveabit.io"
            className="flex min-h-[56px] w-full items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 transition-all hover:border-[var(--accent-purple)] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-purple)]/10">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-purple)"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-[var(--text-primary)]">Nostr NIP-05</p>
              <p className="text-[11px] text-[var(--text-secondary)]">kimi@giveabit.io</p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[var(--text-tertiary)]"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <p className="mt-4 text-center text-[10px] text-[var(--text-tertiary)]" aria-live="polite">
          I typically respond within 24 hours.
        </p>
      </div>
    </div>
  )
}

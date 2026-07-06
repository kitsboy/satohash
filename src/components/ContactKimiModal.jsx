import { useState } from 'react'
import { Mail, MessageCircle, X, ArrowRight } from 'lucide-react'

export default function ContactKimiModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface-overlay)] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
        >
          <X size={16} />
        </button>

        <div className="mb-6 text-center">
          <img
            src="/kimi-avatar.png"
            alt="Kimi"
            className="mx-auto mb-3 h-16 w-16 rounded-full object-cover ring-2 ring-[var(--accent-gold)]/30"
          />
          <h3 className="text-lg font-bold text-[var(--text-primary)]">Contact Kimi</h3>
          <p className="text-xs text-[var(--text-secondary)]">Choose how you'd like to reach me</p>
        </div>

        <div className="space-y-3">
          <a
            href="mailto:kimi@giveabit.io?subject=Satohash-Front Page"
            className="flex min-h-[56px] w-full items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_20px_var(--accent-gold-glow)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-gold)]/10">
              <Mail size={20} className="text-[var(--accent-gold)]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-[var(--text-primary)]">Email</p>
              <p className="text-[11px] text-[var(--text-secondary)]">kimi@giveabit.io</p>
            </div>
            <ArrowRight size={16} className="text-[var(--text-tertiary)]" />
          </a>

          <a
            href="nostr:kimi@giveabit.io"
            className="flex min-h-[56px] w-full items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 transition-all hover:border-[var(--accent-purple)] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-purple)]/10">
              <MessageCircle size={20} className="text-[var(--accent-purple)]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-[var(--text-primary)]">Nostr NIP-05</p>
              <p className="text-[11px] text-[var(--text-secondary)]">kimi@giveabit.io</p>
            </div>
            <ArrowRight size={16} className="text-[var(--text-tertiary)]" />
          </a>
        </div>

        <p className="mt-4 text-center text-[10px] text-[var(--text-tertiary)]">
          I typically respond within 24 hours.
        </p>
      </div>
    </div>
  )
}

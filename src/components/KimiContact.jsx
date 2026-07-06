import { Mail, MessageCircle, BadgeCheck, Sparkles } from 'lucide-react'
import ContactKimiModal from './ContactKimiModal'
import { useState } from 'react'

export default function KimiContact({ compact = false }) {
  const [showModal, setShowModal] = useState(false)

  if (compact) {
    return (
      <a
        href="mailto:kimi@giveabit.io"
        className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_20px_var(--accent-gold-glow)]"
        aria-label="Contact Kimi agent"
      >
        <div className="relative shrink-0">
          <img src="/kimi-avatar.png" alt="Kimi" className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--accent-gold)]/20 transition-all group-hover:ring-[var(--accent-gold)]/40" />
          <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface-raised)] bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-[var(--text-primary)]">Kimi</p>
            <BadgeCheck size={11} className="text-[var(--accent-gold)]" />
          </div>
          <p className="truncate text-[10px] text-[var(--text-secondary)]">Orchestration agent</p>
        </div>
      </a>
    )
  }

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_40px_var(--accent-gold-glow)] sm:flex-row sm:items-center"
        style={{ minHeight: '44px' }}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowModal(true) }}}
        aria-label="Contact Kimi - orchestration agent"
      >
        {/* Glow overlay */}
        <div className="pointer-events-none absolute -inset-40 bg-gradient-radial from-[var(--accent-gold)]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative shrink-0">
          <img
            src="/kimi-avatar.png"
            alt="Kimi — Give A Bit orchestration agent"
            className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-[var(--accent-gold)]/20 transition-all group-hover:ring-[var(--accent-gold)]/40 sm:mx-0"
            width={80}
            height={80}
          />
          <div className="absolute -right-0.5 -bottom-0.5 h-4 w-4 animate-pulse rounded-full border-2 border-[var(--surface-raised)] bg-[var(--accent-success)] shadow-[0_0_12px_var(--accent-success)]" />
        </div>

        <div className="relative flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <p className="text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
              Agent · Give A Bit
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/5 px-2 py-0.5 text-[9px] font-bold text-[var(--accent-gold)] uppercase tracking-wider">
              <BadgeCheck size={10} /> NIP-05 Verified
            </span>
          </div>

          <h3 className="text-lg font-bold text-[var(--text-primary)]">Kimi</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Orchestration agent. Docs, automation.
          </p>

          <p className="mt-3 text-[10px] leading-relaxed text-[var(--text-tertiary)]">
            <Sparkles size={10} className="mr-1 inline text-[var(--accent-gold)]" />
            Click to choose how to reach me — Nostr or email.
          </p>
        </div>
      </div>

      <ContactKimiModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

import { Mail, MessageCircle } from 'lucide-react'

export default function KimiContact({ compact = false }) {
  if (compact) {
    return (
      <a
        href="mailto:kimi@giveabit.io"
        className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3 transition-colors hover:border-[var(--accent-gold)]"
        aria-label="Contact Kimi agent"
      >
        <img src="/kimi-avatar.png" alt="Kimi" className="h-10 w-10 shrink-0 rounded-full" />
        <div className="min-w-0">
          <p className="text-xs font-bold text-[var(--text-primary)]">Kimi</p>
          <p className="truncate text-[10px] text-[var(--text-secondary)]">Orchestration · M4</p>
        </div>
      </a>
    )
  }

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 sm:flex-row sm:items-center"
      style={{ minHeight: '44px' }}
    >
      <img
        src="/kimi-avatar.png"
        alt="Kimi — Give A Bit orchestration agent"
        className="mx-auto h-20 w-20 shrink-0 rounded-full sm:mx-0"
        width={80}
        height={80}
      />
      <div className="flex-1 text-center sm:text-left">
        <p className="text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
          Agent · Give A Bit
        </p>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Kimi</h3>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Orchestration agent. Docs, automation.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
          <a
            href="mailto:kimi@giveabit.io"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-gold)]"
          >
            <Mail size={14} className="text-[var(--accent-gold)]" />
            kimi@giveabit.io
          </a>
          <a
            href="nostr:kimi@giveabit.io"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-bold text-[var(--text-primary)] transition-colors hover:border-[var(--accent-purple)]"
          >
            <MessageCircle size={14} className="text-[var(--accent-purple)]" />
            NIP-05
          </a>
        </div>
      </div>
    </div>
  )
}

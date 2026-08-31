import Tooltip from '../ui/Tooltip'

const CALENDARS = [
  { id: 'alice', host: 'alice.btc.calendar.opentimestamps.org' },
  { id: 'bob', host: 'bob.btc.calendar.opentimestamps.org' },
  { id: 'finney', host: 'finney.calendar.eternitywall.com', note: 'may be flaky' }
]

/** Pending-card jewelry: which public OTS calendars attest the stamp. */
export default function CalendarStrip({ compact = false }) {
  return (
    <div
      data-testid="calendar-strip"
      className="rounded-xl border p-3"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent-active) 28%, var(--border))',
        background:
          'linear-gradient(165deg, color-mix(in srgb, var(--accent-active) 7%, var(--bg-primary)) 0%, var(--bg-primary) 70%, color-mix(in srgb, var(--accent-gold) 4%, var(--bg-primary)) 100%)'
      }}
    >
      <p
        className="text-[9px] font-black tracking-widest uppercase"
        style={{ color: 'var(--accent-active)' }}
      >
        Timestamp servers
        <Tooltip
          title="What are these servers?"
          content="Independent, free OpenTimestamps servers that record your fingerprint so more than one party agrees on the time. No account, no KYC — that is what keeps the proof honest. (The protocol calls them “calendars.”)"
        />
      </p>
      <ul className={`mt-2 ${compact ? 'space-y-1' : 'space-y-1.5'}`}>
        {CALENDARS.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-2">
            <span
              className="font-mono text-[11px] font-bold tracking-wide uppercase"
              style={{ color: 'var(--accent-gold)' }}
            >
              {c.id}
            </span>
            <span
              className="min-w-0 truncate font-mono text-[10px]"
              style={{ color: 'var(--text-muted)' }}
              title={c.host}
            >
              {compact ? c.host.split('.')[0] : c.host}
              {c.note ? ` · ${c.note}` : ''}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

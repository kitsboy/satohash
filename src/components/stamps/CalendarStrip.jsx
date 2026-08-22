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
      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
    >
      <p
        className="text-[9px] font-black tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        OpenTimestamps calendars
        <Tooltip
          title="What are OTS calendars?"
          content="Independent, free, open servers that timestamp your fingerprint so its time is agreed by more than one party. No account, no KYC — that is what keeps the proof honest."
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

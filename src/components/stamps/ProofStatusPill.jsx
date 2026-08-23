import { Activity, CheckCircle, AlertTriangle } from 'lucide-react'

/**
 * Giant mobile-first pending vs confirmed status.
 */
export default function ProofStatusPill({
  status = 'pending',
  blockHeight = null,
  upgradeStatus = null,
  className = ''
}) {
  const s = String(status || 'pending').toLowerCase()
  const confirmed = s === 'confirmed' || s === 'verified'
  const failed = s === 'failed'

  if (confirmed) {
    return (
      <div
        role="status"
        className={`flex flex-col items-center gap-2 rounded-2xl px-5 py-5 text-center ${className}`}
        style={{
          background:
            'linear-gradient(165deg, color-mix(in srgb, var(--accent-success) 16%, var(--surface-raised)) 0%, var(--surface-raised) 60%, color-mix(in srgb, var(--accent-success) 6%, var(--surface-raised)) 100%)',
          border: '1.5px solid color-mix(in srgb, var(--accent-success) 45%, transparent)',
          boxShadow:
            '0 0 30px color-mix(in srgb, var(--accent-success) 18%, transparent), inset 0 1px 0 color-mix(in srgb, var(--accent-success) 16%, transparent)'
        }}
      >
        <CheckCircle
          size={28}
          className="animate-jewel-pulse"
          style={{ color: 'var(--accent-success)' }}
          aria-hidden
        />
        <p
          className="text-lg font-black tracking-tight uppercase"
          style={{ color: 'var(--accent-success)' }}
        >
          Bitcoin confirmed
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {blockHeight
            ? `Anchored in block ${Number(blockHeight).toLocaleString()}`
            : 'Fingerprint is anchored on Bitcoin via OpenTimestamps'}
        </p>
      </div>
    )
  }

  if (failed) {
    return (
      <div
        role="status"
        className={`flex flex-col items-center gap-2 rounded-2xl px-5 py-5 text-center ${className}`}
        style={{
          background:
            'linear-gradient(165deg, color-mix(in srgb, var(--accent-danger) 14%, var(--surface-raised)) 0%, var(--surface-raised) 60%, transparent 100%)',
          border: '1.5px solid color-mix(in srgb, var(--accent-danger) 42%, transparent)',
          boxShadow:
            '0 0 26px color-mix(in srgb, var(--accent-danger) 14%, transparent), inset 0 1px 0 color-mix(in srgb, var(--accent-danger) 12%, transparent)'
        }}
      >
        <AlertTriangle size={28} style={{ color: 'var(--accent-danger)' }} aria-hidden />
        <p
          className="text-lg font-black tracking-tight uppercase"
          style={{ color: 'var(--accent-danger)' }}
        >
          Stamp failed
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Retry stamp or verify your .ots locally.
        </p>
      </div>
    )
  }

  return (
    <div
      role="status"
      className={`flex flex-col items-center gap-2 rounded-2xl px-5 py-5 text-center ${className}`}
      style={{
        background:
          'linear-gradient(165deg, color-mix(in srgb, var(--accent-gold) 12%, var(--surface-raised)) 0%, var(--surface-raised) 60%, color-mix(in srgb, var(--accent-active) 6%, var(--surface-raised)) 100%)',
        border: '1.5px solid color-mix(in srgb, var(--accent-gold) 45%, transparent)',
        boxShadow:
          '0 0 26px color-mix(in srgb, var(--accent-gold) 16%, transparent), inset 0 1px 0 color-mix(in srgb, var(--accent-gold) 14%, transparent)'
      }}
    >
      <Activity
        size={28}
        className={upgradeStatus === 'upgrading' ? 'animate-spin' : 'animate-pulse'}
        style={{ color: 'var(--accent-gold)' }}
        aria-hidden
      />
      <p
        className="text-lg font-black tracking-tight uppercase"
        style={{ color: 'var(--accent-gold)' }}
      >
        Pending confirmation
      </p>
      <p className="max-w-sm text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
        Submitted to OpenTimestamps calendars. This is{' '}
        <strong style={{ color: 'var(--text-primary)' }}>not</strong> Bitcoin-confirmed yet —
        usually minutes to hours depending on calendar aggregation.
      </p>
      {upgradeStatus && (
        <p
          className="text-[10px] font-black tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Live: {upgradeStatus}
        </p>
      )}
    </div>
  )
}

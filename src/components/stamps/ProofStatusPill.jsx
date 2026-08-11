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
          background: 'rgba(34,211,165,0.1)',
          border: '1.5px solid rgba(34,211,165,0.35)'
        }}
      >
        <CheckCircle size={28} style={{ color: 'var(--accent-success)' }} aria-hidden />
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
          background: 'rgba(239,68,68,0.1)',
          border: '1.5px solid rgba(239,68,68,0.35)'
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
        background: 'rgba(240,180,41,0.1)',
        border: '1.5px solid rgba(240,180,41,0.35)'
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

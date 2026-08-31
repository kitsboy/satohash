import { Activity, AlertTriangle, Lock } from 'lucide-react'

/**
 * Giant mobile-first pending vs confirmed status.
 * Pending is gold only — never success green.
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
        <div
          className="animate-jewel-pulse flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            border: '1.5px solid var(--accent-success)',
            background: 'color-mix(in srgb, var(--accent-success) 16%, var(--surface-raised))'
          }}
        >
          <Lock size={22} style={{ color: 'var(--accent-success)' }} aria-hidden />
        </div>
        <p
          className="text-lg font-black tracking-tight uppercase"
          style={{ color: 'var(--accent-success)' }}
        >
          Folded into Bitcoin
        </p>
        {blockHeight ? (
          <p className="space-y-0.5">
            <span
              className="block text-3xl font-black tracking-tight tabular-nums"
              style={{ color: 'var(--text-primary)' }}
            >
              {Number(blockHeight).toLocaleString()}
            </span>
            <span
              className="block text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--accent-success)' }}
            >
              Bitcoin block
            </span>
          </p>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Fingerprint is in the chain via OpenTimestamps
          </p>
        )}
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
        Not Bitcoin-confirmed yet
      </p>
      <p className="max-w-sm text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
        Sent to timestamp servers. Pending is{' '}
        <strong style={{ color: 'var(--text-primary)' }}>not</strong> confirmed — usually minutes to
        hours, until Bitcoin includes it.
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

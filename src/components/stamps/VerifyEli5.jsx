import { useState } from 'react'

/**
 * ELI-5 vs expert toggle for verify UX.
 */
export default function VerifyEli5({ className = '' }) {
  const [mode, setMode] = useState('simple') // simple | expert

  return (
    <div
      data-testid="verify-eli5"
      className={`rounded-2xl border p-4 sm:p-5 ${className}`}
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p
          className="text-[10px] font-black tracking-widest uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          How verification works
        </p>
        <div
          className="inline-flex rounded-full border p-0.5"
          role="group"
          aria-label="Explanation detail"
          style={{ borderColor: 'var(--border)' }}
        >
          {[
            { id: 'simple', label: 'Simple' },
            { id: 'expert', label: 'Expert' }
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={mode === opt.id}
              onClick={() => setMode(opt.id)}
              className="min-h-[36px] rounded-full px-3 text-[10px] font-black tracking-wider uppercase"
              style={{
                background: mode === opt.id ? 'var(--accent-gold)' : 'transparent',
                color: mode === opt.id ? '#141b25' : 'var(--text-secondary)'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'simple' ? (
        <ol
          className="list-decimal space-y-2 pl-5 text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          <li>
            You give Satohash a{' '}
            <strong style={{ color: 'var(--text-primary)' }}>fingerprint</strong> of a file
            (SHA-256) — not the file itself.
          </li>
          <li>
            That fingerprint is submitted to public{' '}
            <strong style={{ color: 'var(--text-primary)' }}>OpenTimestamps</strong> calendars.
          </li>
          <li>
            Later those calendars commit into a{' '}
            <strong style={{ color: 'var(--text-primary)' }}>Bitcoin block</strong>. Then anyone can
            prove the file existed at least by that time.
          </li>
          <li>
            <strong style={{ color: 'var(--accent-gold)' }}>Pending</strong> means “submitted.”{' '}
            <strong style={{ color: 'var(--accent-success)' }}>Confirmed</strong> means “on
            Bitcoin.”
          </li>
        </ol>
      ) : (
        <div
          className="space-y-2 text-xs leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          <p>
            OTS builds a Merkle commitment over digests, attested by calendar servers, then
            aggregated into a Bitcoin transaction. A complete proof is a path from your digest to a
            block header via calendar + Bitcoin Merkle inclusion.
          </p>
          <p>
            Structural verify checks the binary receipt. Independent verify uses open-source{' '}
            <code className="rounded px-1" style={{ background: 'var(--bg-primary)' }}>
              ots-cli
            </code>{' '}
            or equivalent against public calendars / your own node — you do not need to trust
            Satohash for the final claim.
          </p>
          <pre
            className="overflow-x-auto rounded-xl p-3 font-mono text-[11px] leading-relaxed"
            style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
          >
            {`ots-cli verify proof.ots
# or: python3 -m opentimestamps.ots verify proof.ots`}
          </pre>
          <p style={{ color: 'var(--text-muted)' }}>
            Own-node path: api.satohash.io readiness · bitcoind on THOR when healthy.
          </p>
        </div>
      )}
    </div>
  )
}

import { ShieldCheck, ExternalLink, Lock, Anchor } from 'lucide-react'
import Tooltip from '../ui/Tooltip'

/**
 * VerifyYourselfCard — the "verify this yourself" rich glowing CTA.
 *
 * Honesty is the soul of Satohash: never ask a visitor to take our word.
 * This card turns the plain mempool/OTS link into a first-class, glowing
 * proof-of-trust surface with ELI16 micro-copy. Mobile-first (stacked),
 * tap-friendly (>=44px target), and consistent with the family design
 * tokens: jewel-tone accent edge, layered gradient surface, glow on hover.
 */
export default function VerifyYourselfCard({
  blockHeight = null,
  verifyUrl = null,
  compact = false
}) {
  const hasBlock = Boolean(blockHeight)
  const href = hasBlock
    ? `https://mempool.space/block/${blockHeight}`
    : verifyUrl || 'https://opentimestamps.org'
  const label = hasBlock
    ? `Open block ${Number(blockHeight).toLocaleString()} ↗`
    : 'Verify with open tools ↗'

  return (
    <div
      data-testid="verify-yourself-card"
      className="verify-yourself-card relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background:
          'linear-gradient(135deg, var(--surface-raised) 0%, color-mix(in srgb, var(--accent-active) 8%, transparent) 100%)',
        border: '1px solid var(--accent-active)',
        boxShadow:
          '0 0 0 1px color-mix(in srgb, var(--accent-active) 10%, transparent), 0 16px 44px -20px var(--accent-active-glow, var(--jewel-sky-glow))'
      }}
    >
      {/* accent hairline — jewel-tone edge */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, var(--accent-active), var(--accent-gold))'
        }}
      />

      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: 'color-mix(in srgb, var(--accent-active) 14%, transparent)',
            color: 'var(--accent-active)'
          }}
        >
          <ShieldCheck size={20} aria-hidden />
        </span>
        <div className="min-w-0">
          <p
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-active)' }}
          >
            Verify this yourself
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Don&rsquo;t take our word for it — check the proof with free, open tools. No account. No
            KYC.
          </p>
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-xl text-sm font-black tracking-wider uppercase transition-all hover:brightness-110 active:scale-[0.98]"
        style={{
          background: 'var(--accent-active)',
          color: '#fff',
          boxShadow: '0 8px 22px -10px var(--accent-active)'
        }}
      >
        <ExternalLink size={16} aria-hidden /> {label}
      </a>

      {!compact && (
        <div
          className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Lock size={12} aria-hidden /> 0-KYC · self-serve
            <Tooltip
              title="Why 0-KYC matters"
              content="You never need an account, email, or ID to verify a stamp. The proof lives in a public Bitcoin block — trust the math, not a login. Your data stays yours."
            />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Anchor size={12} aria-hidden /> Bitcoin-anchored
            <Tooltip
              title="What a stamp means"
              content="A stamp is your document's fingerprint (SHA-256) recorded in a public Bitcoin block. Anyone, anywhere, can confirm it existed at that time — with no middleman."
            />
          </span>
        </div>
      )}
    </div>
  )
}

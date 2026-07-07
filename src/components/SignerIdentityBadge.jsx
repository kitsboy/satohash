import { ShieldCheck, BadgeCheck } from 'lucide-react'

/** Verified NIP-05 / Lightning signer badge for contracts and PDFs */
export default function SignerIdentityBadge({
  nip05,
  lightningAddress,
  verified = false,
  size = 'md'
}) {
  const pad = size === 'sm' ? 'px-2 py-1 text-[9px]' : 'px-3 py-1.5 text-[10px]'
  const label = nip05 || lightningAddress || 'Anonymous signer'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-black tracking-widest uppercase ${pad}`}
      style={{
        borderColor: verified
          ? 'color-mix(in srgb, var(--accent-success) 35%, transparent)'
          : 'var(--border)',
        color: verified ? 'var(--accent-success)' : 'var(--text-secondary)',
        background: verified
          ? 'color-mix(in srgb, var(--accent-success) 8%, transparent)'
          : 'var(--bg-secondary)'
      }}
      title={verified ? 'NIP-05 verified signer' : 'Unverified signer'}
    >
      {verified ? <BadgeCheck size={12} /> : <ShieldCheck size={12} />}
      {label}
    </span>
  )
}

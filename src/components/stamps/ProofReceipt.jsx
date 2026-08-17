/**
 * Signed-style receipt: Satohash saw hash at T; Bitcoin later at T+n.
 * Not a legal signature — a portable attestation of what this plane recorded.
 */
export default function ProofReceipt({ proof }) {
  if (!proof?.hash) return null
  const submitted = proof.created_at || proof.createdAt
  const confirmedAt = proof.confirmed_at
  const block = proof.bitcoin_block_height
  const pending = proof.status !== 'confirmed'

  return (
    <div
      data-testid="proof-receipt"
      className="vault-ring rounded-2xl border p-4 text-left"
      style={{ borderColor: 'var(--border-gold)', background: 'var(--surface-raised)' }}
    >
      <p
        className="text-[9px] font-black tracking-widest uppercase"
        style={{ color: 'var(--accent-gold)' }}
      >
        Receipt
      </p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        Satohash recorded SHA-256{' '}
        <span className="font-mono text-xs break-all">{String(proof.hash).slice(0, 16)}…</span>
        {submitted ? ` at ${new Date(submitted).toISOString()}` : ''}.
      </p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {pending
          ? 'Bitcoin has not confirmed this stamp yet. Pending is not the same as anchored.'
          : `Bitcoin anchored this fingerprint${block ? ` in block ${Number(block).toLocaleString()}` : ''}${
              confirmedAt ? ` at ${new Date(confirmedAt).toISOString()}` : ''
            }.`}
      </p>
      <p className="mt-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
        This receipt is what Satohash saw. Independent verify uses OpenTimestamps + Bitcoin — you do
        not need to trust this page.
      </p>
    </div>
  )
}

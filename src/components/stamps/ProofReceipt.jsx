/**
 * Signed-style receipt: Satohash saw hash at T; Bitcoin later at T+n.
 * Not a legal signature — a portable attestation of what this plane recorded.
 */
import { useTranslation } from 'react-i18next'

export default function ProofReceipt({ proof }) {
  const { t } = useTranslation()
  if (!proof?.hash) return null
  const submitted = proof.created_at || proof.createdAt
  const confirmedAt = proof.confirmed_at
  const block = proof.bitcoin_block_height
  const pending = proof.status !== 'confirmed'
  const at = (raw) => (raw ? t('receiptPage.at', { time: new Date(raw).toISOString() }) : '')
  const short = `${String(proof.hash).slice(0, 16)}…`

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
        {t('receiptPage.kicker')}
      </p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {t('receiptPage.recorded', { short, at: at(submitted) })}
      </p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {pending
          ? t('receiptPage.pending')
          : t('receiptPage.anchored', {
              block: block
                ? t('receiptPage.inBlock', { block: Number(block).toLocaleString() })
                : '',
              at: at(confirmedAt)
            })}
      </p>
      <p className="mt-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {t('receiptPage.disclaimer')}
      </p>
    </div>
  )
}

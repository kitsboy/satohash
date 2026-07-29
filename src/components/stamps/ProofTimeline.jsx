import { useTranslation } from 'react-i18next'

const STEP_KEYS = ['hashed', 'submitted', 'pending', 'confirmed']
const STEP_ICONS = ['🔒', '📡', '⏳', '✓']

function stepIndex(status, hasOts) {
  if (status === 'confirmed') return 3
  if (hasOts || status === 'anchoring') return 2
  if (status === 'complete' || status === 'pending') return 1
  return 0
}

export default function ProofTimeline({ status = 'pending', hasOts = false, blockHeight }) {
  const { t } = useTranslation()
  const active = stepIndex(status, hasOts)
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label={t('proofTimeline.ariaLabel')}>
      {STEP_KEYS.map((key, i) => (
        <li
          key={key}
          className="rounded-xl border px-3 py-3 text-center"
          style={{
            borderColor: i <= active ? 'var(--accent-gold)' : 'var(--border)',
            background:
              i <= active
                ? 'color-mix(in srgb, var(--accent-gold) 8%, transparent)'
                : 'var(--bg-secondary)',
            opacity: i <= active ? 1 : 0.5
          }}
        >
          <div className="text-lg">{STEP_ICONS[i]}</div>
          <p
            className="mt-1 text-[9px] font-black tracking-widest uppercase"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t(`proofTimeline.${key}`)}
          </p>
          {key === 'confirmed' && blockHeight && i <= active && (
            <p className="mt-1 font-mono text-[10px]" style={{ color: 'var(--accent-success)' }}>
              #{blockHeight}
            </p>
          )}
        </li>
      ))}
    </ol>
  )
}

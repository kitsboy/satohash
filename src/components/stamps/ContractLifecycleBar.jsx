import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, PenLine, Clock, ShieldCheck } from 'lucide-react'

const STEPS = [
  { id: 'draft', labelKey: 'draft', icon: FileText, path: (id) => `/contracts/${id}/edit` },
  { id: 'signed', labelKey: 'signed', icon: PenLine, path: (id) => `/signatures/${id}` },
  {
    id: 'timestamped',
    labelKey: 'timestamp',
    icon: Clock,
    path: (id) => `/timestamp/review/${id}`
  },
  { id: 'verified', labelKey: 'verify', icon: ShieldCheck, path: (id) => `/verify/${id}` }
]

function stepIndex(status) {
  if (status === 'timestamped') return 2
  if (status === 'signed') return 1
  return 0
}

export default function ContractLifecycleBar({ contractId, status = 'draft' }) {
  const { t } = useTranslation()
  const current = stepIndex(status)

  return (
    <div className="mb-6">
      <nav
        aria-label={t('lifecycleBar.ariaLabel')}
        className="flex flex-wrap items-center gap-2 rounded-2xl border p-3"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon
          const done = i <= current
          const active = i === current
          return (
            <span key={step.id} className="flex items-center gap-2">
              <Link
                to={step.path(contractId)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black tracking-widest uppercase transition-opacity"
                style={{
                  opacity: done ? 1 : 0.45,
                  background: active ? 'var(--accent-active)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-secondary)',
                  border: active ? 'none' : '1px solid var(--border)'
                }}
                aria-current={active ? 'step' : undefined}
              >
                <Icon size={12} />
                {t(`lifecycleBar.${step.labelKey}`)}
              </Link>
              {i < STEPS.length - 1 && (
                <span className="text-[10px] opacity-30" aria-hidden>
                  →
                </span>
              )}
            </span>
          )
        })}
      </nav>
      <p
        className="mt-2 px-1 text-[10px] font-bold tracking-wide uppercase italic"
        style={{ color: 'var(--text-secondary)' }}
      >
        {t('lifecycleBar.signedNote')}
      </p>
    </div>
  )
}

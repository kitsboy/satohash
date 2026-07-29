import { Link } from 'react-router-dom'
import { FileText, PenLine, Clock, ShieldCheck } from 'lucide-react'

const STEPS = [
  { id: 'draft', label: 'Draft', icon: FileText, path: (id) => `/contracts/${id}/edit` },
  { id: 'signed', label: 'Signed', icon: PenLine, path: (id) => `/signatures/${id}` },
  { id: 'timestamped', label: 'Timestamp', icon: Clock, path: (id) => `/timestamp/review/${id}` },
  { id: 'verified', label: 'Verify', icon: ShieldCheck, path: (id) => `/verify/${id}` }
]

function stepIndex(status) {
  if (status === 'timestamped') return 2
  if (status === 'signed') return 1
  return 0
}

export default function ContractLifecycleBar({ contractId, status = 'draft' }) {
  const current = stepIndex(status)

  return (
    <nav
      aria-label="Contract lifecycle"
      className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border p-3"
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
              {step.label}
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
  )
}

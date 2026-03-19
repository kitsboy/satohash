import { CircleDashed, Clock, CheckCircle2, ShieldCheck, AlertCircle, Activity } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function StatusPill({ status, className = '' }) {
  const { t } = useTranslation()

  const statusConfig = {
    draft: {
      class: 'status-pill-draft',
      icon: CircleDashed,
      label: t('contracts.status.draft')
    },
    waiting: {
      class: 'status-pill-waiting',
      icon: Clock,
      label: t('contracts.status.waiting')
    },
    signed: {
      class: 'status-pill-signed',
      icon: CheckCircle2,
      label: t('contracts.status.signed')
    },
    timestamped: {
      class: 'status-pill-timestamped',
      icon: ShieldCheck,
      label: t('contracts.status.timestamped')
    },
    pending: {
      class: 'status-pill-pending',
      icon: Activity,
      label: t('contracts.status.pending')
    },
    error: {
      class: 'status-pill-error',
      icon: AlertCircle,
      label: t('contracts.status.error')
    }
  }

  const config = statusConfig[status] || statusConfig.draft
  const Icon = config.icon

  return (
    <span className={`status-pill ${config.class} ${className}`}>
      <Icon size={12} strokeWidth={2.5} />
      {config.label}
    </span>
  )
}

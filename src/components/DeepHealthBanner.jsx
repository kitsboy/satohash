import { useEffect, useState } from 'react'
import { Activity, AlertTriangle } from 'lucide-react'
import { getApiUrl } from '../config/constants'

/** Observability banner fed from /health?deep=true when degraded */
export default function DeepHealthBanner() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${getApiUrl()}/health?deep=true`)
        if (!res.ok) {
          setStatus({ ok: false, message: 'API health check failed' })
          return
        }
        const data = await res.json()
        if (data.degraded || data.status !== 'ok') {
          setStatus({ ok: false, message: data.message || 'Some services degraded' })
        } else {
          setStatus(null)
        }
      } catch {
        setStatus({ ok: false, message: 'Backend unreachable — frontend-only mode' })
      }
    }
    check()
    const id = setInterval(check, 60000)
    return () => clearInterval(id)
  }, [])

  if (!status) return null

  return (
    <div
      className="flex items-center justify-center gap-2 border-b px-4 py-2 text-center text-[10px] font-black tracking-widest uppercase"
      style={{
        borderColor: 'color-mix(in srgb, var(--accent-pending) 30%, transparent)',
        background: 'color-mix(in srgb, var(--accent-pending) 8%, transparent)',
        color: 'var(--accent-pending)'
      }}
      role="status"
    >
      <AlertTriangle size={12} />
      {status.message}
      <Activity size={12} className="opacity-60" />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function UpdatePrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(true)
    window.addEventListener('sw-update-available', handler)
    return () => window.removeEventListener('sw-update-available', handler)
  }, [])

  if (!show) return null

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3 shadow-2xl"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-bright)',
        color: 'var(--text-primary)'
      }}
    >
      <RefreshCw size={14} style={{ color: 'var(--accent-active)' }} />
      <span className="text-sm font-semibold">New version available</span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 rounded-lg px-3 py-1 text-xs font-bold transition-opacity hover:opacity-80"
        style={{ background: 'var(--accent-active)', color: '#fff' }}
      >
        Reload
      </button>
      <button
        onClick={() => setShow(false)}
        className="text-xs opacity-40 hover:opacity-70"
        style={{ color: 'var(--text-secondary)' }}
      >
        ✕
      </button>
    </div>
  )
}

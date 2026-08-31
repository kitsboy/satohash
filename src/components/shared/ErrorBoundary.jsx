import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ShieldAlert } from 'lucide-react'

/** True when a deploy left the browser with a stale chunk (HTML served as JS). */
function isStaleChunkError(error) {
  const msg = String(error?.message || error || '')
  return (
    msg.includes("Unexpected token '<'") ||
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module') ||
    /Loading chunk [\d]+ failed/i.test(msg)
  )
}

async function hardResetClient() {
  try {
    if ('caches' in window) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
  } catch {
    /* ignore */
  }
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(regs.map((r) => r.unregister()))
    }
  } catch {
    /* ignore */
  }
  const url = new URL(window.location.href)
  url.searchParams.set('_sw', String(Date.now()))
  window.location.replace(url.pathname + url.search + url.hash)
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, autoResetting: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Critical Satohash UI Error:', error, errorInfo)
    // Do not auto-reload. Auto hardReset + SW navigate + vite:preloadError
    // stacked into a flash loop ("System Desync"). User can reset from the button.
  }

  render() {
    if (this.state.hasError) {
      const stale = isStaleChunkError(this.state.error)
      return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-6 text-white">
          <div className="absolute top-1/4 -left-20 h-96 w-96 animate-pulse rounded-full bg-[var(--accent-active)]/10 blur-[120px]" />
          <div className="absolute -right-20 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-rose-600/10 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card relative z-10 max-w-lg rounded-[2.5rem] border-white/5 bg-white/5 p-12 text-center shadow-2xl backdrop-blur-3xl"
          >
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/20 to-orange-500/10 text-rose-500 shadow-inner">
              <ShieldAlert size={48} strokeWidth={1.5} />
            </div>

            <h1 className="mb-4 text-3xl font-black tracking-tighter">
              {stale ? 'Update required' : 'System Desync'}
            </h1>
            <p className="mb-10 leading-relaxed font-medium text-white/40">
              {this.state.autoResetting
                ? 'Clearing an outdated offline cache and reloading…'
                : stale
                  ? 'Your browser held an old app shell after a deploy. Clear cache / hard refresh, or use the button below to reset the offline worker.'
                  : 'The interface encountered an unexpected interruption. Your cryptographic anchors and Bitcoin proofs remain active and secure in the protocol layer.'}
            </p>

            <div className="mb-10 rounded-2xl border border-white/5 bg-black/40 p-5 text-left">
              <p className="mb-2 text-[10px] font-black tracking-widest text-rose-500/60 uppercase">
                Internal Fault Report
              </p>
              <code className="block font-mono text-xs break-all text-white/30">
                {this.state.error?.message || 'Render level interruption'}
              </code>
            </div>

            <button
              type="button"
              onClick={() => hardResetClient()}
              className="active:scale-0.98 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4.5 text-sm font-black text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] hover:bg-indigo-500"
            >
              <RefreshCw size={18} className="animate-spin-slow" />
              {stale ? 'CLEAR CACHE & RELOAD' : 'RE-INITIALIZE INTERFACE'}
            </button>

            <button
              type="button"
              onClick={() => {
                const errorText = `Satohash Error Report\n\nError: ${this.state.error?.message}\nStack: ${this.state.error?.stack}\nTime: ${new Date().toISOString()}\nURL: ${window.location.href}`
                navigator.clipboard.writeText(errorText).then(() => {
                  alert('Error details copied to clipboard')
                })
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-bold transition-all hover:opacity-80"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              Copy Error Details
            </button>

            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null })
                hardResetClient()
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-bold transition-all hover:opacity-80"
              style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
            >
              ← Return to Home
            </button>

            <p className="mt-8 font-mono text-[9px] tracking-[0.3em] text-white/10 uppercase">
              Satohash Protocol v1.2.0 • Recovery Layer Active
            </p>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

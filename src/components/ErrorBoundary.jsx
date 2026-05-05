import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Critical Satohash UI Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05070a] px-6 text-white">
          {/* Animated Background Orbs */}
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

            <h1 className="mb-4 text-3xl font-black tracking-tighter">System Desync</h1>
            <p className="mb-10 leading-relaxed font-medium text-white/40">
              The interface encountered an unexpected interruption. Your cryptographic anchors and
              Bitcoin proofs remain active and secure in the protocol layer.
            </p>

            <div className="mb-10 rounded-2xl border border-white/5 bg-black/40 p-5 text-left">
              <p className="mb-2 text-[10px] font-black tracking-widest text-rose-500/60 uppercase">
                Internal Fault Report
              </p>
              <code className="block truncate font-mono text-xs text-white/30">
                {this.state.error?.message || 'Render level interruption'}
              </code>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="active:scale-0.98 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4.5 text-sm font-black text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] hover:bg-indigo-500"
            >
              <RefreshCw size={18} className="animate-spin-slow" />
              RE-INITIALIZE INTERFACE
            </button>

            {/* Copy error to clipboard */}
            <button
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

            {/* Go home without full reload */}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.history.pushState({}, '', '/')
                window.location.reload()
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

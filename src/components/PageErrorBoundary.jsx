import { Component } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class PageErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[PageErrorBoundary]', error, info)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-8 text-center"
        role="alert"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        <AlertTriangle size={48} style={{ color: 'var(--accent-pending)' }} />
        <div>
          <h2 className="text-xl font-black tracking-tight uppercase">This page hit an error</h2>
          <p className="mt-2 max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
            The rest of Satohash is still running. Try again or return to the vault.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black tracking-widest uppercase"
            style={{ background: 'var(--accent-active)', color: '#fff' }}
          >
            <RefreshCw size={14} />
            Retry
          </button>
          <Link
            to="/vault"
            className="rounded-xl border px-5 py-2.5 text-xs font-black tracking-widest uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Go to Vault
          </Link>
        </div>
      </div>
    )
  }
}

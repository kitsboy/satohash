import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-rose-100 bg-white p-8 shadow-xl">
        <div className="absolute top-0 right-0 left-0 h-2 bg-rose-500" />
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertTriangle size={32} />
        </div>
        <h2 className="mb-4 text-2xl font-black text-slate-900">Application Error</h2>
        <p className="mb-6 text-sm text-slate-600">
          Something went wrong loading this component. Please try reloading the system.
        </p>

        <div className="mb-8 overflow-x-auto rounded-xl bg-slate-100 p-4 text-left">
          <code className="font-mono text-xs text-rose-600">
            {error.message || 'Unknown render error occurred.'}
          </code>
        </div>

        <button
          onClick={resetErrorBoundary}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-bold text-white transition-colors hover:bg-slate-800"
        >
          <RefreshCcw size={18} />
          Reload Application
        </button>
      </div>
    </div>
  )
}

export default function ErrorBoundary({ children }) {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>
}

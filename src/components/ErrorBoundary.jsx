import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full border border-rose-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-rose-500" />
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">Application Error</h2>
        <p className="text-slate-600 mb-6 text-sm">
          Something went wrong loading this component. Please try reloading the system.
        </p>

        <div className="bg-slate-100 p-4 rounded-xl text-left mb-8 overflow-x-auto">
          <code className="text-xs text-rose-600 font-mono">
            {error.message || 'Unknown render error occurred.'}
          </code>
        </div>

        <button
          onClick={resetErrorBoundary}
          className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-slate-800 transition-colors"
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

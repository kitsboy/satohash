import React from 'react'
import ReactDOM from 'react-dom/client'
import { addErrorBreadcrumb } from './utils/errors.js'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import UpdatePrompt from './components/UpdatePrompt.jsx'
import './index.css'
import './styles/accessibility.css'
import './i18n/setup'

if (import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
      tracesSampleRate: 0.3,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        addErrorBreadcrumb('app.init', 'Application initialization', 'info')
        return event
      }
    })
  })
}

// Vite PWA handles service worker registration; wire updates to UpdatePrompt
if (import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Auto-apply new shell after deploys (avoids stale chunk HTML-as-JS)
        try {
          updateSW?.(true)
        } catch {
          window.dispatchEvent(new CustomEvent('sw-update-available'))
        }
      },
      onOfflineReady() {
        /* no-op */
      }
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <UpdatePrompt />
    </ErrorBoundary>
  </React.StrictMode>
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import { addErrorBreadcrumb } from './utils/errors.js'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import UpdatePrompt from './components/UpdatePrompt.jsx'
import './index.css'
import './styles/accessibility.css'
import './i18n/setup'

// Build stamp — must be runtime-referenced so Vite content-hash changes after
// edge HTML-as-JS poison (immutable cache on satohash.io apex).
if (typeof window !== 'undefined') {
  window.__SATOHASH_SPA_BUILD__ = '2026-07-29-bundle-b1'
}

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

// Unregister any leftover SW (selfDestroying PWA also does this). Critical after deploys.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister())
  })
  if (window.caches) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
      <UpdatePrompt />
    </ErrorBoundary>
  </React.StrictMode>
)

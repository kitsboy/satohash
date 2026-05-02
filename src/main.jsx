import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { addErrorBreadcrumb } from './utils/errors.js';
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'
import './i18n'

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 0.3, // Reduced for production
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    beforeSend(event) {
      // Add breadcrumbs before sending
      addErrorBreadcrumb('app.init', 'Application initialization', 'info');
      return event;
    }
  })
}

// Register Service Worker for push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registered', reg))
      .catch((err) => console.log('SW registration failed', err));
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
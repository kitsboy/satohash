import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import React, { Suspense, useEffect } from 'react'
import AppShellNoir from './components/AppShellNoir'
import LoadingScreen from './components/LoadingScreen'
import { Toaster } from 'sonner'
import { ToastProvider } from './components/Toast'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Lazy loaded planes
import VerifyPublic from './pages/VerifyPublic';
const Vault = React.lazy(() => import('./pages/Vault'))
const Stamp = React.lazy(() => import('./pages/Stamp'))
const Verify = React.lazy(() => import('./pages/VerificationTool'))
const Contracts = React.lazy(() => import('./pages/ContractList'))
const Snapper = React.lazy(() =>
  import('./pages/Placeholders').then((m) => ({ default: m.Snapper }))
)
const Certificates = React.lazy(() =>
  import('./pages/Placeholders').then((m) => ({ default: m.Certificates }))
)
const Developer = React.lazy(() => import('./pages/Developer'))
const Atlas = React.lazy(() => import('./pages/Atlas'))
const Nodes = React.lazy(() => import('./pages/Mesh'))
const Explorer = React.lazy(() => import('./pages/Explorer'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Access = React.lazy(() => import('./pages/Access'))
const Landing = React.lazy(() => import('./pages/Landing'))
const Trust = React.lazy(() => import('./pages/trust/TrustCenter'))
const About = React.lazy(() => import('./pages/Placeholders').then((m) => ({ default: m.About })))

const NotaryTemplates = React.lazy(() => import('./pages/NotaryTemplates'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

function ProtectedRoute({ children }) {
  const location = useLocation()
  const authed = localStorage.getItem('satohash_authed') === 'true'
  if (!authed) return <Navigate to="/access" state={{ from: location }} replace />
  return children
}

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()
    const timer = setTimeout(() => NProgress.done(), 500)
    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [location.pathname])

  const isPublic =
    location.pathname === '/' ||
    location.pathname === '/access' ||
    location.pathname === '/about' ||
    location.pathname === '/trust'

  const content = (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/access" element={<Access />} />
        <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
        <Route path="/stamp" element={<ProtectedRoute><Stamp /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
<Route path="/verify/:id" element={<VerifyPublic />} />
        <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
        <Route path="/snapper" element={<ProtectedRoute><Snapper /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
        <Route path="/developer" element={<ProtectedRoute><Developer /></ProtectedRoute>} />
        <Route path="/atlas" element={<ProtectedRoute><Atlas /></ProtectedRoute>} />
        <Route path="/nodes" element={<ProtectedRoute><Nodes /></ProtectedRoute>} />
        <Route path="/explorer" element={<ProtectedRoute><Explorer /></ProtectedRoute>} />
        <Route path="/audit-log" element={<ProtectedRoute><Vault /></ProtectedRoute>} /> {/* Reusing Vault as audit log for now */}
        <Route path="/documentation" element={<ProtectedRoute><Developer /></ProtectedRoute>} /> {/* Reusing Developer for docs */}
        <Route path="/status" element={<ProtectedRoute><Atlas /></ProtectedRoute>} /> {/* Reusing Atlas for status */}
        <Route path="/trust-center" element={<ProtectedRoute><Trust /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/trust" element={<Trust />} />
        <Route path="/templates" element={<ProtectedRoute><NotaryTemplates /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  )

  if (isPublic) return content
  return <AppShellNoir>{content}</AppShellNoir>
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)'
            }
          }}
        />
      </Router>
    </ToastProvider>
  )
}

export default App

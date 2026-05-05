import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import React, { Suspense, useEffect } from 'react'
import AppShellNoir from './components/AppShellNoir'
import LoadingScreen from './components/LoadingScreen'
import { Toaster } from 'sonner'
import { ToastProvider } from './components/Toast'
import { ThemeProvider } from './components/ThemeProvider'
import { I18nProvider } from './i18n'
import ErrorBoundary from './components/ErrorBoundary'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Lazy loaded planes
import VerifyPublic from './pages/VerifyPublic'
const Vault = React.lazy(() => import('./pages/Vault'))
const Stamp = React.lazy(() => import('./pages/Stamp'))
const Verify = React.lazy(() => import('./pages/VerificationTool'))
const Contracts = React.lazy(() => import('./pages/ContractList'))
const WebCapture = React.lazy(() => import('./pages/WebCapture'))
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
const About = React.lazy(() => import('./pages/About'))

const NotaryTemplates = React.lazy(() => import('./pages/NotaryTemplates'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

// Legal pages (public)
const CryptoNotice = React.lazy(() => import('./pages/legal/CryptoNotice'))
const PrivacyPolicy = React.lazy(() => import('./pages/legal/PrivacyPolicy'))
const TermsOfService = React.lazy(() => import('./pages/legal/TermsOfService'))

// Contracts sub-pages (protected)
const ContractView = React.lazy(() => import('./pages/contracts/ContractView'))
const ContractEditor = React.lazy(() => import('./pages/contracts/ContractEditor'))

// Orphaned protected pages
const ImageVault = React.lazy(() => import('./pages/ImageVault'))
const ProtocolStats = React.lazy(() => import('./pages/ProtocolStats'))
const Offers = React.lazy(() => import('./pages/Offers'))
const Forum = React.lazy(() => import('./pages/Forum'))
const Identity = React.lazy(() => import('./pages/Identity'))
const MobileSigner = React.lazy(() => import('./pages/MobileSigner'))

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
    location.pathname === '/trust' ||
    location.pathname.startsWith('/legal/')

  const content = (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/access" element={<Access />} />
          <Route path="/about" element={<About />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/trust-center" element={<Navigate to="/trust" replace />} />
          <Route path="/verify/:id" element={<VerifyPublic />} />

          {/* Public legal pages */}
          <Route path="/legal/crypto-notice" element={<CryptoNotice />} />
          <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal/terms" element={<TermsOfService />} />

          {/* Protected routes */}
          <Route
            path="/vault"
            element={
              <ProtectedRoute>
                <Vault />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stamp"
            element={
              <ProtectedRoute>
                <Stamp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <Verify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts"
            element={
              <ProtectedRoute>
                <Contracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts/:id"
            element={
              <ProtectedRoute>
                <ContractView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts/new/:templateType"
            element={
              <ProtectedRoute>
                <ContractEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contracts/edit/:id"
            element={
              <ProtectedRoute>
                <ContractEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/snapper"
            element={
              <ProtectedRoute>
                <WebCapture />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer"
            element={
              <ProtectedRoute>
                <Developer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/atlas"
            element={
              <ProtectedRoute>
                <Atlas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nodes"
            element={
              <ProtectedRoute>
                <Nodes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explorer"
            element={
              <ProtectedRoute>
                <Explorer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <NotaryTemplates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/image-vault"
            element={
              <ProtectedRoute>
                <ImageVault />
              </ProtectedRoute>
            }
          />
          <Route
            path="/protocol-stats"
            element={
              <ProtectedRoute>
                <ProtocolStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <Offers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum/:id"
            element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/identity"
            element={
              <ProtectedRoute>
                <Identity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mobile-signer"
            element={
              <ProtectedRoute>
                <MobileSigner />
              </ProtectedRoute>
            }
          />
          {/* Alias routes for renamed/consolidated paths */}
          <Route path="/developers" element={<Navigate to="/developer" replace />} />
          <Route path="/web-capture" element={<Navigate to="/snapper" replace />} />
          <Route path="/audit-log" element={<Navigate to="/vault" replace />} />
          <Route path="/documentation" element={<Navigate to="/developer" replace />} />
          <Route path="/status" element={<Navigate to="/atlas" replace />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )

  if (isPublic) return content
  return <AppShellNoir>{content}</AppShellNoir>
}

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </I18nProvider>
  )
}

export default App

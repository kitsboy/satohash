import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import React, { Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GlobalDropzone from './components/GlobalDropzone'
import LoadingScreen from './components/LoadingScreen'
import { Toaster } from 'sonner'
import { ToastProvider } from './components/Toast'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, speed: 400 })

// Route-based Code Splitting (Lazy Loading)
const Welcome = React.lazy(() => import('./pages/onboarding/Welcome'))
const TemplateLibrary = React.lazy(() => import('./pages/onboarding/TemplateLibrary'))
const AccountCreation = React.lazy(() => import('./pages/onboarding/AccountCreation'))
const BatchProof = React.lazy(() => import('./pages/onboarding/BatchProof'))

const ContractList = React.lazy(() => import('./pages/contracts/ContractList'))
const ContractEditor = React.lazy(() => import('./pages/contracts/ContractEditor'))
const ContractView = React.lazy(() => import('./pages/contracts/ContractView'))

const SignatureFlow = React.lazy(() => import('./pages/signatures/SignatureFlow'))

const FinalReview = React.lazy(() => import('./pages/timestamp/FinalReview'))
const TimestampProgress = React.lazy(() => import('./pages/timestamp/TimestampProgress'))
const TimestampResult = React.lazy(() => import('./pages/timestamp/TimestampResult'))
const VerificationHelp = React.lazy(() => import('./pages/timestamp/VerificationHelp'))

const TrustCenter = React.lazy(() => import('./pages/trust/TrustCenter'))
const TermsOfService = React.lazy(() => import('./pages/legal/TermsOfService'))
const PrivacyPolicy = React.lazy(() => import('./pages/legal/PrivacyPolicy'))
const CryptoNotice = React.lazy(() => import('./pages/legal/CryptoNotice'))

const VerificationTool = React.lazy(() => import('./pages/verify/VerificationTool'))
const Landing = React.lazy(() => import('./pages/Landing'))
const ProtocolStats = React.lazy(() => import('./pages/ProtocolStats'))
const WebCapture = React.lazy(() => import('./pages/WebCapture'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const ImageVault = React.lazy(() => import('./pages/ImageVault'))

// Developer Portal
const DeveloperPortal = React.lazy(() => import('./pages/DeveloperPortal'))
const BatchTimestamp = React.lazy(() => import('./pages/BatchTimestamp'))

function AppContent() {
  const location = useLocation()

  React.useEffect(() => {
    NProgress.start()
    // Simulate loading delay for page transitions to ensure progress bar renders smoothly
    const timer = setTimeout(() => NProgress.done(), 200)
    return () => clearTimeout(timer)
  }, [location.pathname])

  const hideNavbarPaths = ['/contracts/new/', '/contracts/', '/sign', '/timestamp/']
  const shouldHideNavbar =
    hideNavbarPaths.some((path) => location.pathname.includes(path)) &&
    location.pathname !== '/contracts'

  return (
    <GlobalDropzone>
      {!shouldHideNavbar && <Navbar />}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Onboarding flow */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/choose-template" element={<TemplateLibrary />} />
          <Route path="/account-creation" element={<AccountCreation />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Main app */}
          <Route path="/contracts" element={<ContractList />} />
          <Route path="/contracts/new/:templateType" element={<ContractEditor />} />
          <Route path="/contracts/:contractId" element={<ContractView />} />
          <Route path="/contracts/:contractId/edit" element={<ContractEditor />} />
          <Route path="/contracts/:contractId/sign" element={<SignatureFlow />} />
          <Route path="/batch-proof" element={<BatchProof />} />

          {/* Timestamping flow */}
          <Route path="/contracts/:contractId/timestamp/review" element={<FinalReview />} />
          <Route path="/contracts/:contractId/timestamp/progress" element={<TimestampProgress />} />
          <Route path="/contracts/:contractId/timestamp/result" element={<TimestampResult />} />
          <Route path="/timestamp/verify-help" element={<VerificationHelp />} />

          {/* Trust & Legal */}
          <Route path="/trust" element={<TrustCenter />} />
          <Route path="/legal/terms" element={<TermsOfService />} />
          <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          <Route path="/legal/crypto-notice" element={<CryptoNotice />} />

          {/* Verification */}
          <Route path="/verify" element={<VerificationTool />} />
          <Route path="/protocol-stats" element={<ProtocolStats />} />
          <Route path="/snap-and-stamp" element={<WebCapture />} />
          <Route path="/image-vault" element={<ImageVault />} />

          {/* Developer Portal */}
          <Route path="/developers" element={<DeveloperPortal />} />
          <Route path="/batch-timestamp" element={<BatchTimestamp />} />

          {/* Default redirect & 404 Fallback */}
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{ style: { borderRadius: '12px' } }}
      />
      {!shouldHideNavbar && <Footer />}
    </GlobalDropzone>
  )
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  )
}

export default App

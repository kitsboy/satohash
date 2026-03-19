import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GlobalDropzone from './components/GlobalDropzone'

// Onboarding
import Welcome from './pages/onboarding/Welcome'
import TemplateLibrary from './pages/onboarding/TemplateLibrary'
import AccountCreation from './pages/onboarding/AccountCreation'
import BatchProof from './pages/onboarding/BatchProof'

// Contracts
import ContractList from './pages/contracts/ContractList'
import ContractEditor from './pages/contracts/ContractEditor'
import ContractView from './pages/contracts/ContractView'

// Signatures
import SignatureFlow from './pages/signatures/SignatureFlow'

// Timestamping
import FinalReview from './pages/timestamp/FinalReview'
import TimestampProgress from './pages/timestamp/TimestampProgress'
import TimestampResult from './pages/timestamp/TimestampResult'
import VerificationHelp from './pages/timestamp/VerificationHelp'

// Trust & Legal
import TrustCenter from './pages/trust/TrustCenter'
import TermsOfService from './pages/legal/TermsOfService'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import CryptoNotice from './pages/legal/CryptoNotice'

// Verification
import VerificationTool from './pages/verify/VerificationTool'

// Public Landing
import Landing from './pages/Landing'
import ProtocolStats from './pages/ProtocolStats'
import WebCapture from './pages/WebCapture'

function AppContent() {
  const location = useLocation()
  const hideNavbarPaths = ['/contracts/new/', '/contracts/', '/sign', '/timestamp/']
  const shouldHideNavbar =
    hideNavbarPaths.some((path) => location.pathname.includes(path)) &&
    location.pathname !== '/contracts'

  return (
    <GlobalDropzone>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Onboarding flow */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/choose-template" element={<TemplateLibrary />} />
        <Route path="/account-creation" element={<AccountCreation />} />

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

        {/* Default redirect */}
        <Route path="/" element={<Landing />} />
      </Routes>
      {!shouldHideNavbar && <Footer />}
    </GlobalDropzone>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

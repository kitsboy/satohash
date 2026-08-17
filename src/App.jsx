import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import AppShellNoir from './components/layout/AppShellNoir'
import MarketingShell from './components/layout/MarketingShell'
import LoadingScreen from './components/ui/LoadingScreen'
import OnboardingModal from './components/shared/OnboardingModal'
import { Toaster } from 'sonner'
import { ToastProvider } from './components/ui/Toast'
import { ThemeProvider } from './components/shared/ThemeProvider'
import usePageMeta from './hooks/usePageMeta'
import { I18nProvider } from './i18n'
import LangUrlSync from './components/shared/LangUrlSync'
import SkipToContent from './components/layout/SkipToContent'
import PaywallPreviewBanner from './components/shared/PaywallPreviewBanner'
import ScrollToTop from './components/shared/ScrollToTop'
import OfflineBanner from './components/shared/OfflineBanner'
import DeepHealthBanner from './components/dashboard/DeepHealthBanner'
import ErrorBoundary from './components/shared/ErrorBoundary'
import ProtectedRoute from './components/shared/ProtectedRoute'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getApiUrl } from './config/constants'
import { isMarketingPublicPath, needsMarketingShell } from './utils/publicRoutes'
import useAppHotkeys from './hooks/useAppHotkeys'

import { lazyWithReload } from './utils/lazyWithReload'

// Core loop is lazy + reload-on-stale-chunk so landing stays small.
// Eager Stamp/Verify blew the main index past 1 MB and tripped CI.
const Stamp = lazyWithReload(() => import('./pages/Stamp'))
const StampDone = lazyWithReload(() => import('./pages/StampDone'))
const Verify = lazyWithReload(() => import('./pages/VerificationTool'))
const VerifyPublic = lazyWithReload(() => import('./pages/VerifyPublic'))

// Non-core planes stay lazy; retry+reload if a deploy invalidated the chunk
const Vault = lazyWithReload(() => import('./pages/Vault'))
const Contracts = lazyWithReload(() => import('./pages/contracts/ContractList'))
const WebCapture = lazyWithReload(() => import('./pages/WebCapture'))
const Certificates = lazyWithReload(() =>
  import('./pages/Placeholders').then((m) => ({ default: m.Certificates }))
)
const ImageVault = lazyWithReload(() => import('./pages/ImageVault'))
const Developer = lazyWithReload(() => import('./pages/Developer'))
const Atlas = lazyWithReload(() => import('./pages/Atlas'))
const Nodes = lazyWithReload(() => import('./pages/Mesh'))
const Explorer = lazyWithReload(() => import('./pages/Explorer'))
const Settings = lazyWithReload(() => import('./pages/Settings'))
const Access = lazyWithReload(() => import('./pages/Access'))
// Eager: marketing-critical routes must not use dynamic import (partial deploys +
// circular index↔chunk imports caused "Failed to fetch dynamically imported module")
import Landing from './pages/Landing'
import ExplainerWatch from './pages/ExplainerWatch'
import ExecutiveSummary from './pages/ExecutiveSummary'
const StatusPublic = lazyWithReload(() => import('./pages/StatusPublic'))
const Counsel = lazyWithReload(() => import('./pages/Counsel'))
const ProofCardPublic = lazyWithReload(() => import('./pages/ProofCardPublic'))
const Trust = lazyWithReload(() => import('./pages/trust/TrustCenter'))
const About = lazyWithReload(() => import('./pages/About'))
const Pitch = lazyWithReload(() => import('./pages/Pitch'))
const Admin = lazyWithReload(() => import('./pages/Admin'))
const NostrHealth = lazyWithReload(() => import('./pages/NostrHealth'))

const NotaryTemplates = lazyWithReload(() => import('./pages/NotaryTemplates'))
const TemplatesShowcase = lazyWithReload(() => import('./pages/TemplatesShowcase'))
const NotFound = lazyWithReload(() => import('./pages/NotFound'))
const TemplateDetail = lazyWithReload(() => import('./pages/TemplateDetail'))
const FAQ = lazyWithReload(() => import('./pages/FAQ'))
const Pricing = lazyWithReload(() => import('./pages/Pricing'))
const Comparison = lazyWithReload(() => import('./pages/Comparison'))
const Guides = lazyWithReload(() => import('./pages/Guides'))
const Glossary = lazyWithReload(() => import('./pages/Glossary'))
const Docs = lazyWithReload(() => import('./pages/Docs'))
const DocViewer = lazyWithReload(() => import('./pages/DocViewer'))
const Security = lazyWithReload(() => import('./pages/Security'))
const Integrations = lazyWithReload(() => import('./pages/Integrations'))
const Widgets = lazyWithReload(() => import('./pages/Widgets'))
const Dashboard = lazyWithReload(() => import('./pages/Dashboard'))
const GovernmentUse = lazyWithReload(() => import('./pages/government/GovernmentUse'))
const BatchHashStamp = lazyWithReload(() => import('./pages/government/BatchHashStamp'))
const ChainOfCustody = lazyWithReload(() => import('./pages/government/ChainOfCustody'))
const EvidenceAdmissibility = lazyWithReload(
  () => import('./pages/government/EvidenceAdmissibility')
)
const DistressedAsset = lazyWithReload(() => import('./pages/government/DistressedAsset'))

// Legal pages (public)
// Legal + critical public pages: eager so footer links never hang on lazy chunk miss
import CryptoNotice from './pages/legal/CryptoNotice'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import Network from './pages/Network'
import MotoPassVerify from './pages/government/MotoPassVerify'

// Contracts sub-pages (protected)
const ContractView = lazyWithReload(() => import('./pages/contracts/ContractView'))
const ContractEditor = lazyWithReload(() => import('./pages/contracts/ContractEditor'))

// Orphaned protected pages
const ProtocolStats = lazyWithReload(() => import('./pages/ProtocolStats'))
const Offers = lazyWithReload(() => import('./pages/Offers'))
const Forum = lazyWithReload(() => import('./pages/Forum'))
const Identity = lazyWithReload(() => import('./pages/Identity'))
const MobileSigner = lazyWithReload(() => import('./pages/MobileSigner'))
const BatchTimestamp = lazyWithReload(() => import('./pages/BatchTimestamp'))
const AdminThrottle = lazyWithReload(() => import('./pages/AdminThrottle'))
const Contribute = lazyWithReload(() => import('./pages/Contribute'))
const VerificationShield = lazyWithReload(() => import('./pages/VerificationShield'))
const SignatureFlow = lazyWithReload(() => import('./pages/signatures/SignatureFlow'))

// v5.0.0-ELITE sovereignty surfaces
const V5ProofOfExistence = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.ProofOfExistencePage }))
)

const V5BatchVerify = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.BatchVerifyPage }))
)
const V5LiveFeed = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.StampLiveFeedPage }))
)
const V5Compare = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.CompareProofsPage }))
)
const V5Playground = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.DeveloperPlaygroundPage }))
)
const V5Bitcoin = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.BitcoinExplainPage }))
)
const V5Block = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.BlockPage }))
)
const V5CrossChain = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.CrossChainVerifyPage }))
)
const V5AiHub = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.AiHubPage }))
)
const V5ProofWall = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.ProofWallPage }))
)
const V5Leaderboard = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.LeaderboardPage }))
)
const V5Widget = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.ProofWidgetPage }))
)
const V5Report = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.StampReportPage }))
)
const V5WizardPro = lazyWithReload(() =>
  import('./pages/v5/V5Pages').then((m) => ({ default: m.StampWizardProPage }))
)

// Onboarding flow (protected)
const OnboardingWelcome = lazyWithReload(() => import('./pages/onboarding/Welcome'))
const OnboardingHowItWorks = lazyWithReload(() => import('./pages/onboarding/HowItWorks'))
const OnboardingChooseTemplate = lazyWithReload(() => import('./pages/onboarding/ChooseTemplate'))
const OnboardingAccountCreation = lazyWithReload(() => import('./pages/onboarding/AccountCreation'))
const OnboardingValueConfirmation = lazyWithReload(
  () => import('./pages/onboarding/ValueConfirmation')
)
const OnboardingBatchProof = lazyWithReload(() => import('./pages/onboarding/BatchProof'))
const OnboardingTemplateLibrary = lazyWithReload(() => import('./pages/onboarding/TemplateLibrary'))

// Timestamp wizard (protected)
const TimestampFinalReview = lazyWithReload(() => import('./pages/timestamp/FinalReview'))
const TimestampExplanation = lazyWithReload(() => import('./pages/timestamp/TimestampExplanation'))
const TimestampProgress = lazyWithReload(() => import('./pages/timestamp/TimestampProgress'))
const TimestampResult = lazyWithReload(() => import('./pages/timestamp/TimestampResult'))
const TimestampVerificationHelp = lazyWithReload(() => import('./pages/timestamp/VerificationHelp'))

function AppContent() {
  const location = useLocation()
  useAppHotkeys()

  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduceMotion) return undefined
    NProgress.start()
    const timer = setTimeout(() => NProgress.done(), 500)
    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [location.pathname, reduceMotion])

  const isPublic = isMarketingPublicPath(location.pathname)

  const content = (
    <main id="main-content" tabIndex={-1}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/access" element={<Access />} />
            <Route path="/about" element={<About />} />
            <Route path="/pitch" element={<Pitch />} />
            <Route path="/trust" element={<Trust />} />
            <Route path="/trust-center" element={<Navigate to="/trust" replace />} />
            <Route path="/verify/:id" element={<VerifyPublic />} />
            <Route path="/contribute" element={<Contribute />} />

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
            {/* Core product — always public (MVP free path); no auth gate */}
            <Route path="/stamp" element={<Stamp />} />
            <Route path="/stamp/done" element={<StampDone />} />
            <Route path="/verify" element={<Verify />} />
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
            <Route path="/templates" element={<TemplatesShowcase />} />
            <Route
              path="/templates/new"
              element={
                <ProtectedRoute>
                  <NotaryTemplates />
                </ProtectedRoute>
              }
            />
            <Route path="/templates/:templateId" element={<TemplateDetail />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/docs/executive-summary" element={<ExecutiveSummary />} />
            <Route path="/watch" element={<ExplainerWatch />} />
            <Route path="/explainer" element={<ExplainerWatch />} />
            <Route path="/docs/:slug" element={<DocViewer />} />
            <Route path="/security" element={<Security />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/government" element={<GovernmentUse />} />
            <Route path="/motopass-verify" element={<MotoPassVerify />} />
            <Route path="/batch-hash" element={<BatchHashStamp />} />
            <Route path="/chain-of-custody" element={<ChainOfCustody />} />
            <Route path="/evidence-admissibility" element={<EvidenceAdmissibility />} />
            <Route path="/distressed-asset" element={<DistressedAsset />} />
            <Route path="/widgets" element={<Widgets />} />
            <Route path="/identity" element={<Identity />} />
            {/* v5.0.0-ELITE public surfaces */}
            <Route path="/proof-of-existence" element={<V5ProofOfExistence />} />
            <Route path="/network" element={<Network />} />
            <Route path="/status" element={<StatusPublic />} />
            <Route path="/counsel" element={<Counsel />} />
            <Route path="/p/:hash" element={<ProofCardPublic />} />
            <Route path="/verify/batch" element={<V5BatchVerify />} />
            <Route path="/stamp/live-feed" element={<V5LiveFeed />} />
            <Route path="/compare" element={<V5Compare />} />
            <Route path="/developer/playground" element={<V5Playground />} />
            <Route path="/bitcoin" element={<V5Bitcoin />} />
            <Route path="/block/:height" element={<V5Block />} />
            <Route path="/verify/cross-chain" element={<V5CrossChain />} />
            <Route path="/ai" element={<V5AiHub />} />
            <Route path="/ai-notary" element={<V5AiHub />} />
            <Route path="/community/proof-wall" element={<V5ProofWall />} />
            <Route path="/community/leaderboard" element={<V5Leaderboard />} />
            <Route path="/widget/proof/:hash" element={<V5Widget />} />
            <Route path="/stamp/:id/report" element={<V5Report />} />
            <Route path="/stamp/wizard-pro" element={<V5WizardPro />} />
            <Route path="/stamp/drag-and-drop" element={<Navigate to="/stamp" replace />} />
            <Route path="/mobile-scanner" element={<Navigate to="/stamp" replace />} />
            <Route path="/history/timeline" element={<Navigate to="/vault" replace />} />
            <Route path="/dashboard/metrics" element={<Navigate to="/protocol-stats" replace />} />
            <Route
              path="/community/feed"
              element={<Navigate to="/community/proof-wall" replace />}
            />
            <Route path="/verify/social" element={<Navigate to="/proof-of-existence" replace />} />
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
              path="/mobile-signer"
              element={
                <ProtectedRoute>
                  <MobileSigner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/batch"
              element={
                <ProtectedRoute>
                  <BatchTimestamp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/throttle"
              element={
                <ProtectedRoute>
                  <AdminThrottle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-shield/:id"
              element={
                <ProtectedRoute>
                  <VerificationShield />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signatures/:contractId"
              element={
                <ProtectedRoute>
                  <SignatureFlow />
                </ProtectedRoute>
              }
            />

            {/* Onboarding wizard */}
            <Route
              path="/onboarding/welcome"
              element={
                <ProtectedRoute>
                  <OnboardingWelcome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/how-it-works"
              element={
                <ProtectedRoute>
                  <OnboardingHowItWorks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/choose-template"
              element={
                <ProtectedRoute>
                  <OnboardingChooseTemplate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/account-creation"
              element={
                <ProtectedRoute>
                  <OnboardingAccountCreation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/value-confirmation"
              element={
                <ProtectedRoute>
                  <OnboardingValueConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/batch-proof"
              element={
                <ProtectedRoute>
                  <OnboardingBatchProof />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/template-library"
              element={
                <ProtectedRoute>
                  <OnboardingTemplateLibrary />
                </ProtectedRoute>
              }
            />

            {/* Timestamp wizard */}
            <Route
              path="/contracts/:contractId/timestamp/review"
              element={
                <ProtectedRoute>
                  <TimestampFinalReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contracts/:contractId/timestamp/explanation"
              element={
                <ProtectedRoute>
                  <TimestampExplanation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contracts/:contractId/timestamp/progress"
              element={
                <ProtectedRoute>
                  <TimestampProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contracts/:contractId/timestamp/result"
              element={
                <ProtectedRoute>
                  <TimestampResult />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timestamp/verification-help"
              element={
                <ProtectedRoute>
                  <TimestampVerificationHelp />
                </ProtectedRoute>
              }
            />

            {/* Alias routes for renamed/consolidated paths */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nostr-health"
              element={
                <ProtectedRoute>
                  <NostrHealth />
                </ProtectedRoute>
              }
            />
            <Route path="/developers" element={<Navigate to="/developer" replace />} />
            <Route path="/developer-portal" element={<Navigate to="/developer" replace />} />
            <Route
              path="/choose-template"
              element={<Navigate to="/onboarding/choose-template" replace />}
            />
            <Route
              path="/account-creation"
              element={<Navigate to="/onboarding/account-creation" replace />}
            />
            <Route path="/web-capture" element={<Navigate to="/snapper" replace />} />
            <Route path="/audit-log" element={<Navigate to="/vault" replace />} />
            <Route path="/documentation" element={<Navigate to="/developer" replace />} />
            <Route path="/changelog" element={<Navigate to="/docs/improvements-log" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </main>
  )

  // Marketing routes: no AppShell bottom bar. Many lacked any mobile nav — shell fixes that.
  if (isPublic) {
    if (needsMarketingShell(location.pathname)) {
      return <MarketingShell>{content}</MarketingShell>
    }
    return content
  }
  return <AppShellNoir>{content}</AppShellNoir>
}

function App() {
  usePageMeta({
    title: null,
    description:
      'Stamp any document on the Bitcoin blockchain. Free, private, court-admissible proof of existence.'
  })

  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return (
      localStorage.getItem('satohash_authed') === 'true' &&
      !localStorage.getItem('satohash-onboarded')
    )
  })
  const reduceMotion = useReducedMotion()

  // FIX 2 — Auto-refresh JWT if it exists and is near expiry
  useEffect(() => {
    const token = localStorage.getItem('satohash_token')
    if (!token) return
    const refresh = async () => {
      try {
        const API = getApiUrl()
        const res = await fetch(`${API}/api/auth/refresh`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          if (data.refreshed) {
            localStorage.setItem('satohash_token', data.token)
          }
        } else {
          // Token invalid — clear auth
          localStorage.removeItem('satohash_token')
          localStorage.removeItem('satohash_authed')
        }
      } catch (_err) {
        // Token invalid — silently ignore
      }
    }
    refresh()
  }, [])

  useEffect(() => {
    const goOffline = () => setIsOffline(true)
    const goOnline = () => setIsOffline(false)
    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  return (
    <I18nProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <LangUrlSync />
            <SkipToContent />
            {isOffline && <OfflineBanner />}
            <DeepHealthBanner />
            <PaywallPreviewBanner />

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

            {/* First-run onboarding modal — skip motion when prefers-reduced-motion */}
            {reduceMotion ? (
              showOnboarding && <OnboardingModal onDone={() => setShowOnboarding(false)} />
            ) : (
              <AnimatePresence>
                {showOnboarding && <OnboardingModal onDone={() => setShowOnboarding(false)} />}
              </AnimatePresence>
            )}
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}

export default App

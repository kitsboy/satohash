import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

// Onboarding
import Welcome from './pages/onboarding/Welcome';
import HowItWorks from './pages/onboarding/HowItWorks';
import TemplateLibrary from './pages/onboarding/TemplateLibrary';
import AccountCreation from './pages/onboarding/AccountCreation';
import ValueConfirmation from './pages/onboarding/ValueConfirmation';
import BatchProof from './pages/onboarding/BatchProof';

// Contracts
import ContractList from './pages/contracts/ContractList';
import ContractEditor from './pages/contracts/ContractEditor';
import ContractView from './pages/contracts/ContractView';

// Signatures
import SignatureFlow from './pages/signatures/SignatureFlow';

// Timestamping
import FinalReview from './pages/timestamp/FinalReview';
import TimestampExplanation from './pages/timestamp/TimestampExplanation';
import TimestampProgress from './pages/timestamp/TimestampProgress';
import TimestampResult from './pages/timestamp/TimestampResult';
import VerificationHelp from './pages/timestamp/VerificationHelp';

// Trust & Legal
import TrustCenter from './pages/trust/TrustCenter';
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CryptoNotice from './pages/legal/CryptoNotice';

// Verification
import VerificationTool from './pages/verify/VerificationTool';

function App() {
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

    useEffect(() => {
        const onboarded = localStorage.getItem('satohash_onboarded');
        setHasCompletedOnboarding(onboarded === 'true');
    }, []);

    return (
        <Router>
            <GlobalDropzone>
                <Navbar />
                <Routes>
                    {/* Onboarding flow */}
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/choose-template" element={<TemplateLibrary />} />
                    <Route path="/account-creation" element={<AccountCreation />} />
                    <Route path="/value-confirmation" element={<ValueConfirmation />} />

                    {/* Main app */}
                    <Route path="/contracts" element={<ContractList />} />
                    <Route path="/contracts/new/:templateType" element={<ContractEditor />} />
                    <Route path="/contracts/:contractId" element={<ContractView />} />
                    <Route path="/contracts/:contractId/edit" element={<ContractEditor />} />
                    <Route path="/contracts/:contractId/sign" element={<SignatureFlow />} />
                    <Route path="/batch-proof" element={<BatchProof />} />

                    {/* Timestamping flow */}
                    <Route path="/contracts/:contractId/timestamp/review" element={<FinalReview />} />
                    <Route path="/contracts/:contractId/timestamp/explain" element={<TimestampExplanation />} />
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

                    {/* Default redirect */}
                    <Route
                        path="/"
                        element={
                            hasCompletedOnboarding ?
                                <Navigate to="/contracts" replace /> :
                                <Navigate to="/welcome" replace />
                        }
                    />
                </Routes>
            </GlobalDropzone>
        </Router>
    );
}

export default App;

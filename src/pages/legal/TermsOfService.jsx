import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../../components/Footer';

export default function TermsOfService() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <div className="container container-narrow">
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        marginBottom: 'var(--spacing-lg)'
                    }}
                >
                    <ArrowLeft size={20} /> Back
                </button>

                <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Terms of Service</h1>

                <div style={{
                    fontSize: '16px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.8',
                    fontWeight: '600'
                }}>
                    <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

                    <h2>1. Service Description</h2>
                    <p>Satohash provides cryptographic timestamping services using Bitcoin and OpenTimestamps. We create cryptographic proofs that documents existed at specific times.</p>

                    <h2>2. No Legal Advice</h2>
                    <p>Satohash does not provide legal advice. Our service is a tool for creating cryptographic evidence. Consult a qualified attorney for legal guidance.</p>

                    <h2>3. User Responsibilities</h2>
                    <p>Users are responsible for the accuracy and legality of documents they timestamp. Satohash does not review or validate document contents.</p>

                    <h2>4. Fees</h2>
                    <p>Satohash is currently free during early access. Users pay only Bitcoin network fees for timestamping operations.</p>

                    <h2>5. Data Privacy</h2>
                    <p>We do not store full document contents. Only cryptographic hashes are used for timestamping. See our Privacy Policy for details.</p>

                    <h2>6. No Warranties</h2>
                    <p>The service is provided "as is" without warranties. We do not guarantee legal enforceability of timestamped documents.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

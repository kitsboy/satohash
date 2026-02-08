import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
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

                <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Privacy Policy</h1>

                <div style={{
                    fontSize: '16px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.8',
                    fontWeight: '600'
                }}>
                    <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

                    <h2>1. Information We Collect</h2>
                    <p>Satohash collects minimal information: email addresses for account creation and cryptographic hashes of documents for timestamping.</p>

                    <h2>2. Document Privacy</h2>
                    <p>We do not store full document contents. Only SHA-256 hashes are transmitted to our servers and OpenTimestamps calendar servers.</p>

                    <h2>3. Data Storage</h2>
                    <p>In the current implementation, data is stored locally in your browser. User account data and contracts are stored in browser localStorage.</p>

                    <h2>4. Third-Party Services</h2>
                    <p>We use OpenTimestamps calendar servers and mempool.space API for Bitcoin network data. These services may have their own privacy policies.</p>

                    <h2>5. Data Security</h2>
                    <p>All data is encrypted in transit using HTTPS. Local data security depends on your device security.</p>

                    <h2>6. Your Rights</h2>
                    <p>You can delete your local data at any time by clearing your browser data. You control all document and proof files.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

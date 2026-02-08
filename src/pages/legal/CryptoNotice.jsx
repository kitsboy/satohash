import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../../components/Footer';

export default function CryptoNotice() {
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

                <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Digital Signature & Cryptographic Evidence Notice</h1>

                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
                    <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

                    <h2>Understanding Cryptographic Timestamps</h2>
                    <p>Satohash uses OpenTimestamps to create cryptographic proof that a document existed at or before a specific time.</p>

                    <h2>What This Proves</h2>
                    <ul>
                        <li>The exact content of the document at the time of timestamping</li>
                        <li>When the timestamp was anchored to the Bitcoin blockchain</li>
                        <li>That the document has not been altered since timestamping</li>
                    </ul>

                    <h2>What This Does NOT Prove</h2>
                    <ul>
                        <li>Legal validity or enforceability of the document</li>
                        <li>Identity of document signers (unless additional verification is used)</li>
                        <li>Compliance with jurisdiction-specific requirements</li>
                    </ul>

                    <h2>Legal Considerations</h2>
                    <p>The legal admissibility of digital signatures and cryptographic evidence varies by jurisdiction and use case. Consult local law and legal counsel to understand:</p>
                    <ul>
                        <li>Electronic signature requirements in your jurisdiction</li>
                        <li>Evidence admissibility standards</li>
                        <li>Specific requirements for contracts in your industry</li>
                        <li>Notarization and witnessing requirements</li>
                    </ul>

                    <h2>Technical Verification</h2>
                    <p>The cryptographic proof can be independently verified using open-source tools. This verification is separate from legal enforceability.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}

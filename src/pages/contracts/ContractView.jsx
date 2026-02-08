import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Clock, Users, ShieldCheck, Download, ExternalLink, EyeOff } from 'lucide-react';
import Button from '../../components/Button';
import StatusPill from '../../components/StatusPill';
import Footer from '../../components/Footer';
import ProofExplorer from '../../components/ProofExplorer';
import ZKRedactionTool from '../../components/ZKRedactionTool';

export default function ContractView() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { contractId } = useParams();
    const [contract, setContract] = useState(null);
    const [isProofExplorerOpen, setIsProofExplorerOpen] = useState(false);
    const [isZKToolOpen, setIsZKToolOpen] = useState(false);

    // --- Step 2: Live Signer Heartbeats ---
    const [activeSigners] = useState([
        { id: 1, name: 'Alex Rivera', status: 'viewing', color: '#10b981' },
        { id: 2, name: 'Sarah Chen', status: 'idle', color: '#6366f1' }
    ]);
    const [showHeartbeat, setShowHeartbeat] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowHeartbeat(false);
            setTimeout(() => setShowHeartbeat(true), 150);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            const contracts = JSON.parse(savedContracts);
            const found = contracts.find(c => c.id === contractId);
            setContract(found);
        }
    }, [contractId]);

    if (!contract) {
        return (
            <div className="page">
                <div className="container text-center" style={{ marginTop: '100px' }}>
                    <p>{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    const canTimestamp = contract.status === 'signed';
    const isDraft = contract.status === 'draft';
    const isTimestamped = contract.status === 'timestamped';

    // Generate hash watermark text
    const watermarkHash = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"; // Genesis block hash for flavor
    const watermarkArray = Array(80).fill(watermarkHash);

    return (
        <div className="page" style={{ background: 'var(--color-surface)' }}>
            <div className="container" style={{ paddingTop: '20px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <button
                        onClick={() => navigate('/contracts')}
                        style={{
                            background: 'var(--color-surface-elevated)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '14px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <ArrowLeft size={16} />
                        {t('common.back')}
                    </button>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <StatusPill status={contract.status || 'draft'} />
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>

                    {/* Left Side: Document */}
                    <div style={{ flex: 1 }}>
                        <div className="premium-document-container">
                            {/* Cryptographic Watermark */}
                            <div className="hash-watermark">
                                {watermarkArray.map((hash, i) => (
                                    <span key={i}>{hash}</span>
                                ))}
                            </div>

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    textAlign: 'center',
                                    marginBottom: '60px',
                                    borderBottom: '2px solid #1f2937',
                                    paddingBottom: '20px'
                                }}>
                                    <h1 style={{
                                        fontFamily: 'serif',
                                        fontSize: 'clamp(20px, 4vw, 28px)',
                                        fontWeight: '950',
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        margin: 0,
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        {contract.name}
                                    </h1>

                                    {/* Live Signer Heartbeats */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        marginTop: '20px',
                                        opacity: showHeartbeat ? 1 : 0.6,
                                        transition: 'opacity 0.15s ease'
                                    }}>
                                        {activeSigners.map(signer => (
                                            <div key={signer.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '4px 10px',
                                                background: 'var(--color-border-light)',
                                                borderRadius: '100px',
                                                fontSize: '11px',
                                                fontWeight: '800',
                                                color: 'var(--color-text-secondary)',
                                                border: `1px solid ${signer.status === 'viewing' ? signer.color + '40' : 'transparent'}`
                                            }}>
                                                <div style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: signer.color,
                                                    boxShadow: signer.status === 'viewing' ? `0 0 8px ${signer.color}` : 'none'
                                                }} />
                                                {signer.name.split(' ')[0]}
                                                <span style={{ fontSize: '9px', opacity: 0.6, fontWeight: '500' }}>{signer.status.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{
                                        fontSize: '12px',
                                        color: 'var(--color-text-tertiary)',
                                        marginTop: '10px',
                                        fontWeight: '800',
                                        letterSpacing: '1px'
                                    }}>
                                        SECURED BY SATOHASH BLOCKCHAIN ANCHORING
                                    </p>
                                </div>

                                <div className="legal-typography">
                                    {contract.content}
                                </div>

                                {/* Signatures / Seals Section */}
                                {(contract.status === 'signed' || isTimestamped) && (
                                    <div style={{
                                        marginTop: '80px',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: '40px'
                                    }}>
                                        <div className="digital-seal-container">
                                            <div className="digital-signature-seal animate-seal-drop">
                                                <ShieldCheck size={48} color="white" />
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{ fontSize: '12px', fontWeight: '800', margin: 0, color: '#1f2937' }}>
                                                    CRYPTOGRAPHIC PROOF
                                                </p>
                                                <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>
                                                    {contract.id.substring(0, 16)}...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Actions Sidebar */}
                    <div style={{
                        background: 'var(--color-surface-elevated)',
                        padding: '30px',
                        borderRadius: '20px',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Contract Actions</h3>

                        {isDraft && (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/contracts/${contractId}/edit`)}
                                    style={{ width: '100%', borderRadius: '12px' }}
                                >
                                    <Edit size={18} />
                                    {t('common.edit')}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(`/contracts/${contractId}/sign`)}
                                    style={{ width: '100%', borderRadius: '12px' }}
                                >
                                    <Users size={18} />
                                    {t('timestamp.review.readyToSign')}
                                </Button>
                            </>
                        )}

                        {canTimestamp && (
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/contracts/${contractId}/timestamp/review`)}
                                style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                <Clock size={18} />
                                {t('timestamp.review.timestampThisAgreement')}
                            </Button>
                        )}

                        {isTimestamped && (
                            <>
                                <Button
                                    variant="primary"
                                    style={{ width: '100%', borderRadius: '12px' }}
                                >
                                    <Download size={18} />
                                    Download Proof Package
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate('/verify')}
                                    style={{ width: '100%', borderRadius: '12px' }}
                                >
                                    <ExternalLink size={18} />
                                    Verify on Blockchain
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsProofExplorerOpen(true)}
                                    style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        background: 'rgba(99, 102, 241, 0.05)',
                                        border: '1px dashed rgba(99, 102, 241, 0.3)',
                                        color: '#4f46e5'
                                    }}
                                >
                                    <ShieldCheck size={18} />
                                    Deep Proof Explorer
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsZKToolOpen(true)}
                                    style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        background: 'rgba(34, 197, 94, 0.05)',
                                        border: '1px dashed rgba(34, 197, 94, 0.3)',
                                        color: '#166534'
                                    }}
                                >
                                    <EyeOff size={18} />
                                    Privacy Shield (ZK)
                                </Button>
                            </>
                        )}

                        <div style={{
                            marginTop: '10px',
                            padding: '16px',
                            background: 'var(--color-border-light)',
                            borderRadius: '12px',
                            border: '1px solid var(--color-border)'
                        }}>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: '1.5' }}>
                                <strong>Legal Metadata</strong><br />
                                ID: {contract.id}<br />
                                Created: {new Date(contract.createdAt).toLocaleDateString()}<br />
                                Modified: {new Date(contract.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ height: '60px' }} />
            </div>

            <Footer />

            <ProofExplorer
                isOpen={isProofExplorerOpen}
                onClose={() => setIsProofExplorerOpen(false)}
                contract={contract}
                timestamp={contract.timestamp}
            />

            <ZKRedactionTool
                isOpen={isZKToolOpen}
                onClose={() => setIsZKToolOpen(false)}
                contract={contract}
            />
        </div>
    );
}

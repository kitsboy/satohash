import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Footer from '../../components/Footer';

export default function SignatureFlow() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { contractId } = useParams();
    const [contract, setContract] = useState(null);
    const [signatureType, setSignatureType] = useState('typed'); // 'typed' or 'drawn'
    const [typedName, setTypedName] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            const contracts = JSON.parse(savedContracts);
            const found = contracts.find(c => c.id === contractId);
            setContract(found);
        }
    }, [contractId]);

    const handleSubmitSignature = async () => {
        if (contract) {
            setVerifying(true);
            // Simulate cryptographic seal generation
            await new Promise(r => setTimeout(r, 2000));

            const savedContracts = localStorage.getItem('satohash_contracts');
            const contracts = JSON.parse(savedContracts);
            const index = contracts.findIndex(c => c.id === contractId);

            contracts[index] = {
                ...contracts[index],
                status: 'signed',
                signedAt: new Date().toISOString()
            };

            localStorage.setItem('satohash_contracts', JSON.stringify(contracts));
            setStatus('success');

            // Auto-redirect after seeing the seal
            setTimeout(() => {
                navigate(`/contracts/${contractId}`);
            }, 3000);
        }
    };

    const [verifying, setVerifying] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success

    if (!contract) {
        return (
            <div className="page">
                <div className="container text-center">
                    <p>{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    const canSubmit = signatureType === 'typed' ? (typedName && agreedToTerms) : agreedToTerms;

    return (
        <div className="page">
            <div className="container container-narrow">
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <button
                        onClick={() => navigate(`/contracts/${contractId}`)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)',
                            padding: 'var(--spacing-sm)',
                            marginLeft: '-var(--spacing-sm)'
                        }}
                    >
                        <ArrowLeft size={20} />
                        {t('common.back')}
                    </button>
                </div>

                <div className="page-header">
                    <h1 className="page-title">{t('signatures.title')}</h1>
                </div>

                {status === 'success' ? (
                    <div className="animate-stamp" style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: 'var(--color-primary)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px',
                            color: 'white',
                            boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
                            animation: 'pulse-glow 2s infinite'
                        }}>
                            <Check size={64} strokeWidth={3} />
                        </div>
                        <h2 style={{ fontWeight: '950', color: '#000000', marginBottom: '16px' }}>Cryptographic Seal Applied</h2>
                        <p style={{ color: 'var(--color-text-primary)', fontWeight: '800', maxWidth: '400px', margin: '0 auto' }}>
                            Your digital signature has been cryptographically bound to the document hash.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Signature type selector */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                            <Button
                                variant={signatureType === 'typed' ? 'primary' : 'secondary'}
                                onClick={() => setSignatureType('typed')}
                                style={{ flex: 1, fontWeight: '950' }}
                                disabled={verifying}
                            >
                                {t('signatures.typeSignature')}
                            </Button>
                            <Button
                                variant={signatureType === 'drawn' ? 'primary' : 'secondary'}
                                onClick={() => setSignatureType('drawn')}
                                style={{ flex: 1, fontWeight: '950' }}
                                disabled={verifying}
                            >
                                {t('signatures.drawSignature')}
                            </Button>
                        </div>

                        <Card style={{ position: 'relative', overflow: 'hidden' }}>
                            {verifying && <div className="scan-line" />}
                            {signatureType === 'typed' ? (
                                <div className="form-group">
                                    <label className="form-label">{t('signatures.typeSignature')}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={typedName}
                                        onChange={(e) => setTypedName(e.target.value)}
                                        placeholder="Your full name"
                                        style={{ fontFamily: 'cursive', fontSize: 'var(--text-xl)', height: '60px' }}
                                        disabled={verifying}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="form-label">{t('signatures.drawSignature')}</label>
                                    <canvas
                                        ref={canvasRef}
                                        width={600}
                                        height={300}
                                        style={{
                                            border: '2px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: verifying ? 'default' : 'crosshair',
                                            width: '100%',
                                            background: '#f8fafc'
                                        }}
                                        onMouseDown={() => !verifying && setIsDrawing(true)}
                                        onMouseUp={() => setIsDrawing(false)}
                                    />
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            const canvas = canvasRef.current;
                                            const ctx = canvas.getContext('2d');
                                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                                        }}
                                        style={{ marginTop: 'var(--spacing-sm)' }}
                                        disabled={verifying}
                                    >
                                        {t('signatures.clear')}
                                    </Button>
                                </div>
                            )}

                            <div className="form-checkbox" style={{ marginTop: 'var(--spacing-lg)' }}>
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    disabled={verifying}
                                />
                                <label htmlFor="agreeTerms" style={{ fontWeight: '700' }}>{t('signatures.agreeCheckbox')}</label>
                            </div>
                        </Card>

                        <Button
                            variant="primary"
                            size="large"
                            onClick={handleSubmitSignature}
                            disabled={!canSubmit || verifying}
                            style={{
                                width: '100%',
                                marginTop: 'var(--spacing-xl)',
                                height: '64px',
                                fontWeight: '950',
                                background: verifying ? '#94a3b8' : undefined
                            }}
                        >
                            {verifying ? 'Generating Proof...' : <><Check size={20} /> {t('signatures.submit')}</>}
                        </Button>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}

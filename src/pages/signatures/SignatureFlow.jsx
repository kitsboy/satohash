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

    const handleSubmitSignature = () => {
        if (contract) {
            // Update contract status to signed
            const savedContracts = localStorage.getItem('satohash_contracts');
            const contracts = JSON.parse(savedContracts);
            const index = contracts.findIndex(c => c.id === contractId);

            contracts[index] = {
                ...contracts[index],
                status: 'signed',
                signedAt: new Date().toISOString()
            };

            localStorage.setItem('satohash_contracts', JSON.stringify(contracts));
            navigate(`/contracts/${contractId}`);
        }
    };

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

                {/* Signature type selector */}
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                    <Button
                        variant={signatureType === 'typed' ? 'primary' : 'secondary'}
                        onClick={() => setSignatureType('typed')}
                        style={{ flex: 1 }}
                    >
                        {t('signatures.typeSignature')}
                    </Button>
                    <Button
                        variant={signatureType === 'drawn' ? 'primary' : 'secondary'}
                        onClick={() => setSignatureType('drawn')}
                        style={{ flex: 1 }}
                    >
                        {t('signatures.drawSignature')}
                    </Button>
                </div>

                <Card>
                    {signatureType === 'typed' ? (
                        <div className="form-group">
                            <label className="form-label">{t('signatures.typeSignature')}</label>
                            <input
                                type="text"
                                className="form-input"
                                value={typedName}
                                onChange={(e) => setTypedName(e.target.value)}
                                placeholder="Your full name"
                                style={{ fontFamily: 'cursive', fontSize: 'var(--text-xl)' }}
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="form-label">{t('signatures.drawSignature')}</label>
                            <canvas
                                ref={canvasRef}
                                width={300}
                                height={150}
                                style={{
                                    border: '2px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'crosshair',
                                    width: '100%',
                                    maxWidth: '500px'
                                }}
                                onMouseDown={() => setIsDrawing(true)}
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
                        />
                        <label htmlFor="agreeTerms">{t('signatures.agreeCheckbox')}</label>
                    </div>
                </Card>

                <Button
                    variant="primary"
                    size="large"
                    onClick={handleSubmitSignature}
                    disabled={!canSubmit}
                    style={{ width: '100%', marginTop: 'var(--spacing-xl)' }}
                >
                    <Check size={20} />
                    {t('signatures.submit')}
                </Button>
            </div>

            <Footer />
        </div>
    );
}

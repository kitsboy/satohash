import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Info, Bitcoin } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import { getFeeEstimates, convertSatsToFiat } from '../../utils/mempool';

export default function TimestampExplanation() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { contractId } = useParams();
    const [feeEstimates, setFeeEstimates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const loadFees = async () => {
            const fees = await getFeeEstimates();
            setFeeEstimates(fees);
            setLoading(false);
        };
        loadFees();
    }, []);

    const handleTimestamp = () => {
        navigate(`/contracts/${contractId}/timestamp/progress`);
    };

    return (
        <div className="page">
            <div className="container container-narrow">
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <button
                        onClick={() => navigate(`/contracts/${contractId}/timestamp/review`)}
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

                <div className="page-header text-center">
                    <h1 className="page-title">{t('timestamp.explain.title')}</h1>
                </div>

                <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <p style={{ lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--spacing-lg)' }}>
                        {t('timestamp.explain.description')}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <Info size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                            <p className="mb-0">{t('timestamp.explain.point1')}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <Info size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                            <p className="mb-0">{t('timestamp.explain.point2')}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <Info size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                            <p className="mb-0">{t('timestamp.explain.point3')}</p>
                        </div>
                    </div>
                </Card>

                {/* Fee panel */}
                <Card style={{ background: 'var(--color-surface)', marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                        <Bitcoin size={24} color="var(--color-warning)" />
                        <h3 className="mb-0">{t('timestamp.explain.feeTitle')}</h3>
                    </div>

                    {loading ? (
                        <p className="text-secondary">{t('timestamp.explain.loading')}</p>
                    ) : (
                        <>
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <p className="mb-0">
                                    <span className="font-semibold">Fast confirmation:</span> ~{feeEstimates?.fastestFee || 20} sats/vByte
                                    <span className="text-secondary"> (≈ ${convertSatsToFiat((feeEstimates?.fastestFee || 20) * 250)})</span>
                                </p>
                            </div>
                            <p className="text-secondary mb-0" style={{ fontSize: 'var(--text-sm)' }}>
                                {t('timestamp.explain.feeDescription')}
                            </p>

                            {showDetails && (
                                <div style={{
                                    marginTop: 'var(--spacing-md)',
                                    paddingTop: 'var(--spacing-md)',
                                    borderTop: '1px solid var(--color-border)',
                                    fontSize: 'var(--text-sm)',
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    <p>Half hour: {feeEstimates?.halfHourFee} sats/vByte</p>
                                    <p>One hour: {feeEstimates?.hourFee} sats/vByte</p>
                                    <p>Economy: {feeEstimates?.economyFee} sats/vByte</p>
                                </div>
                            )}

                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-primary)',
                                    cursor: 'pointer',
                                    fontSize: 'var(--text-sm)',
                                    marginTop: 'var(--spacing-sm)',
                                    padding: 0
                                }}
                            >
                                {showDetails ? 'Hide' : t('timestamp.explain.details')}
                            </button>
                        </>
                    )}
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <Button
                        variant="primary"
                        size="large"
                        onClick={handleTimestamp}
                        style={{ width: '100%' }}
                    >
                        {t('timestamp.explain.timestampNow')}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => navigate(`/contracts/${contractId}`)}
                    >
                        {t('timestamp.explain.cancel')}
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

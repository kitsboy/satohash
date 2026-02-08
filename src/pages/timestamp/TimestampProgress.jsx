import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Loader } from 'lucide-react';
import Button from '../../components/Button';
import ProgressSteps from '../../components/ProgressSteps';
import Footer from '../../components/Footer';
import { createHash, createTimestamp } from '../../utils/opentimestamps';

const STEPS = ['Creating fingerprint…', 'Submitting to timestamp servers…', 'Anchoring into Bitcoin…'];

export default function TimestampProgress() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { contractId } = useParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [contract, setContract] = useState(null);
    const [timestamp, setTimestamp] = useState(null);

    useEffect(() => {
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            const contracts = JSON.parse(savedContracts);
            setContract(contracts.find(c => c.id === contractId));
        }
    }, [contractId]);

    useEffect(() => {
        if (!contract) return;

        const processTimestamp = async () => {
            // Step 1: Create hash
            await new Promise(resolve => setTimeout(resolve, 1000));
            const hash = await createHash(contract.content);
            setCurrentStep(1);

            // Step 2: Create timestamp
            await new Promise(resolve => setTimeout(resolve, 1500));
            const ts = await createTimestamp(hash);
            setCurrentStep(2);

            // Step 3: Save
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update contract with timestamp
            const savedContracts = localStorage.getItem('satohash_contracts');
            const contracts = JSON.parse(savedContracts);
            const index = contracts.findIndex(c => c.id === contractId);
            contracts[index] = {
                ...contracts[index],
                status: 'timestamped',
                timestamp: ts
            };
            localStorage.setItem('satohash_contracts', JSON.stringify(contracts));

            setTimestamp(ts);
            setCurrentStep(3);
        };

        processTimestamp();
    }, [contract, contractId]);

    return (
        <div className="page">
            <div className="container container-narrow text-center">
                <div className="page-header">
                    <h1 className="page-title">{t('timestamp.progress.title')}</h1>
                </div>

                <div style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
                    {STEPS.map((step, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                marginBottom: 'var(--spacing-lg)',
                                padding: 'var(--spacing-lg)',
                                background: currentStep > index ? 'var(--color-surface)' : 'transparent',
                                borderRadius: 'var(--radius-md)'
                            }}
                        >
                            {currentStep > index ? (
                                <Check size={24} color="var(--color-success)" />
                            ) : currentStep === index ? (
                                <Loader size={24} className="animate-pulse" color="var(--color-primary)" />
                            ) : (
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--color-border)'
                                }} />
                            )}
                            <span className={currentStep >= index ? 'font-semibold' : 'text-secondary'}>
                                {t(`timestamp.progress.step${index + 1}`)}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="text-secondary" style={{ lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--spacing-xl)' }}>
                    {t('timestamp.progress.info')}
                </p>

                {currentStep === 3 && (
                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => navigate(`/contracts/${contractId}/timestamp/result`)}
                        style={{ width: '100%' }}
                    >
                        {t('timestamp.progress.done')}
                    </Button>
                )}
            </div>
            <Footer />
        </div>
    );
}

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Footer from '../../components/Footer';

export default function FinalReview() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { contractId } = useParams();
    const [contract, setContract] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            const contracts = JSON.parse(savedContracts);
            setContract(contracts.find(c => c.id === contractId));
        }
    }, [contractId]);

    if (!contract) return null;

    return (
        <div className="page">
            <div className="container container-narrow">
                <div className="page-header text-center">
                    <h1 className="page-title">{t('timestamp.review.title')}</h1>
                </div>

                <div style={{
                    background: 'var(--color-surface)',
                    padding: 'var(--spacing-xl)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--spacing-xl)',
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                        {contract.content}
                    </pre>
                </div>

                <Button
                    variant="primary"
                    size="large"
                    onClick={() => setShowConfirm(true)}
                    style={{ width: '100%' }}
                >
                    {t('timestamp.review.timestampThisAgreement')}
                </Button>

                <Modal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    title={t('timestamp.review.confirmTitle')}
                    actions={
                        <>
                            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                                {t('timestamp.review.goBack')}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/contracts/${contractId}/timestamp/explain`)}
                            >
                                {t('timestamp.review.yes')}
                            </Button>
                        </>
                    }
                >
                    <p>{t('timestamp.review.confirmMessage')}</p>
                </Modal>
            </div>
            <Footer />
        </div>
    );
}

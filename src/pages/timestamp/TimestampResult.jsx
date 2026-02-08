import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, Mail, Copy, Check } from 'lucide-react';
import Button from '../../components/Button';
import StatusPill from '../../components/StatusPill';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import { downloadProofPackage, downloadOTSFile } from '../../utils/pdfGenerator';

export default function TimestampResult() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { contractId } = useParams();
    const [contract, setContract] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            const contracts = JSON.parse(savedContracts);
            setContract(contracts.find(c => c.id === contractId));
        }
    }, [contractId]);

    const handleDownload = () => {
        if (contract && contract.timestamp) {
            downloadProofPackage(contract, contract.timestamp);
            downloadOTSFile(contract.timestamp);
        }
    };

    const handleCopyHash = () => {
        if (contract?.timestamp?.hash) {
            navigator.clipboard.writeText(contract.timestamp.hash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!contract || !contract.timestamp) {
        return (
            <div className="page">
                <div className="container text-center">
                    <p>{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container container-narrow">
                <div className="page-header text-center">
                    <h1 className="page-title">{t('timestamp.result.title')}</h1>
                    <StatusPill status={contract.timestamp.status} />
                </div>

                <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                            {t('timestamp.result.statusPending')}
                        </label>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label className="text-secondary" style={{ fontSize: 'var(--text-sm)', display: 'block', marginBottom: 'var(--spacing-xs)' }}>
                            {t('timestamp.result.fingerprint')}
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <code style={{
                                fontSize: 'var(--text-sm)',
                                wordBreak: 'break-all',
                                flex: 1,
                                background: 'var(--color-surface)',
                                padding: 'var(--spacing-sm)',
                                borderRadius: 'var(--radius-sm)'
                            }}>
                                {contract.timestamp.hash}
                            </code>
                            <button
                                onClick={handleCopyHash}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-primary)'
                                }}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                            {t('timestamp.result.timestampedAt')}
                        </label>
                        <p className="mb-0">{new Date(contract.timestamp.createdAt).toLocaleString()}</p>
                    </div>

                    <div>
                        <label className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                            {t('timestamp.result.blockchain')}
                        </label>
                    </div>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                    <Button
                        variant="primary"
                        onClick={handleDownload}
                        style={{ width: '100%' }}
                    >
                        <Download size={20} />
                        {t('timestamp.result.downloadProof')}
                    </Button>
                    <Button
                        variant="secondary"
                        disabled
                        style={{ width: '100%' }}
                    >
                        <Mail size={20} />
                        {t('timestamp.result.emailCopy')}
                    </Button>
                </div>

                <div style={{
                    padding: 'var(--spacing-lg)',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    🔒 {t('timestamp.result.keepSafe')}
                </div>

                <Button
                    variant="ghost"
                    onClick={() => navigate('/contracts')}
                    style={{ width: '100%' }}
                >
                    {t('timestamp.verificationHelp.backToContracts')}
                </Button>
            </div>
            <Footer />
        </div>
    );
}

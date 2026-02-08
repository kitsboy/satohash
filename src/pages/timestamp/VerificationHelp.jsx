import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Globe, AlertCircle } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Footer from '../../components/Footer';

export default function VerificationHelp() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="page">
            <div className="container container-narrow">
                <div className="page-header text-center">
                    <h1 className="page-title">{t('timestamp.verificationHelp.title')}</h1>
                </div>

                <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                        <CheckCircle size={24} color="var(--color-success)" />
                        <div>
                            <h3 className="mb-sm">{t('timestamp.verificationHelp.withSatohash')}</h3>
                            <p className="text-secondary mb-0">{t('timestamp.verificationHelp.withSatohashDesc')}</p>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/verify')}
                        style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                    >
                        Go to verification tool
                    </Button>
                </Card>

                <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                        <Globe size={24} color="var(--color-primary)" />
                        <div>
                            <h3 className="mb-sm">{t('timestamp.verificationHelp.withoutSatohash')}</h3>
                            <p className="text-secondary mb-0">{t('timestamp.verificationHelp.withoutSatohashDesc')}</p>
                        </div>
                    </div>
                    <a
                        href="https://opentimestamps.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ width: '100%', marginTop: 'var(--spacing-md)', display: 'inline-flex', textAlign: 'center', justifyContent: 'center' }}
                    >
                        Visit OpenTimestamps.org
                    </a>
                </Card>

                <Card style={{ background: 'var(--color-surface)', marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <AlertCircle size={24} color="var(--color-warning)" />
                        <div>
                            <h3 className="mb-sm">{t('timestamp.verificationHelp.noMatch')}</h3>
                            <p className="text-secondary mb-0">{t('timestamp.verificationHelp.noMatchDesc')}</p>
                        </div>
                    </div>
                </Card>

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

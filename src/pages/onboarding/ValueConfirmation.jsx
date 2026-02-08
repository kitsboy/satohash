import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Footer from '../../components/Footer';

export default function ValueConfirmation() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleStart = () => {
        // Mark onboarding as complete
        localStorage.setItem('satohash_onboarded', 'true');

        // If they selected a template, take them to the editor
        const templateType = location.state?.templateType;
        if (templateType && templateType !== 'custom') {
            navigate(`/contracts/new/${templateType}`);
        } else {
            navigate('/contracts');
        }
    };

    const steps = [
        'valueConfirmation.step1',
        'valueConfirmation.step2',
        'valueConfirmation.step3'
    ];

    return (
        <div className="page">
            <div className="container container-narrow">
                <div className="page-header text-center">
                    <h1 className="page-title">{t('valueConfirmation.title')}</h1>
                </div>

                <Card style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--spacing-lg)'
                    }}>
                        {steps.map((step, index) => (
                            <li key={index} style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'var(--gradient-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    marginTop: '2px'
                                }}>
                                    <Check size={14} color="white" />
                                </div>
                                <span style={{ flex: 1 }}>{t(step)}</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                <Button
                    variant="primary"
                    size="large"
                    onClick={handleStart}
                    style={{ width: '100%' }}
                >
                    {t('valueConfirmation.start')}
                </Button>
            </div>

            <Footer />
        </div>
    );
}

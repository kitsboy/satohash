import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Info, Lock, Scale } from 'lucide-react';
import Card from '../../components/Card';
import Footer from '../../components/Footer';
import ProofAnalytics from '../../components/ProofAnalytics';
import LegalValidator from '../../components/LegalValidator';

export default function TrustCenter() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const sections = [
        {
            icon: Info,
            title: t('trust.howItWorks'),
            description: t('trust.howItWorksDetail'),
            accent: '#6366f1'
        },
        {
            icon: Shield,
            title: t('trust.whatBlockchain'),
            description: t('trust.whatBlockchainDetail'),
            accent: '#3b82f6'
        },
        {
            icon: Lock,
            title: t('trust.zkPrivacy'),
            description: t('trust.zkPrivacyDetail'),
            accent: '#10b981'
        },
        {
            icon: Scale,
            title: t('trust.legallyBinding'),
            description: t('trust.legallyBindingDetail'),
            accent: '#f59e0b'
        }
    ];

    return (
         <div className="page" style={{ background: '#ffffff', paddingTop: '100px' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="text-center" style={{ marginBottom: '60px' }}>
                    <img
                        src="https://giveabit.io/wp-content/uploads/2022/04/sats_new.png"
                        alt="Logo"
                        style={{ height: '64px', width: 'auto', marginBottom: '24px' }}
                    />
                    <h1 style={{
                        fontSize: 'clamp(32px, 8vw, 64px)',
                        fontWeight: '950',
                        letterSpacing: '-0.05em',
                        color: 'var(--color-text-primary)',
                        marginBottom: '16px',
                        lineHeight: '1.1'
                    }}>
                        {t('trust.title')}
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '20px', maxWidth: '600px', margin: '0 auto', fontWeight: '600' }}>
                        Transparent, mathematical proof of existence and integrity.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '32px', marginBottom: '60px' }}>
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <Card key={index} style={{
                                padding: '40px',
                                border: '1px solid var(--color-border)',
                                boxShadow: '0 4px 30px rgba(0,0,0,0.02)',
                                borderRadius: '24px',
                                background: 'var(--color-surface-elevated)',
                                transition: 'all 0.3s ease',
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '16px',
                                            background: section.accent + '12',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: section.accent,
                                            flexShrink: 0
                                        }}>
                                            <Icon size={32} />
                                        </div>
                                        <h3 style={{
                                            fontSize: '24px',
                                            fontWeight: '950',
                                            margin: 0,
                                            color: 'var(--color-text-primary)',
                                            letterSpacing: '-0.8px'
                                        }}>
                                            {section.title}
                                        </h3>
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '17px',
                                        lineHeight: '1.7',
                                        color: 'var(--color-text-primary)',
                                        fontWeight: '850'
                                    }}>
                                        {section.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <ProofAnalytics />
                <LegalValidator />

                <div style={{
                    marginTop: '80px',
                    padding: '40px',
                    background: 'var(--color-surface-elevated)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '32px',
                    fontSize: '15px',
                    color: 'var(--color-text-secondary)',
                    textAlign: 'center',
                    border: '1px solid var(--color-border)',
                    lineHeight: '1.6',
                    maxWidth: '740px',
                    margin: '0 auto 80px'
                }}>
                    <div style={{ marginBottom: '12px', fontSize: '24px' }}>🛡️</div>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Global Compliance & Responsibility</div>
                    {t('trust.legalDisclaimer')}
                </div>
            </div>
            <Footer />
        </div>
    );
}

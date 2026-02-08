import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Home, FileText, Upload, ArrowRight } from 'lucide-react';
import Footer from '../../components/Footer';

const TEMPLATES = [
    {
        type: 'prenup',
        icon: Heart,
        titleKey: 'chooseTemplate.prenup',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
        description: 'Protect your assets with a prenuptial agreement'
    },
    {
        type: 'property',
        icon: Home,
        titleKey: 'chooseTemplate.property',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        description: 'Record property ownership and transfers'
    },
    {
        type: 'powerOfAttorney',
        icon: FileText,
        titleKey: 'chooseTemplate.powerOfAttorney',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        description: 'Grant legal authority to a trusted party'
    },
    {
        type: 'custom',
        icon: Upload,
        titleKey: 'chooseTemplate.custom',
        gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        description: 'Upload and timestamp your own document'
    }
];

export default function ChooseTemplate() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleTemplateSelect = (templateType) => {
        if (templateType === 'custom') {
            // For custom, go directly to account creation (will implement upload later)
            navigate('/account-creation');
        } else {
            navigate('/account-creation', { state: { templateType } });
        }
    };

    return (
        <div className="page">
            <div className="container container-narrow">
                {/* Header */}
                <div className="text-center" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 className="animate-slide-down" style={{
                        fontSize: 'var(--text-3xl)',
                        fontWeight: '800',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        {t('chooseTemplate.title')}
                    </h1>
                    <p className="text-secondary animate-fade-in" style={{
                        animationDelay: '100ms',
                        fontSize: 'var(--text-lg)'
                    }}>
                        Select a contract template to get started
                    </p>
                </div>

                {/* Template Cards */}
                <div style={{
                    display: 'grid',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-2xl)'
                }}>
                    {TEMPLATES.map((template, index) => {
                        const Icon = template.icon;
                        return (
                            <div
                                key={template.type}
                                onClick={() => handleTemplateSelect(template.type)}
                                className="animate-slide-up"
                                style={{
                                    background: 'white',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--spacing-xl)',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    border: '2px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    animation: `slide-up 0.5s ease-out ${0.1 + index * 0.1}s backwards`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-lg)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }}
                            >
                                {/* Gradient Icon */}
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: 'var(--radius-md)',
                                    background: template.gradient,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                                }}>
                                    <Icon size={32} color="white" strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    <h3 style={{
                                        fontSize: 'var(--text-xl)',
                                        fontWeight: '700',
                                        marginBottom: 'var(--spacing-xs)',
                                        color: 'var(--color-text)'
                                    }}>
                                        {t(template.titleKey)}
                                    </h3>
                                    <p style={{
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--color-text-secondary)',
                                        margin: 0
                                    }}>
                                        {template.description}
                                    </p>
                                </div>

                                {/* Arrow indicator */}
                                <ArrowRight
                                    size={24}
                                    color="var(--color-text-tertiary)"
                                    style={{ flexShrink: 0 }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Disclaimer */}
                <div className="animate-fade-in" style={{
                    animationDelay: '500ms',
                    padding: 'var(--spacing-xl)',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    textAlign: 'center',
                    lineHeight: 'var(--line-height-relaxed)'
                }}>
                    <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-xs)' }}>
                        ⚖️
                    </div>
                    {t('chooseTemplate.disclaimer')}
                </div>
            </div>

            <Footer />
        </div>
    );
}

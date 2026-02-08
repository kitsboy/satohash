import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, FileText, Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/Button';
import StatusPill from '../../components/StatusPill';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';

const getContractIcon = (templateType) => {
    // You can expand this based on contract types
    return FileText;
};

const getStatusColor = (status) => {
    const colors = {
        draft: '#94a3b8',
        waiting: '#f59e0b',
        signed: '#3b82f6',
        timestamped: '#22c55e'
    };
    return colors[status] || colors.draft;
};

export default function ContractList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        // Load contracts from localStorage
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            setContracts(JSON.parse(savedContracts));
        }
    }, []);

    const handleNewContract = () => {
        navigate('/choose-template');
    };

    return (
        <div className="page" style={{
            background: 'var(--color-surface)',
            minHeight: '100vh'
        }}>
            <div className="container">
                {/* Header */}
                <div className="animate-slide-down" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-md)',
                    marginTop: 'var(--spacing-2xl)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: '950', /* Increased from 800 */
                            marginBottom: 'var(--spacing-xs)',
                            color: 'var(--color-text-primary)'
                        }}>
                            {t('contracts.title')}
                        </h1>
                        <p className="text-secondary" style={{ margin: 0 }}>
                            Manage your timestamped contracts and agreements
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleNewContract}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            border: 'none',
                            height: '48px',
                            paddingLeft: 'var(--spacing-lg)',
                            paddingRight: 'var(--spacing-lg)',
                            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        <Plus size={20} />
                        {t('contracts.new')}
                    </Button>
                </div>

                {contracts.length === 0 ? (
                    /* Empty State */
                    <div className="text-center animate-fade-in" style={{
                        marginTop: 'var(--spacing-3xl)',
                        paddingTop: 'var(--spacing-3xl)',
                        paddingBottom: 'var(--spacing-3xl)'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto var(--spacing-xl)',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                            border: '2px dashed rgba(99, 102, 241, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            animation: 'pulse 3s ease-in-out infinite'
                        }}>
                            <FileText size={56} color="var(--color-primary)" strokeWidth={1.5} />
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
                            }}>
                                <Sparkles size={20} color="white" />
                            </div>
                        </div>

                        <h2 style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: '900', /* Increased from 700 */
                            marginBottom: 'var(--spacing-sm)',
                            color: 'var(--color-text-primary)'
                        }}>
                            {t('contracts.empty')}
                        </h2>

                        <p className="text-tertiary" style={{
                            fontSize: 'var(--text-lg)',
                            maxWidth: '480px',
                            margin: '0 auto var(--spacing-2xl)'
                        }}>
                            {t('contracts.emptyDescription')}
                        </p>

                        <Button
                            variant="primary"
                            onClick={handleNewContract}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                border: 'none',
                                fontSize: 'var(--text-lg)',
                                height: '56px',
                                paddingLeft: 'var(--spacing-2xl)',
                                paddingRight: 'var(--spacing-2xl)',
                                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
                            }}
                        >
                            <Plus size={24} />
                            {t('contracts.new')}
                        </Button>
                    </div>
                ) : (
                    /* Contract Grid */
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 'var(--spacing-lg)',
                        marginTop: 'var(--spacing-xl)',
                        marginBottom: 'var(--spacing-2xl)'
                    }}>
                        {contracts.map((contract, index) => {
                            const Icon = getContractIcon(contract.templateType);
                            const statusColor = getStatusColor(contract.status);

                            return (
                                <div
                                    key={contract.id}
                                    onClick={() => navigate(`/contracts/${contract.id}`)}
                                    className="animate-slide-up"
                                    style={{
                                        background: 'var(--color-surface-elevated)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--spacing-xl)',
                                        boxShadow: 'var(--shadow-md)',
                                        border: '2px solid transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        animation: `slide-up 0.5s ease-out ${0.1 + index * 0.05}s backwards`,
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                                        e.currentTarget.style.borderColor = statusColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                >
                                    {/* Status indicator bar */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: statusColor
                                    }} />

                                    {/* Header with icon and status */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 'var(--spacing-md)'
                                    }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-md)',
                                            background: `${statusColor}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Icon size={24} color={statusColor} />
                                        </div>

                                        <StatusPill status={contract.status || 'draft'} />
                                    </div>

                                    {/* Contract name */}
                                    <h3 style={{
                                        fontSize: 'var(--text-lg)',
                                        fontWeight: '800',
                                        marginBottom: 'var(--spacing-sm)',
                                        color: 'var(--color-text-primary)',
                                        lineHeight: '1.4'
                                    }}>
                                        {contract.name}
                                    </h3>

                                    {/* Metadata */}
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 'var(--spacing-xs)',
                                        marginBottom: 'var(--spacing-md)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-xs)',
                                            fontSize: 'var(--text-sm)',
                                            color: 'var(--color-text-secondary)'
                                        }}>
                                            <Calendar size={14} />
                                            <span>Last modified: {new Date(contract.updatedAt).toLocaleDateString()}</span>
                                        </div>

                                        {contract.signers && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-xs)',
                                                fontSize: 'var(--text-sm)',
                                                color: 'var(--color-text-secondary)'
                                            }}>
                                                <Users size={14} />
                                                <span>{contract.signers.length} signer(s)</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* View arrow */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-xs)',
                                        fontSize: 'var(--text-sm)',
                                        color: 'var(--color-primary)',
                                        fontWeight: '600'
                                    }}>
                                        <span>View contract</span>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

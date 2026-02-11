import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Plus,
    FileText,
    Calendar,
    Users,
    ArrowRight,
    Sparkles,
    Zap,
    AlertCircle,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Globe,
    Activity as ActivityIcon,
    Check,
    Clock,
    Lock,
    Eye,
    Download,
    MoreHorizontal,
    Trash2,
    Edit3,
    Copy,
    TrendingUp,
    Shield,
    Hash
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import StatusPill from '../../components/StatusPill';
import Footer from '../../components/Footer';
import BlockchainPulse from '../../components/BlockchainPulse';
import { useState, useEffect } from 'react';

// Demo contracts for showcasing the platform
const DEMO_CONTRACTS = [
    {
        id: 'demo_prenup_001',
        name: 'Anderson-Martinez Prenuptial Agreement',
        status: 'timestamped',
        templateType: 'prenup',
        createdAt: '2026-01-15T10:30:00Z',
        updatedAt: '2026-01-18T14:22:00Z',
        hash: 'a7f3b2c1d4e5f6789012345678901234567890abcdef1234567890abcdef1234',
        blockHeight: 881234,
        parties: ['Sarah Anderson', 'Miguel Martinez'],
        isDemo: true
    },
    {
        id: 'demo_property_001',
        name: 'Commercial Property Transfer - 123 Main St',
        status: 'signed',
        templateType: 'property',
        createdAt: '2026-02-01T09:00:00Z',
        updatedAt: '2026-02-08T16:45:00Z',
        hash: 'b8c4d3e2f1a0987654321098765432109876543210fedcba0987654321fedcba',
        parties: ['Apex Holdings LLC', 'Metropolitan Investments'],
        isDemo: true
    },
    {
        id: 'demo_nda_001',
        name: 'TechCorp NDA - Project Phoenix',
        status: 'waiting',
        templateType: 'nda',
        createdAt: '2026-02-05T11:15:00Z',
        updatedAt: '2026-02-09T08:30:00Z',
        parties: ['TechCorp Inc.', 'Pending: John Developer'],
        isDemo: true
    },
    {
        id: 'demo_poa_001',
        name: 'Power of Attorney - Estate Management',
        status: 'draft',
        templateType: 'powerOfAttorney',
        createdAt: '2026-02-09T14:00:00Z',
        updatedAt: '2026-02-09T14:00:00Z',
        parties: ['Eleanor Williams'],
        isDemo: true
    }
];

const protocolTips = [
    {
        title: "The Power of SHA-256",
        content: "Every document in Satohash is hashed using SHA-256. This creates a 64-character 'fingerprint' that is impossible to reverse or duplicate.",
        icon: Hash
    },
    {
        title: "Why Bitcoin?",
        content: "Bitcoin is the most secure computer network in history. By anchoring your hash to its chain, you leverage billions of dollars in hardware security.",
        icon: Shield
    },
    {
        title: "Entropy & Identity",
        content: "Your digital signature combined with a blockchain timestamp creates a 'Proof of Existence' that is valid across all 195 countries.",
        icon: Globe
    },
    {
        title: "Merkle Trees",
        content: "Your document hash joins thousands of others in a Merkle tree structure. Only the root hash is stored on Bitcoin, making it incredibly efficient.",
        icon: TrendingUp
    }
];

const getStatusColor = (status) => {
    const colors = {
        draft: '#94a3b8',
        waiting: '#f59e0b',
        signed: '#3b82f6',
        timestamped: '#22c55e',
        pending: '#ec4899',
        error: '#ef4444'
    };
    return colors[status] || colors.draft;
};

const getStatusIcon = (status) => {
    const icons = {
        draft: Edit3,
        waiting: Clock,
        signed: Check,
        timestamped: Lock,
        pending: Clock,
        error: AlertCircle
    };
    return icons[status] || FileText;
};

const ProtocolTips = () => {
    const [index, setIndex] = useState(0);
    const tip = protocolTips[index];
    const TipIcon = tip.icon;

    return (
        <div style={{
            maxWidth: '600px',
            margin: '48px auto 0',
            padding: '28px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(168, 85, 247, 0.04) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(99, 102, 241, 0.1)',
            textAlign: 'left',
            position: 'relative'
        }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '14px',
                    background: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                }}>
                    <TipIcon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ 
                        fontSize: '11px', 
                        fontWeight: '900', 
                        color: 'var(--color-primary)', 
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px',
                        marginBottom: '8px'
                    }}>
                        Protocol Insight
                    </div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '17px', fontWeight: '950', color: 'var(--color-text-primary)' }}>
                        {tip.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.65', fontWeight: '600' }}>
                        {tip.content}
                    </p>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
                <button
                    onClick={() => setIndex((i) => (i === 0 ? protocolTips.length - 1 : i - 1))}
                    style={{ 
                        background: 'var(--color-surface-elevated)', 
                        border: '1px solid var(--color-border)', 
                        cursor: 'pointer', 
                        color: 'var(--color-primary)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <ChevronLeft size={18} />
                </button>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '0 12px'
                }}>
                    {protocolTips.map((_, i) => (
                        <div 
                            key={i}
                            style={{
                                width: i === index ? '20px' : '6px',
                                height: '6px',
                                borderRadius: '3px',
                                background: i === index ? 'var(--color-primary)' : 'var(--color-border)',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
                <button
                    onClick={() => setIndex((i) => (i === protocolTips.length - 1 ? 0 : i + 1))}
                    style={{ 
                        background: 'var(--color-surface-elevated)', 
                        border: '1px solid var(--color-border)', 
                        cursor: 'pointer', 
                        color: 'var(--color-primary)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

const ContractCard = ({ contract, onClick }) => {
    const statusColor = getStatusColor(contract.status);
    const StatusIcon = getStatusIcon(contract.status);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <Card
            style={{
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '240px',
                background: 'white',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="card-interactive"
            onClick={onClick}
        >
            {/* Status Bar */}
            <div style={{ 
                height: '5px', 
                background: `linear-gradient(90deg, ${statusColor}, ${statusColor}88)` 
            }} />

            {/* Demo Badge */}
            {contract.isDemo && (
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: '900',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Demo
                </div>
            )}

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ 
                        padding: '12px', 
                        borderRadius: '14px', 
                        background: `${statusColor}12`, 
                        color: statusColor 
                    }}>
                        <StatusIcon size={22} />
                    </div>
                    <StatusPill status={contract.status} />
                </div>

                {/* Title */}
                <h3 style={{ 
                    fontSize: '17px', 
                    fontWeight: '900', 
                    color: 'var(--color-text-primary)', 
                    marginBottom: '12px',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {contract.name}
                </h3>

                {/* Parties */}
                {contract.parties && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '12px' 
                    }}>
                        <Users size={14} color="var(--color-text-tertiary)" />
                        <span style={{ 
                            fontSize: '13px', 
                            fontWeight: '600', 
                            color: 'var(--color-text-secondary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {contract.parties.join(', ')}
                        </span>
                    </div>
                )}

                {/* Hash Preview */}
                {contract.hash && (
                    <div style={{
                        background: 'var(--color-surface)',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Hash size={12} color="var(--color-primary)" />
                        <code style={{ 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            color: 'var(--color-text-tertiary)',
                            fontFamily: 'var(--font-mono)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {contract.hash.slice(0, 16)}...{contract.hash.slice(-8)}
                        </code>
                    </div>
                )}

                {/* Date */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: 'var(--color-text-tertiary)',
                    marginTop: 'auto'
                }}>
                    <Calendar size={14} />
                    <span>Updated {new Date(contract.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Footer Action */}
            <div style={{ 
                padding: '16px 24px', 
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--color-surface)'
            }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-primary)' }}>
                    View Details
                </span>
                <ArrowRight size={16} color="var(--color-primary)" />
            </div>
        </Card>
    );
};

export default function ContractList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [showDemoData, setShowDemoData] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Load contracts from localStorage
        const savedContracts = localStorage.getItem('satohash_contracts');
        if (savedContracts) {
            setContracts(JSON.parse(savedContracts));
        }
    }, []);

    // Combine real and demo contracts
    const displayContracts = showDemoData 
        ? [...contracts, ...DEMO_CONTRACTS]
        : contracts;

    // Filter contracts
    const filteredContracts = filter === 'all' 
        ? displayContracts 
        : displayContracts.filter(c => c.status === filter);

    const handleNewContract = () => {
        navigate('/choose-template');
    };

    const stats = {
        total: displayContracts.length,
        timestamped: displayContracts.filter(c => c.status === 'timestamped').length,
        pending: displayContracts.filter(c => c.status === 'waiting' || c.status === 'signed').length,
        draft: displayContracts.filter(c => c.status === 'draft').length
    };

    return (
        <div className="page" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
            minHeight: '100vh'
        }}>
            <div className="container" style={{ maxWidth: '1400px' }}>
                {/* Header */}
                <div className="animate-slide-down" style={{
                    marginTop: 'var(--spacing-2xl)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <BlockchainPulse />

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        marginTop: '24px',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: 'clamp(28px, 5vw, 40px)',
                                fontWeight: '900',
                                color: '#0f172a',
                                margin: 0,
                                letterSpacing: '-1px'
                            }}>
                                {t('contracts.title')}
                            </h1>
                            <p style={{ 
                                margin: '8px 0 0 0', 
                                fontWeight: '500',
                                color: '#475569',
                                fontSize: '16px'
                            }}>
                                Manage your cryptographic agreements and Bitcoin-anchored proofs.
                            </p>
                        </div>
                        <Button
                            variant="primary"
                            onClick={handleNewContract}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                                border: 'none',
                                height: '52px',
                                paddingLeft: '28px',
                                paddingRight: '28px',
                                borderRadius: '20px',
                                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
                                fontWeight: '700'
                            }}
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            {t('contracts.new')}
                        </Button>
                    </div>
                </div>

                {displayContracts.length === 0 ? (
                    /* Empty State Launchpad */
                    <div className="text-center animate-fade-in" style={{
                        marginTop: '80px',
                        paddingBottom: '80px'
                    }}>
                        <div style={{
                            width: '140px',
                            height: '140px',
                            margin: '0 auto 32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                            border: '3px dashed rgba(99, 102, 241, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            animation: 'pulse 3s ease-in-out infinite'
                        }}>
                            <FileText size={64} color="var(--color-primary)" strokeWidth={1.5} />
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 6px 16px rgba(251, 191, 36, 0.4)'
                            }}>
                                <Sparkles size={22} color="white" />
                            </div>
                        </div>

                        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: '#0f172a', letterSpacing: '-1px' }}>
                            Your Digital Vault is Ready
                        </h2>

                        <p style={{ 
                            fontSize: '17px', 
                            maxWidth: '500px', 
                            margin: '0 auto 40px',
                            fontWeight: '500',
                            color: '#475569',
                            lineHeight: '1.6'
                        }}>
                            Launch your first cryptographic agreement from a template below:
                        </p>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                            gap: '16px', 
                            maxWidth: '700px', 
                            margin: '0 auto 48px' 
                        }}>
                            {[
                                { id: 'nda', name: 'NDA', color: '#10b981', desc: 'Confidentiality' },
                                { id: 'prenup', name: 'Prenuptial', color: '#ec4899', desc: 'Marriage' },
                                { id: 'property', name: 'Property', color: '#3b82f6', desc: 'Real Estate' },
                                { id: 'powerOfAttorney', name: 'Power of Attorney', color: '#f59e0b', desc: 'Legal Rep.' }
                            ].map(quick => (
                                <div
                                    key={quick.id}
                                    onClick={() => navigate(`/contracts/new/${quick.id}`)}
                                style={{
                                    background: '#ffffff',
                                    padding: '32px 24px',
                                    borderRadius: '20px',
                                    border: '2px solid #e2e8f0',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center',
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.06)'
                                }}
                                className="card-interactive"
                                >
                                    <div style={{ 
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        background: `${quick.color}15`,
                                        color: quick.color, 
                                        margin: '0 auto 14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Plus size={24} strokeWidth={2.5} />
                                    </div>
                                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{quick.name}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginTop: '4px' }}>{quick.desc}</div>
                                </div>
                            ))}
                        </div>
                        <ProtocolTips />
                    </div>
                ) : (
                    /* Dashboard with Contracts */
                    <div>
                        {/* Stats Row */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                            gap: '16px', 
                            marginBottom: '32px' 
                        }}>
                            {[
                                { label: 'Total Anchors', value: stats.total, icon: FileText, color: '#6366f1', bg: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' },
                                { label: 'Timestamped', value: stats.timestamped, icon: Lock, color: '#22c55e', bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' },
                                { label: 'In Progress', value: stats.pending, icon: Clock, color: '#f59e0b', bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' },
                                { label: 'Drafts', value: stats.draft, icon: Edit3, color: '#64748b', bg: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }
                            ].map((stat, i) => (
                                <Card key={i} style={{ 
                                    padding: '24px', 
                                    background: stat.bg,
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                                }}>
                                    <div style={{
                                        width: '52px',
                                        height: '52px',
                                        borderRadius: '16px',
                                        background: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: stat.color,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>{stat.value}</div>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginTop: '6px' }}>{stat.label}</div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Filter & Controls */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                            gap: '16px'
                        }}>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {[
                                    { key: 'all', label: 'All' },
                                    { key: 'timestamped', label: 'Timestamped' },
                                    { key: 'signed', label: 'Signed' },
                                    { key: 'waiting', label: 'Pending' },
                                    { key: 'draft', label: 'Drafts' }
                                ].map(f => (
                                    <button
                                        key={f.key}
                                        onClick={() => setFilter(f.key)}
                                        style={{
                                            padding: '10px 18px',
                                            borderRadius: '10px',
                                            border: filter === f.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                            background: filter === f.key ? 'var(--color-primary)' : 'white',
                                            color: filter === f.key ? 'white' : 'var(--color-text-primary)',
                                            fontWeight: '800',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: 'var(--color-text-secondary)'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={showDemoData}
                                    onChange={(e) => setShowDemoData(e.target.checked)}
                                    style={{ 
                                        width: '18px', 
                                        height: '18px',
                                        accentColor: 'var(--color-primary)'
                                    }}
                                />
                                Show demo contracts
                            </label>
                        </div>

                        {/* Contract Grid */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                            gap: '24px',
                            marginBottom: '48px'
                        }}>
                            {filteredContracts.map((contract) => (
                                <ContractCard 
                                    key={contract.id} 
                                    contract={contract}
                                    onClick={() => {
                                        if (contract.isDemo) {
                                            // For demo, just show an alert or navigate to a sample view
                                            alert('This is a demo contract. Create your own to access full features!');
                                        } else {
                                            navigate(`/contracts/${contract.id}`);
                                        }
                                    }}
                                />
                            ))}
                        </div>

                        {filteredContracts.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <AlertCircle size={48} color="var(--color-text-tertiary)" style={{ marginBottom: '16px' }} />
                                <h3 style={{ fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '8px' }}>No contracts found</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontWeight: '600' }}>Try adjusting your filter or create a new contract.</p>
                            </div>
                        )}

                        <ProtocolTips />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

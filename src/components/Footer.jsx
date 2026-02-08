import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Twitter, Github, Linkedin, MessageSquare, ExternalLink, Shield, Heart, Zap, Globe, Cpu } from 'lucide-react';
import DonationModal from './DonationModal';

export default function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    const footerSections = [
        {
            title: 'Protocol',
            links: [
                { label: 'Dashboard', path: '/contracts' },
                { label: 'Verifier', path: '/verify' },
                { label: 'Bulk Proof', path: '/batch-proof' },
                { label: 'How it Works', path: '/how-it-works' }
            ]
        },
        {
            title: 'Resources',
            links: [
                { label: 'Trust Center', path: '/trust' },
                { label: 'Documentation', path: '/docs', external: true },
                { label: 'API Reference', path: '/api', external: true },
                { label: 'Network Stats', path: '/trust' }
            ]
        },
        {
            title: 'Legal',
            links: [
                { label: 'Terms of Service', path: '/legal/terms' },
                { label: 'Privacy Policy', path: '/legal/privacy' },
                { label: 'Crypto Notice', path: '/legal/crypto-notice' },
                { label: 'Compliance', path: '/trust' }
            ]
        }
    ];

    const socialLinks = [
        { icon: Twitter, href: '#', color: '#1DA1F2' },
        { icon: Github, href: '#', color: '#333' },
        { icon: Linkedin, href: '#', color: '#0077b5' },
        { icon: MessageSquare, href: '#', color: '#0088cc' } // Telegram
    ];

    return (
        <>
            <footer style={{
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
                padding: '100px 0 40px',
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden'
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '60px',
                        marginBottom: '80px'
                    }}>
                        {/* Brand Column */}
                        <div style={{ gridColumn: 'span 2', minWidth: '280px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                                <img
                                    src="https://giveabit.io/wp-content/uploads/2022/04/sats_new.png"
                                    alt="Logo"
                                    style={{ height: '32px', width: 'auto' }}
                                />
                                <span style={{ fontWeight: '950', fontSize: '1.6rem', color: 'var(--color-text-primary)', letterSpacing: '-1.5px' }}>
                                    Satohash
                                </span>
                            </div>
                            <p style={{
                                color: 'var(--color-text-secondary)',
                                lineHeight: '1.7',
                                marginBottom: '32px',
                                fontSize: '15px',
                                fontWeight: '500',
                                maxWidth: '380px'
                            }}>
                                Decentralized proof-of-existence protocol. Permanent local-first agreement anchoring on the Bitcoin blockchain.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {socialLinks.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '14px',
                                            background: 'var(--color-surface-elevated)',
                                            border: '1px solid var(--color-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-text-secondary)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--color-primary)';
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--color-text-secondary)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.borderColor = 'var(--color-border)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <social.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Columns */}
                        {footerSections.map((section, idx) => (
                            <div key={idx}>
                                <h4 style={{
                                    fontWeight: '950',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: '28px',
                                    fontSize: '13px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px'
                                }}>
                                    {section.title}
                                </h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx} style={{ marginBottom: '14px' }}>
                                            <a
                                                href={link.path}
                                                onClick={(e) => {
                                                    if (!link.external) {
                                                        e.preventDefault();
                                                        navigate(link.path);
                                                        window.scrollTo(0, 0);
                                                    }
                                                }}
                                                style={{
                                                    color: 'var(--color-text-secondary)',
                                                    textDecoration: 'none',
                                                    fontSize: '15px',
                                                    fontWeight: '700',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = 'var(--color-primary)';
                                                    e.currentTarget.style.paddingLeft = '4px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                                                    e.currentTarget.style.paddingLeft = '0';
                                                }}
                                                target={link.external ? '_blank' : '_self'}
                                                rel={link.external ? 'noopener noreferrer' : ''}
                                            >
                                                {link.label}
                                                {link.external && <ExternalLink size={12} />}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Integrated Action Card (Repositioned for better fit) */}
                    <div style={{
                        background: 'var(--color-surface-elevated)',
                        border: '1px solid var(--color-border)',
                        padding: '40px',
                        borderRadius: '32px',
                        marginBottom: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '32px',
                        flexWrap: 'wrap',
                        boxShadow: '0 4px 30px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, var(--color-primary) 0%, #4338ca 100%)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <Heart size={32} fill="white" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '950', color: 'var(--color-text-primary)', marginBottom: '4px' }}>Support the Protocol</h3>
                                <p style={{ margin: 0, fontSize: '15px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Maintain our open-source, local-first signature ecosystem.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDonationModalOpen(true)}
                            style={{
                                background: 'var(--color-text-primary)',
                                color: 'var(--color-background)',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: '16px',
                                fontWeight: '950',
                                fontSize: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                                e.currentTarget.style.background = 'var(--color-primary)';
                                e.currentTarget.style.color = 'white';
                                const icon = e.currentTarget.querySelector('svg');
                                if (icon) icon.style.fill = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = 'var(--color-text-primary)';
                                e.currentTarget.style.color = 'var(--color-background)';
                                const icon = e.currentTarget.querySelector('svg');
                                if (icon) icon.style.fill = 'var(--color-background)';
                            }}
                        >
                            <Zap size={18} fill="var(--color-background)" style={{ transition: 'fill 0.3s ease' }} />
                            Donate Satoshi
                        </button>
                    </div>

                    {/* Bottom Bar with Logo as requested */}
                    <div style={{
                        paddingTop: '32px',
                        borderTop: '1px solid var(--color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '24px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                    src="https://giveabit.io/wp-content/uploads/2022/04/sats_new.png"
                                    alt="Mini Logo"
                                    style={{ height: '20px', width: 'auto' }}
                                />
                                <span style={{ fontWeight: '900', fontSize: '14px', color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>Satohash™</span>
                            </div>
                            <div style={{ color: 'var(--color-text-tertiary)', fontSize: '13px', fontWeight: '800' }}>
                                © {new Date().getFullYear()} Open Protocol
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '12px', fontWeight: '950' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                                Core Sync: Active
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-tertiary)', fontSize: '13px', fontWeight: '800' }}>
                                <Shield size={14} />
                                eIDAS / ESIGN
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-tertiary)', fontSize: '13px', fontWeight: '800' }}>
                                <Cpu size={14} />
                                Local-First
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <DonationModal
                isOpen={isDonationModalOpen}
                onClose={() => setIsDonationModalOpen(false)}
            />
        </>
    );
}

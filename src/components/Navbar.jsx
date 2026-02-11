import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Globe, LayoutDashboard, ShieldCheck, Search, Cpu } from 'lucide-react';
import LanguagePicker from './LanguagePicker';

export default function Navbar() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState(false);
    const [blockHeight, setBlockHeight] = useState(782456);

    // Don't show navbar on some specific pages if needed, but for "Global" we usually want it everywhere
    // except maybe a very minimal focused editor or splash.
    const isWelcome = location.pathname === '/welcome';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentLanguageName = {
        en: 'EN',
        es: 'ES',
        fr: 'FR',
        de: 'DE',
        zh: 'ZH'
    }[i18n.language] || 'EN';

    const navLinks = [
        { label: 'Dashboard', path: '/contracts', icon: LayoutDashboard },
        { label: 'Verify', path: '/verify', icon: Search },
        { label: 'Trust', path: '/trust', icon: ShieldCheck },
    ];

    if (isWelcome) return null; // Welcome has its own custom hero nav

    return (
        <>
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '72px',
                zIndex: 1100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 var(--spacing-xl)',
                background: '#ffffff',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid #e2e8f0',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isScrolled ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
            }}>
                {/* Logo & Brand */}
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    onClick={() => navigate('/contracts')}
                >
                    <img
                        src="https://giveabit.io/wp-content/uploads/2022/04/sats_new.png"
                        alt="Satohash Logo"
                        style={{ height: '32px', width: 'auto' }}
                    />
                    <span style={{
                        fontWeight: '900',
                        fontSize: '1.5rem',
                        color: '#0f172a',
                        letterSpacing: '-1px'
                    }}>
                        Satohash
                    </span>
                </div>

                {/* Main Links */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 20px',
                                    borderRadius: '16px',
                                    border: isActive ? '2px solid #6366f1' : '2px solid transparent',
                                    background: isActive ? '#f1f5f9' : 'transparent',
                                    color: isActive ? '#6366f1' : '#0f172a',
                                    fontWeight: isActive ? '700' : '600',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = '#f1f5f9';
                                        e.currentTarget.style.color = '#6366f1';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#0f172a';
                                    }
                                }}
                            >
                                <link.icon size={20} strokeWidth={isActive ? 3 : 2.5} />
                                <span className="hide-mobile" style={{ letterSpacing: '-0.2px' }}>{link.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Right Side Utility */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Live Network Indicator */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(34, 197, 94, 0.08)',
                        borderRadius: '100px',
                        border: '1px solid rgba(34, 197, 94, 0.1)'
                    }} className="hide-mobile">
                        <div style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                        <span style={{ color: '#15803d', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}>
                            <Cpu size={10} style={{ marginRight: '2px', verticalAlign: 'middle' }} />
                            #{blockHeight.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={() => setIsLanguagePickerOpen(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            background: '#ffffff',
                            border: '2px solid #e2e8f0',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            color: '#0f172a',
                            fontWeight: '700',
                            fontSize: '13px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {currentLanguageName}
                    </button>
                </div>
            </nav>

            <LanguagePicker
                isOpen={isLanguagePickerOpen}
                onClose={() => setIsLanguagePickerOpen(false)}
            />

            {/* Spacer to prevent content jump */}
            <div style={{ height: '72px' }} />
        </>
    );
}

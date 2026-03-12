import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import LanguagePicker from './LanguagePicker';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Dashboard', path: '/contracts' },
        { name: 'Protocol', path: '/welcome' },
        { name: 'Pulse', path: '/protocol-stats' },
        { name: 'Snap', path: '/snap-and-stamp' },
        { name: 'Verifier', path: '/verify' },
        { name: 'Trust', path: '/trust' },
    ];

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
                background: isScrolled ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid var(--color-border)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isScrolled ? '0 10px 40px rgba(0,0,0,0.1)' : 'none'
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
                        fontWeight: '950',
                        fontSize: '1.5rem',
                        color: 'var(--color-text-primary)',
                        letterSpacing: '-1.2px'
                    }}>
                        Satohash
                    </span>
                </Link>

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
                                    borderRadius: '14px',
                                    border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                                    background: isActive ? 'var(--color-border-light)' : 'transparent',
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                                    fontWeight: isActive ? '950' : '800',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'var(--color-border-light)';
                                        e.currentTarget.style.color = 'var(--color-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--color-text-primary)';
                                    }
                                }}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="navbar-underline"
                                        className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                </div>

                <button
                    onClick={() => setIsLanguagePickerOpen(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'var(--color-surface-elevated)',
                        border: '2px solid var(--color-border)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary)',
                        fontWeight: '900',
                        fontSize: '13px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </div >

            {/* Mobile Menu */ }
            < AnimatePresence >
            { isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-6 shadow-premium overflow-hidden"
                >
                    <div className="flex flex-col gap-6">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    "text-lg font-bold transition-colors",
                                    location.pathname === link.path ? "text-indigo-600" : "text-slate-900"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/welcome"
                            onClick={() => setIsOpen(false)}
                            className="w-full text-center py-4 bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-100"
                        >
                            Launch App
                        </Link>
                    </div>
                </motion.div>
            )
}
            </AnimatePresence >
    {/* Language Picker Modal */ }
    < LanguagePicker
isOpen = { isLangOpen }
onClose = {() => setIsLangOpen(false)}
            />
        </nav >
    );
}

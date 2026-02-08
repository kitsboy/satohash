import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Shield, FileCheck, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';

const CARDS = [
    {
        icon: Lock,
        titleKey: 'howItWorks.card1.title',
        descriptionKey: 'howItWorks.card1.description',
        color: '#6366f1'
    },
    {
        icon: Shield,
        titleKey: 'howItWorks.card2.title',
        descriptionKey: 'howItWorks.card2.description',
        color: '#8b5cf6'
    },
    {
        icon: FileCheck,
        titleKey: 'howItWorks.card3.title',
        descriptionKey: 'howItWorks.card3.description',
        color: '#ec4899'
    }
];

export default function HowItWorks() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentCard, setCurrentCard] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [slideDirection, setSlideDirection] = useState('next');

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextCard();
        }, 4000);

        return () => clearInterval(interval);
    }, [currentCard, isAutoPlaying]);

    const nextCard = () => {
        setSlideDirection('next');
        setCurrentCard((prev) => (prev + 1) % CARDS.length);
    };

    const prevCard = () => {
        setSlideDirection('prev');
        setCurrentCard((prev) => (prev - 1 + CARDS.length) % CARDS.length);
    };

    const goToCard = (index) => {
        setSlideDirection(index > currentCard ? 'next' : 'prev');
        setCurrentCard(index);
    };

    const card = CARDS[currentCard];
    const Icon = card.icon;

    return (
        <div className="page" style={{ overflow: 'hidden' }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '400px',
                background: `linear-gradient(135deg, ${card.color}15 0%, transparent 100%)`,
                transition: 'background 0.5s ease',
                zIndex: 0
            }} />

            <div className="container container-narrow" style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div className="text-center" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 className="animate-slide-down" style={{
                        fontSize: 'var(--text-3xl)',
                        fontWeight: '950',
                        marginBottom: 'var(--spacing-md)',
                        color: 'var(--color-text-primary)'
                    }}>
                        How It Works
                    </h1>
                    <p className="animate-fade-in" style={{
                        animationDelay: '100ms',
                        color: 'var(--color-text-secondary)',
                        fontSize: '20px',
                        fontWeight: '700'
                    }}>
                        Three simple steps to protect your documents
                    </p>
                </div>

                {/* Main carousel card */}
                <div style={{
                    marginTop: 'var(--spacing-2xl)',
                    minHeight: '400px',
                    perspective: '1000px'
                }}>
                    <div
                        key={currentCard}
                        className={`animate-${slideDirection === 'next' ? 'slide-in-right' : 'slide-in-left'}`}
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--spacing-3xl)',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Card number indicator */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: `${card.color}20`,
                            color: card.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: 'var(--text-lg)'
                        }}>
                            {currentCard + 1}
                        </div>

                        {/* Icon with gradient background */}
                        <div style={{
                            width: '96px',
                            height: '96px',
                            margin: '0 auto var(--spacing-xl)',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}cc 100%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 10px 30px ${card.color}40`,
                            animation: 'pulse-subtle 2s ease-in-out infinite'
                        }}>
                            <Icon size={48} color="white" strokeWidth={2} />
                        </div>

                        {/* Content */}
                        <h2 style={{
                            fontSize: 'var(--text-2xl)',
                            fontWeight: '950',
                            marginBottom: 'var(--spacing-lg)',
                            color: '#000000',
                            letterSpacing: '-1.5px'
                        }}>
                            {t(card.titleKey)}
                        </h2>

                        <p style={{
                            fontSize: 'var(--text-lg)',
                            color: '#000000',
                            lineHeight: 'var(--line-height-relaxed)',
                            maxWidth: '500px',
                            margin: '0 auto',
                            fontWeight: '900'
                        }}>
                            {t(card.descriptionKey)}
                        </p>
                    </div>

                    {/* Navigation controls */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-xl)',
                        marginTop: 'var(--spacing-xl)'
                    }}>
                        {/* Previous button */}
                        <button
                            onClick={() => {
                                prevCard();
                                setIsAutoPlaying(false);
                            }}
                            style={{
                                background: currentCard === 0 ? 'var(--color-surface)' : 'white',
                                border: '2px solid var(--color-border)',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: currentCard === 0 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: currentCard === 0 ? 0.5 : 1
                            }}
                            disabled={currentCard === 0}
                            onMouseEnter={(e) => {
                                if (currentCard !== 0) {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <ChevronLeft size={24} color={currentCard === 0 ? 'var(--color-text-tertiary)' : 'var(--color-primary)'} />
                        </button>

                        {/* Dots indicator with play/pause */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            padding: 'var(--spacing-sm) var(--spacing-lg)',
                            background: 'white',
                            borderRadius: 'var(--radius-full)',
                            border: '2px solid var(--color-border)',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            {/* Auto-play toggle */}
                            <button
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'var(--color-primary)'
                                }}
                                title={isAutoPlaying ? 'Pause' : 'Play'}
                            >
                                {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>

                            {/* Dot navigation */}
                            {CARDS.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        goToCard(index);
                                        setIsAutoPlaying(false);
                                    }}
                                    style={{
                                        width: index === currentCard ? '24px' : '8px',
                                        height: '8px',
                                        borderRadius: '4px',
                                        background: index === currentCard ? card.color : 'var(--color-border)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        transition: 'all 0.3s ease'
                                    }}
                                    aria-label={`Go to card ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={() => {
                                nextCard();
                                setIsAutoPlaying(false);
                            }}
                            style={{
                                background: currentCard === CARDS.length - 1 ? 'var(--color-surface)' : 'white',
                                border: '2px solid var(--color-border)',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: currentCard === CARDS.length - 1 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                opacity: currentCard === CARDS.length - 1 ? 0.5 : 1
                            }}
                            disabled={currentCard === CARDS.length - 1}
                            onMouseEnter={(e) => {
                                if (currentCard !== CARDS.length - 1) {
                                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <ChevronRight size={24} color={currentCard === CARDS.length - 1 ? 'var(--color-text-tertiary)' : 'var(--color-primary)'} />
                        </button>
                    </div>
                </div>

                {/* Continue button */}
                <div style={{ marginTop: 'var(--spacing-3xl)', marginBottom: 'var(--spacing-2xl)' }}>
                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => navigate('/choose-template')}
                        style={{
                            width: '100%',
                            boxShadow: `0 10px 40px ${card.color}30`
                        }}
                    >
                        {t('howItWorks.continue')}
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
}

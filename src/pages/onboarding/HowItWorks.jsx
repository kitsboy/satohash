import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Shield, FileCheck, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import Button from '../../components/ui/Button'
import OnboardingProgressBar from '../../components/shared/OnboardingProgressBar'
import usePageMetaOnboarding from '../../hooks/usePageMetaOnboarding'
import { setOnboardingStep } from '../../utils/onboardingFlow'

const CARDS = [
  {
    icon: Lock,
    titleKey: 'howItWorks.card1.title',
    descriptionKey: 'howItWorks.card1.description',
    color: 'var(--accent-gold)'
  },
  {
    icon: Shield,
    titleKey: 'howItWorks.card2.title',
    descriptionKey: 'howItWorks.card2.description',
    color: 'var(--accent-teal)'
  },
  {
    icon: FileCheck,
    titleKey: 'howItWorks.card3.title',
    descriptionKey: 'howItWorks.card3.description',
    color: 'var(--accent-gold)'
  }
]

export default function HowItWorks() {
  usePageMetaOnboarding('how-it-works')
  useEffect(() => {
    setOnboardingStep('how-it-works')
  }, [])
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [currentCard, setCurrentCard] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [slideDirection, setSlideDirection] = useState('next')

  const nextCard = () => {
    setSlideDirection('next')
    setCurrentCard((prev) => (prev + 1) % CARDS.length)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextCard()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentCard, isAutoPlaying])

  const prevCard = () => {
    setSlideDirection('prev')
    setCurrentCard((prev) => (prev - 1 + CARDS.length) % CARDS.length)
  }

  const goToCard = (index) => {
    setSlideDirection(index > currentCard ? 'next' : 'prev')
    setCurrentCard(index)
  }

  const card = CARDS[currentCard]
  const Icon = card.icon

  return (
    <div
      className="page"
      style={{
        overflow: 'hidden',
        background: 'var(--color-surface)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          height: '100vh',
          background: `radial-gradient(circle at 50% 30%, ${card.color}10 0%, transparent 70%)`,
          transition: 'background 0.8s ease',
          zIndex: 0
        }}
      />

      <div
        className="container-narrow container mx-auto"
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '80px',
          paddingBottom: '40px'
        }}
      >
        <OnboardingProgressBar currentStepId="how-it-works" />
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--accent-gold)',
              marginBottom: '8px'
            }}
          >
            {t('howItWorks.title')}
          </div>
          <h1
            className="animate-slide-down"
            style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '950',
              marginBottom: '8px',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.04em'
            }}
          >
            {t('howItWorks.subtitle')}
          </h1>
        </div>

        {/* Main Card View (Matching User Image) */}
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          {/* The Premium Card */}
          <div
            key={currentCard}
            className={`animate-${slideDirection === 'next' ? 'slide-in-right' : 'slide-in-left'}`}
            style={{
              background: 'white', // Bright white like in the image
              borderRadius: '32px',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.08)',
              padding: '60px',
              textAlign: 'center',
              position: 'relative',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }}
          >
            {/* Step Circle (Top Right) */}
            <div
              style={{
                position: 'absolute',
                top: '32px',
                right: '32px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#f3f4ff', // Light purple tint
                color: 'var(--accent-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '950',
                fontSize: '20px'
              }}
            >
              {currentCard + 1}
            </div>

            {/* Large Shield/Icon Container (Left-ish Offset) */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-gold) 0%, #d4a017 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
                marginBottom: '40px'
              }}
            >
              <Icon size={56} color="white" strokeWidth={1.5} />
            </div>

            {/* Message Content */}
            <div style={{ maxWidth: '440px' }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '950',
                  marginBottom: '16px',
                  color: '#000',
                  letterSpacing: '-0.02em'
                }}
              >
                {t(card.titleKey)}
              </h2>
              <p
                style={{
                  fontSize: '18px',
                  color: '#334155', // Slate-700
                  lineHeight: '1.6',
                  fontWeight: '800'
                }}
              >
                {t(card.descriptionKey)}
              </p>
            </div>
          </div>

          {/* Progress Control (The Pill in the middle) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '32px'
            }}
          >
            {/* Dot Navigation & Play/Pause Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 24px',
                background: 'white',
                borderRadius: '100px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                border: '1px solid #e2e8f0'
              }}
            >
              {CARDS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    goToCard(idx)
                    setIsAutoPlaying(false)
                  }}
                  style={{
                    width: idx === currentCard ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '10px',
                    background: idx === currentCard ? 'var(--accent-gold)' : '#e2e8f0',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0
                  }}
                />
              ))}

              <div
                style={{ width: '1px', height: '16px', background: '#e2e8f0', margin: '0 4px' }}
              />

              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--accent-gold)',
                  display: 'flex'
                }}
              >
                {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
            </div>
          </div>

          {/* Navigation Arrows (Optional but nice for accessibility) */}
          <button
            onClick={prevCard}
            style={{
              position: 'absolute',
              left: '-70px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              color: 'var(--accent-gold)',
              opacity: currentCard === 0 ? 0 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextCard}
            style={{
              position: 'absolute',
              right: '-70px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              color: 'var(--accent-gold)',
              opacity: currentCard === CARDS.length - 1 ? 0 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Continue Button */}
        <div
          style={{
            marginTop: '60px',
            maxWidth: '800px',
            margin: '60px auto 40px',
            width: '100%'
          }}
        >
          <Button
            variant="primary"
            onClick={() => navigate('/onboarding/choose-template')}
            style={{
              width: '100%',
              height: '72px',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: '950',
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, #d4a017 100%)',
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.25)',
              border: 'none'
            }}
          >
            {t('howItWorks.continue')}
          </Button>
        </div>

        <div
          style={{ marginTop: '80px', paddingTop: '80px', borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '950',
              textAlign: 'center',
              marginBottom: '40px',
              color: '#0f172a'
            }}
          >
            Protocol Deep-Dive
          </h2>
          <div
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              display: 'grid',
              gap: '24px'
            }}
          >
            <ProtocolStep
              title="1. Local Hashing"
              text="Your document is processed into a 64-character SHA-256 fingerprint. No one, including Satohash, can see your content."
            />
            <ProtocolStep
              title="2. Merkle Bundling"
              text="Multiple fingerprints are combined into a Merkle Tree. This allows for massive scaling and privacy proofs."
            />
            <ProtocolStep
              title="3. Bitcoin Anchoring"
              text="The Merkle Root is embedded into a Bitcoin transaction. The transaction date becomes your permanent timestamp."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProtocolStep({ title, text }) {
  return (
    <div
      style={{
        padding: '24px',
        background: 'white',
        borderRadius: '24px',
        border: '1px solid #e2e8f0'
      }}
    >
      <h4
        style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: '950',
          color: 'var(--accent-teal)',
          textTransform: 'uppercase'
        }}
      >
        {title}
      </h4>
      <p
        style={{
          margin: 0,
          fontSize: '15px',
          color: '#64748b',
          lineHeight: '1.6',
          fontWeight: '600'
        }}
      >
        {text}
      </p>
    </div>
  )
}

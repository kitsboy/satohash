import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, Zap, Globe, Heart, ShieldCheck, ArrowRight } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

const DUMMY_BTC_ADDRESS = 'bc1qexampleonchainaddress0000000000000000'
const DUMMY_LIGHTNING_INVOICE = 'lnbc1exampleinvoice...'

export default function DonationModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('lightning') // Default to Lightning for the 'Bitcoin vibe'
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeAddress = activeTab === 'btc' ? DUMMY_BTC_ADDRESS : DUMMY_LIGHTNING_INVOICE

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '8px',
              background: 'var(--color-primary)',
              borderRadius: '12px',
              color: 'white'
            }}
          >
            <Heart size={20} fill="white" />
          </div>
          <span>{t('donation.title')}</span>
        </div>
      }
    >
      <div style={{ padding: '0 4px' }}>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
            marginBottom: '32px',
            fontWeight: '500'
          }}
        >
          {t('donation.description')}
        </p>

        {/* Network Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--color-surface)',
            padding: '6px',
            borderRadius: '16px',
            marginBottom: '32px',
            border: '1px solid var(--color-border)'
          }}
        >
          <button
            onClick={() => setActiveTab('lightning')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'lightning' ? 'white' : 'transparent',
              boxShadow: activeTab === 'lightning' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              color:
                activeTab === 'lightning' ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <Zap size={16} fill={activeTab === 'lightning' ? 'var(--color-primary)' : 'none'} />
            Lightning
          </button>
          <button
            onClick={() => setActiveTab('btc')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'btc' ? 'white' : 'transparent',
              boxShadow: activeTab === 'btc' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              color: activeTab === 'btc' ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
              fontWeight: '800',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <Globe size={16} />
            On-Chain
          </button>
        </div>

        {/* QR Code Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px',
            animation: 'fade-in 0.4s ease-out'
          }}
        >
          <div
            style={{
              padding: '24px',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              border: '1px solid var(--color-border)',
              position: 'relative',
              marginBottom: '24px'
            }}
          >
            <QRCodeSVG
              value={activeAddress}
              size={220}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: 'https://giveabit.io/wp-content/uploads/2022/04/sats_new.png',
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true
              }}
            />
          </div>

          <div
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              cursor: 'pointer'
            }}
            onClick={() => copyToClipboard(activeAddress)}
          >
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '900',
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '4px'
                }}
              >
                {activeTab === 'lightning' ? 'Lightning Invoice' : 'Bitcoin Address'}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: '600'
                }}
              >
                {activeAddress}
              </div>
            </div>
            <div
              style={{
                padding: '10px',
                background: copied ? '#22c55e15' : 'var(--color-primary-light)',
                borderRadius: '10px',
                color: copied ? '#22c55e' : 'white',
                transition: 'all 0.3s ease'
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </div>
          </div>
        </div>

        {/* Transparency & Security Note */}
        <div
          style={{
            padding: '24px',
            background:
              'linear-gradient(135deg, var(--color-surface) 0%, var(--color-border-light) 100%)',
            borderRadius: '20px',
            border: '1px solid var(--color-border)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              color: 'var(--color-text-primary)'
            }}
          >
            <ShieldCheck size={18} />
            <span style={{ fontWeight: '900', fontSize: '14px' }}>Transparency Protocol</span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--color-text-secondary)',
              fontWeight: '500'
            }}
          >
            {t('donation.transparency')}
          </p>
        </div>

        <div style={{ marginTop: '32px' }}>
          <Button
            variant="primary"
            fullWidth
            onClick={onClose}
            style={{ height: '56px', fontWeight: '950', fontSize: '16px', borderRadius: '16px' }}
          >
            Back to Protocol
          </Button>
        </div>
      </div>
    </Modal>
  )
}

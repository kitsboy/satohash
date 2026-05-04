import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, Heart, ShieldCheck } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

const BTC_ADDRESS = 'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad'

export default function DonationModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

        {/* QR Code Frame */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '32px'
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
              value={`bitcoin:${BTC_ADDRESS}`}
              size={220}
              level="H"
              includeMargin={false}
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
            onClick={copyToClipboard}
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
                Bitcoin Address
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
                {BTC_ADDRESS}
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

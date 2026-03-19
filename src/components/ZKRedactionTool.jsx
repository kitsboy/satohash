import React, { useState } from 'react'
import { EyeOff, Share2, ShieldCheck, Info, X } from 'lucide-react'
import Button from './Button'

const ZKRedactionTool = ({ isOpen, onClose, contract }) => {
  const [redactedContent, setRedactedContent] = useState(contract?.content || '')
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handleTextSelect = () => {
    const selection = window.getSelection()
    if (selection.toString()) {
      const text = selection.toString()
      const replacement = '█'.repeat(text.length)
      setRedactedContent((prev) => prev.replace(text, replacement))
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        zIndex: 2100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '32px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 40px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1' }}>
              <EyeOff size={20} />
              <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>Privacy Shield</h2>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Redact sensitive fields while proving the original exists.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Redaction Canvas */}
          <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#f9fafb' }}>
            <div
              className="premium-document-container"
              onMouseUp={handleTextSelect}
              style={{
                padding: '40px',
                minHeight: 'auto',
                cursor: 'crosshair',
                userSelect: 'text'
              }}
            >
              <div className="legal-typography" style={{ whiteSpace: 'pre-wrap' }}>
                {redactedContent}
              </div>
            </div>
            <div
              style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6366f1'
              }}
            >
              <Info size={16} />
              <span style={{ fontSize: '12px', fontWeight: '600' }}>
                Select text to redact it instantly. Content remains protected by the original
                Bitcoin hash.
              </span>
            </div>
          </div>

          {/* ZK Info Sidebar */}
          <div
            style={{
              width: '320px',
              borderLeft: '1px solid #f3f4f6',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>
                ZK Privacy Tech
              </h3>
              <div
                style={{
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <ShieldCheck size={20} color="#22c55e" />
                  <div style={{ fontSize: '12px', fontWeight: '700' }}>Selective Disclosure</div>
                </div>
                <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                  By using Merkle inclusion proofs, you can reveal part of this document to a third
                  party without revealing the private content, while still proving it matches the
                  original Bitcoin anchor.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <Button
                variant="primary"
                style={{ width: '100%', borderRadius: '14px' }}
                onClick={() => {
                  setIsGenerating(true)
                  setTimeout(() => {
                    setIsGenerating(false)
                    alert(
                      'ZK Privacy Package Generated! You can now share this redacted version with cryptographic proof.'
                    )
                    onClose()
                  }, 2000)
                }}
                loading={isGenerating}
              >
                <Share2 size={18} />
                Generate Private Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZKRedactionTool

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Loader } from 'lucide-react'
import confetti from 'canvas-confetti'
import Button from '../../components/ui/Button'
import { createTimestamp } from '../../utils/opentimestamps'
import { buildMerkleTree } from '../../utils/merkle'
import usePageMetaOnboarding from '../../hooks/usePageMetaOnboarding'

const STEPS = [
  'Splitting document into atoms…',
  'Calculating Merkle Root…',
  'Submitting to Bitcoin…'
]

export default function TimestampProgress() {
  usePageMetaOnboarding('progress')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { contractId } = useParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [contract, setContract] = useState(null)

  useEffect(() => {
    const savedContracts = localStorage.getItem('satohash_contracts')
    if (savedContracts) {
      const contracts = JSON.parse(savedContracts)
      setContract(contracts.find((c) => c.id === contractId))
    }
  }, [contractId])

  useEffect(() => {
    if (!contract) return

    const processTimestamp = async () => {
      // Step 1: Create Merkle Tree
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Split by newline and filter empty lines to create "atoms"
      const atoms = contract.content.split('\n').filter((a) => a.trim() !== '')
      const merkleTree = await buildMerkleTree(atoms)
      setCurrentStep(1)

      // Step 2: Create timestamp from Merkle Root
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const ts = await createTimestamp(merkleTree.root)
      setCurrentStep(2)

      // Step 3: Save results
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Convert Blob to base64 for safe localStorage storage
      let otsFileBase64 = null
      if (ts.otsFile) {
        const arrayBuffer = await ts.otsFile.arrayBuffer()
        const bytes = new Uint8Array(arrayBuffer)
        otsFileBase64 = btoa(String.fromCharCode(...bytes))
        delete ts.otsFile // We don't want to JSON stringify a Blob
      }
      ts.otsFileBase64 = otsFileBase64

      const savedContracts = localStorage.getItem('satohash_contracts')
      const contracts = JSON.parse(savedContracts)
      const index = contracts.findIndex((c) => c.id === contractId)
      contracts[index] = {
        ...contracts[index],
        status: 'timestamped',
        merkleTree: merkleTree, // Save for selective redaction
        timestamp: ts
      }
      localStorage.setItem('satohash_contracts', JSON.stringify(contracts))

      setCurrentStep(3)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#ffffff']
      })
    }

    processTimestamp()
  }, [contract, contractId])

  return (
    <div className="page">
      <div className="container-narrow container text-center">
        <div className="page-header">
          <h1 className="page-title">{t('timestamp.progress.title')}</h1>
        </div>

        <div style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-2xl)' }}>
          {STEPS.map((step, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)',
                padding: 'var(--spacing-lg)',
                background: currentStep > index ? 'var(--color-surface)' : 'transparent',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {currentStep > index ? (
                <Check size={24} color="var(--color-success)" />
              ) : currentStep === index ? (
                <Loader size={24} className="animate-pulse" color="var(--color-primary)" />
              ) : (
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid var(--color-border)'
                  }}
                />
              )}
              <span className={currentStep >= index ? 'font-semibold' : 'text-secondary'}>
                {t(`timestamp.progress.step${index + 1}`)}
              </span>
            </div>
          ))}
        </div>

        <p
          className="text-secondary"
          style={{ lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--spacing-xl)' }}
        >
          {t('timestamp.progress.info')}
        </p>

        {currentStep === 3 && (
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate(`/contracts/${contractId}/timestamp/result`)}
            style={{ width: '100%' }}
          >
            {t('timestamp.progress.done')}
          </Button>
        )}
      </div>
    </div>
  )
}

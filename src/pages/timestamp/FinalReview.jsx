import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Info, Bitcoin, ShieldCheck, Zap, ChevronRight } from 'lucide-react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Modal from '../../components/Modal'
import { getFeeEstimates, convertSatsToFiat } from '../../utils/mempool'
import usePageMetaOnboarding from '../../hooks/usePageMetaOnboarding'

export default function FinalReview() {
  usePageMetaOnboarding('review')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { contractId } = useParams()
  const [contract, setContract] = useState(null)
  const [feeEstimates, setFeeEstimates] = useState(null)
  const [loadingFees, setLoadingFees] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showFeeDetails, setShowFeeDetails] = useState(false)

  useEffect(() => {
    const savedContracts = localStorage.getItem('satohash_contracts')
    if (savedContracts) {
      const contracts = JSON.parse(savedContracts)
      setContract(contracts.find((c) => c.id === contractId))
    }

    const loadFees = async () => {
      const fees = await getFeeEstimates()
      setFeeEstimates(fees)
      setLoadingFees(false)
    }
    loadFees()
  }, [contractId])

  const handleTimestamp = () => {
    navigate(`/contracts/${contractId}/timestamp/progress`)
  }

  const handleLearnMore = () => {
    navigate(`/contracts/${contractId}/timestamp/explanation`)
  }

  if (!contract) return null

  return (
    <div className="page bg-slate-50 pt-24 pb-20">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => navigate(`/contracts/${contractId}`)}
            className="flex items-center gap-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
          >
            <ArrowLeft size={16} />
            Back to Document
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* LEFT: Document Preview */}
          <div>
            <div className="mb-6 flex items-center gap-2 text-slate-900">
              <ShieldCheck className="text-indigo-600" size={24} />
              <h1 className="text-3xl font-black tracking-tight uppercase">Final Review</h1>
            </div>

            <div
              style={{
                background: 'white',
                padding: '40px',
                borderRadius: '32px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.02)',
                maxHeight: '600px',
                overflowY: 'auto',
                position: 'relative'
              }}
            >
              <div className="document-watermark opacity-[0.03]">
                {Array(100).fill('FINAL_REVIEW_ONLY ').join('')}
              </div>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: '1.8',
                  color: 'var(--color-text-secondary)',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {contract.content}
              </pre>
            </div>
          </div>

          {/* RIGHT: Protocol Details & Action */}
          <div className="space-y-6 lg:pt-12">
            <Card
              style={{
                padding: '32px',
                borderRadius: '32px',
                background: 'white',
                border: '1px solid var(--color-border)'
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Zap size={20} fill="currentColor" />
                </div>
                <h3 className="text-sm font-black tracking-tight uppercase">Protocol Mechanics</h3>
              </div>

              <p className="mb-6 text-xs leading-relaxed font-medium text-slate-500">
                {t('timestamp.explain.point1')}
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <p className="text-[11px] leading-normal font-bold text-slate-700">
                    {t('timestamp.explain.point2')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <p className="text-[11px] leading-normal font-bold text-slate-700">
                    {t('timestamp.explain.point3')}
                  </p>
                </div>
              </div>

              {/* FEES */}
              <div className="mt-8 border-t border-slate-100 pt-8">
                <div className="mb-4 flex items-center gap-2">
                  <Bitcoin size={18} className="text-orange-500" />
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Network Priority Fee
                  </span>
                </div>

                {loadingFees ? (
                  <div className="h-12 animate-pulse rounded-xl bg-slate-50" />
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">
                        ~{feeEstimates?.fastestFee || 20} sats/vByte
                      </span>
                      <span className="text-xs font-bold text-indigo-600">
                        ≈ ${convertSatsToFiat((feeEstimates?.fastestFee || 20) * 250)}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">
                      Fast confirmation (approx. 10-30 mins)
                    </p>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="large"
                onClick={() => setShowConfirm(true)}
                style={{ width: '100%', height: '64px', marginTop: '32px' }}
                className="shadow-2xl shadow-indigo-100"
              >
                {t('timestamp.review.timestampThisAgreement')}
                <ChevronRight size={20} className="ml-2" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleLearnMore}
                style={{ width: '100%', marginTop: '12px' }}
              >
                How timestamping works
              </Button>
            </Card>

            <div className="rounded-3xl bg-slate-900 p-6 text-white">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-[10px] font-black tracking-[0.2em] text-white/50 uppercase">
                  Zero-Knowledge Guarantee
                </span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium text-white/80">
                Satohash only broadcasts the SHA-256 fingerprint of your document. Your private data
                never leaves this machine.
              </p>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          title={t('timestamp.review.confirmTitle')}
          actions={
            <>
              <Button variant="ghost" onClick={() => setShowConfirm(false)}>
                {t('timestamp.review.goBack')}
              </Button>
              <Button variant="primary" onClick={handleTimestamp}>
                {t('timestamp.review.yes')}
              </Button>
            </>
          }
        >
          <p className="text-sm font-medium text-slate-600">
            {t('timestamp.review.confirmMessage')}
          </p>
        </Modal>
      </div>
    </div>
  )
}

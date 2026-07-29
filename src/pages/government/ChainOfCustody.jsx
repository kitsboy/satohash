import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import JurisdictionPicker from '../../components/forms/JurisdictionPicker'
import { sha256HexFromObject } from '../../utils/canonicalJson'
import ProofTimeline from '../../components/stamps/ProofTimeline'
import { upsertLocalStamp } from '../../utils/vaultLocal'
import { clientId } from '../../utils/id'

const HISTORY_KEY = 'satohash_custody_log'

export default function ChainOfCustody() {
  usePageMeta({ page: 'chainOfCustody' })
  const { t } = useTranslation()
  const [jurisdiction, setJurisdiction] = useState('us-ueta')
  const [holder, setHolder] = useState('')
  const [witness, setWitness] = useState('')
  const [agency, setAgency] = useState('')
  const [hash, setHash] = useState('')
  const [step, setStep] = useState(0)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'))
    } catch {
      setHistory([])
    }
  }, [])

  const compute = async () => {
    const payload = {
      holder,
      witness,
      agency,
      jurisdiction,
      step: step + 1,
      at: new Date().toISOString()
    }
    const h = await sha256HexFromObject(payload)
    setHash(h)
    const nextStep = Math.min(step + 1, 3)
    setStep(nextStep)
    const entry = { ...payload, hash: h, step: nextStep }
    const next = [entry, ...history].slice(0, 50)
    setHistory(next)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    upsertLocalStamp({
      id: clientId('custody'),
      hash: h,
      filename: `custody-step-${nextStep}`,
      status: 'pending',
      created_at: payload.at,
      source: 'chain-of-custody'
    })
    toast.success(t('chainOfCustodyPage.recordStep'))
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'satohash-custody-log.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const fields = [
    { key: 'holder', value: holder, set: setHolder },
    { key: 'witness', value: witness, set: setWitness },
    { key: 'agency', value: agency, set: setAgency }
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
        <Link
          to="/government"
          className="flex min-h-[44px] items-center text-sm font-bold"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('governmentPage.backGovernment')}
        </Link>
      </header>
      <div className="mx-auto max-w-2xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-black">{t('chainOfCustodyPage.title')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('chainOfCustodyPage.subtitle')}
        </p>
        <JurisdictionPicker value={jurisdiction} onChange={setJurisdiction} />
        <div className="space-y-4">
          {fields.map((f) => (
            <input
              key={f.key}
              placeholder={t(`chainOfCustodyPage.fields.${f.key}`)}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border px-4 py-3 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={compute}
            className="min-h-[44px] rounded-xl px-6 py-3 text-xs font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('chainOfCustodyPage.recordStep')}
          </button>
          {history.length > 0 && (
            <button
              type="button"
              onClick={exportJson}
              className="min-h-[44px] rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              {t('chainOfCustodyPage.exportJson')}
            </button>
          )}
        </div>
        {hash && (
          <>
            <ProofTimeline status="pending" hasOts={false} />
            <p className="font-mono text-xs break-all">{hash}</p>
            <Link
              to={`/stamp?hash=${hash}&label=Chain+of+custody`}
              className="text-xs font-black uppercase underline"
              style={{ color: 'var(--accent-active)' }}
            >
              {t('governmentPage.stampNow')}
            </Link>
          </>
        )}
        {history.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-black">{t('chainOfCustodyPage.history')}</h2>
            {history.slice(0, 5).map((e) => (
              <div
                key={e.at}
                className="rounded-xl border p-3 text-[10px]"
                style={{ borderColor: 'var(--border)' }}
              >
                <p className="font-mono break-all">{e.hash}</p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Step {e.step} · {e.holder || '—'} → {e.agency || '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

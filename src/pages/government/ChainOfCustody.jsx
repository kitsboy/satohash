import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import JurisdictionPicker from '../../components/JurisdictionPicker'
import { sha256HexFromObject } from '../../utils/canonicalJson'
import ProofTimeline from '../../components/ProofTimeline'

export default function ChainOfCustody() {
  usePageMeta({ page: 'chainOfCustody' })
  const [jurisdiction, setJurisdiction] = useState('us-ueta')
  const [holder, setHolder] = useState('')
  const [witness, setWitness] = useState('')
  const [agency, setAgency] = useState('')
  const [hash, setHash] = useState('')
  const [step, setStep] = useState(0)

  const compute = async () => {
    const payload = { holder, witness, agency, jurisdiction, step, at: new Date().toISOString() }
    const h = await sha256HexFromObject(payload)
    setHash(h)
    setStep((s) => Math.min(s + 1, 3))
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
        <Link
          to="/government"
          className="text-sm font-bold"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Government use
        </Link>
      </header>
      <div className="mx-auto max-w-2xl space-y-8 px-6 py-12">
        <h1 className="text-3xl font-black">Chain of custody</h1>
        <JurisdictionPicker value={jurisdiction} onChange={setJurisdiction} />
        <div className="space-y-4">
          {['Holder name', 'Witness', 'Receiving agency'].map((label, i) => (
            <input
              key={label}
              placeholder={label}
              value={[holder, witness, agency][i]}
              onChange={(e) => [setHolder, setWitness, setAgency][i](e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={compute}
          className="rounded-xl px-6 py-3 text-xs font-black uppercase"
          style={{ background: 'var(--accent-gold)', color: '#141b25' }}
        >
          Record custody step
        </button>
        {hash && (
          <>
            <ProofTimeline status={step >= 3 ? 'pending' : 'hashed'} hasOts={false} />
            <p className="font-mono text-xs break-all">{hash}</p>
            <Link
              to={`/stamp?hash=${hash}&label=Chain+of+custody`}
              className="text-xs font-black uppercase underline"
              style={{ color: 'var(--accent-active)' }}
            >
              Stamp this custody record →
            </Link>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

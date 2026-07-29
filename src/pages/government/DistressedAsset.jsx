import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import { sha256HexFromObject } from '../../utils/canonicalJson'
import { compareOtsToHosted } from '../../utils/otsBrowser'

export default function DistressedAsset() {
  usePageMeta({ page: 'distressedAsset' })
  const [listing, setListing] = useState({ asset: '', jurisdiction: '', seller: '', terms: '' })
  const [hash, setHash] = useState('')
  const [otsFile, setOtsFile] = useState(null)
  const [verifyResult, setVerifyResult] = useState(null)
  const [hostedUrl, setHostedUrl] = useState('https://motopass.giveabit.io/proofs/example.ots')

  const hashListing = async () => {
    const h = await sha256HexFromObject(listing)
    setHash(h)
  }

  const verifyHosted = async () => {
    if (!otsFile || !hash || !hostedUrl.trim()) return
    setVerifyResult(await compareOtsToHosted(otsFile, hostedUrl.trim(), hash))
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
      <div className="mx-auto max-w-2xl space-y-6 px-6 py-12">
        <h1 className="text-3xl font-black">Distressed asset attestation</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Hash listing metadata for sovereign asset trades. Pair with hosted .ots from MotoPass
          distressed listings.
        </p>
        {Object.keys(listing).map((k) => (
          <input
            key={k}
            placeholder={k}
            value={listing[k]}
            onChange={(e) => setListing({ ...listing, [k]: e.target.value })}
            className="w-full rounded-xl border px-4 py-3 text-sm capitalize"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
          />
        ))}
        <button
          type="button"
          onClick={hashListing}
          className="rounded-xl px-6 py-3 text-xs font-black uppercase"
          style={{ background: 'var(--accent-gold)', color: '#141b25' }}
        >
          Compute listing hash
        </button>
        {hash && (
          <>
            <p className="font-mono text-xs break-all">{hash}</p>
            <Link
              to={`/stamp?hash=${hash}&source=motopass&label=Distressed+asset`}
              className="text-xs underline"
              style={{ color: 'var(--accent-active)' }}
            >
              Stamp listing hash
            </Link>
          </>
        )}
        <input
          type="file"
          accept=".ots"
          onChange={(e) => setOtsFile(e.target.files?.[0] || null)}
        />
        {otsFile && hash && (
          <div className="space-y-3">
            <input
              type="url"
              value={hostedUrl}
              onChange={(e) => setHostedUrl(e.target.value)}
              placeholder="Hosted .ots URL on motopass or CDN"
              className="w-full rounded-xl border px-4 py-3 font-mono text-xs"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
            />
            <button
              type="button"
              onClick={verifyHosted}
              className="rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              Compare to hosted proof
            </button>
          </div>
        )}
        {verifyResult && (
          <p
            className="text-xs"
            style={{
              color: verifyResult.verified ? 'var(--accent-success)' : 'var(--accent-danger)'
            }}
          >
            {verifyResult.message}
          </p>
        )}
      </div>
      <Footer />
    </div>
  )
}

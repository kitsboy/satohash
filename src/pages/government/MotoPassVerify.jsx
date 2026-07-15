import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Footer from '../../components/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import { normalizeSha256, parseHashLines } from '../../utils/hashUtils'
import { getVerifyUrl } from '../../config/constants'
import StaticModeBanner from '../../components/StaticModeBanner'

export default function MotoPassVerify() {
  usePageMeta({ page: 'motopassVerify' })
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const verify = () => {
    const hashes = parseHashLines(input)
    if (!hashes.length) {
      toast.error('Paste at least one valid SHA-256 hash')
      return
    }
    setResults(
      hashes.map((hash) => ({
        hash,
        verifyUrl: `${getVerifyUrl()}/${hash}`,
        stampUrl: `${window.location.origin}/stamp?hash=${hash}&source=motopass&label=MotoPass+application`
      }))
    )
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
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
        <StaticModeBanner compact />
        <h1 className="text-3xl font-black">Verify MotoPass application hash</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Paste SHA-256 hashes from motopass.giveabit.io applications. Satohash validates format and
          links to independent verification.
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder="One 64-character hex hash per line…"
          className="w-full rounded-2xl border p-4 font-mono text-xs"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        />
        <button
          type="button"
          onClick={verify}
          className="rounded-xl px-8 py-3 text-xs font-black tracking-widest uppercase"
          style={{ background: 'var(--accent-gold)', color: '#141b25' }}
        >
          Validate hashes
        </button>
        {results.length > 0 && (
          <ul className="space-y-3">
            {results.map((r) => (
              <li
                key={r.hash}
                className="rounded-xl border p-4"
                style={{ borderColor: 'var(--border)' }}
              >
                <p className="font-mono text-[10px] break-all">{r.hash}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={r.verifyUrl}
                    className="text-[10px] font-black uppercase underline"
                    style={{ color: 'var(--accent-active)' }}
                  >
                    Verify on Satohash
                  </a>
                  <a
                    href={r.stampUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-black uppercase underline"
                  >
                    Complete stamp
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  )
}

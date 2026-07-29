import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import { parseHashLines } from '../../utils/hashUtils'
import { getVerifyUrl } from '../../config/constants'
import StaticModeBanner from '../../components/shared/StaticModeBanner'

export default function MotoPassVerify() {
  usePageMeta({ page: 'motopassVerify' })
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const verify = () => {
    const hashes = parseHashLines(input)
    if (!hashes.length) {
      toast.error(t('motopassVerifyPage.toastNeedHash'))
      return
    }
    setResults(
      hashes.map((hash) => ({
        hash,
        verifyUrl: `${getVerifyUrl()}/${hash}`,
        verifyToolUrl: `${window.location.origin}/verify?hash=${hash}`,
        stampUrl: `/stamp?hash=${hash}&source=motopass&label=MotoPass+application`
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
          {t('governmentPage.backGovernment')}
        </Link>
      </header>
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
        <StaticModeBanner compact />
        <h1 className="text-3xl font-black">{t('motopassVerifyPage.title')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('motopassVerifyPage.subtitle')}
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder={t('motopassVerifyPage.placeholder')}
          className="w-full rounded-2xl border p-4 font-mono text-xs"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        />
        <button
          type="button"
          onClick={verify}
          className="rounded-xl px-8 py-3 text-xs font-black tracking-widest uppercase"
          style={{ background: 'var(--accent-gold)', color: '#141b25' }}
        >
          {t('motopassVerifyPage.validate')}
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
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={r.verifyUrl}
                    className="text-[10px] font-black uppercase underline"
                    style={{ color: 'var(--accent-active)' }}
                  >
                    {t('motopassVerifyPage.publicVerify')}
                  </a>
                  <a
                    href={r.verifyToolUrl}
                    className="text-[10px] font-black uppercase underline"
                    style={{ color: 'var(--accent-gold)' }}
                  >
                    {t('motopassVerifyPage.verifyTool')}
                  </a>
                  <Link
                    to={r.stampUrl}
                    className="text-[10px] font-black uppercase underline"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('motopassVerifyPage.completeStamp')}
                  </Link>
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

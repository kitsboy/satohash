import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Fingerprint,
  ArrowRight,
  Shield,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Copy
} from 'lucide-react'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import { parseHashLines } from '../../utils/hashUtils'
import { getVerifyUrl } from '../../config/constants'
import StaticModeBanner from '../../components/shared/StaticModeBanner'

/**
 * Humble migration verify helper — not a product launch page.
 * Family apps (e.g. MotoPass) hash client-side and deep-link into Satohash.
 */
export default function MotoPassVerify() {
  usePageMeta({ page: 'motopassVerify' })
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])

  const verify = () => {
    const hashes = parseHashLines(input)
    if (!hashes.length) {
      toast.error(
        t('motopassVerifyPage.toastNeedHash', {
          defaultValue: 'Paste one or more 64-character SHA-256 hashes'
        })
      )
      return
    }
    setResults(
      hashes.map((hash) => ({
        hash,
        verifyUrl: `${getVerifyUrl()}/${hash}`,
        verifyToolUrl: `/verify?hash=${hash}`,
        stampUrl: `/stamp?hash=${hash}&ref=motopass&label=MotoPass+application`
      }))
    )
    toast.success(`${hashes.length} hash${hashes.length > 1 ? 'es' : ''} ready`)
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <section className="border-b px-4 pt-8 pb-12 sm:px-6 sm:pt-12" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black tracking-widest uppercase"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-tertiary)'
              }}
            >
              <Sparkles size={11} /> Quiet R&amp;D · migration pattern
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t('motopassVerifyPage.title', { defaultValue: 'Hash verify helper' })}
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('motopassVerifyPage.subtitle', {
              defaultValue:
                'Paste SHA-256 fingerprints from a client-side migration tool (e.g. passport-style packets). Open Satohash verify or complete a free stamp — biometrics never need to leave the source app.'
            })}
          </p>
          <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            This is a humble concept page for workshop deep-links — not a product campaign. Family
            prototype:{' '}
            <a
              href="https://motopass.giveabit.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              motopass.giveabit.io
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <StaticModeBanner compact />

        <div
          className="rounded-2xl border p-4 sm:p-5"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <label className="mb-2 block text-[10px] font-black tracking-widest uppercase" style={{ color: 'var(--accent-gold)' }}>
            SHA-256 hashes
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder={t('motopassVerifyPage.placeholder', {
              defaultValue: 'One 64-char hex hash per line…'
            })}
            className="w-full rounded-xl border p-4 font-mono text-xs outline-none focus:border-[var(--accent-gold)]"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)'
            }}
          />
          <button
            type="button"
            onClick={verify}
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-black tracking-widest uppercase sm:w-auto"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            <Fingerprint size={16} />
            {t('motopassVerifyPage.validate', { defaultValue: 'Prepare verify links' })}
          </button>
        </div>

        {results.length > 0 && (
          <ul className="space-y-3">
            {results.map((r) => (
              <li
                key={r.hash}
                className="rounded-2xl border p-4"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
              >
                <p className="font-mono text-[10px] break-all" style={{ color: 'var(--text-secondary)' }}>
                  {r.hash}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={`/verify/${r.hash}`}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-black uppercase"
                    style={{ borderColor: 'var(--border)', color: 'var(--accent-gold)' }}
                  >
                    {t('motopassVerifyPage.publicVerify', { defaultValue: 'Public verify' })}{' '}
                    <ArrowRight size={12} />
                  </Link>
                  <Link
                    to={r.verifyToolUrl}
                    className="inline-flex min-h-[40px] items-center rounded-lg border px-3 py-2 text-[10px] font-black uppercase"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    {t('motopassVerifyPage.verifyTool', { defaultValue: 'Verify tool' })}
                  </Link>
                  <Link
                    to={r.stampUrl}
                    className="inline-flex min-h-[40px] items-center rounded-lg px-3 py-2 text-[10px] font-black uppercase"
                    style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                  >
                    {t('motopassVerifyPage.completeStamp', { defaultValue: 'Stamp free' })}
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(r.hash)
                        toast.success('Hash copied')
                      } catch {
                        toast.message(r.hash)
                      }
                    }}
                    className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border px-3 py-2 text-[10px] font-bold uppercase"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
                  >
                    <Copy size={12} /> Copy
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div
          className="rounded-2xl border p-5"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        >
          <div className="mb-3 flex items-center gap-2">
            <Shield size={16} style={{ color: 'var(--accent-gold)' }} />
            <h2 className="text-sm font-black">How the pattern works</h2>
          </div>
          <ul className="space-y-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {[
              'Source app hashes the package on-device (never upload biometrics to Satohash).',
              'Deep-link to /stamp?hash=…&ref=… for free OTS + Bitcoin-bound proof.',
              'Store the .ots next to the application archive for independent verify later.',
              'This page only helps inspect hashes you already control.'
            ].map((line) => (
              <li key={line} className="flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/government"
              className="inline-flex min-h-[44px] items-center gap-1 text-[11px] font-bold uppercase text-[var(--accent-gold)]"
            >
              Government hub <ArrowRight size={12} />
            </Link>
            <Link
              to="/integrations"
              className="inline-flex min-h-[44px] items-center gap-1 text-[11px] font-bold uppercase"
              style={{ color: 'var(--text-secondary)' }}
            >
              Deep-link docs
            </Link>
            <a
              href="https://motopass.giveabit.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1 text-[11px] font-semibold"
              style={{ color: 'var(--text-tertiary)' }}
            >
              External prototype <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

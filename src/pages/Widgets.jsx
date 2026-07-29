import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Copy, Check, Code, Fingerprint, ExternalLink } from 'lucide-react'
import Footer from '../components/layout/Footer'
import ProofDNA from '../components/stamps/ProofDNA'
import usePageMeta from '../hooks/usePageMeta'
import { getPublicBaseUrl } from '../config/constants'

const DEMO_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

function buildEmbeds() {
  const base = getPublicBaseUrl()
  return {
    basic: `<div class="satohash-dna" data-hash="${DEMO_HASH}"></div>
<script src="${base}/widgets/proof-dna.js" async></script>`,
    v3: `<div
  class="satohash-dna-v3"
  data-hash="${DEMO_HASH}"
  data-theme="noir"
  data-domain="yourbrand.com"
  data-verify="${base}/verify/${DEMO_HASH}"
></div>
<script src="${base}/widgets/proof-dna-v3.js" async></script>`,
    badge: `<div
  class="satohash-dna"
  data-hash="${DEMO_HASH}"
  data-size="sm"
  data-label="Bitcoin Proof"
  data-verify="${base}/verify/${DEMO_HASH}"
></div>
<script src="${base}/widgets/proof-dna.js" async></script>`
  }
}

function CopyBlock({ label, code, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2">
        <span className="text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
          {label}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-tertiary)] hover:text-[var(--accent-gold)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed whitespace-pre text-[var(--text-secondary)]">
        {code}
      </pre>
    </div>
  )
}

export default function Widgets() {
  usePageMeta({ page: 'widgets' })
  const { t } = useTranslation()
  const embeds = buildEmbeds()

  const attrKeys = ['hash', 'size', 'verify', 'label', 'theme', 'domain']

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link
            to="/integrations"
            className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
            <ArrowLeft size={16} /> {t('common.integrations')}
          </Link>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            {t('widgetsPage.nav')}
          </span>
        </div>
      </header>

      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <Fingerprint size={32} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            <span className="text-[var(--accent-gold)]">{t('widgetsPage.hero.title')}</span>{' '}
            {t('widgetsPage.hero.titleHighlight')}
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('widgetsPage.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)] uppercase">
              {t('widgetsPage.preview.title')}
            </h2>
            <div className="flex flex-wrap items-center gap-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-10">
              <ProofDNA hash={DEMO_HASH} size="lg" />
              <ProofDNA hash={DEMO_HASH} size="sm" />
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              {t('widgetsPage.preview.body')}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-[var(--text-primary)] uppercase">
              <Code size={20} className="text-[var(--accent-gold)]" />{' '}
              {t('widgetsPage.embed.title')}
            </h2>
            <CopyBlock
              label={t('widgetsPage.embed.basic')}
              code={embeds.basic}
              copyLabel={t('common.copy')}
              copiedLabel={t('common.copied')}
            />
            <CopyBlock
              label={t('widgetsPage.embed.badge')}
              code={embeds.badge}
              copyLabel={t('common.copy')}
              copiedLabel={t('common.copied')}
            />
            <CopyBlock
              label={t('widgetsPage.embed.v3Label')}
              code={embeds.v3}
              copyLabel={t('common.copy')}
              copiedLabel={t('common.copied')}
            />
            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              <p className="border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2 text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
                {t('widgetsPage.preview.v3Title')}
              </p>
              <iframe
                title={t('widgetsPage.preview.v3Title')}
                srcDoc={`<!DOCTYPE html><html><head><meta charset=utf-8><style>body{margin:0;padding:24px;background:#0a0a0b;display:flex;align-items:center;justify-content:center;min-height:120px}</style></head><body>${embeds.v3}</body></html>`}
                className="h-40 w-full bg-[var(--bg-secondary)]"
                sandbox="allow-scripts allow-popups"
              />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 text-xs text-[var(--text-secondary)]">
              <p className="mb-3 font-bold text-[var(--text-primary)]">
                {t('widgetsPage.embed.attributesTitle')}
              </p>
              <ul className="space-y-1 font-mono text-[10px]">
                {attrKeys.map((key) => (
                  <li key={key}>{t(`widgetsPage.embed.attrs.${key}`)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            to="/identity"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-active)] px-6 py-3 text-xs font-black tracking-widest text-white uppercase hover:opacity-90"
          >
            {t('widgetsPage.nip05Cta')} <ExternalLink size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

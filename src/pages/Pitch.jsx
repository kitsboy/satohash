import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, TrendingUp, Megaphone, Briefcase, Shield, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import KimiContact from '../components/forms/KimiContact'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
import { renderDocMarkdown } from '../utils/renderDocMarkdown'
import { normalizeLang } from '../i18n/language'

const TABS = [
  { id: 'pitch', labelKey: 'pitchPage.tabs.pitch', icon: Briefcase },
  { id: 'executive-summary', labelKey: 'pitchPage.tabs.exec', icon: FileText },
  { id: 'marketing', labelKey: 'pitchPage.tabs.marketing', icon: Megaphone },
  { id: 'financials', labelKey: 'pitchPage.tabs.financials', icon: TrendingUp }
]

const PITCH_LOCALES = new Set(['es', 'fr', 'de', 'pt', 'sw', 'zh'])

function renderMarkdown(md) {
  return renderDocMarkdown(md)
}

function looksLikeHtml(text) {
  return typeof text === 'string' && /^\s*<!doctype html/i.test(text)
}

function ProofsCountLine({ line, count }) {
  const idx = line.indexOf(count)
  if (idx < 0) return line
  return (
    <>
      {line.slice(0, idx)}
      <span className="font-black text-[var(--accent-gold)]">{count}</span>
      {line.slice(idx + count.length)}
    </>
  )
}

function pitchMarkdownUrl(tab, lang) {
  if (tab !== 'pitch') return `/docs/${tab}.md`
  const code = normalizeLang(lang)
  if (PITCH_LOCALES.has(code)) return `/docs/pitch.${code}.md`
  return '/docs/pitch.md'
}

async function fetchMarkdown(url) {
  const res = await fetch(url)
  if (!res.ok) return null
  const text = await res.text()
  if (!text || looksLikeHtml(text)) return null
  return text
}

export default function Pitch() {
  const { t, i18n } = useTranslation()
  usePageMeta({ page: 'pitch' })
  const [tab, setTab] = useState('pitch')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [proofCount, setProofCount] = useState(null)
  const proofCountLabel = proofCount != null ? proofCount.toLocaleString(i18n.language) : null

  useEffect(() => {
    fetch('https://api.satohash.io/api/public/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.stamps_stored != null) setProofCount(d.stamps_stored)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    const lang = normalizeLang(i18n.language)
    const primary = pitchMarkdownUrl(tab, lang)

    setLoading(true)
    ;(async () => {
      try {
        let text = await fetchMarkdown(primary)
        if (!text && tab === 'pitch' && primary !== '/docs/pitch.md') {
          text = await fetchMarkdown('/docs/pitch.md')
        }
        if (!cancelled) setContent(text || t('pitchPage.unavailable'))
      } catch {
        if (!cancelled) setContent(t('pitchPage.unavailable'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [tab, i18n.language, t])

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <p className="mb-2 text-center text-[10px] font-bold tracking-[0.2em] text-[var(--accent-gold)] uppercase">
          {t('pitchPage.kicker')}
        </p>
        <h1 className="mb-6 text-center text-2xl font-black tracking-tight sm:text-3xl">
          {t('pitchPage.h1')}
        </h1>

        {proofCountLabel != null && (
          <p className="mb-6 text-center text-sm text-[var(--text-secondary)]">
            <ProofsCountLine
              count={proofCountLabel}
              line={t('pitchPage.proofsLine', { count: proofCountLabel })}
            />{' '}
            <a
              href="https://satohash.io/network"
              className="text-[var(--accent-gold)] hover:underline"
            >
              {t('pitchPage.liveNetwork')}
            </a>
          </p>
        )}

        {/* Government strip — humble, post-government page update */}
        <div
          className="mb-8 rounded-2xl border p-4 sm:p-5"
          style={{
            borderColor: 'var(--border)',
            background: 'var(--surface-raised)'
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Shield
                className="mt-0.5 shrink-0"
                size={22}
                style={{ color: 'var(--accent-gold)' }}
              />
              <div>
                <p className="text-sm font-black">{t('pitchPage.govTitle')}</p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t('pitchPage.govBody')}
                </p>
              </div>
            </div>
            <Link
              to="/government"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-[11px] font-black tracking-wider uppercase"
              style={{ borderColor: 'var(--border-gold)', color: 'var(--accent-gold)' }}
            >
              {t('pitchPage.govCta')} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <nav
          className="templates-category-scroll mb-8 flex gap-2 overflow-x-auto pb-2"
          role="tablist"
          aria-label={t('pitchPage.tabsAria')}
        >
          {TABS.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition-colors"
              style={{
                borderColor: tab === id ? 'var(--accent-gold)' : 'var(--border)',
                background: tab === id ? 'var(--accent-gold-subtle)' : 'transparent',
                color: tab === id ? 'var(--accent-gold)' : 'var(--text-secondary)'
              }}
            >
              <Icon size={14} /> {t(labelKey)}
            </button>
          ))}
        </nav>

        <div className="mb-4 flex flex-wrap gap-2">
          <Link
            to="/stamp"
            className="inline-flex min-h-[44px] items-center rounded-xl px-4 py-2 text-[11px] font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('pitchPage.stampCta')}
          </Link>
          <Link
            to="/docs/executive-summary"
            className="inline-flex min-h-[44px] items-center rounded-xl border px-4 py-2 text-[11px] font-bold uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            {t('pitchPage.execCta')}
          </Link>
        </div>

        <article
          className="prose-invert overflow-x-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 sm:p-8"
          dangerouslySetInnerHTML={{
            __html: loading
              ? `<p>${t('pitchPage.loading')}</p>`
              : `<div>${renderMarkdown(content)}</div>`
          }}
        />

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            {t('pitchPage.talkHeading')}
          </h2>
          <KimiContact />
        </section>
      </main>
      <Footer compact />
    </div>
  )
}

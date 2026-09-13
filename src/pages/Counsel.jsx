import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Counsel() {
  const { t } = useTranslation()
  usePageMeta({
    page: 'counsel',
    title: t('counselPage.metaTitle'),
    description: t('counselPage.metaDesc')
  })

  const printPdf = () => window.print()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <article className="layout-container max-w-3xl space-y-8 py-10 print:max-w-none">
        <header className="space-y-3">
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            {t('counselPage.kicker')}
          </p>
          <h1 className="font-display scroll-mt-24 text-3xl font-black tracking-tight sm:text-4xl">
            {t('counselPage.title')}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('counselPage.lede')}
          </p>
          <button
            type="button"
            onClick={printPdf}
            className="btn-sheen inline-flex min-h-[44px] items-center rounded-xl px-4 text-xs font-black uppercase print:hidden"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('counselPage.print')}
          </button>
        </header>

        <section
          className="vault-ring space-y-3 rounded-2xl border p-5"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-black uppercase">{t('counselPage.itIs')}</h2>
          <ul
            className="list-disc space-y-2 pl-5 text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>{t('counselPage.is1')}</li>
            <li>{t('counselPage.is2')}</li>
            <li>{t('counselPage.is3')}</li>
            <li>{t('counselPage.is4')}</li>
          </ul>
        </section>

        <section
          className="space-y-3 rounded-2xl border p-5"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-black uppercase">{t('counselPage.itIsNot')}</h2>
          <ul
            className="list-disc space-y-2 pl-5 text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>{t('counselPage.not1')}</li>
            <li>{t('counselPage.not2')}</li>
            <li>{t('counselPage.not3')}</li>
            <li>
              {t('counselPage.not4a')} {t('counselPage.not4b')} {t('counselPage.not4c')}
            </li>
          </ul>
        </section>

        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {t('counselPage.footer')}{' '}
          <Link to="/verify" className="underline">
            {t('counselPage.verifyLink')}
          </Link>
          .
        </p>
      </article>
      <Footer compact />
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Shield, Fingerprint, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import GiveABitBadge from '../../components/GiveABitBadge'

const USE_CASE_KEYS = [
  { key: 'passport', link: '/motopass-verify' },
  { key: 'distressed', link: '/distressed-asset' },
  { key: 'custody', link: '/chain-of-custody' },
  { key: 'admissibility', link: '/evidence-admissibility' }
]

export default function GovernmentUse() {
  usePageMeta({ page: 'government' })
  const { t } = useTranslation()

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <header className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <Link
            to="/trust"
            className="text-sm font-bold"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('governmentPage.backTrust')}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center">
        <Shield size={36} className="mx-auto mb-4" style={{ color: 'var(--accent-gold)' }} />
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          {t('governmentUse.title')} &{' '}
          <span style={{ color: 'var(--accent-gold)' }}>{t('governmentUse.titleHighlight')}</span>
        </h1>
        <p
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('governmentUse.subtitle')}
        </p>
        <GiveABitBadge className="mt-6 justify-center" />
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-2">
        {USE_CASE_KEYS.map((c) => (
          <Link
            key={c.link}
            to={c.link}
            className="rounded-2xl border p-6 transition-all hover:border-[var(--accent-gold)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
          >
            <h2 className="text-lg font-black">{t(`governmentUse.${c.key}.title`)}</h2>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {t(`governmentUse.${c.key}.body`)}
            </p>
            <span
              className="mt-4 inline-flex items-center gap-1 text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--accent-active)' }}
            >
              {t('governmentPage.learnMore')} <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </section>

      <section
        className="border-t px-6 py-12"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <Fingerprint size={28} className="mx-auto mb-3" style={{ color: 'var(--accent-gold)' }} />
          <h2 className="text-xl font-black">{t('governmentPage.procurementTitle')}</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('governmentPage.procurementBody')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/docs/executive-summary"
              className="rounded-xl px-6 py-3 text-xs font-black uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('trustPage.procurementCta')}
            </Link>
            <Link
              to="/security"
              className="rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              {t('trustPage.securityLink')}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h2 className="text-xl font-black">{t('governmentPage.readyStamp')}</h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('governmentPage.readyStampDesc')}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/stamp"
            className="rounded-xl px-6 py-3 text-xs font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('governmentPage.stampNow')}
          </Link>
          <Link
            to="/batch-hash"
            className="rounded-xl border px-6 py-3 text-xs font-black uppercase"
            style={{ borderColor: 'var(--border)' }}
          >
            {t('governmentPage.batchHash')}
          </Link>
          <Link
            to="/templates/passport-attestation"
            className="rounded-xl border px-6 py-3 text-xs font-black uppercase"
            style={{ borderColor: 'var(--border)' }}
          >
            Passport template
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

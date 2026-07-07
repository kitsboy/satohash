import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ExternalLink,
  Award,
  GitPullRequest,
  Bug,
  BookOpen,
  Globe,
  Code2,
  TestTube
} from 'lucide-react'
import { motion } from 'framer-motion'
import usePageMeta from '../hooks/usePageMeta'
import { getPublicBaseUrl } from '../config/constants'

const glassCard = 'rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]'
const btnHolographic =
  'bg-[var(--accent-active)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 inline-flex items-center'

const WAY_IDS = ['issues', 'prs', 'docs', 'translations']
const WAY_ICONS = { issues: Bug, prs: GitPullRequest, docs: BookOpen, translations: Globe }
const WAY_HREFS = {
  issues: 'https://github.com/kitsboy/satohash/issues',
  prs: 'https://github.com/kitsboy/satohash/pulls',
  docs: 'https://github.com/kitsboy/satohash/tree/main/docs',
  translations: 'https://github.com/kitsboy/satohash/tree/main/src/i18n/translations'
}

const Contribute = () => {
  usePageMeta({ page: 'contribute' })
  const { t } = useTranslation()

  const ways = useMemo(
    () =>
      WAY_IDS.map((id) => ({
        id,
        icon: WAY_ICONS[id],
        title: t(`contributePage.ways.${id}.title`),
        description: t(`contributePage.ways.${id}.description`),
        cta: t(`contributePage.ways.${id}.cta`),
        href: WAY_HREFS[id]
      })),
    [t]
  )

  const bountyItems = useMemo(
    () => t('contributePage.bounties.items', { returnObjects: true }),
    [t]
  )

  return (
    <div className="from-bg-primary to-bg-secondary min-h-screen bg-gradient-to-br p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl space-y-8"
      >
        <div className="text-center">
          <h1 className="mx-auto mb-4 flex items-center justify-center text-4xl font-bold">
            <Award className="text-accent-active mr-4 h-12 w-12" />
            {t('contributePage.hero.title')}
          </h1>
          <p className="text-text-secondary text-xl">{t('contributePage.hero.subtitle')}</p>
        </div>

        <motion.div className={glassCard + ' p-6'}>
          <h2 className="mb-4 text-2xl font-semibold">{t('contributePage.waysTitle')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {ways.map((way) => {
              const Icon = way.icon
              return (
                <div key={way.id} className="bg-surface-raised flex flex-col gap-3 rounded-lg p-5">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-[var(--accent-gold)]" />
                    <h3 className="font-medium">{way.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{way.description}</p>
                  <a
                    href={way.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={btnHolographic + ' mt-auto self-start'}
                  >
                    {way.cta} <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
              )
            })}
          </div>
        </motion.div>

        <motion.div className={glassCard + ' p-6'}>
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <Code2 className="h-6 w-6 text-[var(--accent-teal)]" />
            {t('contributePage.devSetup.title')}
          </h2>
          <ol className="space-y-3 text-sm">
            <li>
              1. {t('contributePage.devSetup.steps.0')}{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">
                git clone https://github.com/yourusername/satohash.git
              </code>
            </li>
            <li>
              2. {t('contributePage.devSetup.steps.1')}{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">npm install</code>
            </li>
            <li>
              3. {t('contributePage.devSetup.steps.2')}{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">npm run dev</code> (Vite +
              Express on :3001)
            </li>
            <li>
              4. {t('contributePage.devSetup.steps.3')}{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">npm run lint:server</code>{' '}
              and <code className="rounded bg-[var(--bg-primary)] px-2 py-1">npm test</code>
            </li>
            <li>
              5. {t('contributePage.devSetup.steps.4')}{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">
                git checkout -b feat/your-feature
              </code>
            </li>
            <li>6. {t('contributePage.devSetup.steps.5')}</li>
          </ol>
        </motion.div>

        <motion.div className={glassCard + ' p-6'}>
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <TestTube className="h-6 w-6 text-[var(--accent-success)]" />
            {t('contributePage.bounties.title')}
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            {bountyItems.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
          <a
            href="https://github.com/kitsboy/satohash/issues?q=is%3Aissue+is%3Aopen+label%3Ahelp-wanted"
            target="_blank"
            rel="noopener noreferrer"
            className={btnHolographic + ' mt-4 inline-flex items-center'}
          >
            {t('contributePage.bounties.cta')} <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </motion.div>

        <motion.div className={glassCard + ' p-6 text-center'}>
          <h2 className="mb-4 text-2xl font-semibold">{t('contributePage.why.title')}</h2>
          <p className="mb-6 text-lg text-[var(--text-secondary)]">
            {t('contributePage.why.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/kitsboy/satohash" className={btnHolographic}>
              {t('contributePage.why.github')} <ExternalLink className="ml-2 h-4 w-4" />
            </a>
            <a
              href={`${getPublicBaseUrl()}/developer`}
              className="btn-secondary inline-flex items-center rounded-lg border border-[var(--border)] px-4 py-2"
            >
              {t('contributePage.why.apiDocs')}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Contribute

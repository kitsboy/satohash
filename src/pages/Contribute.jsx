import React from 'react'
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

const glassCard = 'rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]'
const btnHolographic =
  'bg-[var(--accent-active)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 inline-flex items-center'

const WAYS_TO_CONTRIBUTE = [
  {
    icon: Bug,
    title: 'Report Issues',
    description:
      'Found a bug or have a feature idea? Open a GitHub issue with steps to reproduce and expected behavior.',
    href: 'https://github.com/kitsboy/satohash/issues',
    cta: 'Open Issues'
  },
  {
    icon: GitPullRequest,
    title: 'Submit Pull Requests',
    description:
      'Fix bugs, improve docs, add translations, or harden security. All contributions welcome — no CLA required.',
    href: 'https://github.com/kitsboy/satohash/pulls',
    cta: 'View PRs'
  },
  {
    icon: BookOpen,
    title: 'Improve Documentation',
    description:
      'Help refine architecture docs, API examples, and onboarding guides in the docs/ folder.',
    href: 'https://github.com/kitsboy/satohash/tree/main/docs',
    cta: 'Browse Docs'
  },
  {
    icon: Globe,
    title: 'Add Translations',
    description:
      'Satohash supports EN, ES, FR, DE, PT, SW, and ZH. Add or improve strings in src/i18n/translations/.',
    href: 'https://github.com/kitsboy/satohash/tree/main/src/i18n/translations',
    cta: 'Translation Files'
  }
]

const Contribute = () => {
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
            Contribute to Satohash
          </h1>
          <p className="text-text-secondary text-xl">
            Open-source Bitcoin notarization — built by the community, for sovereign truth.
          </p>
        </div>

        <motion.div className={glassCard + ' p-6'}>
          <h2 className="mb-4 text-2xl font-semibold">Ways to Contribute</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {WAYS_TO_CONTRIBUTE.map((way) => {
              const Icon = way.icon
              return (
                <div
                  key={way.title}
                  className="bg-surface-raised flex flex-col gap-3 rounded-lg p-5"
                >
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
            Development Setup
          </h2>
          <ol className="space-y-3 text-sm">
            <li>
              1. Fork and clone:{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">
                git clone https://github.com/yourusername/satohash.git
              </code>
            </li>
            <li>
              2. Install:{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">npm install</code>
            </li>
            <li>
              3. Run dev:{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">npm run dev</code> (Vite +
              Express on :3001)
            </li>
            <li>
              4. Lint & test:{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">npm run lint:server</code>{' '}
              and <code className="rounded bg-[var(--bg-primary)] px-2 py-1">npm test</code>
            </li>
            <li>
              5. Branch:{' '}
              <code className="rounded bg-[var(--bg-primary)] px-2 py-1">
                git checkout -b feat/your-feature
              </code>
            </li>
            <li>6. Open a Pull Request with a clear description and screenshots if UI changes.</li>
          </ol>
        </motion.div>

        <motion.div className={glassCard + ' p-6'}>
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
            <TestTube className="h-6 w-6 text-[var(--accent-success)]" />
            Bounties & High-Impact Areas
          </h2>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>• Server security hardening and test coverage</li>
            <li>• OpenTimestamps upgrade daemon reliability</li>
            <li>• Nostr relay integration and NIP-05 verification</li>
            <li>• Accessibility (ARIA, keyboard nav) and mobile UX</li>
            <li>• i18n strings for new locales (pt, sw, ar)</li>
          </ul>
          <a
            href="https://github.com/kitsboy/satohash/issues?q=is%3Aissue+is%3Aopen+label%3Ahelp-wanted"
            target="_blank"
            rel="noopener noreferrer"
            className={btnHolographic + ' mt-4 inline-flex items-center'}
          >
            Help Wanted Issues <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </motion.div>

        <motion.div className={glassCard + ' p-6 text-center'}>
          <h2 className="mb-4 text-2xl font-semibold">Why Contribute?</h2>
          <p className="mb-6 text-lg text-[var(--text-secondary)]">
            Satohash anchors truth to Bitcoin — tamper-proof, permissionless, and free. Your code
            helps defend digital provenance in an era of AI-generated content and deepfakes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/kitsboy/satohash" className={btnHolographic}>
              GitHub Repo <ExternalLink className="ml-2 h-4 w-4" />
            </a>
            <a
              href="https://satohash.giveabit.io/developer"
              className="btn-secondary inline-flex items-center rounded-lg border border-[var(--border)] px-4 py-2"
            >
              API Docs
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Contribute

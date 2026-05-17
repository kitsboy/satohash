import React from 'react'
import { ExternalLink, Award } from 'lucide-react'
import { motion } from 'framer-motion'

const glassCard = 'rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]'
const btnHolographic =
  'bg-[var(--accent-active)] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all duration-200 inline-flex items-center'

const Contribute = () => {
  return (
    <div className="from-bg-primary to-bg-secondary min-h-screen bg-gradient-to-br p-4">
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
            Join the open-source revolution in cryptographic notarization
          </p>
        </div>

        <motion.div className={glassCard + ' p-6'}>
          <h2 className="mb-4 text-2xl font-semibold">Get Involved</h2>
          <div className="space-y-4">
            <div className="bg-surface-raised flex items-center space-x-4 rounded-lg p-4">
              <Award className="h-6 w-6 text-[var(--accent-purple)]" />
              <div>
                <h3 className="font-medium">GitHub Issues</h3>
                <p>Browse and tackle open issues to help build Satohash.</p>
                <a
                  href="https://github.com/satohash/protocol/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnHolographic + ' mt-2 inline-flex items-center'}
                >
                  View Issues <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="bg-surface-raised flex items-center space-x-4 rounded-lg p-4">
              <Award className="text-accent-success h-6 w-6" />
              <div>
                <h3 className="font-medium">Bounties & Rewards</h3>
                <p>
                  Earn bounties for solving high-impact issues. Check labeled bounties on GitHub.
                </p>
                <a
                  href="https://github.com/satohash/protocol/issues?q=is%3Aissue+is%3Aopen+label%3Abounty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnHolographic + ' mt-2 inline-flex items-center'}
                >
                  Active Bounties <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="bg-surface-raised rounded-lg p-4">
              <h3 className="mb-2 font-medium">Development Guide</h3>
              <ul className="space-y-2 text-sm">
                <li>1. Fork the repo on GitHub</li>
                <li>
                  2. Clone your fork:{' '}
                  <code>git clone https://github.com/yourusername/protocol.git</code>
                </li>
                <li>
                  3. Install dependencies: <code>npm install</code>
                </li>
                <li>
                  4. Run dev server: <code>npm run dev</code>
                </li>
                <li>
                  5. Create a feature branch: <code>git checkout -b feat/your-feature</code>
                </li>
                <li>
                  6. Commit changes and push: <code>git push origin feat/your-feature</code>
                </li>
                <li>7. Open a Pull Request!</li>
              </ul>
              <p className="text-text-secondary mt-4 text-sm">
                Follow our{' '}
                <a href="/code-of-conduct" className="underline">
                  Code of Conduct
                </a>{' '}
                and{' '}
                <a href="/contributing" className="underline">
                  Contributing Guidelines
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div className={glassCard + ' p-6 text-center'}>
          <h2 className="mb-4 text-2xl font-semibold">Why Contribute?</h2>
          <p className="mb-6 text-lg">
            Help secure the future of digital notarization. Your contributions power tamper-proof
            proofs on Bitcoin for everyone.
          </p>
          <div className="flex justify-center space-x-4">
            <button className={btnHolographic}>Start Contributing</button>
            <a
              href="https://github.com/satohash/protocol"
              className="btn-secondary inline-flex items-center"
            >
              GitHub Repo <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Contribute

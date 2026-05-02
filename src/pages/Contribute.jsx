import React from 'react';
import { ExternalLink, GitHub, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { glassCard, btnHolographic } from '../../index.css'; // Adjust import if needed

const Contribute = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary to-bg-secondary p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center mx-auto">
            <Award className="w-12 h-12 mr-4 text-accent-active" />
            Contribute to Satohash
          </h1>
          <p className="text-xl text-text-secondary">Join the open-source revolution in cryptographic notarization</p>
        </div>

        <motion.div className={glassCard + ' p-6'}>
          <h2 className="text-2xl font-semibold mb-4">Get Involved</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-surface-raised rounded-lg">
              <GitHub className="w-6 h-6 text-accent-purple" />
              <div>
                <h3 className="font-medium">GitHub Issues</h3>
                <p>Browse and tackle open issues to help build Satohash.</p>
                <a
                  href="https://github.com/satohash/protocol/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnHolographic + ' mt-2 inline-flex items-center'}
                >
                  View Issues <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-surface-raised rounded-lg">
              <Award className="w-6 h-6 text-accent-success" />
              <div>
                <h3 className="font-medium">Bounties & Rewards</h3>
                <p>Earn bounties for solving high-impact issues. Check labeled bounties on GitHub.</p>
                <a
                  href="https://github.com/satohash/protocol/issues?q=is%3Aissue+is%3Aopen+label%3Abounty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={btnHolographic + ' mt-2 inline-flex items-center'}
                >
                  Active Bounties <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            <div className="p-4 bg-surface-raised rounded-lg">
              <h3 className="font-medium mb-2">Development Guide</h3>
              <ul className="space-y-2 text-sm">
                <li>1. Fork the repo on GitHub</li>
                <li>2. Clone your fork: <code>git clone https://github.com/yourusername/protocol.git</code></li>
                <li>3. Install dependencies: <code>npm install</code></li>
                <li>4. Run dev server: <code>npm run dev</code></li>
                <li>5. Create a feature branch: <code>git checkout -b feat/your-feature</code></li>
                <li>6. Commit changes and push: <code>git push origin feat/your-feature</code></li>
                <li>7. Open a Pull Request!</li>
              </ul>
              <p className="mt-4 text-sm text-text-secondary">Follow our <a href="/code-of-conduct" className="underline">Code of Conduct</a> and <a href="/contributing" className="underline">Contributing Guidelines</a>.</p>
            </div>
          </div>
        </motion.div>

        <motion.div className={glassCard + ' p-6 text-center'}>
          <h2 className="text-2xl font-semibold mb-4">Why Contribute?</h2>
          <p className="text-lg mb-6">Help secure the future of digital notarization. Your contributions power tamper-proof proofs on Bitcoin for everyone.</p>
          <div className="flex justify-center space-x-4">
            <button className={btnHolographic}>
              Start Contributing
            </button>
            <a href="https://github.com/satohash/protocol" className="btn-secondary inline-flex items-center">
              GitHub Repo <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contribute;
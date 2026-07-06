import { Link } from 'react-router-dom'
import {
  Shield, Lock, Eye, Server, ArrowLeft, CheckCircle,
  FileText, Github, Key, Download
} from 'lucide-react'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

export default function Security() {
  usePageMeta({
    title: 'Security — Satohash',
    description: 'Zero-knowledge architecture, client-side hashing, open source. Learn how Satohash keeps your documents private and your proofs valid.'
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link to="/trust" className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            <ArrowLeft size={16} /> Trust Center
          </Link>
        </div>
      </header>

      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <Shield size={32} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            <span className="text-[var(--accent-gold)]">Security</span> at Satohash
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Zero-knowledge architecture, client-side hashing, open-source code. Your documents never leave your device.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-8">
          {[
            {
              icon: Lock, title: 'Zero-Knowledge Architecture',
              body: 'Your documents are hashed entirely in your browser using the Web Crypto API. Only the SHA-256 fingerprint — a 64-character hexadecimal string — is transmitted. Neither Satohash nor any third party ever sees your original file content.',
              items: ['Client-side SHA-256 hashing via Web Crypto API', 'Documents never uploaded to any server', 'No account required for basic stamping', 'No data retention of file contents']
            },
            {
              icon: Eye, title: 'Privacy by Design',
              body: 'Satohash is built on the principle of privacy first. There are no tracking cookies, no analytics scripts that fingerprint users, and no data mining.',
              items: ['No analytics or tracking scripts', 'No cookies for non-essential functions', 'Local storage only for user preferences', 'Open-source — verified by the community']
            },
            {
              icon: Server, title: 'Infrastructure Security',
              body: 'The Satohash API server runs with production-grade security configurations including Helmet.js headers, rate limiting, CORS policies, and encrypted database storage.',
              items: ['Helmet.js security headers (CSP, HSTS, XFO)', 'Rate limiting on all API endpoints', 'CORS restricted to authorized origins', 'SQLite database with encrypted WAL mode', 'Redis with optional authentication']
            },
            {
              icon: Key, title: 'Authentication & Access',
              body: 'Admin access requires JWT tokens signed with a server-side secret. API keys are hashed before storage and can be rotated independently.',
              items: ['JWT-based admin authentication (24h expiry)', 'Scoped API keys with granular permissions', 'Rate-limited login attempts', 'Session tokens stored in localStorage only']
            },
            {
              icon: Github, title: 'Open Source Assurance',
              body: 'The full Satohash source code is publicly available on GitHub under the MIT license. Anyone can audit, fork, or self-host.',
              items: ['MIT-licensed open source', 'Public GitHub repository', 'Community code review', 'Self-hosting supported via Docker']
            }
          ].map((section, i) => {
            const Icon = section.icon
            return (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10">
                    <Icon size={24} className="text-[var(--accent-gold)]" />
                  </div>
                  <h2 className="text-xl font-black text-[var(--text-primary)]">{section.title}</h2>
                </div>
                <p className="mb-5 text-sm leading-relaxed text-[var(--text-secondary)]">{section.body}</p>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                      <CheckCircle size={14} className="mt-0.5 shrink-0 text-[var(--accent-success)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Vulnerability Disclosure */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <Lock size={24} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">Vulnerability Disclosure</h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            If you discover a security vulnerability, please report it responsibly.
            We commit to acknowledging receipt within 48 hours and issuing a fix within 7 days.
          </p>
          <a href="mailto:security@giveabit.io?subject=Satohash Security Report"
             className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black text-black uppercase tracking-wider transition-all hover:bg-[var(--accent-gold)]/90">
            <FileText size={16} /> Report Vulnerability
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}

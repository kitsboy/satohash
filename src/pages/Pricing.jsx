import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Check, Zap, Briefcase, Globe, ArrowRight, HelpCircle,
  Mail, Server, Shield, TrendingUp
} from 'lucide-react'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Stamp documents on Bitcoin. No account required.',
    features: [
      'SHA-256 hashing in your browser',
      'OpenTimestamps calendar anchoring',
      'Downloadable .ots proof files',
      'Verify any proof, anywhere',
      'Browser-based — nothing to install'
    ],
    cta: 'Stamp a File',
    to: '/',
    highlighted: false
  },
  {
    name: 'Premium',
    price: 'TBD',
    period: 'per month',
    desc: 'Volume stamping, Lightning payments, and priority anchoring.',
    features: [
      'Everything in Free, plus:',
      'BOLT-12 Lightning payment integration',
      'Priority calendar submission',
      'Batch stamping (up to 100 files)',
      'Multi-party contract co-signing',
      'PDF export with embedded proof'
    ],
    cta: 'Coming Soon',
    to: '/',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    desc: 'Dedicated infrastructure, SLA, and custom integrations.',
    features: [
      'Everything in Premium, plus:',
      'Dedicated OTS calendar node',
      'Private API endpoint',
      'Custom webhook integrations',
      'SLA-backed proof generation',
      'On-premise deployment option',
      'Priority support + dedicated engineer'
    ],
    cta: 'Contact Sales',
    to: 'mailto:hello@giveabit.io?subject=Satohash Enterprise',
    highlighted: false
  }
]

export default function Pricing() {
  usePageMeta({
    title: 'Pricing — Satohash',
    description: 'Free Bitcoin document timestamping. Premium and Enterprise plans for volume stamping, Lightning payments, and dedicated infrastructure.'
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/" className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            <ArrowRight size={16} className="rotate-180" /> Satohash
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            Simple Pricing
          </p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Proof of Existence, <span className="text-[var(--accent-gold)]">For Everyone</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Start free. Scale when you need more. No lock-in, no hidden fees, no account required for basic use.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 transition-all hover:shadow-[0_0_40px_var(--accent-gold-glow)] ${
                tier.highlighted
                  ? 'border-[var(--accent-gold)] bg-[var(--surface-raised)]'
                  : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent-gold)]'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--accent-gold)] px-4 py-1 text-[10px] font-black text-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-6 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  tier.highlighted ? 'bg-[var(--accent-gold)]/10' : 'bg-[var(--bg-secondary)]'
                }`}>
                  {i === 0 ? <Zap size={20} className="text-[var(--accent-gold)]" /> :
                   i === 1 ? <TrendingUp size={20} className="text-[var(--accent-gold)]" /> :
                   <Briefcase size={20} className="text-[var(--accent-gold)]" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">{tier.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    <span className="text-2xl font-black text-[var(--text-primary)]">{tier.price}</span>
                    {tier.price !== 'Custom' && <span className="ml-1">/{tier.period}</span>}
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm text-[var(--text-secondary)]">{tier.desc}</p>

              <ul className="mb-8 space-y-3">
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                    <Check size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
                    {feat}
                  </li>
                ))}
              </ul>

              {tier.to.startsWith('mailto') ? (
                <a
                  href={tier.to}
                  className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                    tier.highlighted
                      ? 'bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold)]/90'
                      : 'border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
                  }`}
                >
                  {tier.cta} <ArrowRight size={16} />
                </a>
              ) : (
                <Link
                  to={tier.to}
                  className={`flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                    tier.highlighted
                      ? 'bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold)]/90'
                      : 'border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
                  }`}
                >
                  {tier.cta} <ArrowRight size={16} />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-2xl font-black text-[var(--text-primary)]">
            Full Feature Comparison
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="p-4 font-bold text-[var(--text-primary)]">Feature</th>
                  <th className="p-4 text-center font-bold text-[var(--accent-gold)]">Free</th>
                  <th className="p-4 text-center font-bold text-[var(--accent-gold)]">Premium</th>
                  <th className="p-4 text-center font-bold text-[var(--accent-gold)]">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Bitcoin-anchored proofs', 'Yes', 'Yes', 'Yes'],
                  ['Browser-based hashing', 'Yes', 'Yes', 'Yes'],
                  ['OTS proof download', 'Yes', 'Yes', 'Yes'],
                  ['Free calendar anchoring', 'Up to 10/month', 'Unlimited', 'Unlimited'],
                  ['Multi-party signing', '—', 'Yes', 'Yes'],
                  ['BOLT-12 Lightning payments', '—', 'Yes', 'Yes'],
                  ['API access', '—', 'Yes', 'Yes'],
                  ['Webhook notifications', '—', 'Yes', 'Yes'],
                  ['Batch stamping', '—', 'Up to 100', 'Unlimited'],
                  ['Dedicated OTS calendar', '—', '—', 'Yes'],
                  ['SLA guarantee', '—', '—', '99.9%'],
                  ['On-premise deployment', '—', '—', 'Yes'],
                  ['Priority support', 'Community', 'Email', '24/7 Dedicated']
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-[var(--border)] ${
                    i % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)]'
                  }`}>
                    {row.map((cell, j) => (
                      <td key={j} className={`p-4 text-xs ${
                        j === 0
                          ? 'font-bold text-[var(--text-primary)]'
                          : cell === 'Yes'
                          ? 'text-center text-[var(--accent-success)]'
                          : cell === '—'
                          ? 'text-center text-[var(--text-tertiary)]'
                          : 'text-center text-[var(--text-secondary)]'
                      }`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <HelpCircle size={24} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">Have Questions About Pricing?</h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">Check our FAQ for common questions or reach out directly.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/faq" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--border)] px-6 text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider transition-all hover:border-[var(--accent-gold)]">
              View FAQ <HelpCircle size={14} />
            </Link>
            <a href="mailto:hello@giveabit.io?subject=Satohash Pricing" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[var(--border)] px-6 text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider transition-all hover:border-[var(--accent-gold)]">
              Contact Sales <Mail size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 text-center">
          {[
            { icon: Shield, text: 'Bitcoin Secured' },
            { icon: Server, text: 'Open Source' },
            { icon: Globe, text: 'No Vendor Lock-in' },
            { icon: Zap, text: 'Zero-Knowledge' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--text-tertiary)] uppercase">
              <item.icon size={16} className="text-[var(--accent-gold)]" />
              {item.text}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

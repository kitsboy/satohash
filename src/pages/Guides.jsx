import { Link } from 'react-router-dom'
import { BookOpen, ArrowRight, ArrowLeft, Shield, FileText, Zap, Globe } from 'lucide-react'

const GUIDES = [
  {
    id: 'what-is-cryptographic-proof',
    icon: Shield,
    title: 'What Is a Cryptographic Proof?',
    desc: 'Understand how SHA-256 hashes, Merkle trees, and blockchain timestamps create mathematical certainty about when a document existed.',
    readTime: '5 min'
  },
  {
    id: 'how-opentimestamps-works',
    icon: Zap,
    title: 'How OpenTimestamps Works',
    desc: 'The protocol that makes free Bitcoin timestamping possible. Learn about OTS calendars, Merkle trees, and block commitment.',
    readTime: '7 min'
  },
  {
    id: 'ots-vs-traditional-notary',
    icon: FileText,
    title: 'OTS vs Traditional Notarization',
    desc: 'Compare cryptographic timestamping with conventional notary services, e-notary platforms, and blockchain alternatives.',
    readTime: '4 min'
  },
  {
    id: 'why-bitcoin-for-truth',
    icon: Globe,
    title: 'Why Bitcoin Is the Ultimate Truth Layer',
    desc: 'Bitcoin is not just money — it is the most secure, decentralized timestamping network ever created. Here is why that matters for proof of existence.',
    readTime: '6 min'
  }
]

export default function Guides() {
  usePageMeta({
    title: 'Educational Guides — Satohash',
    description: 'Learn how cryptographic proofs, OpenTimestamps, and Bitcoin create verifiable truth. Guides for beginners and experts.'
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/" className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            <ArrowLeft size={16} /> Home
          </Link>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">Educational Guides</p>
        </div>
      </header>

      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <BookOpen size={28} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Learn How <span className="text-[var(--accent-gold)]">Proof Works</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Understand the cryptography, protocols, and philosophy behind Bitcoin-anchored proof of existence.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {GUIDES.map(guide => {
            const Icon = guide.icon
            return (
              <div
                key={guide.id}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-all hover:border-[var(--accent-gold)] hover:shadow-[0_0_30px_var(--accent-gold-glow)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10">
                  <Icon size={22} className="text-[var(--accent-gold)]" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-gold)]">
                    {guide.title}
                  </h3>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {guide.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[var(--text-tertiary)]">{guide.readTime} read</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[var(--accent-gold)] uppercase">
                    Read <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">More Coming Soon</h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Guides on NIP-05 identity, BOLT-12 Lightning, multi-party contracts, and advanced verification techniques are in development.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold tracking-wider uppercase">
            <Link to="/faq" className="text-[var(--accent-gold)] hover:underline">FAQ</Link>
            <Link to="/glossary" className="text-[var(--accent-gold)] hover:underline">Glossary</Link>
            <Link to="/comparison" className="text-[var(--accent-gold)] hover:underline">Compare</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

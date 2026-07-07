import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, Search, ArrowLeft, HelpCircle, BookOpen, Mail } from 'lucide-react'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const FAQS = [
  {
    q: 'What is Satohash?',
    a: 'Satohash is a free, open-source tool that lets you prove any digital document, photo, contract, or AI output existed at a specific moment by locking a cryptographic fingerprint into the Bitcoin blockchain using OpenTimestamps.'
  },
  {
    q: 'Do my documents leave my device?',
    a: 'No. Only a SHA-256 cryptographic hash — a short fingerprint — is sent to the network. Your actual file never leaves your browser. This is zero-knowledge by design.'
  },
  {
    q: 'How much does it cost?',
    a: 'Basic Bitcoin timestamping is completely free. No account, no credit card, no subscription. Premium features (BOLT-12 Lightning payments, API access) are in development.'
  },
  {
    q: 'Is the proof legally valid?',
    a: 'Bitcoin timestamps are cryptographically verifiable and have been accepted in legal proceedings. The proof is compliant with ESIGN Act standards and compatible with eIDAS regulations. Consult qualified counsel for your jurisdiction.'
  },
  {
    q: 'What is OpenTimestamps (OTS)?',
    a: 'OpenTimestamps is a protocol that creates a Merkle tree of many document hashes and anchors the root in a single Bitcoin transaction. This makes timestamping virtually free while maintaining full Bitcoin security.'
  },
  {
    q: 'What happens if Satohash shuts down?',
    a: 'Your proofs survive independently. The .ots proof file is self-contained and can be verified by anyone using the open-source ots tool, even if Satohash disappears tomorrow.'
  },
  {
    q: 'Do I need a Bitcoin wallet?',
    a: 'No. For basic timestamping, Satohash handles everything. For premium features like Lightning payments, you may need a compatible wallet for settlement.'
  },
  {
    q: 'What types of files can I stamp?',
    a: 'Any digital file: PDFs, images, videos, audio, source code, AI outputs, contracts, emails, web pages. If it is a file, Satohash can hash it.'
  },
  {
    q: 'How long does stamping take?',
    a: 'The hash is generated instantly in your browser. The OTS calendar commits periodically to Bitcoin blocks. Most proofs are anchored within a few hours, and you get a verification link immediately.'
  },
  {
    q: 'What is NIP-05 / Nostr integration?',
    a: 'NIP-05 links a human-readable name (like kimi@giveabit.io) to a Nostr cryptographic key. This allows verifiable communication and identity for contract signers across the decentralized Nostr protocol.'
  },
  {
    q: 'Can I use Satohash from an API?',
    a: 'Yes. Satohash provides a REST API for programmatic stamping and verification. API key management is available for developers. Webhooks notify your app when proofs complete.'
  },
  {
    q: 'What is a SHA-256 hash?',
    a: 'A SHA-256 hash is a 64-character hexadecimal fingerprint unique to your file. Even changing one pixel in an image produces a completely different hash. It is a mathematical identifier, not the file itself.'
  },
  {
    q: 'Is Satohash open source?',
    a: 'Yes. Satohash is MIT-licensed and available on GitHub at github.com/kitsboy/satohash. The full source code is public.'
  },
  {
    q: 'What is the Satohash Snapper?',
    a: 'The Satohash Snapper is a browser extension that captures web page evidence. Take a snapshot of any webpage, and the extension stamps its hash and metadata to Bitcoin for verifiable proof of its state at that moment.'
  }
]

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'basics', label: 'Basics' },
  { id: 'technical', label: 'Technical' },
  { id: 'legal', label: 'Legal' },
  { id: 'usage', label: 'Usage' }
]

const CATEGORY_MAP = {
  'What is Satohash?': 'basics',
  'Do my documents leave my device?': 'basics',
  'How much does it cost?': 'basics',
  'Is the proof legally valid?': 'legal',
  'What is OpenTimestamps (OTS)?': 'technical',
  'What happens if Satohash shuts down?': 'basics',
  'Do I need a Bitcoin wallet?': 'usage',
  'What types of files can I stamp?': 'usage',
  'How long does stamping take?': 'usage',
  'What is NIP-05 / Nostr integration?': 'technical',
  'Can I use Satohash from an API?': 'technical',
  'What is a SHA-256 hash?': 'technical',
  'Is Satohash open source?': 'basics',
  'What is the Satohash Snapper?': 'usage'
}

export default function FAQ() {
  usePageMeta({ page: 'faq' })

  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = FAQS.filter((faq) => {
    const matchesSearch =
      !searchQuery ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    const cat = CATEGORY_MAP[faq.q] || 'basics'
    const matchesCategory = activeCategory === 'all' || cat === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4">
          <Link
            to="/"
            className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
            <ArrowLeft size={16} /> Satohash
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            Questions? We Have Answers.
          </p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Frequently Asked <span className="text-[var(--accent-gold)]">Questions</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Everything you need to know about Bitcoin-anchored proof of existence, OpenTimestamps,
            and the Satohash protocol.
          </p>
          {/* Search */}
          <div className="relative mx-auto max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--text-tertiary)]"
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] pr-4 pl-11 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] transition-colors outline-none focus:border-[var(--accent-gold)]"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/50 px-6 py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`min-h-[36px] rounded-lg px-4 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
                activeCategory === cat.id
                  ? 'bg-[var(--accent-gold)] text-black'
                  : 'border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ List */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <HelpCircle size={48} className="mx-auto mb-4 text-[var(--text-tertiary)]" />
            <p className="text-lg font-bold text-[var(--text-primary)]">No questions found</p>
            <p className="text-sm text-[var(--text-secondary)]">
              Try different keywords or check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((faq, i) => {
              const isOpen = openIndex === i
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'border-[var(--accent-gold)] bg-[var(--surface-raised)]'
                      : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--border-bright)]'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={'faq-' + i}
                    className="flex min-h-[56px] w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-[var(--text-primary)]">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[var(--text-tertiary)] transition-transform ${
                        isOpen ? 'rotate-180 text-[var(--accent-gold)]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div id={'faq-' + i} className="border-t border-[var(--border)] px-6 py-4">
                      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* Still Have Questions */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-gold)]/10">
            <Mail size={24} className="text-[var(--accent-gold)]" />
          </div>
          <h2 className="mb-3 text-2xl font-black text-[var(--text-primary)]">
            Still Have Questions?
          </h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            Reach out to the team. We typically respond within 24 hours.
          </p>
          <a
            href="mailto:hello@giveabit.io?subject=Satohash Question"
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90"
          >
            Ask a Question <Mail size={16} />
          </a>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-[var(--border)] px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold tracking-wider uppercase">
            <Link
              to="/templates"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
            >
              <BookOpen size={14} className="mr-1.5 inline" /> Browse Templates
            </Link>
            <Link
              to="/pitch"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
            >
              <BookOpen size={14} className="mr-1.5 inline" /> Read the Pitch
            </Link>
            <Link
              to="/trust"
              className="text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-gold)]"
            >
              <BookOpen size={14} className="mr-1.5 inline" /> Trust Center
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

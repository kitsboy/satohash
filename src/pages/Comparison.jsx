import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X as XIcon, ArrowLeft, FileText, Download, ExternalLink } from 'lucide-react'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const COMPARISON = [
  { feature: 'Zero-knowledge (file never leaves device)', satohash: true, docuSign: false, eth: true, diyOTS: true },
  { feature: 'Bitcoin-anchored', satohash: true, docuSign: false, eth: false, diyOTS: true },
  { feature: 'Free for basic use', satohash: true, docuSign: false, eth: true, diyOTS: true },
  { feature: 'No account required', satohash: true, docuSign: false, eth: true, diyOTS: true },
  { feature: 'No gas / transaction fees', satohash: true, docuSign: false, eth: false, diyOTS: true },
  { feature: 'UI for non-developers', satohash: true, docuSign: true, eth: false, diyOTS: false },
  { feature: 'Multi-party co-signing', satohash: true, docuSign: true, eth: true, diyOTS: false },
  { feature: 'Nostr identity (NIP-05)', satohash: true, docuSign: false, eth: false, diyOTS: false },
  { feature: 'BOLT-12 Lightning payments', satohash: true, docuSign: false, eth: false, diyOTS: false },
  { feature: 'Court-admissible format', satohash: true, docuSign: true, eth: false, diyOTS: false },
  { feature: 'Proofs survive company shutdown', satohash: true, docuSign: false, eth: true, diyOTS: true },
  { feature: 'Browser extension (Snapper)', satohash: true, docuSign: false, eth: false, diyOTS: false },
  { feature: 'Developer API + webhooks', satohash: true, docuSign: true, eth: true, diyOTS: false },
  { feature: 'Monthly cost', satohash: '$0', docuSign: '$10-300', eth: 'Variable gas', diyOTS: '$0' }
]

const COLUMNS = [
  { key: 'satohash', label: 'Satohash', color: 'var(--accent-gold)' },
  { key: 'docuSign', label: 'DocuSign', color: 'var(--text-secondary)' },
  { key: 'eth', label: 'Ethereum dApps', color: 'var(--text-secondary)' },
  { key: 'diyOTS', label: 'DIY OpenTimestamps', color: 'var(--text-secondary)' }
]

export default function Comparison() {
  usePageMeta({
    title: 'Satohash vs Alternatives — Comparison',
    description: 'Honest comparison: Satohash vs DocuSign, Ethereum dApps, and DIY OpenTimestamps. See how Bitcoin stacks up for proof of existence.'
  })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link to="/pitch" className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]">
            <ArrowLeft size={16} /> Pitch
          </Link>
        </div>
      </header>

      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-[11px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">Technology Comparison</p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            How Satohash <span className="text-[var(--accent-gold)]">Stacks Up</span>
          </h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Honest comparison across the main alternatives for document timestamping and proof of existence.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="w-1/3 p-4 font-bold text-[var(--text-primary)]">Feature</th>
                  {COLUMNS.map(col => (
                    <th key={col.key} className="p-4 text-center font-bold" style={{ color: col.color }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={`border-b border-[var(--border)] ${i % 2 === 0 ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)]'}`}>
                    <td className="p-4 text-xs font-bold text-[var(--text-primary)]">{row.feature}</td>
                    {['satohash', 'docuSign', 'eth', 'diyOTS'].map(key => {
                      const val = row[key]
                      return (
                        <td key={key} className="p-4 text-center text-xs">
                          {val === true ? (
                            <Check size={16} className="mx-auto text-[var(--accent-success)]" />
                          ) : val === false ? (
                            <XIcon size={16} className="mx-auto text-[var(--text-tertiary)]" />
                          ) : (
                            <span className="text-[var(--text-secondary)]">{val}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <FileText size={24} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">Download the Full Pitch Deck</h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">Executive summary PDF with market analysis, technology deep-dive, and roadmap.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/Satohash_Executive_Pitch.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black text-black uppercase tracking-wider transition-all hover:bg-[var(--accent-gold)]/90"
            >
              <Download size={16} /> Download PDF
            </a>
            <Link
              to="/pitch"
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl border border-[var(--border)] px-8 text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider transition-all hover:border-[var(--accent-gold)] hover:text-[var(--text-primary)]"
            >
              View Online <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

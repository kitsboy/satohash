import { Link } from 'react-router-dom'
import { Shield, Fingerprint, Globe, FileCheck, Scale, ArrowRight } from 'lucide-react'
import Footer from '../../components/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import GiveABitBadge from '../../components/GiveABitBadge'

const USE_CASES = [
  {
    title: 'Passport & travel programs',
    body: 'MotoPass hashes application payloads client-side; Satohash anchors fingerprints to Bitcoin without uploading biometrics.',
    link: '/motopass-verify'
  },
  {
    title: 'Distressed sovereign assets',
    body: 'Listings carry content hashes and optional .ots proofs for cross-border trade transparency.',
    link: '/distressed-asset'
  },
  {
    title: 'Chain of custody',
    body: 'Holder → witness → agency workflow with timestamped handoff records.',
    link: '/chain-of-custody'
  },
  {
    title: 'Evidence admissibility',
    body: 'Jurisdiction matrix for hash-based evidence (UETA, eIDAS, UK, Seychelles).',
    link: '/evidence-admissibility'
  }
]

export default function GovernmentUse() {
  usePageMeta({ page: 'government' })

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
            ← Trust Center
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 text-center">
        <Shield size={36} className="mx-auto mb-4" style={{ color: 'var(--accent-gold)' }} />
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Government & <span style={{ color: 'var(--accent-gold)' }}>Diplomatic Use</span>
        </h1>
        <p
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Zero-knowledge timestamps for passports, national IDs, land titles, and distressed-asset
          programs. Documents never leave the device — only SHA-256 fingerprints reach
          OpenTimestamps calendars.
        </p>
        <GiveABitBadge className="mt-6 justify-center" />
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-2">
        {USE_CASES.map((c) => (
          <Link
            key={c.link}
            to={c.link}
            className="rounded-2xl border p-6 transition-all hover:border-[var(--accent-gold)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
          >
            <h2 className="text-lg font-black">{c.title}</h2>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {c.body}
            </p>
            <span
              className="mt-4 inline-flex items-center gap-1 text-[10px] font-black tracking-widest uppercase"
              style={{ color: 'var(--accent-active)' }}
            >
              Learn more <ArrowRight size={12} />
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
          <h2 className="text-xl font-black">Ready to stamp?</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Use passport attestation templates or batch-hash an entire program roster.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/stamp"
              className="rounded-xl px-6 py-3 text-xs font-black tracking-widest uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              Stamp now
            </Link>
            <Link
              to="/batch-hash"
              className="rounded-xl border px-6 py-3 text-xs font-black tracking-widest uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              Batch hashes
            </Link>
            <Link
              to="/templates/passport-attestation"
              className="rounded-xl border px-6 py-3 text-xs font-black tracking-widest uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              Passport template
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

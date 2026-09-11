import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Package } from 'lucide-react'
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'

const WAITLIST_KEY = 'satohash-proof-pack-waitlist'
const GIVE_BIT_X = 'https://x.com/give_bit'

function readListed() {
  try {
    return localStorage.getItem(WAITLIST_KEY) === '1'
  } catch {
    return false
  }
}

export default function ProofPack() {
  usePageMeta({ page: 'proofPack' })
  const [listed, setListed] = useState(readListed)

  const joinLocal = () => {
    try {
      localStorage.setItem(WAITLIST_KEY, '1')
    } catch {
      /* private mode — still show confirmation */
    }
    setListed(true)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <article className="layout-container max-w-3xl space-y-8 py-10">
        <header className="space-y-3">
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Waitlist · free · not for sale
          </p>
          <div className="flex items-start gap-3">
            <div
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid var(--border)'
              }}
            >
              <Package size={18} style={{ color: 'var(--accent-gold)' }} />
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
              Proof Pack waitlist
            </h1>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Proof Pack is a future bundle idea — <code>.ots</code> receipts, a shareable proof card,
            and a PDF together. It is <strong>not for sale</strong>. There is no checkout, no
            invoice, and no email form (we do not have email infrastructure yet).
          </p>
        </header>

        <section
          className="space-y-3 rounded-2xl border p-5"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
        >
          <h2 className="text-sm font-black uppercase">What this is</h2>
          <ul
            className="list-disc space-y-2 pl-5 text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>A local waitlist on this device. We do not collect your email.</li>
            <li>
              Announcements happen on{' '}
              <a
                href={GIVE_BIT_X}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: 'var(--accent-gold)' }}
              >
                @give_bit
              </a>
              .
            </li>
            <li>
              Stamping is free today. Drop a file on{' '}
              <Link to="/stamp" className="underline" style={{ color: 'var(--accent-gold)' }}>
                /stamp
              </Link>
              . Pending is not confirmed.
            </li>
          </ul>
        </section>

        <section
          className="space-y-3 rounded-2xl border p-5"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-black uppercase">What this is not</h2>
          <ul
            className="list-disc space-y-2 pl-5 text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>Not a paid SKU. Not a subscription. Not a donate-to-unlock pack.</li>
            <li>Not a daily quota or a professional-count claim. Live proof is stamp count.</li>
            <li>Not a mailing list. “I&apos;m in” only sets a flag in your browser.</li>
          </ul>
        </section>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={GIVE_BIT_X}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border px-6 text-sm font-black uppercase"
            style={{
              borderColor: 'var(--border-gold, var(--accent-gold))',
              color: 'var(--accent-gold)'
            }}
          >
            Follow @give_bit <ArrowRight size={16} />
          </a>
          <Link
            to="/stamp"
            className="btn-sheen inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-6 text-sm font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            Stamp free now <ArrowRight size={16} />
          </Link>
          {listed ? (
            <p
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--accent-success)' }}
              data-testid="proof-pack-listed"
            >
              <Check size={16} />
              You&apos;re on the local list — we&apos;ll announce on @give_bit
            </p>
          ) : (
            <button
              type="button"
              onClick={joinLocal}
              data-testid="proof-pack-im-in"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border px-6 text-sm font-bold"
              style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            >
              I&apos;m in
            </button>
          )}
        </div>
      </article>
      <Footer compact />
    </div>
  )
}

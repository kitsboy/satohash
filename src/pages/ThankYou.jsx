import { Link } from 'react-router-dom'
import { CheckCircle2, ShieldCheck, Clock } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'
import Footer from '../components/layout/Footer'

/**
 * Real confirmation page for donations / submissions. A visitor only lands here
 * after a real action (donate, stamp, contact), so it can confirm what happened
 * and give the next step — never a bare stub, never a bounce to the homepage.
 */
export default function ThankYou() {
  usePageMeta({ page: 'thank-you' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] pb-24">
      <div className="mx-auto max-w-2xl space-y-6 p-4 pt-12">
        <div className="text-center">
          <span
            className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent-success)]/40 bg-[var(--accent-success)]/10"
            aria-hidden="true"
          >
            <CheckCircle2 className="text-[var(--accent-success)]" size={30} />
          </span>
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-[var(--accent-gold)] uppercase">
            Request received
          </p>
          <h1 className="text-4xl font-bold sm:text-5xl">Thank you.</h1>
          <p className="mx-auto mt-3 max-w-xl text-[var(--text-secondary)]">
            Your request is with Satohash and has been handled. Here is what happens next — and how
            to check it whenever you like.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <ShieldCheck size={18} className="text-[var(--accent-gold)]" />
            Your file is stamped — here is your proof
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            After you stamp a file, Satohash keeps only a SHA-256 fingerprint — the file never
            leaves your device. That fingerprint is anchored to the Bitcoin blockchain through
            OpenTimestamps calendars, typically within one block (~60 minutes).
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-[var(--accent-gold)]">→</span>
              <span>
                <strong className="text-[var(--text-primary)]">Check status</strong> — open the
                proof card you received, or paste its hash into the{' '}
                <Link to="/verify" className="text-[var(--accent-gold)] hover:underline">
                  verify tool
                </Link>
                .
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-[var(--accent-gold)]">→</span>
              <span>
                <strong className="text-[var(--text-primary)]">Download your proof</strong> — grab
                your portable <code>.ots</code> receipt and PDF certificate so it is safe on your
                own device.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-[var(--accent-gold)]">→</span>
              <span>
                <strong className="text-[var(--text-primary)]">Independent forever</strong> — even
                if Satohash ceased to exist, your proof checks out against Bitcoin with any OTS
                tool.
              </span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Clock size={18} className="text-[var(--accent-gold)]" />
            Pending is not confirmed — yet
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            A stamp that says <em>pending</em> has been submitted to the calendars.{' '}
            <em>Confirmed</em> means a Bitcoin block actually includes the attestation — that is
            what makes your proof permanent. Check back on the card, or{' '}
            <Link to="/network" className="text-[var(--accent-gold)] hover:underline">
              watch our live node
            </Link>{' '}
            as new blocks land.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <h2 className="mb-3 text-lg font-bold">Your support keeps free stamping alive</h2>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            If you made a donation, thank you — the sats go straight to the Satohash wallet and fund
            the OpenTimestamps calendars, the node, and the API that keep document proof free and
            verifiable for everyone. Stamps stay free; tipping never paywalls the trust anchor.
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-3 py-1 text-xs font-bold text-[var(--accent-gold)]">
            Bitcoin-only · no KYC · no middleman
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          <Link
            to="/stamp"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--accent-gold)] px-6 text-sm font-bold text-[#141b25] transition-opacity hover:opacity-90"
          >
            Stamp another file
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link to="/verify" className="text-[var(--accent-gold)] hover:underline">
              Verify a proof
            </Link>
            <span className="text-[var(--text-muted)]">·</span>
            <Link to="/donate" className="text-[var(--accent-gold)] hover:underline">
              Support again
            </Link>
          </div>
        </div>
      </div>
      <Footer compact />
    </div>
  )
}

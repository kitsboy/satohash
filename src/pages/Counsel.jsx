import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
import { Link } from 'react-router-dom'

export default function Counsel() {
  usePageMeta({
    page: 'counsel',
    title: 'For counsel',
    description:
      'What a Satohash / OpenTimestamps stamp is — and is not — for eIDAS, ESIGN, and UETA readers.'
  })

  const printPdf = () => window.print()

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <article className="layout-container max-w-3xl space-y-8 py-10 print:max-w-none">
        <header className="space-y-3">
          <p
            className="text-[10px] font-black tracking-widest uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            For counsel · one pager
          </p>
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            What a Satohash stamp proves
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Bitcoin-anchored proof of <em>existence at a time</em>, not of identity, consent, or
            legal validity of the underlying document.
          </p>
          <button
            type="button"
            onClick={printPdf}
            className="btn-sheen inline-flex min-h-[44px] items-center rounded-xl px-4 text-xs font-black uppercase print:hidden"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            Print / save PDF
          </button>
        </header>

        <section
          className="vault-ring space-y-3 rounded-2xl border p-5"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-black uppercase">It is</h2>
          <ul
            className="list-disc space-y-2 pl-5 text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>
              A SHA-256 fingerprint computed on the client. The file never needs to leave the
              device.
            </li>
            <li>
              An OpenTimestamps receipt that calendars later commit into a Bitcoin transaction.
            </li>
            <li>
              Independently verifiable with <code>ots-cli</code> or any OTS library against public
              calendars or your own Bitcoin node.
            </li>
            <li>
              Compatible in spirit with ESIGN / UETA (US) and eIDAS electronic timestamp concepts —
              a mathematical attestation of prior existence, not a notary commission.
            </li>
          </ul>
        </section>

        <section
          className="space-y-3 rounded-2xl border p-5"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-sm font-black uppercase">It is not</h2>
          <ul
            className="list-disc space-y-2 pl-5 text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            <li>Proof that a particular person authored, signed, or consented to the file.</li>
            <li>Proof the file is true, lawful, admissible, or complete.</li>
            <li>A government-issued notarial act or qualified trust service by itself.</li>
            <li>
              Instant Bitcoin finality. <strong>Pending</strong> means submitted to calendars.{' '}
              <strong>Confirmed</strong> means a Bitcoin block includes the attestation.
            </li>
          </ul>
        </section>

        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Satohash is the product surface. The chain of trust is OpenTimestamps + Bitcoin proof of
          work. Counsel should verify the <code>.ots</code> independently.{' '}
          <Link to="/verify" className="underline">
            Verify a proof
          </Link>
          .
        </p>
      </article>
      <Footer />
    </div>
  )
}

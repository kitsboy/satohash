import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import usePageMeta from '../../hooks/usePageMeta'

const ROWS = [
  {
    framework: 'ESIGN Act',
    region: 'United States',
    status: 'Hash evidence admissible',
    note: 'Electronic records with integrity proof'
  },
  {
    framework: 'UETA',
    region: 'US (47 states)',
    status: 'Compatible',
    note: 'Uniform electronic transactions'
  },
  {
    framework: 'eIDAS',
    region: 'European Union',
    status: 'Compatible',
    note: 'Qualified timestamps may need TSA; OTS is supporting evidence'
  },
  {
    framework: 'UK Evidence Act',
    region: 'United Kingdom',
    status: 'Evidentiary',
    note: 'Hash logs admissible with proper chain of custody'
  },
  {
    framework: 'ZertES',
    region: 'Switzerland',
    status: 'Compatible',
    note: 'Federal Act on Electronic Signatures'
  },
  {
    framework: 'Hague Apostille',
    region: 'Cross-border',
    status: 'Supporting',
    note: 'Companion hash for notarized documents'
  },
  {
    framework: 'GDPR',
    region: 'EU',
    status: 'By design',
    note: 'Zero document bytes stored on Satohash'
  }
]

export default function EvidenceAdmissibility() {
  usePageMeta({ page: 'evidenceAdmissibility' })

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="border-b px-6 py-4" style={{ borderColor: 'var(--border)' }}>
        <Link
          to="/government"
          className="text-sm font-bold"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Government use
        </Link>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-black">Evidence admissibility guide</h1>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Educational reference only — not legal advice. Consult qualified counsel in your
          jurisdiction.
        </p>
        <div
          className="mt-8 overflow-x-auto rounded-2xl border"
          style={{ borderColor: 'var(--border)' }}
        >
          <table className="w-full text-left text-xs">
            <thead>
              <tr style={{ background: 'var(--surface-raised)' }}>
                {['Framework', 'Region', 'Status', 'Notes'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-black tracking-widest uppercase"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.framework} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-3 font-bold">{r.framework}</td>
                  <td className="px-4 py-3">{r.region}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--accent-success)' }}>
                    {r.status}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {r.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <a
          href="/Satohash_Layman_Tutorial.pdf"
          download
          className="mt-8 inline-block text-xs font-black uppercase underline"
          style={{ color: 'var(--accent-active)' }}
        >
          Download verification instructions for officials (PDF)
        </a>
      </div>
      <Footer />
    </div>
  )
}

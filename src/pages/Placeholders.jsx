import { ShieldCheck, FileText, ArrowRight, Plus, Camera, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import usePageMetaOnboarding from '../hooks/usePageMetaOnboarding'

// Legacy — /snapper now routes to WebCapture directly.
// This export kept for backward compat with a coming-soon fallback UI.
export function Snapper() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center space-y-8 p-8 text-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-3xl border"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-secondary)',
          color: 'var(--accent-active)'
        }}
      >
        <Camera size={36} />
      </div>
      <div className="space-y-3">
        <div
          className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black tracking-widest uppercase"
          style={{
            borderColor: 'color-mix(in srgb, var(--accent-pending) 30%, transparent)',
            color: 'var(--accent-pending)'
          }}
        >
          <Clock size={12} /> Coming Soon
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase">Web Capture Snapper</h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Forensic web evidence capture with browser fingerprint metadata is rolling out shortly.
          Use the live Snapper surface in the meantime.
        </p>
      </div>
      <button
        onClick={() => navigate('/snapper')}
        className="flex items-center gap-2 rounded-xl px-8 py-4 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90"
        style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
      >
        Open Web Capture <ArrowRight size={14} />
      </button>
    </div>
  )
}

export function Certificates() {
  usePageMetaOnboarding('certificates')
  const navigate = useNavigate()

  const templates = [
    {
      name: 'Certificate of Provenance',
      id: 'COP_V4',
      desc: 'Standard attestation for a single digital artifact. Generate after stamping any file — proves existence at a specific Bitcoin block height.',
      recommended: true,
      action: () => navigate('/stamp'),
      actionLabel: 'Stamp a Document'
    },
    {
      name: 'Evidence Verification Record',
      id: 'EVR_V1',
      desc: 'Detailed forensic report including Merkle path traversal. Retrieve from your Vault for any confirmed OTS proof.',
      action: () => navigate('/vault'),
      actionLabel: 'Open Vault'
    },
    {
      name: 'Contract Attestation',
      id: 'CAS_V2',
      desc: 'Multi-party signature summary with NIP-05 identifiers. Available for contracts with co-signers attached.',
      action: () => navigate('/contracts'),
      actionLabel: 'View Contracts'
    }
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[var(--accent-active)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Certificates</h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">
            Assemble case-ready evidence and legal-grade reports.
          </p>
        </div>
        <button
          onClick={() => navigate('/stamp')}
          className="flex items-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 py-3 text-xs font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]"
        >
          <Plus size={14} /> New Stamp
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="group flex flex-col space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 transition-all hover:border-[var(--border-bright)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                <FileText size={24} />
              </div>
              {t.recommended && (
                <span className="rounded-full bg-[var(--accent-active)]/10 px-3 py-1 text-[9px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                  Standard
                </span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold tracking-tight">{t.name}</h4>
              </div>
              <p className="font-mono text-[11px] text-[var(--text-secondary)] opacity-50">
                {t.id}
              </p>
              <p className="text-xs leading-relaxed font-medium text-[var(--text-secondary)]">
                {t.desc}
              </p>
            </div>
            <button
              onClick={t.action}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 text-xs font-bold tracking-widest uppercase transition-all group-hover:border-[var(--border-bright)] hover:border-[var(--accent-active)] hover:text-[var(--accent-active)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t.actionLabel}
              <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

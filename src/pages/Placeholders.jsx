import {
  Camera,
  Globe,
  Layers,
  ShieldCheck,
  FileCode,
  ImageIcon,
  FileText,
  Settings as SettingsIcon,
  Shield,
  ArrowRight,
  Plus
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ForensicLayer = ({ icon: Icon, title, hash, status }) => (
  <div className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-secondary)] text-[var(--accent-active)]">
      <Icon size={18} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
        {title}
      </p>
      <p className="truncate font-mono text-[11px]">{hash}</p>
    </div>
    <div className="text-right">
      <span className="text-[9px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
        {status}
      </span>
    </div>
  </div>
)

export function Snapper() {
  const navigate = useNavigate()
  const [isCapturing, setIsCapturing] = useState(false)
  const [scene, setScene] = useState(null)
  const [urlInput, setUrlInput] = useState('')
  const [urlError, setUrlError] = useState('')

  const handleCapture = () => {
    if (!urlInput.trim()) {
      setUrlError('Please enter a URL to capture.')
      return
    }
    let normalised = urlInput.trim()
    if (!/^https?:\/\//i.test(normalised)) normalised = 'https://' + normalised
    try {
      new URL(normalised)
    } catch {
      setUrlError('Please enter a valid URL (e.g. https://example.com).')
      return
    }
    setUrlError('')
    setIsCapturing(true)

    // Submit the URL to the capture API
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    fetch(`${API}/api/capture/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: normalised })
    })
      .then((r) => r.json())
      .then((data) => {
        setScene({
          id: data.id || 'scene_pending',
          url: normalised,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          domHash: data.hash || data.sha256 || '—',
          status: data.status || 'pending'
        })
      })
      .catch(() => {
        setScene({
          id: 'scene_error',
          url: normalised,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          domHash: '—',
          status: 'error'
        })
      })
      .finally(() => setIsCapturing(false))
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 p-8">
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Camera className="text-[var(--accent-active)]" size={24} />
            <h1 className="text-4xl font-bold tracking-tighter uppercase">Snapper Forensic</h1>
          </div>
          <p className="font-medium text-[var(--text-secondary)]">
            Snap, Stamp & Scene. Multi-layer web evidence capture.
          </p>
        </div>
        <button
          onClick={() => navigate('/vault')}
          className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-6 text-xs font-bold tracking-widest uppercase transition-all hover:border-[var(--border-bright)]"
        >
          View Vault
        </button>
      </header>

      {/* URL input */}
      <div className="space-y-3 rounded-[2rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <label className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          Target URL
        </label>
        <div className="flex gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4">
            <Globe size={14} className="shrink-0 text-[var(--text-secondary)]" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value)
                setUrlError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleCapture()}
              placeholder="https://example.com/document"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
            />
          </div>
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="h-11 shrink-0 rounded-xl bg-[var(--text-primary)] px-8 text-xs font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isCapturing ? 'Capturing…' : 'Capture & Stamp'}
          </button>
        </div>
        {urlError && <p className="text-xs font-medium text-red-400">{urlError}</p>}
        <p className="text-[10px] text-[var(--text-secondary)] opacity-60">
          The page content will be hashed server-side and anchored to Bitcoin via OpenTimestamps.
          The original page is not stored.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)]">
            {scene ? (
              <>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${scene.status === 'error' ? 'bg-red-500/10' : 'bg-[var(--accent-success)]/10'}`}
                  >
                    <Camera
                      size={28}
                      className={
                        scene.status === 'error' ? 'text-red-400' : 'text-[var(--accent-success)]'
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-white">
                      {scene.status === 'error' ? 'Capture failed' : 'Scene captured'}
                    </p>
                    <p className="max-w-sm truncate font-mono text-xs text-[var(--text-secondary)]">
                      {scene.url}
                    </p>
                    <p className="font-mono text-[10px] text-[var(--text-secondary)] opacity-60">
                      {scene.timestamp}
                    </p>
                  </div>
                  {scene.status !== 'error' && (
                    <div className="flex items-center gap-3 rounded-lg border border-[var(--accent-success)]/20 bg-[var(--accent-success)]/10 px-4 py-2">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-success)]" />
                      <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--accent-success)] uppercase">
                        Stamp {scene.status === 'pending' ? 'Pending' : 'Confirmed'}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--border)]">
                  <Globe size={32} />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-[var(--text-secondary)]">
                    No active forensic scene
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] opacity-60">
                    Enter a URL above to capture web evidence
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-8 rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center gap-3">
              <Layers size={18} className="text-[var(--accent-active)]" />
              <h3 className="text-[10px] font-bold tracking-widest uppercase">Forensic Layers</h3>
            </div>
            <div className="space-y-3">
              <ForensicLayer
                icon={FileCode}
                title="DOM Manifest"
                hash={scene ? scene.domHash : '0x00…'}
                status={scene ? (scene.status === 'error' ? 'Failed' : 'Captured') : 'Pending'}
              />
              <ForensicLayer
                icon={ImageIcon}
                title="Visual Frame"
                hash={scene ? scene.domHash : '0x00…'}
                status={scene ? (scene.status === 'error' ? 'Failed' : 'Captured') : 'Pending'}
              />
            </div>
            {scene && scene.status !== 'error' && (
              <button
                onClick={() => navigate('/vault')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-3 text-[10px] font-bold tracking-widest uppercase transition-all hover:border-[var(--accent-active)] hover:text-[var(--accent-active)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                View in Vault <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Certificates() {
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

export function Settings() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 p-8">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <SettingsIcon className="text-[var(--accent-active)]" size={24} />
          <h1 className="text-4xl font-bold tracking-tighter uppercase">Settings</h1>
        </div>
        <p className="font-medium text-[var(--text-secondary)]">
          Configure your sovereign truth environment.
        </p>
      </header>

      <div className="space-y-8">
        <div className="space-y-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8">
          <h3 className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
            Organization Profile
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Counsel @ Truth Firm"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-sm outline-none focus:border-[var(--accent-active)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                NIP-05 Handle
              </label>
              <input
                type="text"
                placeholder="counsel@satohash.nip05"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-sm outline-none focus:border-[var(--accent-active)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Trust() {
  const principles = [
    {
      title: 'Zero-Knowledge Hashing',
      desc: 'SHA-256 fingerprints are calculated locally. Your original data never leaves your environment.'
    },
    {
      title: 'Independent Verification',
      desc: 'Proofs can be verified using any OpenTimestamps-compatible client, independent of Satohash.'
    },
    {
      title: 'Bitcoin Anchoring',
      desc: 'Finality is secured by the cumulative proof-of-work of the global Bitcoin network.'
    }
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 p-8">
      <header className="space-y-6 text-center">
        <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-[var(--accent-success)]/20 bg-[var(--accent-success)]/10 px-4 py-2">
          <Shield className="text-[var(--accent-success)]" size={16} />
          <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--accent-success)] uppercase">
            Verified Architecture
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tighter uppercase">The Trust Mesh</h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed font-medium text-[var(--text-secondary)]">
          Satohash is built on the principle of absolute sovereignty. We provide the tools; you
          provide the truth. No accounts, no custody, no compromise.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {principles.map((p) => (
          <div
            key={p.title}
            className="group space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 transition-all hover:border-[var(--accent-active)]"
          >
            <h3 className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-[var(--accent-active)]">
              {p.title}
            </h3>
            <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="border-b border-[var(--border)] bg-[var(--bg-primary)]/50 p-10">
          <h3 className="mb-2 text-2xl font-bold tracking-tighter uppercase">
            Protocol Specification
          </h3>
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Technical standards ensuring cross-platform compatibility.
          </p>
        </div>
        <div className="space-y-12 p-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                Witness Mesh
              </h4>
              <div className="space-y-4">
                {[
                  { name: 'Alice (Primary)', status: 'Syncing', type: 'OTS-Calendar' },
                  { name: 'Bob (Secondary)', status: 'Online', type: 'OTS-Calendar' },
                  { name: 'Satoshi (Legacy)', status: 'Online', type: 'OTS-Calendar' }
                ].map((w) => (
                  <div
                    key={w.name}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent-success)]" />
                      <span className="text-sm font-bold">{w.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase">
                      {w.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold tracking-widest text-[var(--accent-active)] uppercase">
                Technical Transparency
              </h4>
              <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">
                Satohash utilizes the OpenTimestamps (OTS) protocol for all anchoring operations.
                Our source code is open for audit, and we encourage independent verification of our
                hashing workers and proof generation pipelines.
              </p>
              <button className="flex h-12 items-center gap-2 rounded-xl bg-[var(--text-primary)] px-6 text-[10px] font-bold tracking-widest text-[var(--bg-primary)] uppercase transition-all hover:scale-[1.02]">
                <FileCode size={14} /> View Audit Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-[var(--border)] pt-12 text-center">
        <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--text-secondary)] uppercase">
          Don&apos;t Trust. Verify.
        </p>
      </footer>
    </div>
  )
}

export function About() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Simple navbar back to home */}
      <nav
        className="flex items-center gap-3 border-b px-6 py-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.png" className="h-7 w-7" alt="Satohash" />
          <span
            className="font-black tracking-tighter uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            Satohash
          </span>
        </a>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Hero */}
        <div className="mb-16">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-black tracking-widest uppercase"
            style={{
              borderColor: 'rgba(240,180,41,0.4)',
              backgroundColor: 'rgba(240,180,41,0.08)',
              color: 'var(--accent-gold)'
            }}
          >
            Our Mission
          </div>
          <h1 className="mb-6 text-5xl font-black tracking-tighter">
            We believe truth should be
            <br />
            <span style={{ color: 'var(--accent-gold)' }}>mathematically provable.</span>
          </h1>
          <p
            className="max-w-2xl text-xl leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Satohash was built on a simple insight: Bitcoin&apos;s blockchain is not just a payment
            network. It is the world&apos;s most reliable timestamp server — and almost nobody uses
            it that way.
          </p>
        </div>

        {/* Story */}
        <div
          className="mb-16 space-y-8 text-lg leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          <p>
            Every 10 minutes, Bitcoin miners race to solve a mathematical puzzle. The winner adds a
            new block to the chain — a permanent, global record that includes a Merkle root of all
            recent transactions. That root is a cryptographic commitment to a specific set of data
            at a specific moment in time.
          </p>
          <p>
            OpenTimestamps, the open protocol we build on, figured out how to leverage this
            mechanism for document notarization. By submitting the SHA-256 hash of any file to an
            OTS calendar server, your document&apos;s fingerprint gets embedded into the next
            Bitcoin block. Forever.
          </p>
          <p style={{ color: 'var(--text-primary)' }} className="font-semibold">
            Your document never leaves your device. We never see its contents. Only the fingerprint
            — 64 hex characters — is submitted. This is zero-knowledge notarization.
          </p>
        </div>

        {/* Values grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {[
            {
              emoji: '🔐',
              title: 'Privacy First',
              body: 'Your documents are yours. We see only mathematical fingerprints. Always.'
            },
            {
              emoji: '₿',
              title: 'Bitcoin Native',
              body: 'We anchor to Bitcoin because it is the most secure, decentralized timestamp server ever built.'
            },
            {
              emoji: '⚖️',
              title: 'Legal Grade',
              body: 'Our proofs meet ESIGN Act, UETA, and eIDAS standards. Court-ready by design.'
            }
          ].map(({ emoji, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border p-6"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
            >
              <div className="mb-3 text-3xl">{emoji}</div>
              <h3 className="mb-2 text-lg font-black">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="rounded-3xl border p-10 text-center"
          style={{
            borderColor: 'rgba(240,180,41,0.3)',
            background: 'linear-gradient(135deg, rgba(240,180,41,0.05), rgba(14,165,233,0.03))'
          }}
        >
          <h2 className="mb-4 text-3xl font-black">Ready to anchor your first document?</h2>
          <a
            href="/stamp"
            className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-black transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--accent-gold)', color: '#141b25' }}
          >
            Start Free — No Account Needed →
          </a>
        </div>
      </div>
    </div>
  )
}

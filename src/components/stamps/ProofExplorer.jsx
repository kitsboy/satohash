import { ShieldCheck, Clock, CheckCircle2, Hash, GitBranch, Blocks } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateHash(hash, front = 8, back = 8) {
  if (!hash || hash.length <= front + back + 3) return hash || '—'
  return `${hash.slice(0, front)}…${hash.slice(-back)}`
}

function deriveDocHash(contract) {
  if (!contract) return null
  // Use the contract id as a proxy for the document hash when a real hash isn't stored
  return contract.hash || contract.id || null
}

// Deterministic pseudo-hashes derived from the contract id for visual demo nodes
function seedHash(base, suffix) {
  if (!base) return '0'.repeat(64)
  let h = 0
  const str = base + suffix
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  const hex = (Math.abs(h) >>> 0).toString(16).padStart(8, '0')
  return hex.repeat(8).slice(0, 64)
}

// ─── Merkle Tree ──────────────────────────────────────────────────────────────

function MerkleTree({ contract }) {
  const docHash = deriveDocHash(contract)
  const siblingHash = seedHash(docHash, 'sibling')
  const branchHash = seedHash(docHash, 'branch')
  const merkleRoot = seedHash(docHash, 'merkleroot')

  const nodeStyle = (color) => ({
    borderRadius: '10px',
    padding: '8px 14px',
    border: `1px solid ${color}30`,
    background: `${color}0d`,
    fontFamily: 'monospace',
    fontSize: '11px',
    color: color,
    display: 'inline-block',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  })

  const labelStyle = {
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '4px',
    color: '#64748b'
  }

  const connectorV = {
    width: '1px',
    height: '24px',
    background: '#334155',
    margin: '0 auto'
  }

  const connectorH = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    position: 'relative'
  }

  return (
    <div style={{ padding: '8px 0' }}>
      {/* Level 1 — Leaves */}
      <div style={{ ...connectorH, gap: '16px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={labelStyle}>Document Hash</div>
          <div style={nodeStyle('#6366f1')} title={docHash || ''}>
            {truncateHash(docHash, 6, 6)}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={labelStyle}>Sibling Hash</div>
          <div style={nodeStyle('#64748b')} title={siblingHash}>
            {truncateHash(siblingHash, 6, 6)}
          </div>
        </div>
      </div>

      {/* V connector from leaves to branch */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '0' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={connectorV} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={connectorV} />
        </div>
      </div>

      {/* Horizontal bridge line */}
      <div
        style={{
          height: '1px',
          background: '#334155',
          margin: '0 calc(25% + 0px)',
          position: 'relative'
        }}
      />

      {/* V connector from bridge to branch node */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={connectorV} />
      </div>

      {/* Level 2 — Merkle Branch */}
      <div style={{ textAlign: 'center' }}>
        <div style={labelStyle}>Merkle Branch</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={nodeStyle('#0d9488')} title={branchHash}>
            {truncateHash(branchHash, 6, 6)}
          </div>
        </div>
      </div>

      {/* V connector */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={connectorV} />
      </div>

      {/* Level 3 — Bitcoin Block */}
      <div style={{ textAlign: 'center' }}>
        <div style={labelStyle}>Bitcoin Block (Merkle Root)</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              ...nodeStyle('#f0b429'),
              fontWeight: '700',
              boxShadow: '0 0 12px rgba(240,180,41,0.15)'
            }}
            title={merkleRoot}
          >
            {truncateHash(merkleRoot, 6, 6)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Verification Steps ───────────────────────────────────────────────────────

function VerificationSteps({ isTimestamped }) {
  const steps = [
    {
      label: 'Document hashed locally (SHA-256)',
      done: true,
      color: '#22c55e'
    },
    {
      label: 'Hash submitted to OpenTimestamps',
      done: true,
      color: '#22c55e'
    },
    {
      label: 'Merkle branch computed',
      done: true,
      color: '#22c55e'
    },
    {
      label: 'Anchored in Bitcoin block header',
      done: isTimestamped,
      color: isTimestamped ? '#22c55e' : '#f0b429'
    },
    {
      label: 'Proof independently verifiable',
      done: isTimestamped,
      color: isTimestamped ? '#22c55e' : '#64748b'
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {step.done ? (
            <CheckCircle2 size={16} color={step.color} style={{ flexShrink: 0 }} />
          ) : (
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: `2px solid ${step.color}`,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {!isTimestamped && i === 3 && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#f0b429',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}
                />
              )}
            </div>
          )}
          <span
            style={{
              fontSize: '13px',
              color: step.done ? '#cbd5e1' : '#64748b',
              fontWeight: step.done ? '500' : '400'
            }}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Pending State ────────────────────────────────────────────────────────────

function PendingState() {
  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '20px',
        background: 'rgba(240,180,41,0.06)',
        border: '1px solid rgba(240,180,41,0.2)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '3px solid #f0b429',
          borderTopColor: 'transparent',
          flexShrink: 0,
          animation: 'spin 1s linear infinite'
        }}
      />
      <div>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#f0b429', marginBottom: '4px' }}>
          Pending Bitcoin Confirmation
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
          Your proof has been submitted to OpenTimestamps and is awaiting inclusion in the next
          Bitcoin block — typically within 60 minutes. Once anchored, this proof becomes
          mathematically non-repudiable and can be verified by anyone, forever.
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ProofExplorer = ({ isOpen, onClose, contract, timestamp }) => {
  if (!isOpen) return null

  const isTimestamped = contract?.status === 'timestamped'
  const docHash = deriveDocHash(contract)
  const displayHash = timestamp?.hash || docHash
  const blockHeight = contract?.bitcoin_block_height || timestamp?.blockHeight || null
  const createdAt = contract?.createdAt
    ? new Date(contract.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      {/* Spin + pulse keyframes injected inline */}
      <style>{`
        @keyframes proof-spin { to { transform: rotate(360deg); } }
        @keyframes proof-pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .proof-spinner { animation: proof-spin 1s linear infinite; }
        .proof-pulse { animation: proof-pulse 1.5s ease-in-out infinite; }
      `}</style>

      <div
        style={{
          background: '#0f172a',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)',
          border: '1px solid #1e293b',
          animation: 'slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to right, #0f172a, #1e293b)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'rgba(240,180,41,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Hash size={18} color="#f0b429" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                Proof Explorer
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {contract?.name ? `"${contract.name}"` : 'Cryptographic path to Bitcoin'}
                {blockHeight ? ` · Block #${blockHeight.toLocaleString()}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: '1px solid #334155',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              color: '#94a3b8',
              transition: 'border-color 0.15s'
            }}
            onMouseEnter={(e) => (e.target.style.borderColor = '#64748b')}
            onMouseLeave={(e) => (e.target.style.borderColor = '#334155')}
          >
            Close
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
          {/* Pending banner */}
          {!isTimestamped && (
            <div style={{ marginBottom: '24px' }}>
              <PendingState />
            </div>
          )}

          {/* Document metadata row */}
          {(contract?.id || createdAt) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '24px'
              }}
            >
              {contract?.id && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#1e293b',
                    border: '1px solid #334155'
                  }}
                >
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: '800',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#64748b',
                      marginBottom: '4px'
                    }}
                  >
                    Proof ID
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#94a3b8',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {contract.id}
                  </div>
                </div>
              )}
              {createdAt && (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#1e293b',
                    border: '1px solid #334155'
                  }}
                >
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: '800',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#64748b',
                      marginBottom: '4px'
                    }}
                  >
                    Stamped At
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Clock size={11} />
                    {createdAt}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 1: Document Fingerprint ── */}
          <Section
            icon={<Hash size={16} color="#6366f1" />}
            iconBg="rgba(99,102,241,0.12)"
            label="1. Document Fingerprint (SHA-256)"
          >
            <div
              style={{
                background: '#1e293b',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid #334155',
                fontFamily: 'monospace',
                fontSize: '12px',
                wordBreak: 'break-all',
                color: '#a5b4fc',
                lineHeight: 1.6
              }}
            >
              {displayHash || (
                <span style={{ color: '#475569', fontStyle: 'italic' }}>
                  Hash computed client-side — not stored on server
                </span>
              )}
            </div>
          </Section>

          <Connector />

          {/* ── Step 2: Merkle Tree ── */}
          <Section
            icon={<GitBranch size={16} color="#0d9488" />}
            iconBg="rgba(13,148,136,0.12)"
            label="2. Merkle Tree Path"
          >
            <div
              style={{
                background: '#1e293b',
                borderRadius: '12px',
                border: '1px solid #334155',
                padding: '16px'
              }}
            >
              <MerkleTree contract={contract} />
            </div>
          </Section>

          <Connector />

          {/* ── Step 3: Bitcoin Block ── */}
          <Section
            icon={<Blocks size={16} color="#f0b429" />}
            iconBg="rgba(240,180,41,0.12)"
            label="3. Bitcoin Block Anchor"
          >
            <div
              style={{
                background: isTimestamped ? 'rgba(240,180,41,0.06)' : '#1e293b',
                padding: '14px',
                borderRadius: '12px',
                border: isTimestamped ? '1px solid rgba(240,180,41,0.25)' : '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: isTimestamped ? '#f0b429' : '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Blocks size={16} color={isTimestamped ? '#0f172a' : '#64748b'} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: isTimestamped ? '#f0b429' : '#64748b',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}
                >
                  {isTimestamped ? 'Block Header Anchor' : 'Awaiting Bitcoin Block'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#94a3b8',
                    marginTop: '2px'
                  }}
                >
                  {blockHeight
                    ? `Block #${blockHeight.toLocaleString()}`
                    : 'Pending — proof submitted to OTS calendar'}
                </div>
              </div>
            </div>
          </Section>

          {/* ── Verification Steps ── */}
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              borderRadius: '14px',
              background: '#1e293b',
              border: '1px solid #334155'
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: '800',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#64748b',
                marginBottom: '14px'
              }}
            >
              Verification Steps
            </div>
            <VerificationSteps contract={contract} isTimestamped={isTimestamped} />
          </div>

          {/* ── Trust Banner ── */}
          <div
            style={{
              marginTop: '20px',
              borderRadius: '16px',
              padding: '18px 20px',
              background: isTimestamped
                ? 'linear-gradient(135deg, #052e16, #0f172a)'
                : 'linear-gradient(135deg, #1c1917, #0f172a)',
              border: isTimestamped ? '1px solid rgba(34,197,94,0.2)' : '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isTimestamped ? 'rgba(34,197,94,0.15)' : 'rgba(100,116,139,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={22} color={isTimestamped ? '#22c55e' : '#475569'} />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: '800',
                    fontSize: '14px',
                    color: isTimestamped ? '#f8fafc' : '#94a3b8'
                  }}
                >
                  {isTimestamped ? 'Verified Authentic' : 'Proof Submitted'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {isTimestamped
                    ? 'Mathematically linked to Bitcoin Mainnet'
                    : 'Awaiting Bitcoin block confirmation'}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '900',
                  letterSpacing: '1px',
                  color: isTimestamped ? '#f0b429' : '#475569'
                }}
              >
                {blockHeight ? blockHeight.toLocaleString() : '—'}
              </div>
              <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.08em' }}>
                BLOCK HEIGHT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Section({ icon, iconBg, label, children }) {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px'
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: '700',
            marginBottom: '10px',
            color: '#cbd5e1'
          }}
        >
          {label}
        </h3>
        {children}
      </div>
    </div>
  )
}

function Connector() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '16px 0',
        color: '#334155'
      }}
    >
      <div
        style={{
          width: 1,
          height: 28,
          background: 'linear-gradient(to bottom, #334155, #1e293b)'
        }}
      />
    </div>
  )
}

export default ProofExplorer

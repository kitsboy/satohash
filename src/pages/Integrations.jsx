import { Link } from 'react-router-dom'
import {
  Code,
  Server,
  Globe,
  Smartphone,
  ArrowLeft,
  Copy,
  Check,
  Terminal,
  Zap,
  Fingerprint
} from 'lucide-react'
import { useState } from 'react'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

const SNIPPETS = {
  curl: `curl -X POST https://api.satohash.io/api/v1/timestamp \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key_here" \\
  -d '{"hash": "5d41402abc4b2a76b9719d911017c592"}'`,
  js: `import { SatohashClient } from '@satohash/client'

const client = new SatohashClient({
  apiKey: 'your_api_key_here'
})

// Stamp a hash to Bitcoin
const proof = await client.timestamp({
  hash: '5d41402abc4b2a76b9719d911017c592'
})
console.log('Proof created:', proof.id)`,

  python: `from satohash import SatohashClient

client = SatohashClient(
    api_key="your_api_key_here"
)

# Verify an existing proof
result = client.verify("proof_file.ots")
print(f"Verified: {result.verified}")
print(f"Timestamp: {result.timestamp}")`,

  bash: `# Using the satohash CLI
satohash stamp document.pdf
# Output: Proof created: abc123... (tx: 7a8b...)

satohash verify proof.ots document.pdf
# Output: ✓ Verified — Bitcoin block 891234`,

  wordpress: `// WordPress shortcode: [satohash_proof id="abc123"]
function satohash_proof_shortcode($atts) {
    $id = $atts['id'];
    return '<iframe src="https://satohash.io/verify/' .
           esc_attr($id) . '" width="100%" height="400"></iframe>';
}
add_shortcode('satohash_proof', 'satohash_proof_shortcode');`
}

const SECTIONS = [
  {
    icon: Terminal,
    title: 'REST API',
    desc: 'Full REST API for creating and verifying proofs programmatically.',
    features: [
      'POST /api/v1/timestamp — Create a proof',
      'GET /api/v1/verify/:id — Verify a proof',
      'GET /api/v1/price — Current pricing',
      'Rate-limited to 100 req/min for free tier'
    ]
  },
  {
    icon: Server,
    title: 'Webhooks',
    desc: 'Receive real-time notifications when proofs are confirmed on-chain.',
    features: [
      'Configurable webhook URLs',
      'HMAC-SHA256 signature verification',
      'Automatic retry with backoff',
      'Supports JSON and form-encoded payloads'
    ]
  },
  {
    icon: Globe,
    title: 'WordPress Integration',
    desc: 'Embed Satohash proofs in any WordPress site with a simple shortcode.',
    features: [
      '[satohash_proof id="..."] shortcode',
      'Customizable iframe dimensions',
      'Works with any WordPress theme',
      'No plugin required — paste the code'
    ]
  },
  {
    icon: Smartphone,
    title: 'Mobile-Ready',
    desc: 'Proof pages are fully responsive and work on any device.',
    features: [
      'Responsive verification pages',
      'PWA installable on iOS/Android',
      'QR code sharing for proofs',
      'Deep link support'
    ]
  }
]

function CodeBlock({ label, code }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2">
        <span className="text-[10px] font-bold tracking-widest text-[var(--accent-gold)] uppercase">
          {label}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent-gold)]"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed whitespace-pre text-[var(--text-secondary)]">
        {code}
      </pre>
    </div>
  )
}

export default function Integrations() {
  usePageMeta({ page: 'integrations' })

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <header className="border-b border-[var(--border)] bg-[var(--bg-navbar)]/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link
            to="/docs"
            className="flex min-h-[44px] items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
          >
            <ArrowLeft size={16} /> Docs
          </Link>
          <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            Integrations
          </span>
        </div>
      </header>

      <section className="border-b border-[var(--border)] px-6 pt-20 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <Zap size={32} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-4xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            <span className="text-[var(--accent-gold)]">Integrate</span> Satohash
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Add Bitcoin-anchored proof of existence to your apps, websites, and workflows. REST API,
            webhooks, WordPress, and CLI — pick your path.
          </p>
        </div>
      </section>

      {/* Integration Types */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {SECTIONS.map((sec, i) => {
            const Icon = sec.icon
            return (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition-all hover:border-[var(--accent-gold)]"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-gold)]/10">
                    <Icon size={20} className="text-[var(--accent-gold)]" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{sec.title}</h3>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {sec.desc}
                </p>
                <ul className="space-y-1.5">
                  {sec.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)]"
                    >
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Code Examples */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-black text-[var(--text-primary)]">
            Quick Start <span className="text-[var(--accent-gold)]">Code Samples</span>
          </h2>
          <div className="grid gap-6">
            <CodeBlock label="cURL" code={SNIPPETS.curl} />
            <div className="grid gap-6 md:grid-cols-2">
              <CodeBlock label="JavaScript" code={SNIPPETS.js} />
              <CodeBlock label="Python" code={SNIPPETS.python} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <CodeBlock label="CLI / Bash" code={SNIPPETS.bash} />
              <CodeBlock label="WordPress" code={SNIPPETS.wordpress} />
            </div>
          </div>
        </div>
      </section>

      {/* Proof DNA Widgets */}
      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Fingerprint size={28} className="mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-2xl font-black text-[var(--text-primary)]">
            Proof DNA <span className="text-[var(--accent-gold)]">Widgets</span>
          </h2>
          <p className="mb-6 max-w-lg text-sm text-[var(--text-secondary)]">
            Embed verifiable badges on any website. Deterministic visuals from SHA-256 — one div,
            one script.
          </p>
          <Link
            to="/widgets"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-[var(--accent-gold)] uppercase hover:bg-[var(--accent-gold)]/10"
          >
            Widget Gallery <Fingerprint size={16} />
          </Link>
        </div>
      </section>

      {/* Getting API Key */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl text-center">
          <Code size={24} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">Get Your API Key</h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            Generate API keys from the developer dashboard. Each key has scoped permissions and can
            be revoked independently.
          </p>
          <Link
            to="/developer"
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90"
          >
            Developer Dashboard <Terminal size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import Footer from '../components/layout/Footer'
import usePageMeta from '../hooks/usePageMeta'
import { getPublicBaseUrl, getApiUrl } from '../config/constants'

function buildSnippets() {
  const base = getPublicBaseUrl()
  const api = getApiUrl()
  return {
    curl: `curl -X POST ${api}/api/stamp \\
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
    return '<iframe src="${base}/verify/' .
           esc_attr($id) . '" width="100%" height="400"></iframe>';
}
add_shortcode('satohash_proof', 'satohash_proof_shortcode');`
  }
}

const SECTION_IDS = [
  { id: 'restApi', icon: Terminal },
  { id: 'webhooks', icon: Server },
  { id: 'wordpress', icon: Globe },
  { id: 'mobile', icon: Smartphone }
]

function CodeBlock({ label, code, copyLabel, copiedLabel }) {
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
          {copied ? copiedLabel : copyLabel}
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
  const { t } = useTranslation()

  const sections = useMemo(
    () =>
      SECTION_IDS.map(({ id, icon }) => {
        const data = t(`integrationsPage.sections.${id}`, { returnObjects: true })
        return { id, icon, title: data.title, desc: data.desc, features: data.features }
      }),
    [t]
  )

  const SNIPPETS = useMemo(() => buildSnippets(), [])

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="border-b border-[var(--border)] px-4 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-[10px] font-bold tracking-[0.25em] text-[var(--accent-gold)] uppercase">
            {t('common.integrations')}
          </p>
          <Zap size={32} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h1 className="mb-4 text-3xl font-black tracking-tight text-[var(--text-primary)] sm:text-5xl">
            <span className="text-[var(--accent-gold)]">{t('integrationsPage.hero.title')}</span>{' '}
            {t('integrationsPage.hero.titleHighlight')}
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
            {t('integrationsPage.hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map((sec) => {
            const Icon = sec.icon
            return (
              <div
                key={sec.id}
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

      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-center text-2xl font-black text-[var(--text-primary)]">
            Give A Bit <span className="text-[var(--accent-gold)]">ecosystem</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-[var(--text-secondary)]">
            MotoPass and sister apps hash passports, program data, and distressed-asset listings
            client-side, then deep-link to Satohash for independent Bitcoin verification.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="mb-2 text-sm font-black text-[var(--text-primary)]">
                MotoPass → Satohash
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                Applications and vault flows link to{' '}
                <code className="font-mono text-[var(--accent-gold)]">/stamp?hash=…</code> and{' '}
                <code className="font-mono text-[var(--accent-gold)]">/verify/…</code> for
                passport-grade provenance without uploading documents.
              </p>
              <a
                href="https://motopass.giveabit.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black tracking-widest text-[var(--accent-active)] uppercase underline"
              >
                motopass.giveabit.io →
              </a>
            </div>
            <CodeBlock
              label="Family deep-link (canonical)"
              code={`// Hash client-side (browser SHA-256) — never upload the file
const hash = await sha256Hex(canonicalPayload)

// Canonical stamp entry (prefer this for all family apps)
window.open(\`${getPublicBaseUrl()}/stamp?hash=\${hash}&ref=motopass&label=Passport+application\`)

// Also accepted: homepage redirects to /stamp
// ${getPublicBaseUrl()}/?hash=\${hash}&ref=sherpacarta

// After stamp: shareable verify (id preferred; hash also works)
window.open(\`${getPublicBaseUrl()}/verify/\${stampId}\`)
// Header on API: X-Satohash-Client: sherpacarta | motopass | …`}
              copyLabel={t('common.copy')}
              copiedLabel={t('common.copied')}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-black text-[var(--text-primary)]">
            {t('integrationsPage.codeSamples.title')}{' '}
            <span className="text-[var(--accent-gold)]">
              {t('integrationsPage.codeSamples.titleHighlight')}
            </span>
          </h2>
          <div className="grid gap-6">
            <CodeBlock
              label={t('integrationsPage.codeSamples.labels.curl')}
              code={SNIPPETS.curl}
              copyLabel={t('common.copy')}
              copiedLabel={t('common.copied')}
            />
            <div className="grid gap-6 md:grid-cols-2">
              <CodeBlock
                label={t('integrationsPage.codeSamples.labels.js')}
                code={SNIPPETS.js}
                copyLabel={t('common.copy')}
                copiedLabel={t('common.copied')}
              />
              <CodeBlock
                label={t('integrationsPage.codeSamples.labels.python')}
                code={SNIPPETS.python}
                copyLabel={t('common.copy')}
                copiedLabel={t('common.copied')}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <CodeBlock
                label={t('integrationsPage.codeSamples.labels.bash')}
                code={SNIPPETS.bash}
                copyLabel={t('common.copy')}
                copiedLabel={t('common.copied')}
              />
              <CodeBlock
                label={t('integrationsPage.codeSamples.labels.wordpress')}
                code={SNIPPETS.wordpress}
                copyLabel={t('common.copy')}
                copiedLabel={t('common.copied')}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Fingerprint size={28} className="mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-2xl font-black text-[var(--text-primary)]">
            {t('integrationsPage.widgets.title')}{' '}
            <span className="text-[var(--accent-gold)]">
              {t('integrationsPage.widgets.titleHighlight')}
            </span>
          </h2>
          <p className="mb-6 max-w-lg text-sm text-[var(--text-secondary)]">
            {t('integrationsPage.widgets.subtitle')}
          </p>
          <Link
            to="/widgets"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-[var(--accent-gold)] uppercase hover:bg-[var(--accent-gold)]/10"
          >
            {t('integrationsPage.widgets.cta')} <Fingerprint size={16} />
          </Link>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl text-center">
          <Code size={24} className="mx-auto mb-4 text-[var(--accent-gold)]" />
          <h2 className="mb-3 text-xl font-black text-[var(--text-primary)]">
            {t('integrationsPage.apiKey.title')}
          </h2>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            {t('integrationsPage.apiKey.subtitle')}
          </p>
          <Link
            to="/developer"
            className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[var(--accent-gold)] px-8 text-sm font-black tracking-wider text-black uppercase transition-all hover:bg-[var(--accent-gold)]/90"
          >
            {t('integrationsPage.apiKey.cta')} <Terminal size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

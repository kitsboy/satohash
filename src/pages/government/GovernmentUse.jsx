import { Link } from 'react-router-dom'
import {
  Shield,
  Fingerprint,
  ArrowRight,
  Globe2,
  Scale,
  Layers,
  FileCheck,
  Users,
  Lock,
  Lightbulb,
  Building2,
  Plane,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/layout/Footer'
import usePageMeta from '../../hooks/usePageMeta'
import GiveABitBadge from '../../components/marketing/GiveABitBadge'

/** Simple accessible bar chart — pure SVG, no chart lib */
function BarChart({ title, subtitle, bars, max }) {
  const peak = max || Math.max(...bars.map((b) => b.value), 1)
  return (
    <div
      className="rounded-2xl border p-4 sm:p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
    >
      <h3 className="text-sm font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {subtitle && (
        <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      )}
      <div className="mt-4 space-y-3" role="img" aria-label={title}>
        {bars.map((b) => (
          <div key={b.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-[11px]">
              <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {b.label}
              </span>
              <span className="font-mono font-bold tabular-nums" style={{ color: b.color }}>
                {b.display ?? b.value}
              </span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full"
              style={{ background: 'var(--bg-primary)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(4, (b.value / peak) * 100)}%`,
                  background: b.color,
                  boxShadow: `0 0 12px ${b.color}55`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DonutChart({ title, subtitle, slices }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  const gradients = slices
    .reduce(
      (state, sl) => {
        const start = (state.acc / total) * 100
        const next = state.acc + sl.value
        const end = (next / total) * 100
        state.parts.push(`${sl.color} ${start}% ${end}%`)
        return { acc: next, parts: state.parts }
      },
      { acc: 0, parts: [] }
    )
    .parts.join(', ')

  return (
    <div
      className="rounded-2xl border p-4 sm:p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
    >
      <h3 className="text-sm font-black tracking-tight">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      )}
      <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <div
          className="h-36 w-36 shrink-0 rounded-full"
          style={{
            background: `conic-gradient(${gradients})`,
            boxShadow: 'inset 0 0 0 18px var(--surface-raised)'
          }}
          role="img"
          aria-label={title}
        />
        <ul className="w-full space-y-2 text-[11px]">
          {slices.map((sl) => (
            <li key={sl.label} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: sl.color }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>{sl.label}</span>
              </span>
              <span className="font-mono font-bold tabular-nums" style={{ color: sl.color }}>
                {Math.round((sl.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const SOLUTIONS = [
  {
    icon: Lock,
    title: 'Hash-only evidence',
    body: 'Never upload the document. Browser SHA-256 + OpenTimestamps calendars produce a Bitcoin-anchored proof anyone can re-verify offline.',
    color: '#f0b429'
  },
  {
    icon: Layers,
    title: 'Batch & custody chains',
    body: 'Stamp folders of filings, then record handoffs (holder → witness → agency) as sequential proofs for chain-of-custody narratives.',
    color: '#0ea5e9'
  },
  {
    icon: Scale,
    title: 'Court-friendly artifacts',
    body: 'Export .ots proofs, structural verify in-browser, and optional W3C-style credentials — built for eIDAS / UETA-style discussions, not vendor lock-in.',
    color: '#22d3a5'
  },
  {
    icon: Globe2,
    title: 'Air-gapped friendly',
    body: 'Hash offline when needed; only the fingerprint and proof file leave the device. Fits data-residency and classified-adjacent workflows.',
    color: '#8b5cf6'
  }
]

const IDEAS = [
  {
    icon: Building2,
    title: 'Land & registry modernization',
    body: 'Fingerprint title packages and survey plats before cross-border sale or reconstruction. Proof survives agency system replacements.'
  },
  {
    icon: FileCheck,
    title: 'Procurement & tender integrity',
    body: 'Stamp bid packets at submission time. Later disputes start from “what existed when,” not “who controls the file server.”'
  },
  {
    icon: Users,
    title: 'Civil status & vital records',
    body: 'Birth, marriage, and identity companion files can carry optional timestamps without centralizing biometrics on Satohash servers.'
  },
  {
    icon: Lightbulb,
    title: 'Distressed & recovery assets',
    body: 'Listings and chain docs for sovereign or corporate recovery programs with transparent content hashes for counterparties.'
  }
]

const USE_CASE_KEYS = [
  { key: 'passport', link: '/motopass-verify', icon: Plane },
  { key: 'distressed', link: '/distressed-asset', icon: Building2 },
  { key: 'custody', link: '/chain-of-custody', icon: Layers },
  { key: 'admissibility', link: '/evidence-admissibility', icon: Scale }
]

export default function GovernmentUse() {
  usePageMeta({ page: 'government' })
  const { t } = useTranslation()

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-8 pb-10 text-center sm:px-6 sm:pt-12 sm:pb-12">
        <Shield size={36} className="mx-auto mb-4" style={{ color: 'var(--accent-gold)' }} />
        <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
          {t('governmentUse.title', { defaultValue: 'Government' })}{' '}
          <span style={{ color: 'var(--accent-gold)' }}>
            {t('governmentUse.titleHighlight', { defaultValue: '& Diplomatic Use' })}
          </span>
        </h1>
        <p
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-[15px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('governmentUse.subtitle', {
            defaultValue:
              'Zero-knowledge timestamps for passports, national IDs, land titles, and distressed-asset programs. Documents never leave the device — only SHA-256 fingerprints reach OpenTimestamps calendars.'
          })}
        </p>
        <GiveABitBadge className="mt-6 justify-center" />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/stamp"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 py-3 text-xs font-black tracking-wider uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            <Fingerprint size={16} /> Free stamp
          </Link>
          <Link
            to="/batch-hash"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border px-6 py-3 text-xs font-black tracking-wider uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            Batch hash
          </Link>
          <Link
            to="/security"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border px-6 py-3 text-xs font-black tracking-wider uppercase"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Security model
          </Link>
        </div>
      </section>

      {/* Executive summary strip */}
      <section className="border-y px-4 py-10 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-center text-[10px] font-black tracking-[0.22em] uppercase"
            style={{ color: 'var(--accent-gold)' }}
          >
            At a glance
          </p>
          <h2 className="mb-6 text-center text-xl font-black tracking-tight sm:text-2xl">
            Why agencies explore Bitcoin-anchored proofs
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                k: 'Minutes, not months',
                v: 'A stranger can stamp a file and download .ots proof today — free tier open, no account wall.'
              },
              {
                k: 'No document upload',
                v: 'Only hashes leave the browser. Fits privacy, data-residency, and “air-gap then anchor” playbooks.'
              },
              {
                k: 'Survives vendor exit',
                v: 'Proofs verify against public calendars + Bitcoin — not a single SaaS database you must keep forever.'
              }
            ].map((card) => (
              <div
                key={card.k}
                className="rounded-2xl border p-4 text-left"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
              >
                <p className="text-sm font-black" style={{ color: 'var(--accent-gold)' }}>
                  {card.k}
                </p>
                <p
                  className="mt-2 text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {card.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Graphs */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p
          className="mb-2 text-center text-[10px] font-black tracking-[0.22em] uppercase"
          style={{ color: 'var(--accent-gold)' }}
        >
          Illustrative
        </p>
        <h2 className="mb-2 text-center text-xl font-black tracking-tight sm:text-2xl">
          Where proofs land in the stack
        </h2>
        <p
          className="mx-auto mb-8 max-w-2xl text-center text-xs leading-relaxed sm:text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Conceptual models for planning conversations — not production SLAs. Real stamp counts and
          IBD progress live on the API / HQ metrics plane.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          <BarChart
            title="Typical proof journey (time-to-value)"
            subtitle="From drop-file to portable .ots — calendar anchors first; Bitcoin confirmation later."
            bars={[
              { label: 'Local SHA-256', value: 1, display: '~1s', color: '#22d3a5' },
              { label: 'OTS calendars', value: 8, display: 'seconds', color: '#0ea5e9' },
              { label: 'Pending confirm', value: 45, display: 'minutes*', color: '#f0b429' },
              { label: 'Bitcoin locked', value: 100, display: 'blocks', color: '#f97316' }
            ]}
          />
          <DonutChart
            title="Evidence posture (agency workshop mix)"
            subtitle="How teams often allocate early pilots — hash-only first, then custody + templates."
            slices={[
              { label: 'Hash + .ots only', value: 42, color: '#f0b429' },
              { label: 'Chain of custody', value: 28, color: '#0ea5e9' },
              { label: 'Templates / forms', value: 18, color: '#8b5cf6' },
              { label: 'Batch / bulk', value: 12, color: '#22d3a5' }
            ]}
          />
          <BarChart
            title="Migration-style workloads"
            subtitle="Document families that benefit from client-side hashing before system cutovers."
            bars={[
              { label: 'Identity packets', value: 90, color: '#f0b429' },
              { label: 'Title / registry', value: 75, color: '#0ea5e9' },
              { label: 'Tender / RFP', value: 65, color: '#22d3a5' },
              { label: 'Diplomatic notes', value: 50, color: '#8b5cf6' },
              { label: 'Medical companions', value: 40, color: '#f43f5e' }
            ]}
          />
          <div
            className="rounded-2xl border p-4 sm:p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
          >
            <h3 className="text-sm font-black tracking-tight">Solid solutions checklist</h3>
            <ul className="mt-4 space-y-3">
              {[
                'Start free stamps on satohash.io — prove the loop before procurement paperwork',
                'Use batch hash for folder migrations; keep .ots with the archive',
                'Wire family apps via /stamp?hash=… deep-links (X-Satohash-Client attribution)',
                'Verify independently: structure check in browser + Bitcoin upgrade path',
                'Keep REQUIRE_LIGHTNING=false until you choose a fee model'
              ].map((line) => (
                <li key={line} className="flex gap-2 text-xs leading-relaxed">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: 'var(--accent-gold)' }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Solutions grid */}
      <section
        className="border-t px-4 py-12 sm:px-6"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center text-xl font-black tracking-tight sm:text-2xl">
            Solid solutions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SOLUTIONS.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.title}
                  className="rounded-2xl border p-5"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `${s.color}22`, color: s.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-black">{s.title}</h3>
                  <p
                    className="mt-2 text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {s.body}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ideas */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="mb-2 text-center text-xl font-black tracking-tight sm:text-2xl">
          Program ideas
        </h2>
        <p
          className="mx-auto mb-8 max-w-xl text-center text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          Discussion starters for digital transformation and migration workshops.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {IDEAS.map((idea) => {
            const Icon = idea.icon
            return (
              <div
                key={idea.title}
                className="flex gap-3 rounded-2xl border p-4"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
              >
                <Icon
                  size={20}
                  className="mt-0.5 shrink-0"
                  style={{ color: 'var(--accent-gold)' }}
                />
                <div>
                  <h3 className="text-sm font-black">{idea.title}</h3>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {idea.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Motopass — humble concept */}
      <section
        id="migration-concepts"
        className="border-t px-4 py-12 sm:px-6"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-3xl">
          <div
            className="rounded-2xl border p-5 sm:p-7"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 80%, transparent)',
              background: 'color-mix(in srgb, var(--surface-raised) 90%, transparent)'
            }}
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Sparkles size={16} style={{ color: 'var(--text-tertiary)' }} />
              <p
                className="text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Quiet R&amp;D · family stack
              </p>
            </div>
            <h2 className="text-lg font-black tracking-tight sm:text-xl">
              Migration tooling (early concept)
            </h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Across the Give A Bit family we experiment with small migration helpers — including a
              quiet prototype called{' '}
              <strong style={{ color: 'var(--text-primary)' }}>MotoPass</strong> for passport-style
              application packets. The idea is simple: hash sensitive packages client-side, then
              open Satohash with a deep-link so only the fingerprint is stamped.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              This is not a launch campaign. No hard sell. Think of it as a pattern: any program
              migrating identity or travel docs can wire the same{' '}
              <code
                className="rounded px-1.5 py-0.5 font-mono text-[11px]"
                style={{ background: 'var(--bg-primary)' }}
              >
                /stamp?hash=…&amp;ref=…
              </code>{' '}
              flow without shipping biometrics to the proof API.
            </p>
            <ul className="mt-4 space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
                Client-side hash → Satohash stamp → portable .ots beside the application archive
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
                Optional verify deep-links for auditors and counterparties
              </li>
              <li className="flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
                Attribution via family client headers for HQ metrics — not for public hype
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/motopass-verify"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-4 py-2 text-[11px] font-bold tracking-wider uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Verify pattern <ArrowRight size={12} />
              </Link>
              <Link
                to="/integrations"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border px-4 py-2 text-[11px] font-bold tracking-wider uppercase"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                Deep-link docs
              </Link>
              <a
                href="https://motopass.giveabit.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-[11px] font-semibold underline-offset-2 hover:underline"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Family prototype (external)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <h2 className="mb-6 text-center text-xl font-black tracking-tight">Use-case deep links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {USE_CASE_KEYS.map((c) => {
            const Icon = c.icon
            return (
              <Link
                key={c.link}
                to={c.link}
                className="rounded-2xl border p-5 transition-all hover:border-[var(--accent-gold)] active:scale-[0.99]"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
              >
                <Icon size={20} className="mb-2" style={{ color: 'var(--accent-gold)' }} />
                <h3 className="text-base font-black">{t(`governmentUse.${c.key}.title`)}</h3>
                <p
                  className="mt-2 text-xs leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t(`governmentUse.${c.key}.body`)}
                </p>
                <span
                  className="mt-4 inline-flex min-h-[40px] items-center gap-1 text-[10px] font-black tracking-widest uppercase"
                  style={{ color: 'var(--accent-active)' }}
                >
                  {t('governmentPage.learnMore', { defaultValue: 'Learn more' })}{' '}
                  <ArrowRight size={12} />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Procurement */}
      <section
        className="border-t px-4 py-12 sm:px-6"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <Fingerprint size={28} className="mx-auto mb-3" style={{ color: 'var(--accent-gold)' }} />
          <h2 className="text-xl font-black">
            {t('governmentPage.procurementTitle', { defaultValue: 'Procurement one-pager' })}
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('governmentPage.procurementBody', {
              defaultValue:
                'Air-gapped hashing, data residency in-browser, chain-of-custody workflows, and optional family deep-links for migration programs.'
            })}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/docs/executive-summary"
              className="inline-flex min-h-[48px] items-center rounded-xl px-6 py-3 text-xs font-black uppercase"
              style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            >
              {t('trustPage.procurementCta', { defaultValue: 'Executive summary' })}
            </Link>
            <Link
              to="/pitch"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              Pitch & partners
            </Link>
            <Link
              to="/security"
              className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
              style={{ borderColor: 'var(--border)' }}
            >
              {t('trustPage.securityLink', { defaultValue: 'Security' })}
            </Link>
          </div>
        </div>
      </section>

      {/* Ready CTA */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
        <h2 className="text-xl font-black">
          {t('governmentPage.readyStamp', { defaultValue: 'Ready to stamp?' })}
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {t('governmentPage.readyStampDesc', {
            defaultValue: 'Free stamps today. Proofs anchor toward Bitcoin via OpenTimestamps.'
          })}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/stamp"
            className="inline-flex min-h-[48px] items-center rounded-xl px-6 py-3 text-xs font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
          >
            {t('governmentPage.stampNow', { defaultValue: 'Stamp now' })}
          </Link>
          <Link
            to="/batch-hash"
            className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
            style={{ borderColor: 'var(--border)' }}
          >
            {t('governmentPage.batchHash', { defaultValue: 'Batch hash' })}
          </Link>
          <Link
            to="/templates"
            className="inline-flex min-h-[48px] items-center rounded-xl border px-6 py-3 text-xs font-black uppercase"
            style={{ borderColor: 'var(--border)' }}
          >
            Templates
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

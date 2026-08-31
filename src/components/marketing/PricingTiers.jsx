import { motion } from 'framer-motion'
import { Check, Zap, Building2, Bitcoin, Shield, Clock, Globe, ArrowRight } from 'lucide-react'

const TIERS = [
  {
    name: 'Free',
    description: 'Permanent trust anchor. Live now. Never paywalled.',
    price: { sats: 0, display: '0 sats', per: 'live now' },
    icon: Zap,
    color: 'gold',
    live: true,
    tag: 'Live now',
    features: [
      { text: 'Unlimited stamp / verify / .ots', included: true },
      { text: 'Client-side hashing — file never leaves the device', included: true },
      { text: '10 stamps / day cap', included: true },
      { text: 'Bitcoin-anchored OpenTimestamps proofs', included: true },
      { text: 'No account, no Lightning invoice', included: true },
      { text: 'Never paywalled', included: true },
      { text: 'Full vault / API / webhooks', included: false },
      { text: 'White-label / SLA', included: false }
    ],
    cta: 'Stamp a File',
    href: '/stamp',
    popular: false
  },
  {
    name: 'Professional',
    description: 'Built and staged. Individual, high-volume stamping.',
    price: { sats: 2100, display: '~2,100 sats', per: '/ mo (~$29)' },
    icon: Bitcoin,
    color: 'gold',
    live: false,
    tag: 'Built, staged',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Unlimited stamping / full vault (planned)', included: true },
      { text: 'API access + webhooks (planned)', included: true },
      { text: 'PDF exports + priority calendar (planned)', included: true },
      { text: 'Lightning billing when rails are funded', included: true },
      { text: 'Launches paid only once Lightning is funded', included: true },
      { text: 'White-label / SLA', included: false },
      { text: 'Live checkout today', included: false }
    ],
    cta: 'Coming soon',
    href: null,
    popular: true
  },
  {
    name: 'Business',
    description: 'Built and staged. Teams and studios (~$299/mo).',
    price: { sats: 21000, display: '~21,000 sats', per: '/ mo (~$299)' },
    icon: Building2,
    color: 'gold',
    live: false,
    tag: 'Built, staged',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Teams and studios', included: true },
      { text: 'White-label options (planned)', included: true },
      { text: 'SLA / priority support (planned)', included: true },
      { text: 'Volume + dedicated calendar path (planned)', included: true },
      { text: 'Launches paid only once Lightning is funded', included: true },
      { text: 'Enterprise (custom, partner-gated) is not marketed now', included: true },
      { text: 'Live checkout today', included: false }
    ],
    cta: 'Coming soon',
    href: null,
    popular: false
  }
]

const PAYMENT_INFO = [
  {
    icon: Bitcoin,
    title: 'Lightning when paid launches',
    description:
      'Paid tiers collect in sats over Lightning. Rails are built; they switch on only once channels are funded and tested. Free stays live either way.'
  },
  {
    icon: Clock,
    title: 'Pay-per-use API',
    description:
      'Developer access is 1–5 sats per stamp via L402 when billing is on. Not a replacement for the free 10/day trust anchor.'
  },
  {
    icon: Shield,
    title: 'Privacy first',
    description:
      'No KYC. Client-side hashing. Lightning payments, when live, do not require a credit card.'
  }
]

export default function PricingTiers() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <p className="text-center text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Free is live now. Professional and Business are built and staged — they launch paid only
        once Lightning rails are funded. Enterprise is custom and partner-gated, not marketed now.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => {
          const Icon = tier.icon

          return (
            <div
              key={tier.name}
              className="relative overflow-hidden rounded-2xl border"
              style={{
                borderColor: tier.popular || tier.live ? 'var(--border-gold)' : 'var(--border)',
                background: 'var(--surface-raised)',
                boxShadow: tier.popular ? '0 0 28px var(--accent-gold-glow)' : undefined
              }}
            >
              {tier.tag && (
                <div
                  className="absolute top-0 right-0 rounded-bl-lg px-4 py-1 text-[10px] font-black tracking-widest uppercase"
                  style={{
                    background: tier.live ? 'var(--accent-gold)' : 'var(--bg-primary)',
                    color: tier.live ? '#141b25' : 'var(--text-secondary)',
                    borderLeft: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  {tier.tag}
                </div>
              )}

              <div className="p-6">
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: 'color-mix(in srgb, var(--accent-gold) 12%, transparent)'
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: 'var(--accent-gold)' }} />
                </div>

                <h3 className="mb-1 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {tier.name}
                </h3>
                <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {tier.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-4xl font-bold"
                      style={{
                        color: tier.live ? 'var(--accent-gold)' : 'var(--text-primary)'
                      }}
                    >
                      {tier.price.display}
                    </span>
                    {tier.price.per && (
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {tier.price.per}
                      </span>
                    )}
                  </div>
                </div>

                {tier.href ? (
                  <a
                    href={tier.href}
                    className="mb-6 flex min-h-[44px] w-full items-center justify-center rounded-lg text-sm font-semibold"
                    style={{ background: 'var(--accent-gold)', color: '#141b25' }}
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mb-6 flex min-h-[44px] w-full items-center justify-center rounded-lg text-sm font-semibold opacity-70"
                    style={{
                      background: 'var(--bg-primary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {tier.cta}
                  </button>
                )}

                <ul className="space-y-3">
                  {tier.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check
                          className="h-5 w-5 flex-shrink-0"
                          style={{ color: 'var(--accent-gold)' }}
                        />
                      ) : (
                        <span
                          className="h-5 w-5 flex-shrink-0"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          —
                        </span>
                      )}
                      <span
                        style={{
                          color: feature.included ? 'var(--text-secondary)' : 'var(--text-muted)'
                        }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PAYMENT_INFO.map((info, idx) => {
          const Icon = info.icon
          return (
            <div
              key={idx}
              className="rounded-xl border p-6"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                style={{
                  background: 'color-mix(in srgb, var(--accent-gold) 16%, transparent)'
                }}
              >
                <Icon className="h-5 w-5" style={{ color: 'var(--accent-gold)' }} />
              </div>
              <h4 className="mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
                {info.title}
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {info.description}
              </p>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)' }}
      >
        <h3
          className="mb-6 flex items-center gap-2 text-xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          <Globe className="h-5 w-5" style={{ color: 'var(--accent-gold)' }} />
          Fair use
        </h3>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Live now
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex justify-between gap-4">
                <span>Free stamp / verify / .ots</span>
                <span style={{ color: 'var(--text-primary)' }}>10 / day</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Client-side hashing</span>
                <span style={{ color: 'var(--text-primary)' }}>Unlimited</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Paid checkout</span>
                <span style={{ color: 'var(--text-primary)' }}>Not live</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Staged (Lightning-funded)
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex justify-between gap-4">
                <span>Professional</span>
                <span style={{ color: 'var(--text-primary)' }}>~2,100 sats / mo</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Business / Studio</span>
                <span style={{ color: 'var(--text-primary)' }}>~21,000 sats / mo</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Pay-per-use API</span>
                <span style={{ color: 'var(--text-primary)' }}>1–5 sats / stamp (L402)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Free is the never-paywalled trust anchor. Need Enterprise (custom, partner-gated)?{' '}
            <a
              href="mailto:hello@giveabit.io?subject=Satohash Enterprise"
              className="ml-1"
              style={{ color: 'var(--accent-gold)' }}
            >
              Contact the team
            </a>
            .
          </p>
        </div>
      </div>

      <div className="py-8 text-center">
        <h3 className="mb-3 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Enterprise is partner-gated
        </h3>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          Custom pricing is not marketed now. Free remains live; paid tiers wait on funded Lightning
          rails.
        </p>
        <a
          href="mailto:hello@giveabit.io?subject=Satohash Enterprise"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-6 py-3"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <Building2 className="h-5 w-5" />
          Talk to us
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  )
}

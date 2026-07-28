/**
 * Full plane readiness — paywall, bitcoin, lightning, AI, nostr.
 * Used so Cam can flip switches knowing every element is in place.
 */
import { bitcoinRpcHealth } from './bitcoin-rpc.js'
import {
  isLnbitsConfigured,
  isLndConfigured,
  lnbitsWalletInfo,
  paywallStampPriceSats
} from './lnbits.js'
import { listNostrRelays, pingRelays } from '../nostr.js'

export async function buildReadinessReport() {
  const requireLightning = process.env.REQUIRE_LIGHTNING !== 'false'
  const familyKeys = Boolean(
    (process.env.FAMILY_API_KEYS || process.env.FAMILY_API_KEY || '').trim()
  )
  const anthropic = Boolean(process.env.ANTHROPIC_API_KEY?.trim())

  const [bitcoin, lnbits, nostrPings] = await Promise.all([
    bitcoinRpcHealth(),
    lnbitsWalletInfo(),
    pingRelays().catch(() => [])
  ])

  const nostrOk = (nostrPings || []).filter((r) => r.status === 'ok')
  const damus = (nostrPings || []).find((r) => r.url?.includes('damus'))

  const paywall = {
    mode: requireLightning ? 'paid' : 'free_open',
    require_lightning: requireLightning,
    flip_to_paid:
      'Set REQUIRE_LIGHTNING=true on THOR and rebuild/restart API (or env only if process reloads env)',
    flip_to_free: 'Set REQUIRE_LIGHTNING=false',
    stamp_price_sats: paywallStampPriceSats(),
    family_keys_configured: familyKeys,
    invoice_backend: isLnbitsConfigured()
      ? 'lnbits'
      : isLndConfigured()
        ? 'lnd'
        : 'mock_until_configured',
    ready_to_enable_paid: isLnbitsConfigured() || isLndConfigured(),
    missing_for_paid: []
  }
  if (!isLnbitsConfigured() && !isLndConfigured()) {
    paywall.missing_for_paid.push('LNBITS_URL + LNBITS_INVOICE_KEY (or LND_HOST + macaroon)')
  }
  if (!familyKeys) {
    paywall.missing_for_paid.push('optional FAMILY_API_KEYS for suite free tier when paid')
  }

  return {
    schema: 'satohash.readiness.v1',
    version: process.env.npm_package_version || '5.0.0-ELITE',
    timestamp: new Date().toISOString(),
    planes: {
      proof_api: { status: 'live', note: 'OTS stamp/verify' },
      paywall,
      bitcoin_node: bitcoin,
      lightning: {
        lnbits: lnbits,
        lnd_configured: isLndConfigured(),
        ready: isLnbitsConfigured() || isLndConfigured()
      },
      ai: {
        anthropic_key: anthropic,
        local_embeddings: true,
        local_fraud_ml: true,
        endpoints: [
          '/api/ai/summarize',
          '/api/ai/diff',
          '/api/ai/search',
          '/api/ai/fraud',
          '/api/ai/embed',
          '/api/compliance-check',
          '/api/templates/suggest'
        ],
        note: anthropic
          ? 'Claude + local ML both active'
          : 'Local embeddings + fraud ML active; set ANTHROPIC_API_KEY for LLM depth'
      },
      nostr: {
        relays: listNostrRelays(),
        ok_count: nostrOk.length,
        total: (nostrPings || []).length,
        damus: damus || null,
        pings: nostrPings,
        healthy: nostrOk.length >= 1,
        note: 'Success if ≥1 relay OK; damus may soft-fail bots'
      }
    },
    cam_switches: {
      keep_free: 'REQUIRE_LIGHTNING=false (current default intent)',
      enable_paywall: 'REQUIRE_LIGHTNING=true after LNBITS invoice key live',
      enable_own_node: 'BITCOIN_RPC_URL + AUTH on THOR bitcoind',
      hq_wallet_display: 'Paste Satohash LNbits invoice key into HQ Vault (browser)'
    }
  }
}

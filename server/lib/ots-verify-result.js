/**
 * The one wire shape for a verification answer (engine contract v2).
 *
 * WHY: every surface that reports on a proof — the public verify route, the
 * JSON verify route, the upgrade daemon logs — must say the same things with
 * the same words. Two rules are encoded here:
 *
 *  1. `verified` is a chain-resolved fact, never a registry flag and never a
 *     text match. It is only ever set from ots-chain-verify.js.
 *  2. The caller is always told how to reach the same conclusion WITHOUT
 *     trusting Satohash (`independent_verification` + the `.ots` download
 *     link). A proof registry that cannot be audited is just another
 *     authority, and the whole point of OTS is that it need not be one.
 */
import OpenTimestamps from 'opentimestamps'
import { explainVerification, VERIFY_METHOD } from './ots-chain-verify.js'
import { describeAttestations } from './ots-attestations.js'

/**
 * The real, usable `.ots` bytes for a registry row, or null.
 * Calendar placeholders (`ots:pending:<hash>`) are not proofs and must never be
 * handed out or verified — treating one as a proof is exactly how a fake
 * "confirmed" gets manufactured.
 */
export function realOtsBuffer (stamp) {
  const candidates = [stamp?.upgraded_binary, stamp?.ots_binary]
  for (const raw of candidates) {
    if (!raw) continue
    const buf = Buffer.from(raw)
    if (buf.length < 8) continue
    if (buf.toString('utf8', 0, 4) === 'ots:') continue
    return buf
  }
  return null
}

/**
 * Public download link for a registry row's `.ots` proof. This is what makes
 * the registry auditable: the caller can take the proof and check it without
 * asking us again.
 */
export function otsDownloadUrl (id) {
  const origin = (process.env.PUBLIC_API_ORIGIN || 'https://api.satohash.io').replace(/\/$/, '')
  return `${origin}/api/stamps/${id}?download=true`
}

/** `OpenTimestamps.info()` text — kept for display only, never as evidence. */
export function safeOtsInfo (detached) {
  try {
    return OpenTimestamps.info(detached)
  } catch {
    return null
  }
}

/**
 * Plain-language instructions for verifying a proof with no help from us.
 * Kept in the payload so a UI never has to invent assurance copy.
 */
export function independentVerification (otsUrl) {
  return {
    method: 'any OpenTimestamps client, on any machine, forever',
    needs: 'your own file + its .ots proof. No Satohash account, no API access, no permission.',
    command: otsUrl
      ? `ots verify yourfile.ots   (download the proof: ${otsUrl})`
      : 'ots verify yourfile.ots',
    tool: 'https://opentimestamps.org/',
    why: 'The .ots resolves against the Bitcoin blockchain itself, so Satohash does not have to be trusted — or even online.'
  }
}

/**
 * Build the canonical verification response body.
 *
 * @param {object} p
 * @param {object} p.verdict      from verifyDetachedAgainstChain()
 * @param {object|null} p.view    from inspectAttestations()
 * @param {object|null} p.binding from checkDigestBinding()
 * @param {string|null} [p.details] OpenTimestamps.info() text (display only)
 * @param {object|null} [p.registry] registry lookup result, when there was one
 * @param {object} [p.extra]       extra top-level fields (id, filename, ...)
 */
export function describeVerifyResult ({
  verdict,
  view = null,
  binding = null,
  details = null,
  registry = null,
  extra = {}
}) {
  const attestationView = view || {
    state: 'unknown',
    bitcoin: [],
    litecoin: [],
    pending: [],
    unknown: [],
    digest: null
  }
  const verified = Boolean(verdict?.verified)

  const body = {
    // ---- the verdict (chain-resolved) ----
    verified,
    verified_method: verified ? verdict.method : null,
    trust: verified ? verdict.trust : null,
    chain: verdict?.chain || 'bitcoin',
    reason: verified ? null : verdict?.reason || 'verification_failed',

    // ---- the anchor, when there is one ----
    bitcoin_block_height: verified ? verdict.height ?? null : null,
    block_hash: verified ? verdict.block_hash ?? null : null,
    block_time: verified ? verdict.block_time ?? null : null,
    merkle_root: verified ? verdict.merkle_root ?? null : null,
    commitment: verdict?.commitment ?? null,
    source: verdict?.source ?? null,

    // ---- what the proof itself claims (structured, never text-parsed) ----
    attestations: attestationView,
    attestation_summary: describeAttestations(attestationView),
    digest: attestationView.digest,
    hash_binding: binding,

    // ---- registry vs proof: two different things, labelled as such ----
    registry_check: Boolean(registry),
    registry_status: registry ? registry.status ?? null : null,
    registry,

    // ---- how to check it without us ----
    ots_download_url: null,
    independent_verification: null,

    // ---- display only ----
    status: verified ? 'confirmed' : attestationView.state === 'pending' ? 'pending' : 'unverified',
    explainer: explainVerification(verdict || {}),
    details,
    verification_method_note:
      verdict?.method === VERIFY_METHOD.OWN_NODE
        ? "Resolved against Satohash's own Bitcoin node — no third party trusted."
        : verdict?.method === VERIFY_METHOD.EXPLORER
          ? 'Resolved against a public Bitcoin explorer (own node was unavailable). Your .ots still proves this without Satohash.'
          : null,
    ...extra
  }

  body.independent_verification = independentVerification(body.ots_download_url)
  return body
}

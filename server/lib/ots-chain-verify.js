/**
 * Chain-resolved OpenTimestamps verification — the source of truth for
 * "confirmed" anywhere in the system.
 *
 * WHY THIS FILE EXISTS (F1 + F3, audit 2026-08-22 / t_da054829)
 * ------------------------------------------------------------
 * Two defects used to be in the verify path:
 *
 *  F1 — `POST /api/verify {hash}` answered from the registry's `status` column.
 *       That is Satohash's word, not proof. A registry lookup is not a verdict.
 *  F3 — every other path decided "confirmed" by grepping the rendered
 *       `OpenTimestamps.info()` text. A forged proof claiming block 999999
 *       passed. The regex was also brittle: the info format carries the height
 *       as `BitcoinBlockHeaderAttestation(<height>)`, which the old
 *       `/Bitcoin block (\d+)/` regex never matched.
 *
 * The fix is one rule, enforced here and nowhere else:
 *
 *      A proof is `confirmed` ONLY when a block header fetched from a real
 *      Bitcoin source commits to the digest the proof claims — i.e. the
 *      attestation's commitment equals that block's merkleroot.
 *
 * Verification source order:
 *   1. The plane's own bitcoind (BITCOIN_RPC_URL). Self-sovereign: no third
 *      party, no API key, nothing to trust. This is the default and the
 *      authority.
 *   2. Public Esplora (blockstream.info) — only when own node is unreachable
 *      or cannot answer, and always labelled `third-party-explorer` so callers
 *      and UIs can be honest about it. Never silent.
 *
 * Everything else (no block attestation, a block height that does not exist, a
 * merkle root that does not match) is a hard `verified: false`.
 */
// The library's own Esplora client. `opentimestamps` (its index.js) does not
// re-export Esplora, so it is imported from the subpath; the package has no
// "exports" map, so the subpath is stable.
import Esplora from 'opentimestamps/src/esplora.js'
import logger from '../logger.js'
import { bitcoinRpc, isBitcoinRpcConfigured } from './bitcoin-rpc.js'
import {
  bitcoinAttestationObjects,
  bytesToHex,
  describeAttestations,
  inspectAttestations
} from './ots-attestations.js'

export const VERIFY_METHOD = {
  OWN_NODE: 'bitcoind',
  EXPLORER: 'esplora'
}

export const VERIFY_TRUST = {
  SELF_SOVEREIGN: 'self-sovereign',
  THIRD_PARTY_EXPLORER: 'third-party-explorer'
}

const DEFAULT_TIMEOUT_MS = Number(process.env.OTS_VERIFY_TIMEOUT_MS || 8000)
const ESPLORA_URL = process.env.OTS_ESPLORA_URL || 'https://blockstream.info/api'

function verdict ({ verified, method = null, trust = null, reason = null, payload = {} }) {
  return { verified, method, trust, chain: 'bitcoin', reason, ...payload }
}

/** Is this RPC error "that block height cannot exist" (a definitive NO)? */
function isMissingBlockError (message = '') {
  const m = String(message).toLowerCase()
  return (
    m.includes('out of range') ||
    m.includes('not found') ||
    m.includes('invalid parameter')
  )
}

/**
 * Fetch one block header from the plane's own bitcoind.
 * Header lookups work on a pruned node (the block index keeps every header),
 * so an old stamp is still independently verifiable here.
 */
async function ownNodeHeader (height, timeoutMs) {
  const blockHash = await bitcoinRpc('getblockhash', [height], { timeoutMs })
  const header = await bitcoinRpc('getblockheader', [blockHash, true], { timeoutMs })
  return { blockHash, header }
}

/** Mirrors the library: commitment byte-reversed vs the block's merkleroot. */
function checkMerkle (attestationObj, header) {
  return attestationObj.attestation.verifyAgainstBlockheader(
    attestationObj.msg.slice().reverse(),
    header
  )
}

/**
 * Verify a parsed proof against the plane's own bitcoind.
 * Never throws for data reasons — always returns a verdict fragment.
 */
export async function verifyWithOwnNode (detached, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const attestations = bitcoinAttestationObjects(detached)
  if (attestations.length === 0) {
    return verdict({ verified: false, reason: 'no_block_attestation', payload: { attestations_tried: [] } })
  }
  if (!isBitcoinRpcConfigured()) {
    return verdict({ verified: false, reason: 'own_node_not_configured', payload: { attestations_tried: [] } })
  }

  const tried = []
  let sawTransportFailure = false

  for (const attestationObj of attestations) {
    const height = attestationObj.height
    try {
      const { blockHash, header } = await ownNodeHeader(height, timeoutMs)
      const blockTime = checkMerkle(attestationObj, header)
      return verdict({
        verified: true,
        method: VERIFY_METHOD.OWN_NODE,
        trust: VERIFY_TRUST.SELF_SOVEREIGN,
        payload: {
          height,
          block_hash: blockHash,
          block_time: blockTime,
          merkle_root: header?.merkleroot ?? null,
          commitment: bytesToHex(attestationObj.msg),
          source: 'own bitcoind (getblockhash + getblockheader over RPC)',
          attestations_tried: [
            ...tried,
            { height, source: VERIFY_METHOD.OWN_NODE, outcome: 'verified' }
          ]
        }
      })
    } catch (err) {
      const message = err?.message || String(err)
      const merkleMismatch = /merkleroot|expected digest/i.test(message)
      const missingBlock = isMissingBlockError(message)

      if (merkleMismatch || missingBlock) {
        // The node answered and the answer is NO. Definitive — do not retry
        // elsewhere: another source would only re-read the same chain.
        tried.push({
          height,
          source: VERIFY_METHOD.OWN_NODE,
          outcome: merkleMismatch ? 'merkle_root_mismatch' : 'block_does_not_exist',
          detail: message.slice(0, 200)
        })
        return verdict({
          verified: false,
          method: VERIFY_METHOD.OWN_NODE,
          trust: VERIFY_TRUST.SELF_SOVEREIGN,
          reason: merkleMismatch ? 'merkle_root_mismatch' : 'block_does_not_exist',
          payload: { height, commitment: bytesToHex(attestationObj.msg), attestations_tried: tried }
        })
      }

      // Transport / pruned-data trouble: own node could not answer at all.
      sawTransportFailure = true
      tried.push({
        height,
        source: VERIFY_METHOD.OWN_NODE,
        outcome: 'unavailable',
        detail: message.slice(0, 200)
      })
      logger.warn('ots verify: own node unavailable for height %s: %s', height, message)
    }
  }

  return verdict({
    verified: false,
    reason: sawTransportFailure ? 'own_node_unavailable' : 'verification_failed',
    payload: { attestations_tried: tried }
  })
}

/**
 * Verify a parsed proof against a public Esplora explorer. Fallback only —
 * the returned verdict always carries `third-party-explorer` trust.
 */
export async function verifyWithExplorer (detached, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const attestations = bitcoinAttestationObjects(detached)
  if (attestations.length === 0) {
    return verdict({ verified: false, reason: 'no_block_attestation', payload: { attestations_tried: [] } })
  }

  const tried = []
  const esplora = new Esplora({ url: ESPLORA_URL, timeout: timeoutMs })

  for (const attestationObj of attestations) {
    const height = attestationObj.height
    try {
      const blockHash = await esplora.blockhash(height)
      const block = await esplora.block(blockHash)
      const blockTime = checkMerkle(attestationObj, block)
      return verdict({
        verified: true,
        method: VERIFY_METHOD.EXPLORER,
        trust: VERIFY_TRUST.THIRD_PARTY_EXPLORER,
        payload: {
          height,
          block_hash: blockHash,
          block_time: blockTime,
          merkle_root: block?.merkleroot ?? null,
          commitment: bytesToHex(attestationObj.msg),
          source: `public explorer (${ESPLORA_URL})`,
          note: 'Own bitcoind was unavailable — this verdict leans on a third-party explorer.',
          attestations_tried: [
            ...tried,
            { height, source: VERIFY_METHOD.EXPLORER, outcome: 'verified' }
          ]
        }
      })
    } catch (err) {
      const message = err?.message || String(err)
      tried.push({
        height,
        source: VERIFY_METHOD.EXPLORER,
        outcome: /merkleroot|expected digest/i.test(message) ? 'merkle_root_mismatch' : 'unavailable',
        detail: message.slice(0, 200)
      })
    }
  }

  return verdict({ verified: false, reason: 'explorer_verify_failed', payload: { attestations_tried: tried } })
}

/**
 * The one verification entry point used by every route and daemon:
 * own bitcoind first (the authority), explorer only as a labelled fallback.
 *
 * @param {import('opentimestamps').DetachedTimestampFile} detached parsed proof
 * @param {object} [options]
 * @param {number} [options.timeoutMs]
 * @param {boolean} [options.allowExplorerFallback=true]
 * @returns {Promise<object>} verdict — always resolves, never throws on bad data
 */
export async function verifyDetachedAgainstChain (detached, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, allowExplorerFallback = true } = options

  const own = await verifyWithOwnNode(detached, { timeoutMs })
  if (own.verified) return own

  const definitiveNo = own.reason === 'merkle_root_mismatch' || own.reason === 'block_does_not_exist'
  if (definitiveNo) return own

  if (!allowExplorerFallback) return own

  const explorer = await verifyWithExplorer(detached, { timeoutMs })
  return {
    ...explorer,
    own_node_attempt: { reason: own.reason, attempts: own.attestations_tried || [] }
  }
}

/**
 * Does the proof actually commit to the hash the caller asked about?
 * (Content-binding responsibility, engine contract §1.6 — a `.ots` is detached
 * over a digest, so this is the only thing tying the proof to the content.)
 * @returns {{bound: boolean, digest: string|null, state: string, summary: string}}
 */
export function checkDigestBinding (detached, expectedHashHex) {
  const view = inspectAttestations(detached)
  return {
    bound: Boolean(
      view.digest &&
      expectedHashHex &&
      view.digest.toLowerCase() === String(expectedHashHex).toLowerCase()
    ),
    digest: view.digest,
    state: view.state,
    summary: describeAttestations(view)
  }
}

/**
 * The plain-language, no-jargon explainer used across the family surfaces.
 * Kept next to the verdict so API copy and UI copy cannot drift apart.
 */
export function explainVerification (v) {
  if (v.verified && v.method === VERIFY_METHOD.OWN_NODE) {
    return `Verified against Satohash's own Bitcoin node — block ${v.height}. No third party was trusted.`
  }
  if (v.verified && v.method === VERIFY_METHOD.EXPLORER) {
    return `Verified against a public Bitcoin explorer — block ${v.height}. You can confirm the same thing yourself with the .ots file and any Bitcoin tool.`
  }
  if (v.reason === 'no_block_attestation') {
    return 'This proof has no Bitcoin block in it yet — it is still waiting for Bitcoin to confirm (usually minutes to a few hours).'
  }
  if (v.reason === 'merkle_root_mismatch') {
    return 'The proof points at a Bitcoin block that does not commit to this file. It does not prove anything.'
  }
  if (v.reason === 'block_does_not_exist') {
    return 'The proof names a Bitcoin block that does not exist. It does not prove anything.'
  }
  if (v.reason === 'own_node_unavailable' || v.reason === 'explorer_verify_failed') {
    return 'Could not reach a Bitcoin source to check this proof right now. Try again shortly — and you can always verify the .ots yourself with any OpenTimestamps tool.'
  }
  if (v.reason === 'digest_mismatch') {
    return 'That proof is for a different file — the hash inside it does not match yours.'
  }
  return 'This proof did not verify.'
}

/**
 * Structured OpenTimestamps attestation inspection.
 *
 * WHY THIS FILE EXISTS (F3, audit 2026-08-22 / t_da054829)
 * --------------------------------------------------------
 * Confirmation used to be detected by pattern-matching the human-readable text
 * that `OpenTimestamps.info()` prints (`info.includes('Bitcoin block')`,
 * `info.match(/Bitcoin block (\d+)/)`). That text is a *rendering* of the proof,
 * not the proof, and it is printed from what the file claims. A hand-forged
 * `.ots` carrying a BitcoinBlockHeaderAttestation at height 999999 — a block
 * that does not exist and whose merkle root never committed to the digest —
 * renders "Bitcoin block" and was therefore reported as verified by the live
 * API. Text is never evidence.
 *
 * The only sanctioned way to read a proof's state is to walk its parsed
 * attestation tree (`timestamp.allAttestations()`), which yields real
 * typed attestation objects. Everything downstream (the verify route, the
 * JSON verify path, the upgrade route and the upgrade daemon) must go through
 * this module so there is exactly one interpretation of a proof in the system.
 *
 * Note: an attestation here is a *claim* ("block N committed to this digest").
 * It is only a fact once ots-chain-verify.js has resolved it against a real
 * block header. Never treat this module's output as a verdict.
 */
import OpenTimestamps from 'opentimestamps'

const { Notary, Utils } = OpenTimestamps

export const OTS_STATE = {
  CONFIRMED: 'confirmed', // carries a Bitcoin (or Litecoin) block header attestation
  PENDING: 'pending', // only calendar attestations so far — no block anchor yet
  UNKNOWN: 'unknown' // parseable, but nothing that can ever resolve
}

export function bytesToHex (bytes) {
  return Utils.bytesToHex(bytes)
}

/**
 * Parse a serialized `.ots` proof. The single deserialize entry point.
 * @param {Buffer|Uint8Array} buffer
 * @returns {import('opentimestamps').DetachedTimestampFile}
 */
export function parseOts (buffer) {
  return OpenTimestamps.DetachedTimestampFile.deserialize(buffer)
}

/**
 * Walk every attestation in a proof and return a JSON-safe description.
 * The returned object is safe to put on the wire: no library objects leak.
 *
 * @param {import('opentimestamps').DetachedTimestampFile} detached
 * @returns {{
 *   digest: string|null,            // the SHA-256 the proof is detached over
 *   state: 'confirmed'|'pending'|'unknown',
 *   bitcoin: Array<{height:number, commitment:string}>,
 *   litecoin: Array<{height:number, commitment:string}>,
 *   pending: Array<{uri:string}>,
 *   unknown: Array<{tag:string}>
 * }}
 */
export function inspectAttestations (detached) {
  const view = {
    digest: null,
    state: OTS_STATE.UNKNOWN,
    bitcoin: [],
    litecoin: [],
    pending: [],
    unknown: []
  }

  if (!detached || !detached.timestamp || typeof detached.timestamp.allAttestations !== 'function') {
    return view
  }

  try {
    view.digest = bytesToHex(detached.fileDigest())
  } catch {
    view.digest = null
  }

  detached.timestamp.allAttestations().forEach((attestation, msg) => {
    const commitment = safeHex(msg)
    if (attestation instanceof Notary.BitcoinBlockHeaderAttestation) {
      view.bitcoin.push({ height: Number(attestation.height), commitment })
    } else if (attestation instanceof Notary.LitecoinBlockHeaderAttestation) {
      view.litecoin.push({ height: Number(attestation.height), commitment })
    } else if (attestation instanceof Notary.PendingAttestation) {
      view.pending.push({ uri: String(attestation.uri || '') })
    } else {
      view.unknown.push({ tag: safeHex(attestation?._TAG ? attestation._TAG() : []) })
    }
  })

  // Ascending block height: the earliest anchor is the one that counts.
  view.bitcoin.sort((a, b) => a.height - b.height)
  view.litecoin.sort((a, b) => a.height - b.height)

  if (view.bitcoin.length > 0 || view.litecoin.length > 0) {
    view.state = OTS_STATE.CONFIRMED
  } else if (view.pending.length > 0) {
    view.state = OTS_STATE.PENDING
  }

  return view
}

/**
 * The block heights a proof *claims*, in ascending order, read from the
 * structured tree. This replaces every `info.match(/Bitcoin block (\d+)/)`
 * and `parseBitcoinBlockHeight(info)` call site.
 * @param {import('opentimestamps').DetachedTimestampFile} detached
 * @returns {number[]}
 */
export function claimedBitcoinHeights (detached) {
  return inspectAttestations(detached).bitcoin.map((a) => a.height)
}

/**
 * The lowest claimed Bitcoin block height, or null. Convenience for callers
 * that need a single number (e.g. the registry's `bitcoin_block_height`).
 * @param {import('opentimestamps').DetachedTimestampFile} detached
 * @returns {number|null}
 */
export function claimedBlockHeight (detached) {
  const heights = claimedBitcoinHeights(detached)
  return heights.length > 0 ? heights[0] : null
}

/**
 * Raw (attestation, message) pairs with the live library objects attached —
 * for the verifier, which needs to run the merkle-root check. NOT JSON-safe:
 * never send this to a client.
 * @param {import('opentimestamps').DetachedTimestampFile} detached
 * @returns {Array<{attestation: object, msg: number[], height: number}>}
 */
export function bitcoinAttestationObjects (detached) {
  const out = []
  if (!detached || !detached.timestamp) return out
  detached.timestamp.allAttestations().forEach((attestation, msg) => {
    if (attestation instanceof Notary.BitcoinBlockHeaderAttestation) {
      out.push({ attestation, msg, height: Number(attestation.height) })
    }
  })
  return out.sort((a, b) => a.height - b.height)
}

function safeHex (bytes) {
  try {
    return bytesToHex(bytes)
  } catch {
    return null
  }
}

/**
 * Human-readable one-line summary for logs and `details` fields. Built from the
 * structured view so it can never claim more than the proof carries.
 * @param {ReturnType<typeof inspectAttestations>} view
 */
export function describeAttestations (view) {
  const parts = []
  if (view.bitcoin.length > 0) {
    parts.push(`bitcoin block claim(s): ${view.bitcoin.map((a) => a.height).join(', ')}`)
  }
  if (view.litecoin.length > 0) {
    parts.push(`litecoin block claim(s): ${view.litecoin.map((a) => a.height).join(', ')}`)
  }
  if (view.pending.length > 0) {
    parts.push(`pending calendar attestation(s): ${view.pending.length}`)
  }
  if (view.unknown.length > 0) {
    parts.push(`unknown attestation(s): ${view.unknown.length}`)
  }
  return parts.length > 0 ? parts.join('; ') : 'no attestations'
}

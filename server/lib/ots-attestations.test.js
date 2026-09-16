/**
 * Unit tests for the structured OTS attestation reader and the chain verifier's
 * offline paths. No network, no bitcoind — these pin the *interpretation* of a
 * proof, which is what F3 was about.
 *
 * The anchor of the whole suite: a proof is a set of claims. `inspectAttestations`
 * reports claims; only `verifyDetachedAgainstChain` (exercised live in
 * tests/ots-verify-soundness.mjs) turns a claim into a fact. A forged proof must
 * read as "claims block N" and must never be mistaken for verified.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import crypto from 'crypto'
import OpenTimestamps from 'opentimestamps'
import {
  inspectAttestations,
  claimedBitcoinHeights,
  claimedBlockHeight,
  describeAttestations,
  bitcoinAttestationObjects,
  OTS_STATE
} from './ots-attestations.js'
import { verifyWithOwnNode, VERIFY_METHOD } from './ots-chain-verify.js'

function sha256Bytes (label) {
  return Array.from(crypto.createHash('sha256').update(label).digest())
}

/** A proof that merely CLAIMS a Bitcoin block — no chain contact involved. */
function forgeProof (height, label = 'forged') {
  const ts = new OpenTimestamps.Timestamp(sha256Bytes(label))
  ts.attestations.push(new OpenTimestamps.Notary.BitcoinBlockHeaderAttestation(height))
  return new OpenTimestamps.DetachedTimestampFile(new OpenTimestamps.Ops.OpSHA256(), ts)
}

/** A freshly stamped proof: pending calendar attestation only. */
function pendingProof (label = 'pending') {
  const ts = new OpenTimestamps.Timestamp(sha256Bytes(label))
  ts.attestations.push(new OpenTimestamps.Notary.PendingAttestation('https://alice.btc.calendar.opentimestamps.org'))
  return new OpenTimestamps.DetachedTimestampFile(new OpenTimestamps.Ops.OpSHA256(), ts)
}

function emptyProof (label = 'empty') {
  return new OpenTimestamps.DetachedTimestampFile(
    new OpenTimestamps.Ops.OpSHA256(),
    new OpenTimestamps.Timestamp(sha256Bytes(label))
  )
}

const savedRpc = { ...process.env }

beforeEach(() => {
  delete process.env.BITCOIN_RPC_URL
  delete process.env.BITCOIN_RPC_AUTH
})

afterEach(() => {
  process.env.BITCOIN_RPC_URL = savedRpc.BITCOIN_RPC_URL
  process.env.BITCOIN_RPC_AUTH = savedRpc.BITCOIN_RPC_AUTH
})

describe('inspectAttestations — structured, never text-parsed', () => {
  it('reads a claimed Bitcoin block height from the proof tree', () => {
    const view = inspectAttestations(forgeProof(999999))
    expect(view.bitcoin).toHaveLength(1)
    expect(view.bitcoin[0].height).toBe(999999)
    expect(view.state).toBe(OTS_STATE.CONFIRMED)
    expect(view.unknown).toHaveLength(0)
    expect(view.pending).toHaveLength(0)
  })

  it('reports a freshly stamped proof as pending, with its calendar', () => {
    const view = inspectAttestations(pendingProof())
    expect(view.state).toBe(OTS_STATE.PENDING)
    expect(view.pending).toHaveLength(1)
    expect(view.pending[0].uri).toContain('alice.btc.calendar')
    expect(view.bitcoin).toHaveLength(0)
  })

  it('reports a proof with no attestations as unknown', () => {
    const view = inspectAttestations(emptyProof())
    expect(view.state).toBe(OTS_STATE.UNKNOWN)
    expect(view.bitcoin).toHaveLength(0)
    expect(view.pending).toHaveLength(0)
  })

  it('surfaces the digest the proof is detached over (content binding)', () => {
    const detached = forgeProof(963600, 'digest-check')
    const view = inspectAttestations(detached)
    expect(view.digest).toBe(crypto.createHash('sha256').update('digest-check').digest('hex'))
  })

  it('claimedBitcoinHeights/claimedBlockHeight return the lowest claim first', () => {
    // Two claims at two different levels of the proof tree. (Note: the library
    // keys allAttestations() by message, so two attestations sitting on the
    // *same* message collapse to one — nesting is the only way to carry more.)
    const ts = new OpenTimestamps.Timestamp(sha256Bytes('multi'))
    ts.attestations.push(new OpenTimestamps.Notary.BitcoinBlockHeaderAttestation(970000))
    const deeper = ts.add(new OpenTimestamps.Ops.OpSHA256())
    deeper.attestations.push(new OpenTimestamps.Notary.BitcoinBlockHeaderAttestation(963545))
    const detached = new OpenTimestamps.DetachedTimestampFile(new OpenTimestamps.Ops.OpSHA256(), ts)
    expect(claimedBitcoinHeights(detached)).toEqual([963545, 970000])
    expect(claimedBlockHeight(detached)).toBe(963545)
  })

  it('describeAttestations describes claims as claims, not as verification', () => {
    const summary = describeAttestations(inspectAttestations(forgeProof(999999)))
    expect(summary).toContain('claim')
    expect(summary).toContain('999999')
  })

  it('bitcoinAttestationObjects returns live objects for the merkle check', () => {
    const objects = bitcoinAttestationObjects(forgeProof(963600))
    expect(objects).toHaveLength(1)
    expect(typeof objects[0].attestation.verifyAgainstBlockheader).toBe('function')
    expect(Array.isArray(objects[0].msg)).toBe(true)
  })
})

describe('verifyWithOwnNode — offline paths', () => {
  it('refuses to invent a verdict when own bitcoind is not configured', async () => {
    const r = await verifyWithOwnNode(forgeProof(999999))
    expect(r.verified).toBe(false)
    expect(r.reason).toBe('own_node_not_configured')
    expect(r.method).toBeNull()
  })

  it('reports no_block_attestation for a proof with no block claim', async () => {
    const r = await verifyWithOwnNode(emptyProof())
    expect(r.verified).toBe(false)
    expect(r.reason).toBe('no_block_attestation')
  })

  it('never reports verified:true without a resolved block', async () => {
    process.env.BITCOIN_RPC_URL = 'http://127.0.0.1:1/' // unreachable on purpose
    process.env.OTS_VERIFY_TIMEOUT_MS = '300'
    const r = await verifyWithOwnNode(forgeProof(963600))
    expect(r.verified).toBe(false)
    expect(r.height).toBeUndefined()
    expect(VERIFY_METHOD.OWN_NODE).toBe('bitcoind')
  })
})

import { createHash, randomBytes } from 'crypto'
import { describe, expect, it } from 'vitest'
import { parsePaymentProof, preimagePaysHash } from './payment-proof.js'

function paidPair() {
  const preimage = randomBytes(32).toString('hex')
  const paymentHash = createHash('sha256').update(Buffer.from(preimage, 'hex')).digest('hex')
  return { preimage, paymentHash }
}

describe('parsePaymentProof', () => {
  it('ignores a typed L402 header', () => {
    expect(parsePaymentProof({ authorization: 'L402 not-a-payment' })).toEqual({
      preimage: '',
      paymentHash: ''
    })
  })

  it('ignores a short preimage', () => {
    expect(parsePaymentProof({ 'x-preimage': 'abcd' })).toEqual({
      preimage: '',
      paymentHash: ''
    })
  })

  it('reads a 32-byte preimage and payment hash', () => {
    const { preimage, paymentHash } = paidPair()
    expect(
      parsePaymentProof({
        'x-preimage': preimage.toUpperCase(),
        'x-payment-hash': paymentHash
      })
    ).toEqual({ preimage, paymentHash })
  })
})

describe('preimagePaysHash', () => {
  it('accepts only the hash of that preimage', () => {
    const { preimage, paymentHash } = paidPair()
    expect(preimagePaysHash(preimage, paymentHash)).toBe(true)
    const flipped = (paymentHash[0] === 'a' ? 'b' : 'a') + paymentHash.slice(1)
    expect(preimagePaysHash(preimage, flipped)).toBe(false)
    expect(preimagePaysHash('nope', paymentHash)).toBe(false)
  })
})

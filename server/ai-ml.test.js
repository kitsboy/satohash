import { describe, it, expect } from 'vitest'
import { embedText, cosineSimilarity, fraudScore, semanticRank } from './ai-ml.js'

describe('ai-ml local embeddings + fraud', () => {
  it('embeds with fixed dim and unit-ish norm', () => {
    const v = embedText('satohash open timestamps bitcoin proof')
    expect(v).toHaveLength(64)
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0))
    expect(norm).toBeGreaterThan(0.99)
    expect(norm).toBeLessThan(1.01)
  })

  it('similar texts have higher cosine than unrelated', () => {
    const a = embedText('bitcoin open timestamps proof of existence')
    const b = embedText('bitcoin ots proof existence notarize')
    const c = embedText('banana smoothie recipe sugar milk')
    expect(cosineSimilarity(a, b)).toBeGreaterThan(cosineSimilarity(a, c))
  })

  it('fraud score identical is low', () => {
    const f = fraudScore('hello world', 'hello world')
    expect(f.risk).toBe('low')
    expect(f.features.identical).toBe(true)
  })

  it('fraud score divergent is elevated', () => {
    const f = fraudScore(
      'Party A pays Party B one bitcoin on 2020-01-01',
      'Party A pays Party B one million bitcoin on 2099-12-31 secretly'
    )
    expect(f.risk_score).toBeGreaterThan(0.2)
    expect(f.model).toBe('satohash-fraud-ml-v1')
  })

  it('semanticRank orders relevant first', () => {
    const items = [
      { id: 1, t: 'banana recipe' },
      { id: 2, t: 'bitcoin ots notary stamp proof' }
    ]
    const ranked = semanticRank('bitcoin stamp proof', items, (i) => i.t)
    expect(ranked[0].item.id).toBe(2)
  })
})

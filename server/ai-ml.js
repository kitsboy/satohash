/**
 * Local embeddings + fraud scoring — runs without external keys.
 * Optional Claude enrichment when ANTHROPIC_API_KEY is set (callers handle that).
 */
import crypto from 'crypto'

const EMBED_DIM = 64

/** Deterministic bag-of-tokens embedding (local, no API). */
export function embedText(text = '') {
  const vec = new Float64Array(EMBED_DIM)
  const tokens = String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1)
  if (tokens.length === 0) return Array.from(vec)
  for (const t of tokens) {
    const h = crypto.createHash('sha256').update(t).digest()
    for (let i = 0; i < EMBED_DIM; i++) {
      vec[i] += (h[i % h.length] / 255) * 2 - 1
    }
  }
  // L2 normalize
  let norm = 0
  for (let i = 0; i < EMBED_DIM; i++) norm += vec[i] * vec[i]
  norm = Math.sqrt(norm) || 1
  for (let i = 0; i < EMBED_DIM; i++) vec[i] /= norm
  return Array.from(vec)
}

export function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0
  let dot = 0
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i]
  return Math.max(-1, Math.min(1, dot))
}

function charFreq(s) {
  const m = new Map()
  for (const c of s) m.set(c, (m.get(c) || 0) + 1)
  return m
}

function shannonEntropy(s) {
  if (!s.length) return 0
  const m = charFreq(s)
  let e = 0
  for (const n of m.values()) {
    const p = n / s.length
    e -= p * Math.log2(p)
  }
  return e
}

function jaccardTokens(a, b) {
  const A = new Set(a.toLowerCase().split(/\s+/).filter(Boolean))
  const B = new Set(b.toLowerCase().split(/\s+/).filter(Boolean))
  if (A.size === 0 && B.size === 0) return 1
  let inter = 0
  for (const t of A) if (B.has(t)) inter++
  const union = A.size + B.size - inter
  return union ? inter / union : 0
}

/**
 * Fraud / change risk model (heuristic ML). Returns score 0–1 and features.
 */
export function fraudScore(a = '', b = '') {
  const ja = jaccardTokens(a, b)
  const lenA = a.length || 1
  const lenB = b.length || 1
  const lenRatio = Math.min(lenA, lenB) / Math.max(lenA, lenB)
  const embSim = cosineSimilarity(embedText(a), embedText(b))
  const entA = shannonEntropy(a)
  const entB = shannonEntropy(b)
  const entDelta = Math.abs(entA - entB)

  // High risk when low similarity + big structural change
  const risk =
    1 - 0.35 * ja - 0.35 * Math.max(0, embSim) - 0.2 * lenRatio + 0.1 * Math.min(1, entDelta / 4)

  const clamped = Math.max(0, Math.min(1, risk))
  let level = 'low'
  if (clamped >= 0.66) level = 'high'
  else if (clamped >= 0.33) level = 'medium'

  return {
    risk_score: Number(clamped.toFixed(4)),
    risk: level,
    model: 'satohash-fraud-ml-v1',
    features: {
      jaccard_tokens: Number(ja.toFixed(4)),
      embedding_cosine: Number(embSim.toFixed(4)),
      length_ratio: Number(lenRatio.toFixed(4)),
      entropy_a: Number(entA.toFixed(4)),
      entropy_b: Number(entB.toFixed(4)),
      entropy_delta: Number(entDelta.toFixed(4)),
      identical: a === b
    },
    summary:
      a === b
        ? 'Documents identical — low fraud signal.'
        : `Change risk ${level} (score ${clamped.toFixed(2)}). Jaccard=${ja.toFixed(2)}, embed=${embSim.toFixed(2)}.`
  }
}

export function semanticRank(query, items, textFn) {
  const qv = embedText(query)
  return items
    .map((item) => {
      const text = textFn(item)
      const score = cosineSimilarity(qv, embedText(text))
      return { item, score }
    })
    .sort((a, b) => b.score - a.score)
}

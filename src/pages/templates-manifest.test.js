import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const manifest = JSON.parse(readFileSync(join(root, 'public/data/templates-manifest.json'), 'utf8'))

describe('templates-manifest', () => {
  it('has all category and non-empty template list', () => {
    expect(manifest.categories?.some((c) => c.id === 'all')).toBe(true)
    expect(manifest.templates?.length).toBeGreaterThan(5)
  })

  it('every template category exists and counts stay positive', () => {
    const ids = new Set(manifest.categories.map((c) => c.id))
    for (const tpl of manifest.templates) {
      expect(ids.has(tpl.category) || ids.has('all')).toBe(true)
      expect(tpl.title).toBeTruthy()
      expect(tpl.id).toBeTruthy()
    }
    for (const cat of manifest.categories) {
      if (cat.id === 'all') continue
      const n = manifest.templates.filter((t) => t.category === cat.id).length
      expect(n).toBeGreaterThan(0)
    }
  })

  it('category labels fit professional chip UI (bounded length)', () => {
    for (const cat of manifest.categories) {
      expect(cat.label.length).toBeLessThanOrEqual(28)
    }
  })
})

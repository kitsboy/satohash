import { describe, it, expect } from 'vitest'
import { TEMPLATES } from './NotaryTemplates.jsx'
import manifest from '../../public/data/templates-manifest.json'

/** Government / travel IDs that must open a real editor (not CTA shells). */
const GOVERNMENT_TEMPLATE_IDS = [
  'passport-attestation',
  'national-id-attestation',
  'diplomatic-note',
  'beneficial-ownership',
  'apostille-companion'
]

const CTA_SECTION_IDS = ['make-your-own', 'api-benefits']

describe('government templates wired to TEMPLATES', () => {
  it('exports every government manifest ID as a full NotaryTemplates entry', () => {
    const ids = new Set(TEMPLATES.map((t) => t.id))
    for (const id of GOVERNMENT_TEMPLATE_IDS) {
      expect(ids.has(id), `missing TEMPLATES entry for ${id}`).toBe(true)
    }
  })

  it('government templates have fields and demoData for the editor', () => {
    for (const id of GOVERNMENT_TEMPLATE_IDS) {
      const t = TEMPLATES.find((x) => x.id === id)
      expect(t.fields?.length).toBeGreaterThan(3)
      expect(t.demoData).toBeTruthy()
      expect(t.category).toBe('Government & Travel')
    }
  })

  it('manifest templates list includes government IDs for grid filter', () => {
    const manifestIds = new Set(manifest.templates.map((t) => t.id))
    for (const id of GOVERNMENT_TEMPLATE_IDS) {
      expect(manifestIds.has(id), `missing from templates-manifest.json: ${id}`).toBe(true)
    }
  })

  it('CTA special sections remain non-templates', () => {
    const ids = new Set(TEMPLATES.map((t) => t.id))
    for (const id of CTA_SECTION_IDS) {
      expect(ids.has(id)).toBe(false)
    }
  })
})

import { describe, it, expect } from 'vitest'
import { qrDataUrlForVerify } from './pdfHelpers'

describe('pdfHelpers', () => {
  it('qrDataUrlForVerify returns a data URL', async () => {
    const url = await qrDataUrlForVerify('contract_test123')
    expect(url).toMatch(/^data:image\/png;base64,/)
  })
})

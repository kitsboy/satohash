import { describe, it, expect, vi, afterEach } from 'vitest'
import { getDeploymentMode } from './staticMode'

describe('staticMode', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns development in dev', () => {
    vi.stubEnv('DEV', true)
    expect(getDeploymentMode()).toBe('development')
  })

  it('returns static-only when no API URL in production', () => {
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_API_URL', '')
    expect(getDeploymentMode()).toBe('static-only')
  })
})

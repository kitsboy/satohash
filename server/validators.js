import { z } from 'zod'

export const SHA256_HEX = /^[a-f0-9]{64}$/i
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const NPUB_RE = /^npub1[a-z0-9]{58}$/

export const hashSchema = z
  .string()
  .length(64, 'Hash must be 64 hex characters')
  .regex(SHA256_HEX, 'Hash must be valid SHA-256 hex')

export const uuidSchema = z.string().regex(UUID_RE, 'Invalid UUID')

export const npubSchema = z
  .string()
  .length(63, 'npub must be 63 characters')
  .regex(NPUB_RE, 'Invalid npub format')

export const anchorBodySchema = z.object({
  hash: hashSchema,
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional()
})

export const webhookEventsSchema = z.array(
  z.enum(['confirmed', 'revoked', 'test', 'stamped', 'failed'])
)

export function parseHash(value) {
  const result = hashSchema.safeParse(value)
  return result.success ? result.data.toLowerCase() : null
}

export function parseUuid(value) {
  const result = uuidSchema.safeParse(value)
  return result.success ? result.data : null
}

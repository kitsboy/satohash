import swaggerJsDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Satohash OTS API',
      version: '5.0.0',
      description:
        'API for Bitcoin Proof-of-Existence using OpenTimestamps. Stamp a SHA-256 hash, verify a proof, browse the registry, and consume live network/calendar health. Free public tier — no API key required for most endpoints.',
      contact: {
        name: 'Satohash / Give A Bit',
        url: 'https://satohash.io',
        email: 'hello@giveabit.io'
      },
      license: { name: 'MIT' }
    },
    servers: [
      { url: process.env.SWAGGER_URL || 'https://api.satohash.io' },
      { url: 'http://localhost:3001', description: 'Local dev' }
    ],
    tags: [
      { name: 'Public', description: 'Open endpoints — no auth' },
      { name: 'Stamps', description: 'Stamp lifecycle: create, list, verify, upgrade' },
      { name: 'Network', description: 'Bitcoin node, calendars, Nostr, lightning' },
      { name: 'Identity', description: 'NIP-05 identity resolution' }
    ],
    paths: {
      '/health': {
        get: {
          tags: ['Network'],
          summary: 'API health',
          description:
            'Basic liveness + uptime. Append ?deep=true for full dependency health (db, redis, OTS calendars, Nostr, lightning, bitcoin).',
          parameters: [
            {
              name: 'deep',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['true'] },
              description: 'Deep health check'
            }
          ],
          responses: { 200: { description: 'Health payload' } }
        }
      },
      '/api/public/status': {
        get: {
          tags: ['Public'],
          summary: 'Suite status',
          description:
            'Service identity, plane, family free tier flag, stamps stored, expected family clients.',
          responses: { 200: { description: 'Status payload' } }
        }
      },
      '/api/public/stats': {
        get: {
          tags: ['Public'],
          summary: 'Stamp statistics',
          description:
            'Rolling stats: stamps created in window, active clients, average confirm time, calendar health per calendar.',
          responses: { 200: { description: 'Stats payload' } }
        }
      },
      '/api/public/network': {
        get: {
          tags: ['Network'],
          summary: 'Network overview',
          description:
            'Bitcoin node status (blocks, chain, pruned, ibd), calendars, mempool fallback state.',
          responses: { 200: { description: 'Network payload' } }
        }
      },
      '/api/public/version': {
        get: {
          tags: ['Public'],
          summary: 'API version',
          description: 'Version + build metadata.',
          responses: { 200: { description: 'Version payload' } }
        }
      },
      '/api/stamps/recent': {
        get: {
          tags: ['Stamps'],
          summary: 'Recent stamps',
          description: 'Most recent stamps (hash, filename, status, block height).',
          responses: { 200: { description: 'Array of recent stamps' } }
        }
      },
      '/api/stamps/{hash}/by-hash': {
        get: {
          tags: ['Stamps'],
          summary: 'Lookup by hash',
          description: 'Look up a stamp by its SHA-256 hash.',
          parameters: [
            {
              name: 'hash',
              in: 'path',
              required: true,
              schema: { type: 'string', pattern: '^[a-f0-9]{64}$' },
              description: 'SHA-256 hex hash'
            }
          ],
          responses: { 200: { description: 'Stamp record' }, 404: { description: 'Not found' } }
        }
      },
      '/api/stamps/{id}/certificate': {
        get: {
          tags: ['Stamps'],
          summary: 'PDF proof certificate',
          description:
            'Server-rendered PDF certificate (jsPDF) with embedded QR linking to the verify page. Content-Type application/pdf.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Stamp id or hash'
            }
          ],
          responses: {
            200: { description: 'PDF certificate', content: { 'application/pdf': {} } },
            404: { description: 'Not found' }
          }
        }
      },
      '/api/stamp': {
        post: {
          tags: ['Stamps'],
          summary: 'Create a stamp',
          description:
            'Submit a SHA-256 hash (and optional filename) to anchor via OpenTimestamps calendars. Free tier: no auth required while REQUIRE_LIGHTNING=false.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['hash'],
                  properties: {
                    hash: {
                      type: 'string',
                      pattern: '^[a-f0-9]{64}$',
                      description: 'SHA-256 hex hash'
                    },
                    filename: { type: 'string', description: 'Original filename (optional)' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Stamp created or already pending' },
            429: { description: 'Rate limited (5/min public)' }
          }
        }
      },
      '/api/verify': {
        post: {
          tags: ['Stamps'],
          summary: 'Verify a hash or proof',
          description:
            'Check a hash against the registry, or upload an .ots file (multipart) for structural + chain verification.',
          responses: {
            200: { description: 'Verification result' },
            404: { description: 'Hash not found in registry' }
          }
        }
      },
      '/api/upgrade': {
        post: {
          tags: ['Stamps'],
          summary: 'Upgrade a pending .ots',
          description:
            'Upload a pending .ots (multipart) and receive an upgraded file with fresher calendar attestations. Returns X-Ots-Upgraded header.',
          responses: {
            200: {
              description: 'Upgraded .ots binary',
              content: { 'application/octet-stream': {} }
            }
          }
        }
      },
      '/.well-known/lnurlp/{name}': {
        get: {
          tags: ['Identity'],
          summary: 'LNURL-pay discovery',
          description:
            'Lightning address / LNURL-pay request for a receive prefix (e.g. satohash, sherpa, katoa…). Returns a payRequest for invoice generation.',
          parameters: [
            {
              name: 'name',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'LNURL username prefix'
            }
          ],
          responses: { 200: { description: 'LNURL payRequest' }, 404: { description: 'Not found' } }
        }
      },
      '/.well-known/nostr.json': {
        get: {
          tags: ['Identity'],
          summary: 'NIP-05 identity resolution',
          description: 'Nostr NIP-05 name → pubkey mapping for api.satohash.io identities.',
          parameters: [
            {
              name: 'name',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'NIP-05 name'
            }
          ],
          responses: { 200: { description: 'names + relays map' } }
        }
      },
      '/metrics.json': {
        get: {
          tags: ['Public'],
          summary: 'Product metrics envelope',
          description:
            'gab.product-metrics.v1 envelope for HQ: raw stats, last10 stamps, familyClients attribution, health dependencies.',
          responses: { 200: { description: 'Metrics envelope' } }
        }
      }
    }
  },
  apis: ['./server/index.js']
}

const specs = swaggerJsDoc(options)
export default specs

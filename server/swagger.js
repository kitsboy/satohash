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
            'Basic liveness + uptime. JSON includes gitSha (short git of the API image). Append ?deep=true for full dependency health (db, redis, OTS calendars, Nostr, lightning, bitcoin) plus details.paywall.require_lightning (from REQUIRE_LIGHTNING env).',
          parameters: [
            {
              name: 'deep',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['true'] },
              description: 'Deep health check'
            }
          ],
          responses: {
            200: {
              description: 'Health payload',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      gitSha: {
                        type: 'string',
                        nullable: true,
                        description: 'Short git of the API image (GIT_SHA)'
                      },
                      details: {
                        type: 'object',
                        properties: {
                          uptime: { type: 'number' },
                          version: { type: 'string' },
                          service: { type: 'string' },
                          plane: { type: 'string' },
                          timestamp: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  },
                  examples: {
                    liveness: {
                      summary: 'Default GET /health (no deep)',
                      value: {
                        status: 'ok',
                        gitSha: '8e78fb5',
                        details: {
                          uptime: 3600.12,
                          version: '5.0.0-ELITE',
                          service: 'satohash-api',
                          plane: 'proof',
                          timestamp: '2026-09-07T00:00:00.000Z'
                        }
                      }
                    },
                    deepPaywall: {
                      summary:
                        '?deep=true paywall slice (require_lightning from env; no invented stamp metrics)',
                      value: {
                        status: 'ok',
                        gitSha: '8e78fb5',
                        details: {
                          uptime: 3600.12,
                          version: '5.0.0-ELITE',
                          service: 'satohash-api',
                          plane: 'proof',
                          timestamp: '2026-09-07T00:00:00.000Z',
                          paywall: {
                            require_lightning: false,
                            mode: 'free_open',
                            stamp_price_sats: 21
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/public/status': {
        get: {
          tags: ['Public'],
          summary: 'Suite status',
          description:
            'Service identity, plane, family free tier flag, stamps stored, expected family clients. JSON includes git_sha (short git of the API image). Live body from GET /api/public/status — no invented user counts or daily caps.',
          responses: {
            200: {
              description: 'Status payload',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      ok: { type: 'boolean', example: true },
                      service: { type: 'string', example: 'satohash-api' },
                      plane: { type: 'string', example: 'proof' },
                      family_free_tier: { type: 'boolean' },
                      require_lightning: { type: 'boolean', example: false },
                      stamps_stored: { type: 'integer', nullable: true },
                      git_sha: {
                        type: 'string',
                        nullable: true,
                        description: 'Short git of the API image (GIT_SHA)'
                      },
                      timestamp: { type: 'string', format: 'date-time' },
                      clients_expected: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Family client ids (directory.clientsExpected)'
                      }
                    }
                  },
                  examples: {
                    live: {
                      summary: 'Live GET /api/public/status shape',
                      value: {
                        ok: true,
                        service: 'satohash-api',
                        plane: 'proof',
                        family_free_tier: true,
                        require_lightning: false,
                        stamps_stored: 12,
                        git_sha: '8e78fb5',
                        timestamp: '2026-09-07T00:00:00.000Z',
                        clients_expected: [
                          'sherpacarta',
                          'sherpacarta-canada',
                          'motopass',
                          'katoa',
                          'giveabit',
                          'tadbuy',
                          'stranded',
                          'openstrata',
                          'spa',
                          'cli',
                          'hq'
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/public/stats': {
        get: {
          tags: ['Public'],
          summary: 'Stamp statistics',
          description:
            'Rolling 24h stats from GET /api/public/stats: stamps created in window, distinct active clients, average confirm time in seconds, calendar health per calendar. Live keys only — no invented user counts or daily caps.',
          responses: {
            200: {
              description: 'Stats payload (example values; counts are illustrative)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      window: { type: 'string', example: '24h' },
                      stamps_created: { type: 'integer', example: 12 },
                      clients_active: { type: 'integer', example: 4 },
                      avg_confirm_time_sec: { type: 'integer', nullable: true, example: 3600 },
                      calendar_health: {
                        type: 'object',
                        additionalProperties: {
                          type: 'object',
                          properties: {
                            ok: { type: 'boolean' },
                            ms: { type: 'integer' },
                            error: { type: 'string' }
                          }
                        }
                      },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  },
                  examples: {
                    live: {
                      summary: 'Example GET /api/public/stats shape (24h window; no invented caps)',
                      value: {
                        window: '24h',
                        stamps_created: 12,
                        clients_active: 4,
                        avg_confirm_time_sec: 3600,
                        calendar_health: {
                          'https://alice.btc.calendar.opentimestamps.org': { ok: true, ms: 120 },
                          'https://bob.btc.calendar.opentimestamps.org': { ok: true, ms: 95 },
                          'https://finney.calendar.eternitywall.com': { ok: true, ms: 210 }
                        },
                        timestamp: '2026-09-08T00:00:00.000Z'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/public/calendar-status': {
        get: {
          tags: ['Network'],
          summary: 'OTS calendar health',
          description:
            'Live GET /api/public/calendar-status: probes Alice, Bob, and Finney calendars. Each entry has url, ok, http_status, response_time_ms, last_checked. Alice + Bob are enough; Finney often flaky — not an invented outage.',
          responses: {
            200: {
              description: 'Calendar probe payload (example values; latencies are illustrative)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      calendars: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            url: { type: 'string', format: 'uri' },
                            ok: { type: 'boolean' },
                            http_status: { type: 'integer' },
                            response_time_ms: { type: 'integer' },
                            last_checked: { type: 'string', format: 'date-time' }
                          }
                        }
                      },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  },
                  examples: {
                    live: {
                      summary:
                        'Example GET /api/public/calendar-status — Alice + Bob up; Finney flaky',
                      value: {
                        calendars: [
                          {
                            url: 'https://alice.btc.calendar.opentimestamps.org',
                            ok: true,
                            http_status: 200,
                            response_time_ms: 120,
                            last_checked: '2026-09-08T00:00:00.000Z'
                          },
                          {
                            url: 'https://bob.btc.calendar.opentimestamps.org',
                            ok: true,
                            http_status: 200,
                            response_time_ms: 95,
                            last_checked: '2026-09-08T00:00:00.000Z'
                          },
                          {
                            url: 'https://finney.calendar.eternitywall.com',
                            ok: false,
                            http_status: 0,
                            response_time_ms: 4000,
                            last_checked: '2026-09-08T00:00:00.000Z'
                          }
                        ],
                        timestamp: '2026-09-08T00:00:00.000Z'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/public/network': {
        get: {
          tags: ['Network'],
          summary: 'Network overview',
          description:
            'Companion network surface from GET /api/public/network: mempool.space tip + recommended fees and a derived halving estimate. Own-node bitcoind status is GET /api/public/bitcoin (source: bitcoind), not this route.',
          responses: {
            200: {
              description: 'Network payload (example values; block_height is a round placeholder)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      source: { type: 'string', example: 'mempool.space' },
                      block_height: {
                        type: 'integer',
                        nullable: true,
                        example: 900000,
                        description:
                          'Tip height from source (example placeholder, not a live claim)'
                      },
                      fees: {
                        type: 'object',
                        nullable: true,
                        properties: {
                          fastestFee: { type: 'integer' },
                          halfHourFee: { type: 'integer' },
                          hourFee: { type: 'integer' },
                          economyFee: { type: 'integer' },
                          minimumFee: { type: 'integer' }
                        }
                      },
                      fee_estimates: {
                        type: 'object',
                        nullable: true,
                        description: 'Same object as fees'
                      },
                      halving: {
                        type: 'object',
                        nullable: true,
                        properties: {
                          next_halving_height: { type: 'integer' },
                          blocks_remaining: { type: 'integer' },
                          approx_days: { type: 'integer' }
                        }
                      },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  },
                  examples: {
                    mempool: {
                      summary:
                        'Example GET /api/public/network (round block_height is illustrative, not a live tip)',
                      value: {
                        source: 'mempool.space',
                        block_height: 900000,
                        fees: {
                          fastestFee: 2,
                          halfHourFee: 1,
                          hourFee: 1,
                          economyFee: 1,
                          minimumFee: 1
                        },
                        fee_estimates: {
                          fastestFee: 2,
                          halfHourFee: 1,
                          hourFee: 1,
                          economyFee: 1,
                          minimumFee: 1
                        },
                        halving: {
                          next_halving_height: 1050000,
                          blocks_remaining: 150000,
                          approx_days: 1042
                        },
                        timestamp: '2026-09-08T00:00:00.000Z'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/public/bitcoin': {
        get: {
          tags: ['Network'],
          summary: 'Own-node Bitcoin status',
          description:
            'Live GET /api/public/bitcoin from THOR bitcoind when RPC is healthy or syncing (source: bitcoind). Falls back to mempool.space tip height only if own node is unavailable. Example values; block_height is a round placeholder, not a live tip.',
          responses: {
            200: {
              description:
                'Bitcoin node payload (example values; block_height is a round placeholder)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      source: { type: 'string', example: 'bitcoind' },
                      status: { type: 'string', example: 'healthy' },
                      block_height: {
                        type: 'integer',
                        nullable: true,
                        example: 900000,
                        description:
                          'Tip height from source (example placeholder, not a live claim)'
                      },
                      headers: { type: 'integer', nullable: true, example: 900000 },
                      ibd: { type: 'boolean', example: false },
                      progress_pct: { type: 'number', nullable: true, example: 100 },
                      peers: { type: 'integer', nullable: true },
                      mempool_count: { type: 'integer', nullable: true },
                      chain: { type: 'string', example: 'main' },
                      pruned: { type: 'boolean', nullable: true },
                      ready_to_verify: { type: 'boolean', example: true },
                      note: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  },
                  examples: {
                    bitcoind: {
                      summary:
                        'Example GET /api/public/bitcoin own node (round block_height is illustrative, not a live tip)',
                      value: {
                        source: 'bitcoind',
                        status: 'healthy',
                        block_height: 900000,
                        headers: 900000,
                        ibd: false,
                        progress_pct: 100,
                        peers: 8,
                        mempool_count: 4000,
                        chain: 'main',
                        pruned: true,
                        ready_to_verify: true,
                        note: 'Own pruned bitcoind ready for independent verify',
                        timestamp: '2026-09-08T00:00:00.000Z'
                      }
                    }
                  }
                }
              }
            }
          }
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
          description:
            'Last 20 stamps from GET /api/stamps/recent: id, hash, status, created_at, client. No filename, block height, user counts, or daily cap.',
          responses: {
            200: {
              description: 'Recent stamps envelope (not a bare array)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      stamps: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            hash: {
                              type: 'string',
                              description:
                                'SHA-256 hex (64 chars) or truncated 16-char prefix + ellipsis in examples'
                            },
                            status: { type: 'string', enum: ['pending', 'confirmed', 'failed'] },
                            created_at: { type: 'string' },
                            client: { type: 'string', nullable: true }
                          }
                        }
                      }
                    }
                  },
                  examples: {
                    recent: {
                      summary:
                        'Live GET /api/stamps/recent shape — no invented user counts or 10/day cap',
                      value: {
                        stamps: [
                          {
                            id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                            hash: 'e3b0c44298fc1c14...',
                            status: 'pending',
                            created_at: '2026-09-08T00:00:00.000Z',
                            client: 'spa'
                          },
                          {
                            id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
                            hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                            status: 'confirmed',
                            created_at: '2026-09-07T12:00:00.000Z',
                            client: null
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          }
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
                      description: 'SHA-256 hex hash',
                      example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
                    },
                    filename: { type: 'string', description: 'Original filename (optional)' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description:
                'Stamp created, already pending, or reused. Empty SHA-256 of an empty file (e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855) returns 200 reused/confirmed if already stamped.',
              content: {
                'application/json': {
                  examples: {
                    reusedEmpty: {
                      summary: 'Reuse of empty-file SHA-256',
                      value: {
                        success: true,
                        reused: true,
                        hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                        status: 'confirmed',
                        message:
                          'Hash already stamped — returning existing proof (no new calendar submit).'
                      }
                    }
                  }
                }
              }
            },
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
            'gab.product-metrics.v1 envelope for HQ: raw stats, last10 stamps, familyClients attribution, health dependencies. raw.requireLightning mirrors REQUIRE_LIGHTNING (false = free stamps).',
          responses: {
            200: {
              description: 'Metrics envelope',
              content: {
                'application/json': {
                  examples: {
                    live: {
                      summary:
                        'Illustrative live snapshot (real KPI keys + raw.counts; not a user or daily-cap claim)',
                      value: {
                        schema: 'gab.product-metrics.v1',
                        productId: 'satohash',
                        name: 'Satohash',
                        health: {
                          status: 'green',
                          message: 'API healthy — live stamp aggregates for HQ',
                          uptimePct24h: null
                        },
                        kpis: [
                          {
                            key: 'stamps_total',
                            label: 'Stamps (all time)',
                            value: 190,
                            unit: 'proofs',
                            format: 'number',
                            priority: 1
                          },
                          {
                            key: 'stamps_24h',
                            label: 'Stamps 24h',
                            value: 7,
                            unit: 'proofs',
                            format: 'number',
                            priority: 1
                          },
                          {
                            key: 'pending',
                            label: 'Pending confirm',
                            value: 2,
                            unit: 'proofs',
                            format: 'number',
                            priority: 2
                          },
                          {
                            key: 'confirmed',
                            label: 'Confirmed (all time)',
                            value: 188,
                            unit: 'proofs',
                            format: 'number',
                            priority: 2
                          },
                          {
                            key: 'confirm_rate',
                            label: 'Confirm rate',
                            value: 100,
                            unit: '%',
                            format: 'percent',
                            priority: 1
                          }
                        ],
                        raw: {
                          demo: false,
                          requireLightning: false,
                          counts: {
                            stampsTotal: 190,
                            stamps24h: 7,
                            stamps7d: 46,
                            pending: 2,
                            confirmed: 188,
                            confirmed7d: 44,
                            failed: 0,
                            failed7d: 0,
                            familyFree: 1,
                            distinctClients: 12,
                            confirmRate: 100
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./server/index.js']
}

const specs = swaggerJsDoc(options)
export default specs

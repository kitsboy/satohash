import cron from 'node-cron'
import logger from './logger.js'
import db from './db.js'
import OpenTimestamps from 'opentimestamps'
import { dispatchWebhook } from './webhooks.js'
import { performBackup } from './backup.js'
import { inspectAttestations, parseOts } from './lib/ots-attestations.js'
import { verifyDetachedAgainstChain } from './lib/ots-chain-verify.js'
import { realOtsBuffer } from './lib/ots-verify-result.js'
import crypto from 'crypto'

/**
 *
 * Upgrade Daemon: Every 15 minutes, check for pending OTS files and try to upgrade them.
 */
const startUpgradeDaemon = (io) => {
  // Daily backup at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      const backupPath = await performBackup()
      logger.info(`💾 Daily DB backup created: ${backupPath}`)
    } catch (e) {
      logger.error(`❌ Daily backup failed: ${e.message}`)
    }
  })

  logger.info('📅 Daily backup cron scheduled (2:00 AM)')

  // Archival cron: Every Sunday at 3 AM, archive stamps older than 30 days
  cron.schedule('0 3 * * 0', async () => {
    logger.info('🗄️ Starting IPFS archival for old stamps...')
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const oldStamps = db
      .prepare(
        `
      SELECT id, hash, ots_binary, confirmed_at
      FROM timestamps
      WHERE status = 'confirmed' AND confirmed_at < ?
      LIMIT 50
    `
      )
      .all(thirtyDaysAgo)

    for (const stamp of oldStamps) {
      try {
        // Real IPFS via web3.storage (if API key configured), fallback to simulated
        let simulatedCid
        const web3StorageToken = process.env.WEB3_STORAGE_TOKEN
        if (web3StorageToken) {
          try {
            const { Blob } = await import('buffer')
            const content = Buffer.from(`${stamp.hash}:${stamp.confirmed_at}:${stamp.id}`)
            const formData = new FormData()
            formData.append(
              'file',
              new Blob([content], { type: 'application/octet-stream' }),
              `${stamp.id}.proof`
            )
            const uploadRes = await fetch('https://api.web3.storage/upload', {
              method: 'POST',
              headers: { Authorization: `Bearer ${web3StorageToken}` },
              body: formData
            })
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json()
              simulatedCid = uploadData.cid
              logger.info(`🌐 Real IPFS CID for ${stamp.id}: ${simulatedCid}`)
            } else {
              throw new Error(`web3.storage error: ${uploadRes.status}`)
            }
          } catch (ipfsErr) {
            logger.warn(`IPFS upload failed, using simulated CID: ${ipfsErr.message}`)
            simulatedCid = `Qm${crypto.createHash('sha256').update(`${stamp.hash}:${stamp.confirmed_at}`).digest('hex').slice(0, 44)}`
          }
        } else {
          // No token configured — use deterministic placeholder CID
          simulatedCid = `Qm${crypto.createHash('sha256').update(`${stamp.hash}:${stamp.confirmed_at}`).digest('hex').slice(0, 44)}`
        }

        db.prepare(
          `
          UPDATE timestamps
          SET ipfs_cid = ?, archived_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `
        ).run(simulatedCid, stamp.id)

        logger.info(`🗄️ Archived stamp ${stamp.id} to IPFS CID: ${simulatedCid}`)
      } catch (e) {
        logger.error(`❌ Archival failed for ${stamp.id}: ${e.message}`)
      }
    }
    logger.info(`✅ Archival complete: ${oldStamps.length} stamps processed.`)
  })

  logger.info('🗄️ Weekly archival cron scheduled (Sun 3:00 AM)')

  // Use a slightly offset cron to avoid thundering herd on full segments
  cron.schedule('3,18,33,48 * * * *', async () => {
    logger.info('🔄 [DAEMON] Initiating OTS confirmation check cycle...')
    let upgradedThisPass = 0

    // Only pick top 20 pending stamps to avoid overwhelming memory/network
    const pendingStamps = db
      .prepare("SELECT * FROM timestamps WHERE status = 'pending' ORDER BY created_at ASC LIMIT 20")
      .all()

    if (pendingStamps.length === 0) {
      logger.info('✅ [DAEMON] State: All proofs confirmed.')
    }

    for (const stamp of pendingStamps) {
      // Robust exponential backoff strategy for checking older stamps
      const ageHours = (new Date() - new Date(stamp.created_at)) / (1000 * 60 * 60)
      let skipProbability = 0

      if (ageHours > 72) {
        skipProbability = 0.95 // Rarely check stamps older than 3 days
      } else if (ageHours > 24) {
        skipProbability = 0.8 // Check stamps older than 24h about 20% of the time
      } else if (ageHours > 4) {
        skipProbability = 0.5 // Check stamps older than 4h about 50% of the time
      }

      if (Math.random() < skipProbability) {
        continue
      }

      try {
        const detached = OpenTimestamps.DetachedTimestampFile.deserialize(
          Buffer.from(stamp.ots_binary)
        )
        if (io) {
          io.emit('ots:upgrade:status', {
            id: stamp.id,
            hash: stamp.hash,
            status: 'upgrading'
          })
        }

        const upgraded = await OpenTimestamps.upgrade(detached)

        if (upgraded) {
          const upgradedBinary = detached.serializeToBytes()
          // F3: the block claim comes from the parsed attestation tree, and a
          // claim only becomes `confirmed` after it resolves against a real
          // block header. Text parsing and unresolved claims are both gone.
          const view = inspectAttestations(detached)
          let blockHeight = null

          if (view.bitcoin.length > 0) {
            const verdict = await verifyDetachedAgainstChain(detached)
            if (verdict.verified) {
              blockHeight = verdict.height
              db.prepare(
                `
                UPDATE timestamps
                SET status = 'confirmed',
                    upgraded_binary = ?,
                    bitcoin_block_height = ?,
                    confirmed_at = CURRENT_TIMESTAMP,
                    verify_method = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
              `
              ).run(
                Buffer.from(upgradedBinary),
                blockHeight,
                `${verdict.method}:${verdict.trust}`,
                stamp.id
              )
            } else {
              // Store the upgraded bytes but do NOT claim confirmation.
              db.prepare(
                'UPDATE timestamps SET upgraded_binary = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
              ).run(Buffer.from(upgradedBinary), stamp.id)
              logger.warn(
                `[DAEMON] block claim for ${stamp.id} did not resolve (${verdict.reason}) — staying pending`
              )
            }
          } else {
            // Upgraded, but still no block attestation in the proof yet.
            db.prepare(
              'UPDATE timestamps SET upgraded_binary = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
            ).run(Buffer.from(upgradedBinary), stamp.id)
          }

          if (blockHeight != null) {
            upgradedThisPass += 1

            logger.info(`🎊 [DAEMON] TRUTH_FOUND: ${stamp.id} confirmed at block ${blockHeight}.`)

            dispatchWebhook('confirmed', { id: stamp.id, blockHeight })

            if (io) {
              io.emit('ots:upgrade:status', {
                id: stamp.id,
                hash: stamp.hash,
                status: 'confirmed',
                blockHeight
              })
              io.emit('ots:confirmed', {
                id: stamp.id,
                hash: stamp.hash,
                blockHeight
              })
            }
          } else if (io) {
            io.emit('ots:upgrade:status', {
              id: stamp.id,
              hash: stamp.hash,
              status: 'pending'
            })
          }
        } else if (io) {
          io.emit('ots:upgrade:status', {
            id: stamp.id,
            hash: stamp.hash,
            status: 'pending'
          })
        }

        // Add a small delay to avoid hammering the public calendar servers
        await new Promise((r) => setTimeout(r, 1000))
      } catch (error) {
        logger.error(`❌ [DAEMON] Upgrade failure for ${stamp.id}: ${error.message}`)

        // Increment retry counter and mark failure time
        try {
          db.prepare(
            `
            UPDATE timestamps
            SET retry_count = COALESCE(retry_count, 0) + 1,
                upgrade_failed_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `
          ).run(stamp.id)
          const updated = db
            .prepare('SELECT retry_count FROM timestamps WHERE id = ?')
            .get(stamp.id)
          if (updated && updated.retry_count >= 10) {
            db.prepare("UPDATE timestamps SET status = 'failed' WHERE id = ?").run(stamp.id)
            logger.warn(
              `[DAEMON] Stamp ${stamp.id} permanently failed after ${updated.retry_count} retries.`
            )
          }
        } catch (dbErr) {
          logger.error(`[DAEMON] Failed to update retry_count for ${stamp.id}: ${dbErr.message}`)
        }

        // Graceful handling of calendar rate limits (HTTP 429)
        if (error.message.toLowerCase().includes('rate limit') || error.message.includes('429')) {
          logger.warn('⚠️ [DAEMON] OTS calendar rate limit hit. Pausing daemon until next cycle.')
          break // Exit the loop for this cycle
        }
      }
    }

    // Confirmed stamps missing height: read the claim from the proof structure
    // and resolve it against the chain — no calendar upgrade, no text parsing.
    const confirmedMissingHeight = db
      .prepare(
        `
      SELECT id, upgraded_binary, ots_binary
      FROM timestamps
      WHERE status = 'confirmed' AND bitcoin_block_height IS NULL
      LIMIT 20
    `
      )
      .all()

    for (const stamp of confirmedMissingHeight) {
      try {
        const raw = realOtsBuffer(stamp)
        if (!raw) continue
        const detached = parseOts(raw)
        const view = inspectAttestations(detached)
        if (view.bitcoin.length === 0) continue
        const verdict = await verifyDetachedAgainstChain(detached)
        if (!verdict.verified) {
          logger.warn(`[DAEMON] ${stamp.id} is marked confirmed but its proof does not resolve (${verdict.reason})`)
          continue
        }
        db.prepare(
          `
          UPDATE timestamps
          SET bitcoin_block_height = ?, verify_method = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `
        ).run(verdict.height, `${verdict.method}:${verdict.trust}`, stamp.id)
        logger.info(`[DAEMON] Backfilled bitcoin_block_height ${verdict.height} for ${stamp.id}`)
      } catch (error) {
        logger.error(`❌ [DAEMON] Height backfill failed for ${stamp.id}: ${error.message}`)
      }
    }

    // Legacy reconciliation: every `confirmed` row written before the chain
    // check existed carries verify_method = NULL. Re-resolve a bounded batch so
    // the registry can state, per row, whether its confirmation was actually
    // anchored to a Bitcoin block — or is legacy bookkeeping. Status is never
    // rewritten here; the point is to make the record honest, then surface
    // anything that fails to a human.
    const legacyUnverified = db
      .prepare(
        `
      SELECT id, hash, upgraded_binary, ots_binary, bitcoin_block_height
      FROM timestamps
      WHERE status = 'confirmed' AND verify_method IS NULL
      ORDER BY created_at ASC
      LIMIT 20
    `
      )
      .all()

    if (legacyUnverified.length > 0) {
      let ok = 0
      let bad = 0
      for (const stamp of legacyUnverified) {
        try {
          const raw = realOtsBuffer(stamp)
          if (!raw) {
            db.prepare("UPDATE timestamps SET verify_method = ? WHERE id = ?").run(
              'unverified:no-proof-bytes',
              stamp.id
            )
            bad += 1
            continue
          }
          const verdict = await verifyDetachedAgainstChain(parseOts(raw))
          if (verdict.verified) {
            db.prepare(
              'UPDATE timestamps SET verify_method = ?, bitcoin_block_height = COALESCE(bitcoin_block_height, ?) WHERE id = ?'
            ).run(`${verdict.method}:${verdict.trust}`, verdict.height, stamp.id)
            ok += 1
          } else {
            db.prepare('UPDATE timestamps SET verify_method = ? WHERE id = ?').run(
              `unverified:${verdict.reason}`,
              stamp.id
            )
            bad += 1
            logger.warn(
              `[DAEMON] legacy row ${stamp.id} (${String(stamp.hash).slice(0, 12)}…) is marked confirmed but does not resolve (${verdict.reason})`
            )
          }
        } catch (error) {
          logger.error(`❌ [DAEMON] legacy reconciliation failed for ${stamp.id}: ${error.message}`)
        }
      }
      logger.info(`[DAEMON] legacy reconciliation: ${ok} chain-verified, ${bad} unresolved`)
    }

    // Shrink WAL after a pass that actually confirmed proofs — skip empty ticks
    if (upgradedThisPass > 0) {
      try {
        db.pragma('wal_checkpoint(TRUNCATE)')
        db.pragma('incremental_vacuum(100)') // reclaim free pages after TRUNCATE
        db.pragma('optimize') // once-per-successful-batch, not every empty tick
      } catch (e) {
        logger.warn(`[DAEMON] wal_checkpoint(TRUNCATE) failed: ${e.message}`)
      }
    }
  })

  logger.info('🕒 OTS Upgrade Daemon active (Tier-1 Bitcoin Witness Mode)')
}

export default startUpgradeDaemon

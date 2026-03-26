import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import logger from './logger.js';
import { v4 as uuidv4 } from 'uuid';
import db from './db.js';
import OpenTimestamps from 'opentimestamps';

/**
 * Item 5: Silent Watcher (Local Agent)
 * Automatically notarizes files in a target directory upon change.
 */

const watchedPaths = new Set();

export const startSilentWatcher = (dirPath, io) => {
    if (!fs.existsSync(dirPath)) {
        logger.warn(`📂 Watcher: Directory ${dirPath} not found. Skipping.`);
        return;
    }

    if (watchedPaths.has(dirPath)) return;
    watchedPaths.add(dirPath);

    logger.info(`🕵️ Silent Watcher activated for: ${dirPath}`);

    // Native watcher (Recursive only available on macOS/Windows in older node, 
    // but we assume modern environment).
    fs.watch(dirPath, { recursive: true }, async (eventType, filename) => {
        if (!filename || filename.startsWith('.') || eventType !== 'change') return;

        const absolutePath = path.join(dirPath, filename);
        if (fs.statSync(absolutePath).isDirectory()) return;

        logger.info(`⚡ Silent Watcher: Detected change in ${filename}. Notarizing...`);
        
        try {
            const buffer = fs.readFileSync(absolutePath);
            const hash = crypto.createHash('sha256').update(buffer).digest('hex');

            // Prevent redundant stamps (check recent stamps)
            const existing = db.prepare("SELECT id FROM timestamps WHERE hash = ? AND status = 'pending'").get(hash);
            if (existing) return;

            const opSHA256 = new OpenTimestamps.Ops.OpSHA256();
            const detached = OpenTimestamps.DetachedTimestampFile.fromHash(opSHA256, Buffer.from(hash, 'hex'));
            await OpenTimestamps.stamp(detached);
            const otsBinary = detached.serializeToBytes();

            const id = uuidv4();
            db.prepare("INSERT INTO timestamps (id, hash, original_filename, ots_binary) VALUES (?, ?, ?, ?)").run(
                id, hash, `Watcher: ${filename}`, Buffer.from(otsBinary)
            );

            if (io) io.emit('ots:stamped', { id, hash, filename: `Watcher: ${filename}` });
            logger.info(`✅ Silent Watcher: Permanently sealed ${filename} version [${id.substring(0,8)}]`);
        } catch (e) {
            logger.error(`❌ Watcher Notarization Error: ${e.message}`);
        }
    });
};

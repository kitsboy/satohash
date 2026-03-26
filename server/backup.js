import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data/satohash.db');
const backupDir = path.resolve(__dirname, '../data/backups');

/**
 * Creates a timestamped backup of the SQLite database.
 */
export const performBackup = () => {
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `satohash-v120-${timestamp}.db`);

    try {
        fs.copyFileSync(dbPath, backupPath);
        // Prune logic: Keep only the 10 most recent backups
        const backups = fs.readdirSync(backupDir).sort().reverse();
        backups.slice(10).forEach(b => fs.unlinkSync(path.join(backupDir, b)));
        logger.info(`💾 Database backup complete: ${backupPath}`);
        return backupPath;
    } catch (e) {
        logger.error(`❌ DB Backup failed: ${e.message}`);
        throw e;
    }
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
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
    const zipPath = path.join(backupDir, `satohash-v120-${timestamp}.zip`);

// Simple zip using child_process (assumes 'zip' command available)
const { execSync } = require('child_process');
try {
  execSync(`cd ${path.dirname(dbPath)} && zip -q "${zipPath}" "${path.basename(dbPath)}"`, { stdio: 'ignore' });
  // Prune logic: Keep only the 10 most recent backups
  const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.zip')).sort().reverse();
  backups.slice(10).forEach(b => fs.unlinkSync(path.join(backupDir, b)));
  logger.info(`💾 Database ZIP backup complete: ${zipPath}`);
  return zipPath;
} catch (e) {
  logger.warn(`⚠️ ZIP backup failed, falling back to DB copy`);
  fs.copyFileSync(dbPath, backupPath + '.db'); // Fallback to .db copy
  return backupPath + '.db';
}

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

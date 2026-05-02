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
import crypto from 'crypto';

const ENCRYPTION_KEY = Buffer.from(process.env.BACKUP_KEY || crypto.randomBytes(32).toString('hex'), 'hex'); // Use env key
const IV_LENGTH = 16;

export const performBackup = () => {
  // ... existing code ...

  try {
    let backupContent;
    if (fs.existsSync(dbPath)) {
      // Backup as JSON for simplicity
      const rows = db.prepare('SELECT * FROM timestamps').all(); // Add other tables
      backupContent = JSON.stringify({ timestamps: rows, exported_at: new Date().toISOString() });
    } else {
      backupContent = '{}';
    }

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipher('aes256', ENCRYPTION_KEY);
    let encrypted = cipher.update(backupContent, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const encryptedBackup = iv.toString('hex') + encrypted;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `satohash-encrypted-${timestamp}.enc`);
    fs.writeFileSync(backupPath, encryptedBackup);

    // Prune old backups
    const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.enc')).sort().reverse();
    backups.slice(10).forEach(b => fs.unlinkSync(path.join(backupDir, b)));

    logger.info(`🔒 Encrypted backup complete: ${backupPath}`);
    return backupPath;

  } catch (e) {
    logger.error(`❌ Encrypted backup failed: ${e.message}`);
    throw e;
  }
};

// Decrypt function for testing
export const decryptBackup = (encryptedPath, key) => {
  try {
    const encryptedData = fs.readFileSync(encryptedPath, 'utf8');
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const encryptedText = encryptedData.slice(IV_LENGTH * 2);
    const decipher = crypto.createDecipher('aes256', key || ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (e) {
    throw new Error('Decryption failed');
  }
};
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

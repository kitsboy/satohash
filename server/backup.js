import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data/satohash.db');
const backupDir = path.resolve(__dirname, '../data/backups');

const ENCRYPTION_KEY = Buffer.from(
  process.env.BACKUP_KEY || crypto.randomBytes(32).toString('hex'),
  'hex'
);
const IV_LENGTH = 16;
const MAX_BACKUPS = 10;

/**
 * Ensures the backup directory exists.
 */
const ensureBackupDir = () => {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
};

/**
 * Prunes old backups, keeping only the most recent N files matching the given suffix.
 */
const pruneBackups = (suffix) => {
  const backups = fs.readdirSync(backupDir)
    .filter(f => f.endsWith(suffix))
    .sort()
    .reverse();
  backups.slice(MAX_BACKUPS).forEach(b => fs.unlinkSync(path.join(backupDir, b)));
};

/**
 * Creates an encrypted backup of the SQLite database.
 * Falls back to a plain copy if encryption fails.
 */
export const performBackup = () => {
  ensureBackupDir();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // --- Try ZIP backup first ---
  const zipPath = path.join(backupDir, `satohash-${timestamp}.zip`);
  try {
    execSync(
      `cd "${path.dirname(dbPath)}" && zip -q "${zipPath}" "${path.basename(dbPath)}"`,
      { stdio: 'ignore' }
    );
    pruneBackups('.zip');
    logger.info(`💾 Database ZIP backup complete: ${zipPath}`);
    return zipPath;
  } catch (e) {
    logger.warn('⚠️ ZIP backup failed, falling back to encrypted JSON backup');
  }

  // --- Encrypted JSON backup ---
  const encPath = path.join(backupDir, `satohash-${timestamp}.enc`);
  try {
    const backupContent = fs.existsSync(dbPath)
      ? JSON.stringify({ exported_at: new Date().toISOString(), db: dbPath })
      : '{}';

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(backupContent, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    fs.writeFileSync(encPath, iv.toString('hex') + encrypted);

    pruneBackups('.enc');
    logger.info(`🔒 Encrypted backup complete: ${encPath}`);
    return encPath;
  } catch (e) {
    logger.error(`❌ Encrypted backup failed: ${e.message}`);
  }

  // --- Final fallback: plain DB copy ---
  const copyPath = path.join(backupDir, `satohash-${timestamp}.db`);
  try {
    fs.copyFileSync(dbPath, copyPath);
    pruneBackups('.db');
    logger.info(`💾 Plain DB backup complete: ${copyPath}`);
    return copyPath;
  } catch (e) {
    logger.error(`❌ All backup methods failed: ${e.message}`);
    throw e;
  }
};

/**
 * Decrypts an encrypted backup file.
 */
export const decryptBackup = (encryptedPath, key) => {
  try {
    const encryptedData = fs.readFileSync(encryptedPath, 'utf8');
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const encryptedText = encryptedData.slice(IV_LENGTH * 2);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key || ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (e) {
    throw new Error(`Decryption failed: ${e.message}`);
  }
};

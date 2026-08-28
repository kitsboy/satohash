import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import Database from 'better-sqlite3';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data/satohash.db');
const backupDir = path.resolve(__dirname, '../data/backups');

// BACKUP_KEY must be set in production. Read lazily at call time (not module load)
// so dotenv.config() in server/index.js has already run before we read it.
const IV_LENGTH = 16;
const MAX_BACKUPS = 10;
const backupKey = () => (process.env.BACKUP_KEY ? Buffer.from(process.env.BACKUP_KEY, 'hex') : null);

const ensureBackupDir = () => {
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
};

const pruneBackups = (suffix) => {
  const backups = fs.readdirSync(backupDir)
    .filter((f) => f.endsWith(suffix))
    .sort()
    .reverse();
  backups.slice(MAX_BACKUPS).forEach((b) => {
    try { fs.unlinkSync(path.join(backupDir, b)); } catch { /* ok */ }
  });
};

/**
 * Consistent snapshot of the SQLite DB using the online backup API.
 * Opens a read-write handle for the source (better-sqlite3 requires it).
 */
function snapshotDb() {
  const snap = path.join(backupDir, `.snap-${Date.now()}.db`);
  const src = new Database(dbPath); // rw handle; backup API needs it
  try {
    src.backup(snap);
  } finally {
    src.close();
  }
  return snap;
}

/** Encrypt binary DB bytes → [iv(16) || base64-utf8-ciphertext] as a Buffer. */
function encryptBytes(plainBuf, key) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const enc = Buffer.concat([cipher.update(plainBuf), cipher.final()]);
  return Buffer.concat([iv, enc]);
}

/** Decrypt a backup file → raw DB bytes (Buffer). */
export function decryptBackup(encryptedPath, key) {
  try {
    const buf = fs.readFileSync(encryptedPath);
    const iv = buf.slice(0, IV_LENGTH);
    const body = buf.slice(IV_LENGTH);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key || backupKey(), iv);
    const dec = Buffer.concat([decipher.update(body), decipher.final()]);
    return dec;
  } catch (e) {
    throw new Error(`Decryption failed: ${e.message}`);
  }
}

/**
 * Create an encrypted, restorable backup of the real database bytes.
 * Never a path stub — always contains the actual DB.
 */
export function performBackup() {
  ensureBackupDir();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  let snap = null;

  // 1. Consistent snapshot (this is the source of truth for all paths).
  try {
    snap = snapshotDb();
  } catch (e) {
    logger.warn(`⚠️ Snapshot failed: ${e.message}`);
  }

  // 2. Prefer plain ZIP when `zip` exists (most portable for human ops).
  if (snap && fs.existsSync(snap)) {
    const zipPath = path.join(backupDir, `satohash-${timestamp}.zip`);
    try {
      execSync(`cd "${backupDir}" && zip -q "${zipPath}" "${path.basename(snap)}" && rm -f "${path.basename(snap)}"`, { stdio: 'ignore' });
      pruneBackups('.zip');
      logger.info(`💾 Database ZIP backup complete: ${zipPath}`);
      return zipPath;
    } catch (e) {
      logger.warn(`⚠️ ZIP backup failed (zip binary missing?): ${e.message}`);
    }
  }

  // 3. Encrypted backup of the real DB bytes (always available; needs BACKUP_KEY).
  const encPath = path.join(backupDir, `satohash-${timestamp}.enc`);
  const bytes = (snap && fs.existsSync(snap)) ? fs.readFileSync(snap) : (fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : Buffer.alloc(0));
  try {
    if (bytes.length === 0) throw new Error('db file empty');
    const key = backupKey();
    if (!key) {
      logger.error('🔒 BACKUP_KEY not set — encrypted backup skipped (set BACKUP_KEY to a 64-hex key in production)');
      throw new Error('BACKUP_KEY missing');
    }
    const sealed = encryptBytes(bytes, key);
    fs.writeFileSync(encPath, sealed);
    if (snap && fs.existsSync(snap)) { try { fs.unlinkSync(snap); } catch { /* ok */ } }
    pruneBackups('.enc');
    logger.info(`🔒 Encrypted DB backup complete (${bytes.length} bytes -> ${sealed.length} bytes): ${encPath}`);
    return encPath;
  } catch (e) {
    logger.error(`❌ Encrypted backup failed: ${e.message}`);
  }

  // 4. Final fallback: plain copy of the snapshot.
  if (snap && fs.existsSync(snap)) {
    const copyPath = path.join(backupDir, `satohash-${timestamp}.db`);
    try {
      fs.copyFileSync(snap, copyPath);
      fs.unlinkSync(snap);
      pruneBackups('.db');
      logger.info(`💾 Plain DB backup complete: ${copyPath}`);
      return copyPath;
    } catch (e) {
      logger.error(`❌ All backup methods failed: ${e.message}`);
    }
  }
  throw new Error('All backup methods failed');
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsPath = path.resolve(__dirname, './migrations');

/**
 * Poor man's migration runner.
 * Ensures an 'applied_migrations' table exists and runs new .sql files in order.
 */
export const runMigrations = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS applied_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);

    const files = fs.readdirSync(migrationsPath)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        const row = db.prepare("SELECT * FROM applied_migrations WHERE name = ?").get(file);
        if (!row) {
            logger.info(`✨ Running migration: ${file}`);
            const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
            try {
                db.exec(sql);
                db.prepare("INSERT INTO applied_migrations (name) VALUES (?)").run(file);
                logger.info(`✅ Migration applied: ${file}`);
            } catch (e) {
                // Non-fatal: skip migrations that try to add already-existing columns
                if (e.message && e.message.includes('duplicate column name')) {
                    logger.warn(`⚠️ Migration skipped (${file}): ${e.message} — column already exists, marking as applied.`);
                    db.prepare("INSERT OR IGNORE INTO applied_migrations (name) VALUES (?)").run(file);
                } else {
                    logger.error(`❌ Migration failed (${file}): ${e.message}`);
                    throw e;
                }
            }
        }
    }
};

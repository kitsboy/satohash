import logger from './logger.js';
import dotenv from 'dotenv';
dotenv.config();

const REQUIRED_ENVS = [
    'SENTRY_DSN',
    'ADMIN_KEY',
    'NODE_ENV',
    'PORT'
];

/**
 * Validates existence and basic structure of required environment variables.
 */
export const validateSecrets = () => {
    let missing = [];
    
    // Inject defaults in development to make it "Just Work"
    if (process.env.NODE_ENV !== 'production') {
        if (!process.env.ADMIN_KEY) {
            process.env.ADMIN_KEY = 'admin123';
            logger.warn('🔑 No ADMIN_KEY found. Defaulting to "admin123" for development.');
        }
        if (!process.env.PORT) {
            process.env.PORT = '3001';
            logger.warn('🔌 No PORT found. Defaulting to 3001.');
        }
        if (!process.env.SENTRY_DSN) {
            logger.info('🛰️ Sentry DSN not provided. Observability will be limited.');
        }
    }

    for (const envName of REQUIRED_ENVS) {
        if (!process.env[envName]) {
            missing.push(envName);
        }
    }

    if (missing.length > 0) {
        if (process.env.NODE_ENV === 'production') {
            logger.error(`❌ FATAL: Missing critical configuration: ${missing.join(', ')}`);
            process.exit(1);
        } else {
             logger.warn(`⚠️ Development mode: Missing non-critical configuration: ${missing.join(', ')}`);
        }
    } else {
        logger.info(`🔐 Secrets validated for ${process.env.NODE_ENV} environment.`);
    }
};

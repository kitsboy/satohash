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
    for (const envName of REQUIRED_ENVS) {
        if (!process.env[envName]) {
            missing.push(envName);
        }
    }

    if (missing.length > 0) {
        logger.error(`❌ Missing critical configuration: ${missing.join(', ')}`);
        // We might not want to hard exit if these aren't critical in dev, but in prod they should be.
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    } else {
        logger.info(`🔐 Secrets validated for ${process.env.NODE_ENV} environment.`);
    }
};

import logger from './logger.js';

export const validateSecrets = () => {
    const isProd = process.env.NODE_ENV === 'production';
    const errors = [];
    const warnings = [];

    // Critical secrets that must be changed in production
    const adminKey = process.env.ADMIN_KEY || '';
    if (isProd && (adminKey === 'admin123' || adminKey.includes('change-me') || adminKey.length < 16)) {
        errors.push('ADMIN_KEY must be set to a strong secret in production (min 16 chars, not default)');
    }

    const jwtSecret = process.env.JWT_SECRET || '';
    if (isProd && (jwtSecret.includes('change-me') || jwtSecret.includes('mock-secret') || jwtSecret.length < 32)) {
        errors.push('JWT_SECRET must be at least 32 characters and not a default value in production');
    }

    const snapperKey = process.env.SNAPPER_KEY || '';
    if (isProd && snapperKey.length < 32) {
        errors.push('SNAPPER_KEY must be set to a strong secret in production');
    }

    // Warnings (non-fatal)
    if (!process.env.SENTRY_DSN) {
        warnings.push('SENTRY_DSN not set — error tracking disabled');
    }
    if (!process.env.NOSTR_SECRET_KEY) {
        warnings.push('NOSTR_SECRET_KEY not set — using ephemeral Nostr identity (will change on restart)');
    }

    // Report
    warnings.forEach(w => logger.warn(`⚠️  Config warning: ${w}`));

    if (errors.length > 0) {
        errors.forEach(e => logger.error(`❌ FATAL config error: ${e}`));
        logger.error('🛑 Server refuses to start in production with insecure defaults. Fix the above and restart.');
        process.exit(1);
    }

    logger.info(`✅ Secrets validation passed (${isProd ? 'production' : 'development'} mode)`);
};

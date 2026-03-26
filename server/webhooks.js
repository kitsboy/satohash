import db from './db.js';
import axios from 'axios';
import logger from './logger.js';
import crypto from 'crypto';

/**
 * Dispatches webhooks to external subscribers on proof events.
 */
export const dispatchWebhook = async (event, data) => {
    try {
        const webhooks = db.prepare("SELECT * FROM webhooks").all();
        
        for (const hook of webhooks) {
            const allowedEvents = JSON.parse(hook.events || '[]');
            if (allowedEvents.includes(event) || allowedEvents.length === 0) {
                const payload = {
                    event,
                    timestamp: new Date().toISOString(),
                    data
                };

                const signature = crypto.createHmac('sha256', hook.secret || 'default_secret')
                                     .update(JSON.stringify(payload))
                                     .digest('hex');

                try {
                    await axios.post(hook.url, payload, {
                        headers: { 
                            'X-Satohash-Signature': signature,
                            'X-Satohash-Event': event 
                        },
                        timeout: 5000
                    });
                    logger.info(`🪝 Webhook dispatched: ${event} -> ${hook.url}`);
                } catch (err) {
                    logger.warn(`🪝 Webhook failed for ${hook.url}: ${err.message}`);
                }
            }
        }
    } catch (e) {
        logger.error(`Webhook Dispatch Error: ${e.message}`);
    }
};

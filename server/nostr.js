import { finalizeEvent, getPublicKey, generateSecretKey } from 'nostr-tools/pure';
import { Relay } from 'nostr-tools/relay';
import logger from './logger.js';

const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social'
];

/**
 * Publishes a "Satohash Timestamp Event" to Nostr.
 */
export const publishTimestampToNostr = async (hash, filename, id) => {
  try {
    const sk = generateSecretKey(); // We generate a random key for the "system" or use a configured one
    const pk = getPublicKey(sk);

    const eventTemplate = {
      kind: 1, // Text note (or we could use a custom kind like 30063 for file metadata)
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['t', 'satohash'],
        ['hash', hash],
        ['filename', filename],
        ['ots_id', id]
      ],
      content: `🔒 Cryptographic Proof-of-Existence\nFile: ${filename}\nHash: ${hash}\nVerified with Satohash Protocol.\n\nVerify at: https://satohash.com/verify/${id}`
    };

    const event = finalizeEvent(eventTemplate, sk);

    for (const url of RELAYS) {
      try {
        const relay = await Relay.connect(url);
        await relay.publish(event);
        logger.info(`🟣 Nostr event published to ${url}`);
        relay.close();
      } catch (err) {
        logger.error(`❌ Nostr publish error on ${url}: %o`, err);
      }
    }
  } catch (error) {
    logger.error('Nostr integration error: %o', error);
  }
};

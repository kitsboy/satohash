import { finalizeEvent, getPublicKey, generateSecretKey } from 'nostr-tools/pure';
import { Relay } from 'nostr-tools/relay';
import logger from './logger.js';

const RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.snort.social'
];

const BOT_SK = process.env.NOSTR_SECRET_KEY || generateSecretKey(); // Use persistent key in prod
const BOT_PK = getPublicKey(BOT_SK);

/**
 * Publishes a "Satohash Timestamp Event" to Nostr.
 */
export const publishTimestampToNostr = async (hash, filename, id) => {
  try {
    const eventTemplate = {
      kind: 1063, // NIP-94 File Metadata
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['t', 'satohash'],
        ['hash', hash],
        ['filename', filename],
        ['ots_id', id],
        ['url', `https://satohash.com/verify/${id}`],
        ['p', BOT_PK]
      ],
      content: `🔒 Cryptographic Proof-of-Existence\nFile: ${filename}\nHash: ${hash}\nVerified with Satohash Protocol.`
    };

    const event = finalizeEvent(eventTemplate, BOT_SK);

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

import { finalizeEvent, getPublicKey, generateSecretKey, verifySignature } from 'nostr-tools/pure';
import { Relay, nip05 } from 'nostr-tools';
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

/**
 * Fetches Nostr profile (kind 0) and NIP-05 verification for a given pubkey.
 * Returns { name, about, picture, nip05, verified } or null on failure.
 */
export const fetchNostrProfile = async (pubkey) => {
  if (!pubkey || pubkey.length !== 64 || !/^[a-f0-9]{64}$/i.test(pubkey)) {
    logger.warn('Invalid pubkey provided for profile fetch');
    return null;
  }

  try {
    let profile = null;
    let verifiedNip05 = null;

    // Fetch from relays
    const sub = {
      "#k": ["0"],
      "authors": [pubkey],
      "limit": 1,
      "since": 0
    };

    for (const relayUrl of RELAYS) {
      try {
        const relay = await Relay.connect(relayUrl);
        const events = await relay.list(sub);
        relay.close();

        if (events.length > 0) {
          const event = events[0];
          profile = {
            name: event.tags.find(t => t[0] === 'name')?.[1] || '',
            about: event.content || '',
            picture: event.tags.find(t => t[0] === 'picture')?.[1] || '',
            created_at: event.created_at
          };
          break;
        }
      } catch (err) {
        logger.warn(`Failed to fetch profile from ${relayUrl}: ${err.message}`);
      }
    }

    // Try NIP-05 verification if name suggests a domain (contains @)
    if (profile && profile.name && profile.name.includes('@')) {
      try {
        const nip05Result = await nip05.verify(profile.name, pubkey);
        if (nip05Result) {
          verifiedNip05 = profile.name;
          profile.verified = true;
        }
      } catch (err) {
        logger.warn(`NIP-05 verification failed for ${profile.name}: ${err.message}`);
      }
    }

    if (profile) {
      profile.nip05 = verifiedNip05;
    }

    logger.info(`Fetched profile for pubkey ${pubkey.slice(0,8)}...: ${profile ? 'success' : 'no data'}`);
    return profile || null;
  } catch (error) {
    logger.error(`Error fetching Nostr profile for ${pubkey}: %o`, error);
    return null;
  }
};

/**
 * Pings all configured Nostr relays and measures connection latency.
 * Returns array of {url, latency (ms), status ('ok' | 'error'), error?}
 */
export const pingRelays = async () => {
  const results = [];
  const timeout = 5000; // 5s timeout per relay

  for (const url of RELAYS) {
    const start = performance.now(); // Use performance for ms precision
    let latency = -1;
    let status = 'error';
    let error = '';

    try {
      const relay = await Promise.race([
        Relay.connect(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
      ]);
      latency = Math.round(performance.now() - start);
      status = 'ok';
      relay.close();
    } catch (err) {
      latency = Math.round(performance.now() - start);
      error = err.message;
      logger.warn(`Nostr ping failed for ${url}: ${error}`);
    }

    results.push({ url, latency, status, error });
  }

  logger.info('Nostr relay ping results: %o', results);
  return results;
};

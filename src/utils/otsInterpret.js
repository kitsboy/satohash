/**
 * Interpret OpenTimestamps verify payload into a simple status + ELI-16 copy.
 * PendingAttestation = calendars hold the receipt, not yet in a Bitcoin block.
 * Bitcoin block height / "Bitcoin block" in details = on-chain success.
 */
export function interpretOtsResult({ api, structural, hash, hadOtsFile }) {
  const details =
    typeof api?.details === 'string'
      ? api.details
      : api?.details
        ? JSON.stringify(api.details, null, 2)
        : ''
  const detailLower = details.toLowerCase()
  const hasBitcoinBlock =
    Boolean(api?.verified) ||
    Boolean(api?.bitcoin_block_height) ||
    /bitcoin block\s*\d+/i.test(details) ||
    detailLower.includes('bitcoinblockattestation')
  const hasPending =
    detailLower.includes('pendingattestation') ||
    detailLower.includes('pending attestation') ||
    (api && api.verified === false && details && !api.error)
  const structuralOk = structural?.verified !== false && structural?.mode !== 'failed'
  const registryPending = api?.status === 'pending'
  const registryConfirmed = api?.status === 'confirmed' || api?.status === 'verified'

  if (api?.error && !details && !structuralOk) {
    return {
      level: 'failed',
      title: 'Failed',
      headline: 'We could not verify this proof.',
      eli16:
        'Something is wrong with the file, the hash, or the server response. Try re-uploading the .ots, paste the matching SHA-256, or use “Upgrade .ots” and verify again.',
      code: details || api.error || structural?.message || 'No details returned.'
    }
  }

  if (hasBitcoinBlock || registryConfirmed) {
    const block = api?.bitcoin_block_height
    return {
      level: 'success',
      title: 'Success',
      headline: 'Your document fingerprint is anchored on Bitcoin.',
      eli16: block
        ? `Think of Bitcoin as a public notary book. Your file’s fingerprint was written into that book around block #${block}. Anyone can re-check the .ots later — even without Satohash — and see the same proof.`
        : 'Think of Bitcoin as a public notary book. Your .ots shows a Bitcoin block attestation: the fingerprint is recorded on the chain, not only on a temporary calendar server.',
      code:
        details || structural?.message || `Verified · block ${block ?? '—'} · hash ${hash || '—'}`
    }
  }

  if (hasPending || registryPending || (hadOtsFile && structuralOk && api && !api.verified)) {
    const calendars = []
    if (/alice\.btc\.calendar/i.test(details)) calendars.push('Alice')
    if (/bob\.btc\.calendar/i.test(details)) calendars.push('Bob')
    if (/finney|eternitywall/i.test(details)) calendars.push('Finney')
    const calTxt = calendars.length ? calendars.join(' + ') : 'OTS calendars'
    return {
      level: 'pending',
      title: 'Pending',
      headline: 'Valid proof file — not on the Bitcoin chain yet.',
      eli16: `Your .ots is real and accepted by ${calTxt}. They hold a “pending receipt.” After enough Bitcoin blocks, that receipt upgrades into a permanent chain anchor. Click Upgrade .ots in a while, then Verify again. Until then the certificate correctly says PENDING.`,
      code: details || structural?.message || 'Pending calendar attestation — no Bitcoin block yet.'
    }
  }

  if (hadOtsFile && structuralOk && !hash) {
    return {
      level: 'pending',
      title: 'Proof loaded',
      headline: 'OTS file looks valid — add the document hash to finish pairing.',
      eli16:
        'We opened the receipt (the .ots). To prove it matches a specific file, paste the 64-character SHA-256 or upload the original document so we can hash it in your browser, then hit Verify again.',
      code: details || structural?.message || 'Structural check passed.'
    }
  }

  if (structural && !structuralOk) {
    return {
      level: 'failed',
      title: 'Failed',
      headline: 'This does not look like a valid .ots proof.',
      eli16:
        'The file may be corrupt, empty, or not an OpenTimestamps proof. Re-download the .ots from your stamp page or vault and try again.',
      code: structural.message || 'Structural check failed.'
    }
  }

  if (api?.error === 'Hash not found in registry.' || (api && api.verified === false && !details)) {
    return {
      level: 'failed',
      title: 'Not found',
      headline: 'No matching stamp in the Satohash registry.',
      eli16:
        'That hash is not in our database (or not under this API). You can still verify a .ots independently on opentimestamps.org or with the CLI — registry lookup is only one path.',
      code: api.error || 'Hash not found in registry.'
    }
  }

  return {
    level: 'pending',
    title: 'Checked',
    headline: 'We ran a check — see the technical log below.',
    eli16:
      'If you expected “Success,” wait for calendars to upgrade the proof into a Bitcoin block, then Upgrade + Verify again. Pending is normal for new stamps.',
    code: details || structural?.message || JSON.stringify(api || {}, null, 2)
  }
}

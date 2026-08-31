/**
 * DonationReceiptShare — OPTIONAL, share-first actions for a verified receipt.
 * Cam's ask (2026-08-25): no forced email/PDF; let the giver choose.
 *   • Share to socials (primary, optional): Web Share API + explicit X / Nostr / copy-link
 *   • Email (optional): mailto with the proof-card URL (giver chooses to send, never auto)
 *   • PDF (optional): download the proof package / certificate ONLY if they want it
 * Honesty: the URL is the proof; sharing is a choice, not a funnel.
 */
import { Share2, Mail, FileDown, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { buildXIntent, buildNostrShareLinks, buildProofCardUrl } from '../../utils/shareProof'

/** Interactive verify / PDF live on /verify. Share/copy/iMessage use /p/<hash>. */
function buildVerifyUrl(proof) {
  if (typeof window === 'undefined') return ''
  const origin = window.location.origin
  const id = proof?.id || proof?.timestamp_id
  if (id && !String(id).startsWith('ots-')) return `${origin}/verify/${id}`
  if (proof?.hash && /^[a-f0-9]{64}$/i.test(proof.hash)) return `${origin}/verify/${proof.hash}`
  return `${origin}/verify`
}

function buildShareText(proof, isDonation) {
  const amt = proof?.amount_sats ? `${Number(proof.amount_sats).toLocaleString()} sats ` : ''
  if (isDonation) {
    return `Gave ${amt}to the Give A Bit family — verified, stamped on Bitcoin via OpenTimestamps. We'd rather show you old truth than new lies.`
  }
  const label = proof?.filename || 'proof'
  const status = proof?.status === 'confirmed' ? 'Bitcoin-confirmed' : 'Bitcoin-submitted'
  return `${status} for “${label}” via Satohash / OpenTimestamps.`
}

export default function DonationReceiptShare({ proof, isDonation = false }) {
  const [copied, setCopied] = useState(false)
  const url = buildProofCardUrl(proof)
  const verifyUrl = buildVerifyUrl(proof)
  const text = buildShareText(proof, isDonation)

  async function webShare() {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'Give A Bit receipt', text: `${text}\n${url}`, url })
        return true
      }
    } catch (e) {
      if (e?.name === 'AbortError') return true
    }
    return false
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
      toast.success('Receipt link copied')
    } catch {
      toast.error('Could not copy link')
    }
  }

  const xIntent = buildXIntent({ text, url })
  const nostrLinks = buildNostrShareLinks({
    text,
    url,
    nostrEventId: proof?.nostr_event_id
  })
  const mailto = `mailto:?subject=${encodeURIComponent('A Give A Bit receipt to verify')}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
  const shareLinkClass =
    'flex min-h-[44px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase'
  const shareLinkStyle = { borderColor: 'var(--border)', color: 'var(--text-primary)' }

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: 'var(--border-gold)', background: 'var(--surface-raised)' }}
    >
      <p
        className="text-[10px] font-black tracking-widest uppercase"
        style={{ color: 'var(--accent-gold)' }}
      >
        {isDonation ? 'Share your gift — if you want to' : 'Share this proof — if you want to'}
      </p>
      <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {isDonation
          ? 'No emails, no accounts, nothing forced. This receipt is yours — share it, download it, or leave it. The proof lives on Bitcoin either way.'
          : 'Sharing is optional. The proof is on Bitcoin regardless — this is just if you want to show it.'}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={async () => {
            const ok = await webShare()
            if (ok) toast.success('Shared')
            else await copyLink()
          }}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-xs font-black tracking-wider uppercase"
          style={{ background: 'var(--accent-gold)', color: '#141b25' }}
        >
          <Share2 size={15} /> Share
        </button>
        <a
          href={xIntent}
          target="_blank"
          rel="noopener noreferrer"
          className={shareLinkClass}
          style={shareLinkStyle}
        >
          X / Twitter
        </a>
        {nostrLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={shareLinkClass}
            style={shareLinkStyle}
          >
            {link.label}
          </a>
        ))}
        <button type="button" onClick={copyLink} className={shareLinkClass} style={shareLinkStyle}>
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={mailto}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <Mail size={15} /> Email (optional)
        </a>
        <a
          href={`${verifyUrl}#download`}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border text-xs font-black tracking-wider uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <FileDown size={15} /> PDF (optional)
        </a>
      </div>

      {verifyUrl ? (
        <a
          href={verifyUrl}
          className="mt-2 flex min-h-[44px] items-center justify-center rounded-xl border text-xs font-black tracking-wider uppercase"
          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
        >
          Interactive verify
        </a>
      ) : null}
    </div>
  )
}

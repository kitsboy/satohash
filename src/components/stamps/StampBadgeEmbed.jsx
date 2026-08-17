import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { buildVerifyUrl } from '../../utils/shareProof'

/** Embeddable “this file is stamped” snippet. */
export default function StampBadgeEmbed({ proof }) {
  const [open, setOpen] = useState(false)
  const url = useMemo(() => buildVerifyUrl(proof), [proof])
  const status = proof?.status === 'confirmed' ? 'Confirmed on Bitcoin' : 'Pending Bitcoin stamp'
  const snippet = `<a href="${url}" rel="noopener noreferrer">This file is stamped on Bitcoin via Satohash — ${status}</a>`

  if (!url) return null

  return (
    <div data-testid="stamp-badge-embed">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-xl border py-3 text-xs font-black tracking-wider uppercase"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        {open ? 'Hide badge snippet' : 'Embed / badge'}
      </button>
      {open && (
        <div
          className="mt-2 space-y-2 rounded-xl border p-3"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
        >
          <a
            href={url}
            className="inline-flex min-h-[40px] items-center rounded-full border px-3 text-[10px] font-black tracking-widest uppercase"
            style={{
              borderColor: 'var(--accent-gold)',
              color: 'var(--accent-gold)',
              background: 'var(--accent-gold-subtle)'
            }}
          >
            Stamped on Bitcoin
          </a>
          <textarea
            readOnly
            value={snippet}
            className="h-20 w-full rounded-lg border p-2 font-mono text-[10px]"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)'
            }}
          />
          <button
            type="button"
            className="btn-sheen min-h-[44px] w-full rounded-xl text-xs font-black uppercase"
            style={{ background: 'var(--accent-gold)', color: '#141b25' }}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(snippet)
                toast.success('Badge HTML copied')
              } catch {
                toast.error('Copy failed')
              }
            }}
          >
            Copy HTML
          </button>
        </div>
      )}
    </div>
  )
}

import { useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { getApiUrl } from '../config/constants'
import { isApiExplicitlyConfigured } from '../config/mvp'
import { persistLastProof, readLastProof } from '../utils/lastProof'
import {
  alreadyNotified,
  markNotified,
  notifyProofConfirmed,
  requestConfirmNotifyPermission
} from '../utils/notifyConfirmed'

function sha256Hex(value) {
  const hex = String(value || '')
    .toLowerCase()
    .replace(/^0x/, '')
  return /^[a-f0-9]{64}$/.test(hex) ? hex : ''
}

function isPending(proof) {
  if (!proof) return false
  const s = String(proof.status || '').toLowerCase()
  if (s === 'confirmed' || s === 'verified' || s === 'failed') return false
  if (proof.isConfirmed) return false
  return Boolean(sha256Hex(proof.hash) || proof.id)
}

function isConfirmed(proof) {
  if (!proof) return false
  const s = String(proof.status || '').toLowerCase()
  return s === 'confirmed' || s === 'verified' || Boolean(proof.isConfirmed)
}

async function fetchByHash(hex) {
  const res = await fetch(`${getApiUrl()}/api/stamps/${hex}/by-hash`)
  if (!res.ok) return null
  const body = await res.json()
  const row = Array.isArray(body?.stamps) ? body.stamps[0] : body
  if (!row || typeof row !== 'object') return null
  return { ...row, hash: row.hash || hex, source: 'api' }
}

/**
 * While the last local proof is Pending, poll by-hash. When Bitcoin confirms,
 * persist, toast, and fire a browser notification so the user can come back.
 */
export function usePendingProofWatch() {
  const { t } = useTranslation()

  useEffect(() => {
    if (!isApiExplicitlyConfigured()) return undefined

    let cancelled = false
    let timer = null

    const announce = (next) => {
      const hex = sha256Hex(next.hash)
      if (!hex || alreadyNotified(hex)) return
      const url = `/p/${hex}`
      const title = t('stampDonePage.notifyTitle')
      const body = t('stampDonePage.notifyBody')
      notifyProofConfirmed({ title, body, url, hash: hex })
      markNotified(hex)
      toast.success(t('stampDonePage.confirmedToast'), {
        description: t('stampDonePage.confirmedToastHint'),
        action: {
          label: t('stampDonePage.viewProofCard'),
          onClick: () => {
            window.location.href = url
          }
        }
      })
    }

    const tick = async () => {
      const proof = readLastProof()
      if (!isPending(proof)) return
      const hex = sha256Hex(proof.hash)
      if (!hex) return
      try {
        const next = await fetchByHash(hex)
        if (!next || cancelled) return
        persistLastProof({ ...proof, ...next })
        if (isConfirmed(next)) announce(next)
      } catch {
        /* keep last known */
      }
    }

    const start = () => {
      const proof = readLastProof()
      if (!isPending(proof)) return
      requestConfirmNotifyPermission()
      tick()
      if (!timer) timer = setInterval(tick, 15000)
    }

    start()
    const onUpdate = () => start()
    window.addEventListener('satohash-proof-updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      cancelled = true
      if (timer) clearInterval(timer)
      window.removeEventListener('satohash-proof-updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [t])
}

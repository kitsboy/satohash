/**
 * Bridge dual i18n: shell (useI18n) + marketing/onboarding (react-i18next).
 * Prefer shell keys when present; fall back to i18next dotted keys.
 */
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useI18n } from '../i18n'

export default function useAppTranslation() {
  const { t: shellT, lang, setLang } = useI18n()
  const { t: i18nT, i18n } = useTranslation()

  const t = useCallback(
    (key, fallbackOrOpts, maybeFallback) => {
      if (typeof key === 'string' && key.includes('.')) {
        const [ns, sub] = key.split('.')
        const shellKey = sub || ns
        const shellNs = sub ? ns : 'common'
        const shellVal = shellT(shellNs, shellKey)
        if (shellVal && shellVal !== shellKey) return shellVal
        return i18nT(key, fallbackOrOpts ?? maybeFallback)
      }
      if (typeof fallbackOrOpts === 'string') {
        const shellVal = shellT('common', key)
        return shellVal !== key ? shellVal : fallbackOrOpts
      }
      return i18nT(key, fallbackOrOpts)
    },
    [shellT, i18nT]
  )

  return { t, lang, setLang, i18n }
}

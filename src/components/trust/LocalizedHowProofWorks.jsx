import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import HowProofWorks, { DEFAULT_LABELS } from './HowProofWorks'

export default function LocalizedHowProofWorks(props) {
  const { t } = useTranslation()
  const labels = useMemo(() => {
    const raw = t('howProofWorks', { returnObjects: true })
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return DEFAULT_LABELS
    return { ...DEFAULT_LABELS, ...raw }
  }, [t])
  return <HowProofWorks {...props} labels={labels} />
}

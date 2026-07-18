import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import usePageMeta from '../hooks/usePageMeta'

export default function TemplateDetail() {
  const { t } = useTranslation()
  const [template, setTemplate] = useState(null)
  usePageMeta({
    page: 'templateDetail',
    title: template ? `${template.title} — Demo Preview` : undefined
  })
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [Editor, setEditor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)

    import('./NotaryTemplates')
      .then((mod) => {
        if (!active) return
        const match = mod.TEMPLATES.find((t) => t.id === templateId)
        if (!match) {
          setError(true)
          setLoading(false)
          return
        }
        setTemplate(match)
        setEditor(() => mod.TemplateEditor)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setError(true)
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [templateId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent-gold)] border-t-transparent" />
      </div>
    )
  }

  if (error || !template || !Editor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--bg-primary)] px-6">
        <FileText size={48} className="text-[var(--text-tertiary)]" />
        <h1 className="text-2xl font-black text-[var(--text-primary)]">
          {t('templateDetailPage.notFound', { defaultValue: 'Template not found' })}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {t('templateDetailPage.loadError', {
            defaultValue: "This template doesn't exist or could not be loaded."
          })}
        </p>
        <Link
          to="/templates"
          className="rounded-xl bg-[var(--accent-gold)] px-6 py-3 text-xs font-black tracking-wider text-black uppercase"
        >
          {t('templatesPage.browseAll', { defaultValue: 'Browse Templates' })}
        </Link>
      </div>
    )
  }

  return (
    <Editor key={template.id} template={template} demoMode onBack={() => navigate('/templates')} />
  )
}

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'
import { clsx } from 'clsx'
import { useI18n } from '../../i18n'

/**
 * Drop target. The file is handed to the stamp flow at once.
 * There is no encryption switch. The file stays on the device either way.
 */
export default function GlobalDropzone({ onFileProcessed }) {
  const { t } = useI18n()
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles) => {
      setDragActive(false)
      const file = acceptedFiles[0]
      if (file && onFileProcessed) onFileProcessed(file)
    },
    [onFileProcessed]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const dragging = isDragActive || dragActive

  return (
    <>
      <div
        {...getRootProps()}
        className={clsx('relative w-full transition-all duration-300', dragging && 'scale-[1.01]')}
      >
        <input {...getInputProps()} />
        <button
          type="button"
          onClick={open}
          aria-label={t('dashboard', 'dropAria')}
          className={clsx(
            'group w-full rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200',
            dragging
              ? 'border-[var(--accent-active)] bg-[var(--accent-active)]/5'
              : 'border-[var(--border)] bg-[var(--bg-primary)] hover:bg-[var(--surface-raised)]'
          )}
          style={
            dragging
              ? { boxShadow: '0 0 34px var(--jewel-sky-glow)' }
              : {
                  borderColor: 'color-mix(in srgb, var(--accent-active) 30%, var(--border))',
                  transition: 'border-color .3s ease, box-shadow .3s ease'
                }
          }
        >
          <UploadCloud
            size={28}
            className="mx-auto mb-3 transition-transform group-hover:scale-110"
            style={{
              color: 'var(--accent-active)',
              filter: 'drop-shadow(0 0 10px var(--jewel-sky-glow))'
            }}
          />
          <p
            className="mb-1 text-sm font-black tracking-wide uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('dashboard', 'dropBrowse')}
          </p>
          <p className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>
            {t('dashboard', 'dropHint')}
          </p>
          <p className="mt-3 text-[10px] font-black tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            {t('dashboard', 'fileStays')}
          </p>
        </button>
      </div>

      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[2000] flex items-center justify-center backdrop-blur-2xl"
            style={{ background: 'rgba(5,7,10,0.92)' }}
          >
            <div className="px-6 text-center">
              <h2 className="mb-4 text-4xl font-black tracking-tighter text-white uppercase">
                {t('dashboard', 'releaseTitle')}
              </h2>
              <p className="mx-auto max-w-md text-base leading-relaxed text-white/70">
                {t('dashboard', 'releaseBody')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

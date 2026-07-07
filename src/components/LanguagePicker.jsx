import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Modal from './Modal'
import { useI18n, languages } from '../i18n'

export default function LanguagePicker({ isOpen, onClose }) {
  const { lang, setLang } = useI18n()

  const handleLanguageSelect = (languageCode) => {
    setLang(languageCode)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Language">
      <p className="mb-5 text-sm text-slate-500">
        Select your preferred language for the Satohash interface.
      </p>
      <div className="flex flex-col gap-2">
        {languages.map((item, idx) => {
          const isActive = lang === item.code
          return (
            <motion.button
              key={item.code}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => handleLanguageSelect(item.code)}
              className={`group flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all ${
                isActive
                  ? 'border-2 border-indigo-200 bg-indigo-50 shadow-sm'
                  : 'border-2 border-transparent hover:border-slate-100 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">{item.flag}</span>
              <div className="flex-1">
                <span
                  className={`block text-sm font-bold ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}
                >
                  {item.label}
                </span>
                <span className="text-[11px] font-medium text-slate-400">{item.native}</span>
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white"
                >
                  <Check size={14} strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
    </Modal>
  )
}

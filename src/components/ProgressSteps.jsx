import { Check } from 'lucide-react'

export default function ProgressSteps({ steps, currentStep }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)',
        margin: 'var(--spacing-xl) 0'
      }}
    >
      {steps.map((step, index) => {
        const isComplete = index < currentStep
        const isCurrent = index === currentStep
        const stepNumber = index + 1

        return (
          <div
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                background: isComplete
                  ? 'var(--gradient-success)'
                  : isCurrent
                    ? 'var(--gradient-primary)'
                    : 'var(--color-surface)',
                color:
                  isComplete || isCurrent
                    ? 'var(--color-text-inverse)'
                    : 'var(--color-text-tertiary)',
                border: isComplete || isCurrent ? 'none' : '2px solid var(--color-border)'
              }}
            >
              {isComplete ? <Check size={16} /> : stepNumber}
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  width: '40px',
                  height: '2px',
                  background: isComplete ? 'var(--color-success)' : 'var(--color-border)'
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

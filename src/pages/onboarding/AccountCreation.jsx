import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Shield, Mail, User, Building2, Sparkles } from 'lucide-react'
import Button from '../../components/Button'
import OnboardingProgressBar from '../../components/OnboardingProgressBar'
import usePageMetaOnboarding from '../../hooks/usePageMetaOnboarding'
import { setOnboardingStep } from '../../utils/onboardingFlow'

export default function AccountCreation() {
  usePageMetaOnboarding('account-creation')
  useEffect(() => {
    setOnboardingStep('account-creation')
  }, [])
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    organization: ''
  })
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Save user data to localStorage (simulated account creation)
    localStorage.setItem('satohash_user', JSON.stringify(formData))
    const templateType = location.state?.templateType
    navigate('/onboarding/value-confirmation', { state: { templateType } })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const formFields = [
    {
      name: 'email',
      type: 'email',
      label: t('account.email'),
      placeholder: t('account.emailPlaceholder'),
      icon: Mail,
      required: true
    },
    {
      name: 'name',
      type: 'text',
      label: t('account.name'),
      placeholder: t('account.namePlaceholder'),
      icon: User,
      required: true
    },
    {
      name: 'organization',
      type: 'text',
      label: t('account.organization'),
      placeholder: t('account.organizationPlaceholder'),
      icon: Building2,
      required: false
    }
  ]

  return (
    <div
      className="page"
      style={{ background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.03) 0%, white 40%)' }}
    >
      <div className="layout-container">
        <OnboardingProgressBar currentStepId="account-creation" />
        {/* Header */}
        <div
          className="text-center"
          style={{
            marginTop: 'var(--spacing-2xl)',
            marginBottom: 'var(--spacing-2xl)'
          }}
        >
          <div
            className="animate-slide-down"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              marginBottom: 'var(--spacing-lg)',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)'
            }}
          >
            <Sparkles size={32} color="white" />
          </div>

          <h1
            className="animate-slide-down"
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: '800',
              marginBottom: 'var(--spacing-sm)',
              animationDelay: '100ms'
            }}
          >
            {t('account.title')}
          </h1>

          <p
            className="text-secondary animate-fade-in"
            style={{
              animationDelay: '200ms',
              fontSize: 'var(--text-lg)'
            }}
          >
            Create your account to get started with Satohash
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-in"
          style={{
            animationDelay: '300ms'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-2xl)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              marginBottom: 'var(--spacing-xl)'
            }}
          >
            {formFields.map((field, index) => {
              const Icon = field.icon
              const isFocused = focusedField === field.name
              const hasValue = formData[field.name].length > 0

              return (
                <div
                  key={field.name}
                  style={{ marginBottom: index < formFields.length - 1 ? 'var(--spacing-xl)' : 0 }}
                >
                  <label
                    className="form-label"
                    htmlFor={field.name}
                    style={{
                      display: 'block',
                      marginBottom: 'var(--spacing-sm)',
                      fontWeight: '600',
                      fontSize: 'var(--text-sm)',
                      color: isFocused ? 'var(--color-primary)' : 'var(--color-text)',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {field.label}{' '}
                    {field.required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
                  </label>

                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Icon
                        size={20}
                        color={
                          isFocused
                            ? 'var(--color-primary)'
                            : hasValue
                              ? 'var(--color-text-secondary)'
                              : 'var(--color-text-tertiary)'
                        }
                      />
                    </div>

                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      className="form-input"
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      required={field.required}
                      style={{
                        paddingLeft: '48px',
                        fontSize: 'var(--text-base)',
                        borderColor: isFocused ? 'var(--color-primary)' : 'var(--color-border)',
                        boxShadow: isFocused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Security note */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-lg)',
              background:
                'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              marginBottom: 'var(--spacing-xl)',
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              alignItems: 'flex-start'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Shield size={20} color="#22c55e" />
            </div>
            <p className="mb-0" style={{ paddingTop: '6px' }}>
              {t('account.securityNote')}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            style={{
              width: '100%',
              marginBottom: 'var(--spacing-md)',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              border: 'none',
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              height: '56px',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.3)'
            }}
          >
            {t('account.createAccount')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/contracts')}
            style={{ width: '100%' }}
          >
            {t('account.signInInstead')}
          </Button>
        </form>
      </div>
    </div>
  )
}

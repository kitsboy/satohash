import usePageMeta from './usePageMeta'

const TITLES = {
  welcome: 'Welcome — Get Started',
  'how-it-works': 'How It Works',
  'choose-template': 'Choose a Template',
  'account-creation': 'Create Your Account',
  'value-confirmation': 'Confirm Your Plan',
  'batch-proof': 'Batch Proof Demo',
  'template-library': 'Template Library',
  review: 'Final Review',
  explanation: 'Timestamp Explanation',
  progress: 'Anchoring Progress',
  result: 'Timestamp Result',
  'verification-help': 'Verification Help',
  signatures: 'Signature Flow',
  certificates: 'Certificate Templates',
  admin: 'Admin Console',
  'notary-templates': 'Notary Templates',
  'contract-editor': 'Contract Editor'
}

export default function usePageMetaOnboarding(page) {
  usePageMeta({ title: TITLES[page] || page })
}

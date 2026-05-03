import { LucideIcon } from 'lucide-react'

export const Bitcoin = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6v12M8 8h8M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

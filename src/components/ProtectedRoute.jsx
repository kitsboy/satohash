import { Navigate, useLocation } from 'react-router-dom'
import PageErrorBoundary from './PageErrorBoundary'

export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const authed =
    localStorage.getItem('satohash_authed') === 'true' ||
    sessionStorage.getItem('satohash_authed') === 'true'
  const token = localStorage.getItem('satohash_token')

  if (!authed && !token) {
    return <Navigate to="/access" state={{ from: location }} replace />
  }

  return <PageErrorBoundary>{children}</PageErrorBoundary>
}

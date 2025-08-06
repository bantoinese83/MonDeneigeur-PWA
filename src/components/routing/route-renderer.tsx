import { Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../auth/protected-route'
import type { RouteConfig } from '../../lib/types'

interface RouteRendererProps {
  route: RouteConfig
  isAuthenticated: boolean
}

export function RouteRenderer({ route, isAuthenticated }: RouteRendererProps) {
  // Handle redirects
  if (route.redirect) {
    return <Navigate to={route.redirect} replace />
  }

  // Handle public routes with authentication redirect
  if (route.redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to={route.redirectIfAuthenticated} replace />
  }

  // Handle protected routes
  if (route.element && route.allowedRoles) {
    return (
      <ProtectedRoute allowedRoles={route.allowedRoles}>
        <route.element />
      </ProtectedRoute>
    )
  }

  // Handle public routes
  if (route.element) {
    return <route.element />
  }

  return null
} 
import { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { Loader2 } from 'lucide-react'
import { Spinner3D } from '../shared/3d-spinner'
import type { UserRole } from '../../lib/database.types'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Only check auth if not already authenticated
    if (!isAuthenticated && !isLoading) {
      checkAuth()
    }
  }, [isAuthenticated, isLoading]) // Include dependencies to prevent stale closures

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo)
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo])

  useEffect(() => {
    if (!isLoading && isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        navigate('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner3D size="md" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
} 
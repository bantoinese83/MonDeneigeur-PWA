import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { AuthLayout } from '../../components/layout/auth-layout'
import { LoginForm } from '../../components/auth/login-form'
import { Link } from 'react-router-dom'

export function LoginPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <AuthLayout 
      title="Sign In" 
      subtitle="Welcome back to MonDeneigeur"
    >
      <LoginForm />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
} 
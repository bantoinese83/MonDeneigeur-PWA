import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { AuthLayout } from '../../components/layout/auth-layout'
import { RegisterForm } from '../../components/auth/register-form'
import { Link } from 'react-router-dom'

export function RegisterPage() {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join MonDeneigeur today"
    >
      <RegisterForm />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
} 
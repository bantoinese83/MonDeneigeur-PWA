import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../stores/auth-store'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Spinner3D } from '../shared/3d-spinner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuthStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    clearError()
    await login(data.email, data.password)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="input pl-10"
              placeholder="Enter your email address"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-error mt-2 flex items-center">
              <span className="w-1 h-1 bg-error rounded-full mr-2"></span>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="input pl-10 pr-10"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-error mt-2 flex items-center">
              <span className="w-1 h-1 bg-error rounded-full mr-2"></span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <div className="flex items-center">
              <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
              {error}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full btn-lg"
        >
          {isLoading ? (
            <>
              <Spinner3D size="sm" />
              <span className="ml-2">Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  )
} 
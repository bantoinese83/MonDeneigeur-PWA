import { Loader2, Snowflake } from 'lucide-react'
import { Spinner3D } from '../shared/3d-spinner'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'skeleton' | 'dots' | 'brand'
  className?: string
}

export function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md', 
  variant = 'spinner',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const renderSpinner = () => {
    switch (variant) {
      case 'skeleton':
        return (
          <div className="space-y-3">
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="skeleton h-4 w-2/3"></div>
          </div>
        )
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )
      
      case 'brand':
        return (
          <div className="flex items-center justify-center">
            <Snowflake className={`${sizeClasses[size]} text-primary animate-pulse`} />
          </div>
        )
      
      default:
        return (
          <Spinner3D size={size} />
        )
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center">
        {renderSpinner()}
        {message && (
          <p className="text-gray-600 mt-4 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  )
}

// Enhanced skeleton loading component
export function SkeletonLoader({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index} 
          className="skeleton h-4"
          style={{ width: `${Math.max(50, 100 - index * 20)}%` }}
        ></div>
      ))}
    </div>
  )
}

// Enhanced loading overlay
export function LoadingOverlay({ 
  message = 'Loading...',
  show = true 
}: { 
  message?: string
  show?: boolean 
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <LoadingSpinner message={message} size="md" variant="brand" />
      </div>
    </div>
  )
} 
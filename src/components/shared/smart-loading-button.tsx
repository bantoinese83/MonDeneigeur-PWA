import { useState, useRef, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface SmartLoadingButtonProps {
  onClick: () => Promise<void>
  children: React.ReactNode
  className?: string
  disabled?: boolean
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function SmartLoadingButton({
  onClick,
  children,
  className = '',
  disabled = false,
  loadingText = 'Loading...',
  variant = 'primary',
  size = 'md'
}: SmartLoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleClick = async () => {
    if (isLoading || disabled) return
    setIsLoading(true)
    try {
      await onClick()
    } catch (error) {
      console.error('Button action failed:', error)
    } finally {
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 hover:bg-primary-700 text-white border-transparent'
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white border-transparent'
      case 'outline':
        return 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-transparent'
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white border-transparent'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'lg':
        return 'px-6 py-3 text-lg'
      default:
        return 'px-4 py-2 text-sm'
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClasses()} ${getSizeClasses()} ${className}`}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {isLoading ? loadingText : children}
    </button>
  )
} 
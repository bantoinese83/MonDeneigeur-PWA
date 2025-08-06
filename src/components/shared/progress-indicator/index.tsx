import { ProgressBar } from './progress-bar'
import { Spinner } from './spinner'
import { Skeleton } from './skeleton'

interface ProgressIndicatorProps {
  type: 'spinner' | 'progress' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  value?: number
  max?: number
  showLabel?: boolean
  lines?: number
  className?: string
}

export function ProgressIndicator({
  type,
  size = 'md',
  variant = 'default',
  value = 0,
  max = 100,
  showLabel = false,
  lines = 3,
  className = ''
}: ProgressIndicatorProps) {
  switch (type) {
    case 'spinner':
      return <Spinner size={size} variant={variant} className={className} />
    
    case 'progress':
      return (
        <ProgressBar
          value={value}
          max={max}
          size={size}
          variant={variant}
          showLabel={showLabel}
          className={className}
        />
      )
    
    case 'skeleton':
      return <Skeleton lines={lines} className={className} />
    
    default:
      return <Spinner size={size} variant={variant} className={className} />
  }
}

// Export individual components for direct use
export { ProgressBar } from './progress-bar'
export { Spinner } from './spinner'
export { Skeleton } from './skeleton' 
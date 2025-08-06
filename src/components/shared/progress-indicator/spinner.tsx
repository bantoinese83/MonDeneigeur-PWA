import { Spinner3D } from '../3d-spinner'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  className?: string
}

export function Spinner({ size = 'md', variant = 'default', className = '' }: SpinnerProps) {
  return (
    <Spinner3D
      size={size}
      className={className}
    />
  )
} 
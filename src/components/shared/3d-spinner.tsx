

interface Spinner3DProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner3D({ size = 'md', className = '' }: Spinner3DProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  // Debug log to verify component is rendering
  console.log('Spinner3D rendering with size:', size, 'className:', className)

  return (
    <div 
      className={`spinner-3d ${sizeClasses[size]} ${className}`}
      data-testid="spinner-3d"
      data-size={size}
    >
      <div className="spinner-ring ring-1"></div>
      <div className="spinner-ring ring-2"></div>
      <div className="spinner-ring ring-3"></div>
    </div>
  )
} 
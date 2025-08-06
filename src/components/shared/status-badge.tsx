import clsx from 'clsx'

export interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig = {
  // Employee status
  active: { variant: 'success' as const, label: 'Active' },
  inactive: { variant: 'warning' as const, label: 'Inactive' },
  terminated: { variant: 'error' as const, label: 'Terminated' },
  
  // Contract status
  draft: { variant: 'info' as const, label: 'Draft' },
  completed: { variant: 'success' as const, label: 'Completed' },
  cancelled: { variant: 'error' as const, label: 'Cancelled' },
  
  // Route status
  pending: { variant: 'warning' as const, label: 'Pending' },
  in_progress: { variant: 'info' as const, label: 'In Progress' },
  
  // Default
  default: { variant: 'default' as const, label: 'Unknown' }
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800'
}

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
}

export function StatusBadge({ 
  status, 
  variant, 
  size = 'md', 
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default
  const finalVariant = variant || config.variant
  const label = config.label

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variantStyles[finalVariant],
        sizeStyles[size],
        className
      )}
    >
      {label}
    </span>
  )
} 
// Status utilities
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'success':
      return 'text-green-600 bg-green-100'
    case 'pending':
    case 'draft':
      return 'text-yellow-600 bg-yellow-100'
    case 'inactive':
    case 'cancelled':
    case 'error':
      return 'text-red-600 bg-red-100'
    case 'in_progress':
      return 'text-blue-600 bg-blue-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export const getStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
      return 'check-circle'
    case 'pending':
    case 'draft':
      return 'clock'
    case 'inactive':
    case 'cancelled':
      return 'x-circle'
    case 'in_progress':
      return 'play-circle'
    case 'error':
      return 'alert-circle'
    default:
      return 'help-circle'
  }
}

export const getGreeting = (): string => {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
} 
// Error utilities with better type safety
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  
  // Handle network errors
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as any).status
    if (status === 404) return 'Resource not found'
    if (status === 403) return 'Access denied'
    if (status === 401) return 'Authentication required'
    if (status >= 500) return 'Server error'
  }
  
  return 'An unknown error occurred'
}

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('Network Error') || 
           error.message.includes('Failed to fetch') ||
           error.message.includes('timeout')
  }
  
  return false
} 
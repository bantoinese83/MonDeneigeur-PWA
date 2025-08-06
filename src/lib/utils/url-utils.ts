// URL utilities
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.VITE_API_URL || 'http://localhost:3000'
}

export const buildUrl = (path: string, params?: Record<string, string>): string => {
  const url = new URL(path, getBaseUrl())
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value)
      }
    })
  }
  
  return url.toString()
}

export const getQueryParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  const result: Record<string, string> = {}
  
  params.forEach((value, key) => {
    result[key] = value
  })
  
  return result
} 
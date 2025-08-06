// Date utilities with caching for better performance
const dateCache = new Map<string, string>()

export const formatDate = (date: string | Date): string => {
  const dateStr = date.toString()
  if (dateCache.has(dateStr)) {
    return dateCache.get(dateStr)!
  }
  
  const d = new Date(date)
  const formatted = d.toLocaleDateString()
  dateCache.set(dateStr, formatted)
  return formatted
}

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleString()
}

export const formatTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const isToday = (date: string | Date): boolean => {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

export const isPast = (date: string | Date): boolean => {
  const d = new Date(date)
  const now = new Date()
  return d < now
}

export const isFuture = (date: string | Date): boolean => {
  const d = new Date(date)
  const now = new Date()
  return d > now
}

export const getRelativeTime = (date: string | Date): string => {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(date)
} 
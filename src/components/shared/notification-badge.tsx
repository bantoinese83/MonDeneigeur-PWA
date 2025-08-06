import { Bell } from 'lucide-react'

interface NotificationBadgeProps {
  count: number
  onClick?: () => void
  className?: string
}

export function NotificationBadge({ count, onClick, className = '' }: NotificationBadgeProps) {
  if (count === 0) {
    return (
      <button
        onClick={onClick}
        className={`relative p-2 text-gray-600 hover:text-gray-900 ${className}`}
      >
        <Bell className="h-6 w-6" />
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-900 ${className}`}
    >
      <Bell className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {count > 9 ? '9+' : count}
      </span>
    </button>
  )
} 
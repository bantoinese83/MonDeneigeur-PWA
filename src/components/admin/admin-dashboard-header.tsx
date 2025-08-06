import { Users, MapPin } from 'lucide-react'
import { CircularCalendarBanner } from '../shared/circular-calendar-banner'

interface AdminDashboardHeaderProps {
  user: any
  getWelcomeMessage: () => string
  activeEmployeesCount: number
}

export function AdminDashboardHeader({ user, getWelcomeMessage, activeEmployeesCount }: AdminDashboardHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {getWelcomeMessage()}, {user?.fullName || user?.email}
            </h1>
            <p className="text-sm text-gray-600">
              Admin Dashboard • Company Operations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">
                {activeEmployeesCount} Active
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Employees</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Tracking</span>
            </div>
          </div>
        </div>
        
        {/* Circular Calendar Banner */}
        <CircularCalendarBanner className="w-full" />
      </div>
    </div>
  )
} 
import { User, Building } from 'lucide-react'

interface EmployeeDashboardHeaderProps {
  user: any
  getWelcomeMessage: () => string
}

export function EmployeeDashboardHeader({ user, getWelcomeMessage }: EmployeeDashboardHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {getWelcomeMessage()}, {user?.fullName || user?.email}
            </h1>
            <p className="text-sm text-gray-600">
              Employee Dashboard • Mobile Operations
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Employee</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Company</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
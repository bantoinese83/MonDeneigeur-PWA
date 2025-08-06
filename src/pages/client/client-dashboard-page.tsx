import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { CircularCalendarBanner } from '../../components/shared/circular-calendar-banner'
import { Spinner3D } from '../../components/shared/3d-spinner'
import { 
  useClientServiceStatus, 
  useClientNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead
} from '../../hooks/use-client-portal'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Bell,
  FileText,
  Settings,
  ArrowRight
} from 'lucide-react'

export function ClientDashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)

  const { data: serviceStatus, isLoading: statusLoading } = useClientServiceStatus()
  const { data: notifications, isLoading: notificationsLoading } = useClientNotifications(5)
  const { data: unreadCount } = useUnreadNotificationCount()
  
  const markAsRead = useMarkNotificationAsRead()
  const markAllAsRead = useMarkAllNotificationsAsRead()

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead.mutate(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  if (statusLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <Spinner3D size="md" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getWelcomeMessage()}, {user?.fullName || user?.email}
          </h1>
          <p className="text-lg text-gray-600">Track your snow removal services</p>
        </div>
        
        {/* Notification Bell */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Bell className="h-6 w-6" />
            {unreadCount && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Circular Calendar Banner */}
      <div className="mb-8">
        <CircularCalendarBanner className="w-full" />
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Services</p>
              <p className="text-3xl font-bold text-gray-900">
                {serviceStatus?.totalServices || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {serviceStatus?.completedServices || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-green-100 text-green-600 group-hover:from-green-100 group-hover:to-green-200 transition-all">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Contracts</p>
              <p className="text-3xl font-bold text-gray-900">
                {serviceStatus?.activeContracts?.length || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 group-hover:from-purple-100 group-hover:to-purple-200 transition-all">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-900">
                {serviceStatus?.totalServices || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 group-hover:from-orange-100 group-hover:to-orange-200 transition-all">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Contracts */}
      {serviceStatus?.activeContracts && serviceStatus.activeContracts.length > 0 && (
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="card-title">Active Contracts</h3>
            <p className="card-description">Your current service agreements</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {serviceStatus.activeContracts.map((contract: any) => (
                <div key={contract.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{contract.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Contract #{contract.id}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                      <button 
                        onClick={() => navigate('/contracts')}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {showNotifications && (
        <div className="card mb-8">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="card-title">Notifications</h3>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-accent hover:text-accent-dark"
              >
                Mark all as read
              </button>
            </div>
            <p className="card-description">Recent updates about your services</p>
          </div>
          <div className="card-content">
            {notificationsLoading ? (
              <div className="text-center py-8">
                <Spinner3D size="md" />
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification: any) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.created_at}</p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-accent hover:text-accent-dark"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
          <p className="card-description">Common tasks for your account</p>
        </div>
        <div className="card-content pt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button 
              onClick={() => navigate('/contracts')}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">View Contracts</h4>
                  <p className="text-sm text-gray-500">Manage your service agreements</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/service-history')}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Service History</h4>
                  <p className="text-sm text-gray-500">View past service records</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/settings')}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                  <Settings className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Notification Settings</h4>
                  <p className="text-sm text-gray-500">Configure your preferences</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
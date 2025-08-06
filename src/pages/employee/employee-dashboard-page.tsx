import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { useEmployeeId } from '../../hooks/use-employee-id'
import { useTodayServiceVisits } from '../../hooks/use-service-visits'
import { WeatherWidget } from '../../components/shared/weather-widget'
import { CircularCalendarBanner } from '../../components/shared/circular-calendar-banner'
import { Spinner3D } from '../../components/shared/3d-spinner'
import { useReverseGeocoding } from '../../hooks/use-reverse-geocoding'
import { 
  MapPin, 
  CheckCircle, 
  Clock,
  Play,
  Square,
  X,
  ArrowRight,
  Calendar,
  Settings
} from 'lucide-react'

export function EmployeeDashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Get employee ID
  const { data: employeeId, isLoading: employeeIdLoading } = useEmployeeId()
  
  // Get today's service visits
  const { data: todayVisits, isLoading: todayLoading } = useTodayServiceVisits(employeeId || '')

  // Default coordinates for Montreal
  const defaultLat = 45.5017
  const defaultLon = -73.5673
  
  // Get location name for Montreal coordinates
  const { name: locationName, isLoading: locationNameLoading } = useReverseGeocoding(defaultLat, defaultLon)

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleStartRoute = (visitId: string) => {
    // TODO: Implement route start logic
    console.log('Start route:', visitId)
  }

  const handleCompleteJob = (visitId: string) => {
    // TODO: Implement job completion with photo capture
    console.log('Complete job:', visitId)
  }

  const handleCancelJob = (visitId: string) => {
    // TODO: Implement job cancellation
    console.log('Cancel job:', visitId)
  }

  const getCompletedCount = () => {
    return todayVisits?.filter(visit => visit.status === 'completed').length || 0
  }

  const getPendingCount = () => {
    return todayVisits?.filter(visit => visit.status === 'pending').length || 0
  }

  const getInProgressCount = () => {
    return todayVisits?.filter(visit => visit.status === 'in_progress').length || 0
  }

  const isLoading = employeeIdLoading || todayLoading

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <Spinner3D size="md" />
        </div>
      </DashboardLayout>
    )
  }

  if (!employeeId) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Unable to load employee information</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
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
          <p className="text-lg text-gray-600">Your daily service assignments</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <MapPin className="h-4 w-4" />
            <span>
              {locationNameLoading ? 'Loading location...' : 
               locationName || 'Montreal, QC'}
            </span>
          </div>
        </div>
        
        {/* Current Location Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Location tracking active</span>
          </div>
        </div>
      </div>

      {/* Circular Calendar Banner */}
      <div className="mb-8">
        <CircularCalendarBanner className="w-full" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Today's Tasks</p>
              <p className="text-3xl font-bold text-gray-900">
                {todayVisits?.length || 0}
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
                {getCompletedCount()}
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
              <p className="text-sm font-medium text-gray-500 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {getInProgressCount()}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 group-hover:from-purple-100 group-hover:to-purple-200 transition-all">
              <Play className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {getPendingCount()}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 group-hover:from-orange-100 group-hover:to-orange-200 transition-all">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="card-title">Today's Service Visits</h3>
          <p className="card-description">Your assigned tasks for today</p>
        </div>
        <div className="card-content">
          {todayVisits && todayVisits.length > 0 ? (
            <div className="space-y-4">
              {todayVisits.map((visit: any) => (
                <div key={visit.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                        {visit.client_name || 'Client'}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{visit.address}</p>
                      <p className="text-xs text-gray-400 mt-1">Scheduled: {visit.scheduled_date ? new Date(visit.scheduled_date).toLocaleTimeString() : 'N/A'}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        visit.status === 'completed' ? 'text-green-600 bg-green-50' :
                        visit.status === 'in_progress' ? 'text-blue-600 bg-blue-50' :
                        visit.status === 'cancelled' ? 'text-red-600 bg-red-50' :
                        'text-gray-600 bg-gray-50'
                      }`}>
                        {visit.status}
                      </span>
                      <div className="flex space-x-2">
                        {visit.status === 'pending' && (
                          <button
                            onClick={() => handleStartRoute(visit.id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </button>
                        )}
                        {visit.status === 'in_progress' && (
                          <button
                            onClick={() => handleCompleteJob(visit.id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Complete
                          </button>
                        )}
                        {visit.status === 'pending' && (
                          <button
                            onClick={() => handleCancelJob(visit.id)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tasks assigned for today</p>
            </div>
          )}
        </div>
      </div>

      {/* Weather Widget */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="card-title">Weather Conditions</h3>
          <p className="card-description">Current weather for your area</p>
        </div>
        <div className="card-content">
          <WeatherWidget 
            lat={defaultLat} 
            lon={defaultLon} 
            showForecast={false}
            showAlerts={true}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
          <p className="card-description">Common tasks for your work</p>
        </div>
        <div className="card-content pt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button 
              onClick={() => navigate('/route-detail')}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
            >
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">View Route</h4>
                  <p className="text-sm text-gray-500">See your assigned route</p>
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
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Settings</h4>
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
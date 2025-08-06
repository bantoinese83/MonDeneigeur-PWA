import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { RealTimeMap } from '../../components/admin/real-time-map'
import { WeatherWidget } from '../../components/shared/weather-widget'
import { CircularCalendarBanner } from '../../components/shared/circular-calendar-banner'
import { Spinner3D } from '../../components/shared/3d-spinner'
import { useActiveEmployeesLocations } from '../../hooks/use-gps'
import { useRoutes } from '../../hooks/use-routes'
import { useServiceVisits } from '../../hooks/use-service-visits'
import { useReverseGeocoding } from '../../hooks/use-reverse-geocoding'
import { 
  Users, 
  MapPin, 
  CheckCircle, 
  Clock,
  ArrowRight,
  BarChart3,
  FileText
} from 'lucide-react'

export function AdminDashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tracking' | 'weather'>('overview')
  
  const { data: employeeLocations, isLoading: locationsLoading } = useActiveEmployeesLocations()
  const { data: routes, isLoading: routesLoading } = useRoutes(user?.companyId || '')
  const { data: serviceVisits, isLoading: visitsLoading } = useServiceVisits(user?.companyId || '')

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

  const getActiveEmployeesCount = () => {
    if (!employeeLocations) return 0
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    return employeeLocations.filter(location => 
      new Date(location.timestamp).getTime() > fiveMinutesAgo
    ).length
  }

  const getTodayVisitsCount = () => {
    if (!serviceVisits) return 0
    const today = new Date().toDateString()
    return serviceVisits.filter(visit => 
      visit.scheduled_date && new Date(visit.scheduled_date).toDateString() === today
    ).length
  }

  const getCompletedVisitsCount = () => {
    if (!serviceVisits) return 0
    const today = new Date().toDateString()
    return serviceVisits.filter(visit => 
      visit.scheduled_date && new Date(visit.scheduled_date).toDateString() === today && 
      visit.status === 'completed'
    ).length
  }

  const getPendingRoutesCount = () => {
    if (!routes) return 0
    return routes.filter(route => route.status === 'pending').length
  }

  const isLoading = locationsLoading || routesLoading || visitsLoading

  if (isLoading) {
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
          <p className="text-lg text-gray-600">Manage your snow removal operations</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
            <MapPin className="h-4 w-4" />
            <span>
              {locationNameLoading ? 'Loading location...' : 
               locationName || 'Montreal, QC'}
            </span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === 'overview' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('tracking')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === 'tracking' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Tracking
          </button>
          <button
            onClick={() => setSelectedTab('weather')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTab === 'weather' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Weather
          </button>
        </div>
      </div>

      {/* Circular Calendar Banner */}
      <div className="mb-8">
        <CircularCalendarBanner className="w-full" />
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Employees</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {getActiveEmployeesCount()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Today's Visits</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {getTodayVisitsCount()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-green-100 text-green-600 group-hover:from-green-100 group-hover:to-green-200 transition-all">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {getCompletedVisitsCount()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 group-hover:from-purple-100 group-hover:to-purple-200 transition-all">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Pending Routes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {getPendingRoutesCount()}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 group-hover:from-orange-100 group-hover:to-orange-200 transition-all">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mb-8">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
              <p className="card-description">Manage your operations efficiently</p>
            </div>
            <div className="card-content pt-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <button 
                  onClick={() => navigate('/routes')}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
                >
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Assign Routes</h4>
                      <p className="text-sm text-gray-500">Manage employee routes</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/employees')}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
                >
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Manage Employees</h4>
                      <p className="text-sm text-gray-500">View and manage team</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/clients')}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
                >
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Client Portal</h4>
                      <p className="text-sm text-gray-500">Manage client accounts</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                
                <button 
                  onClick={() => navigate('/audit')}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:shadow-primary-100"
                >
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">View Reports</h4>
                      <p className="text-sm text-gray-500">Analytics and insights</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
              <p className="card-description">Latest updates from your operations</p>
            </div>
            <div className="card-content">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Employee completed service visit</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New route assigned</p>
                    <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Weather alert issued</p>
                    <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tracking Tab */}
      {selectedTab === 'tracking' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Real-Time Employee Tracking</h3>
            <p className="card-description">Monitor employee locations and activity</p>
          </div>
          <div className="card-content">
            <RealTimeMap height="h-[600px]" />
          </div>
        </div>
      )}

      {/* Weather Tab */}
      {selectedTab === 'weather' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weather & Alerts</h3>
            <p className="card-description">Current conditions and weather alerts</p>
          </div>
          <div className="card-content">
            <WeatherWidget 
              lat={defaultLat} 
              lon={defaultLon} 
              showForecast={true}
              showAlerts={true}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  )
} 
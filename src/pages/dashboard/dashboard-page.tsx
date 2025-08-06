import React from 'react'
import { useTranslation } from 'react-i18next'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { useAuthStore } from '../../stores/auth-store'
import { useEmployees } from '../../hooks/use-employees'
import { useContracts } from '../../hooks/use-contracts'
import { useServiceVisits } from '../../hooks/use-service-visits'
import { WeatherWidget } from '../../components/shared/weather-widget'
import { CircularCalendarBanner } from '../../components/shared/circular-calendar-banner'
import { Spinner } from '../../components/shared/progress-indicator'
import { StatusBadge } from '../../components/shared/status-badge'
import { useReverseGeocoding } from '../../hooks/use-reverse-geocoding'
import { 
  Users, 
  FileText, 
  MapPin, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  
  // Data fetching hooks - using user's company ID or default
  const companyId = user?.companyId || 'default'
  const { data: employees, isLoading: employeesLoading } = useEmployees(companyId)
  const { data: contracts, isLoading: contractsLoading } = useContracts(companyId)
  const { data: serviceVisits, isLoading: visitsLoading } = useServiceVisits(companyId)
  
  // Get location name for Montreal coordinates
  const { name: locationName, isLoading: locationNameLoading } = useReverseGeocoding(45.5017, -73.5673)

  // Calculate dashboard stats
  const totalEmployees = employees?.length || 0
  const activeEmployees = employees?.filter(emp => emp.status === 'active').length || 0
  const totalContracts = contracts?.length || 0
  const activeContracts = contracts?.filter(contract => contract.status === 'active').length || 0
  const completedVisits = serviceVisits?.filter(visit => visit.status === 'completed').length || 0
  const pendingVisits = serviceVisits?.filter(visit => visit.status === 'pending').length || 0

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('dashboard.goodMorning')
    if (hour < 18) return t('dashboard.goodAfternoon')
    return t('dashboard.goodEvening')
  }

  const getTodayVisits = () => {
    if (!serviceVisits) return []
    const today = new Date().toDateString()
    return serviceVisits.filter(visit => 
      visit.scheduled_date && new Date(visit.scheduled_date).toDateString() === today
    ).slice(0, 3)
  }

  const getUpcomingVisits = () => {
    if (!serviceVisits) return []
    const today = new Date()
    return serviceVisits.filter(visit => 
      visit.scheduled_date && new Date(visit.scheduled_date) > today
    ).slice(0, 3)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getWelcomeMessage()}, {user?.fullName || user?.email}
          </h1>
          <p className="text-lg text-gray-600">{t('dashboard.subtitle')}</p>
        </div>
        
        {/* Quick Stats Summary */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>
              {locationNameLoading ? 'Loading location...' : 
               locationName || 'Montreal, QC'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{activeEmployees} active employees</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{pendingVisits} pending visits</span>
          </div>
        </div>
      </div>

      {/* Circular Calendar Banner */}
      <div className="mb-8">
        <CircularCalendarBanner className="w-full" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.totalEmployees')}</p>
              {employeesLoading ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.activeEmployees')}</p>
              {employeesLoading ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{activeEmployees}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-green-100 text-green-600 group-hover:from-green-100 group-hover:to-green-200 transition-all">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.totalContracts')}</p>
              {contractsLoading ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{totalContracts}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 group-hover:from-purple-100 group-hover:to-purple-200 transition-all">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.activeContracts')}</p>
              {contractsLoading ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{activeContracts}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-50 to-green-100 text-green-600 group-hover:from-green-100 group-hover:to-green-200 transition-all">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.completedVisits')}</p>
              {visitsLoading ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{completedVisits}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{t('dashboard.pendingVisits')}</p>
              {visitsLoading ? (
                <Spinner size="sm" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{pendingVisits}</p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 group-hover:from-orange-100 group-hover:to-orange-200 transition-all">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Weather and Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weather Widget */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('dashboard.weather')}</h3>
            <p className="card-description">Current weather conditions</p>
          </div>
          <div className="card-content">
            <WeatherWidget />
          </div>
        </div>

        {/* Calendar Widget */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('dashboard.calendar')}</h3>
            <p className="card-description">Your schedule and appointments</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {/* Today's Visits */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Today's Visits</h4>
                {getTodayVisits().length > 0 ? (
                  <div className="space-y-2">
                    {getTodayVisits().map((visit, index) => (
                      <div key={visit.id || index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {visit.client?.address || 'Service Visit'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {visit.scheduled_date ? formatDate(visit.scheduled_date) : 'No time set'}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={visit.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No visits scheduled for today</p>
                )}
              </div>

              {/* Upcoming Visits */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Upcoming</h4>
                {getUpcomingVisits().length > 0 ? (
                  <div className="space-y-2">
                    {getUpcomingVisits().map((visit, index) => (
                      <div key={visit.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {visit.client?.address || 'Service Visit'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {visit.scheduled_date ? formatDate(visit.scheduled_date) : 'No time set'}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={visit.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No upcoming visits</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('dashboard.recentActivity')}</h3>
          <p className="card-description">Latest updates from your operations</p>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {serviceVisits?.slice(0, 5).map((visit, index) => (
              <div key={visit.id || index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <StatusBadge status={visit.status} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {visit.client?.address || t('dashboard.noAddress')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {visit.scheduled_date ? formatDate(visit.scheduled_date) : t('dashboard.noDate')}
                  </p>
                </div>
                <div className="flex-shrink-0 text-sm text-gray-500">
                  {visit.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : visit.status === 'pending' ? (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
            {(!serviceVisits || serviceVisits.length === 0) && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('dashboard.noRecentActivity')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
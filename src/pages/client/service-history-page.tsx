import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Spinner3D } from '../../components/shared/3d-spinner'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Download
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentUserClient } from '../../hooks/use-clients'
import { useServiceVisitsByClient } from '../../hooks/use-service-visits'
import { formatDate, formatDateTime } from '../../lib/utils/date-utils'

export function ServiceHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { user } = useAuthStore()
  
  // Get current user's client record
  const { data: clientData, isLoading: clientLoading } = useCurrentUserClient()
  
  // Get service visits for the current client
  const { data: serviceVisits, isLoading: visitsLoading } = useServiceVisitsByClient(
    clientData?.id || ''
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in_progress': return <Clock className="h-5 w-5 text-blue-500" />
      case 'cancelled': return <AlertCircle className="h-5 w-5 text-red-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  // Transform service visits to display format
  const serviceHistory = serviceVisits?.map(visit => ({
    id: visit.id,
    date: visit.scheduled_date,
    service: visit.route?.route_name || 'Snow Removal Service',
    status: visit.status,
    location: visit.client?.address || 'Service Location',
    duration: visit.completed_at && visit.scheduled_date 
      ? `${Math.round((new Date(visit.completed_at).getTime() - new Date(visit.scheduled_date).getTime()) / (1000 * 60 * 60))} hours`
      : 'N/A',
    notes: visit.notes || 'Service completed',
    employee: visit.employee?.profile?.full_name || 'Service Team'
  })) || []

  const filteredHistory = selectedFilter === 'all' 
    ? serviceHistory 
    : serviceHistory.filter(service => service.status === selectedFilter)

  const isLoading = clientLoading || visitsLoading

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            to="/client/dashboard"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service History</h1>
            <p className="text-lg text-gray-600">View your past snow removal services</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Services</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button 
            onClick={() => alert('Export functionality coming soon!')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Service History List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Services</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="px-6 py-8 text-center">
              <Spinner3D size="md" />
              <p className="text-gray-600 mt-4">Loading service history...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((service) => (
              <div key={service.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(service.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">{service.service}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{service.location}</p>
                      <p className="text-sm text-gray-500">{service.notes}</p>
                      <p className="text-xs text-gray-400 mt-1">Service by: {service.employee}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{service.date ? formatDate(service.date) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No service history yet</h3>
              <p className="text-gray-500">You haven't had any snow removal services scheduled yet. Check back later for updates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{serviceHistory.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Services</p>
              <p className="text-2xl font-bold text-gray-900">
                {serviceHistory.filter(service => service.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {serviceHistory.filter(service => {
                  if (!service.date) return false
                  const serviceDate = new Date(service.date)
                  const now = new Date()
                  return serviceDate.getMonth() === now.getMonth() && 
                         serviceDate.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 
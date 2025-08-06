import { Play, Pause, CheckCircle, XCircle, MapPin, Camera, Clock } from 'lucide-react'

interface ServiceVisit {
  id: string
  status: string
  scheduled_date: string
  client: {
    profile?: {
      full_name: string
      email: string
    }
  }
  notes?: string
}

interface EmployeeTaskListProps {
  visits: ServiceVisit[]
  activeVisit: string | null
  onStartRoute: (visitId: string) => void
  onCompleteJob: (visitId: string) => void
  onCancelJob: (visitId: string) => void
}

export function EmployeeTaskList({ 
  visits, 
  activeVisit, 
  onStartRoute, 
  onCompleteJob, 
  onCancelJob 
}: EmployeeTaskListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'in_progress': return Play
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  if (!visits || visits.length === 0) {
    return (
      <div className="card">
        <div className="card-content text-center py-12">
          <div className="text-gray-400 mb-4">
            <Clock className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-gray-500 text-lg font-medium">No tasks scheduled for today</p>
          <p className="text-gray-400 text-sm mt-2">Check back later for new assignments</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
        <span className="text-sm text-gray-500">{visits.length} tasks</span>
      </div>
      
      <div className="space-y-4">
        {visits.map((visit) => {
          const StatusIcon = getStatusIcon(visit.status)
          return (
            <div key={visit.id} className="card">
              <div className="card-content">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {visit.client.profile?.full_name || 'Unknown Client'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {visit.client.profile?.email || 'No email'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(visit.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {visit.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {visit.status === 'pending' && (
                      <button
                        onClick={() => onStartRoute(visit.id)}
                        className="btn btn-primary btn-sm"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </button>
                    )}
                    {visit.status === 'in_progress' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onCompleteJob(visit.id)}
                          className="btn btn-sm"
                          style={{ backgroundColor: 'var(--color-success)', color: 'var(--color-success-foreground)' }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </button>
                        <button
                          onClick={() => onCancelJob(visit.id)}
                          className="btn btn-sm"
                          style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-error-foreground)' }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Task Details */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Camera className="h-4 w-4" />
                    <span>Photo</span>
                  </div>
                </div>
                
                {/* Notes */}
                {visit.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-accent">
                    <p className="text-sm text-gray-700">{visit.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 
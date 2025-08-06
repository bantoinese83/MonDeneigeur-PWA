import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useServiceVisit } from '../../hooks/use-service-visits'
import { useStartServiceVisit, useCompleteServiceVisit, useCancelServiceVisit } from '../../hooks/use-service-visits'
import { useLogLocation } from '../../hooks/use-gps'
import { useEmployeeId } from '../../hooks/use-employee-id'
import { useAuthStore } from '../../stores/auth-store'
import { Spinner3D } from '../../components/shared/3d-spinner'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Camera, 
  CheckCircle, 
  XCircle,
  Play,
  Navigation,
  FileText
} from 'lucide-react'

export function RouteDetailPage() {
  const { visitId } = useParams<{ visitId: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const { data: employeeId } = useEmployeeId()
  const { data: visit, isLoading } = useServiceVisit(visitId || '')
  const startVisit = useStartServiceVisit()
  const completeVisit = useCompleteServiceVisit()
  const cancelVisit = useCancelServiceVisit()
  const logLocation = useLogLocation()

  const handleStartRoute = async () => {
    if (!visitId || !employeeId) return
    
    try {
      await startVisit.mutateAsync(visitId)
      // Start location tracking
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            logLocation.mutate({
              employee_id: employeeId,
              visit_id: visitId,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
          },
          (error) => {
            console.error('Location tracking error:', error)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          }
        )
      }
    } catch (error) {
      console.error('Failed to start route:', error)
    }
  }

  const handleCompleteJob = async () => {
    if (!visitId) return
    
    try {
      await completeVisit.mutateAsync({
        id: visitId,
        photos: capturedPhotos,
        notes: notes.trim() || undefined
      })
      navigate('/employee/dashboard')
    } catch (error) {
      console.error('Failed to complete job:', error)
    }
  }

  const handleCancelJob = async () => {
    if (!visitId) return
    
    try {
      await cancelVisit.mutateAsync({
        id: visitId,
        notes: notes.trim() || undefined
      })
      navigate('/employee/dashboard')
    } catch (error) {
      console.error('Failed to cancel job:', error)
    }
  }

  const handleCapturePhoto = () => {
    setIsCapturing(true)
    
    // Check if camera is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera is not available on this device')
      setIsCapturing(false)
      return
    }

    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Create video element to capture frame
        const video = document.createElement('video')
        video.srcObject = stream
        video.play()

        // Capture frame after video loads
        video.onloadedmetadata = () => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          
          if (ctx) {
            ctx.drawImage(video, 0, 0)
            const photoUrl = canvas.toDataURL('image/jpeg')
            setCapturedPhotos(prev => [...prev, photoUrl])
          }
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop())
          setIsCapturing(false)
        }
      })
      .catch(error => {
        console.error('Camera access error:', error)
        alert('Unable to access camera. Please check permissions.')
        setIsCapturing(false)
      })
  }

  const handleOpenNavigation = () => {
    if (visit?.client.address) {
      const encodedAddress = encodeURIComponent(visit.client.address)
      window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <Spinner3D size="md" />
            <p className="text-gray-600 mt-4">Loading route details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!visit) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Route not found</p>
            <button
              onClick={() => navigate('/employee/dashboard')}
              className="btn btn-primary mt-4"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/employee/dashboard')}
              className="btn btn-outline btn-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Route Details</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">
        {/* Status Badge */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            visit.status === 'completed' ? 'bg-green-100 text-green-800' :
            visit.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            visit.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {visit.status === 'completed' ? 'Completed' :
             visit.status === 'in_progress' ? 'In Progress' :
             visit.status === 'cancelled' ? 'Cancelled' :
             'Pending'}
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
          </div>
          <div className="p-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {visit.client.profile?.full_name || 'Client Name'}
                </p>
                <p className="text-sm text-gray-600">
                  {visit.client.profile?.email || 'No email'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Address</p>
                <p className="text-sm text-gray-600">
                  {visit.client.address || 'No address provided'}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Scheduled</p>
                <p className="text-sm text-gray-600">
                  {visit.scheduled_date ? new Date(visit.scheduled_date).toLocaleDateString() : 'No date set'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Route Information</h3>
          </div>
          <div className="p-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Route Name</p>
                <p className="text-sm text-gray-600">
                  {visit.route.route_name || 'Unnamed Route'}
                </p>
              </div>
            </div>

            {visit.route.description && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Description</p>
                  <p className="text-sm text-gray-600">
                    {visit.route.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {visit.status === 'pending' && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4">
              <div className="flex space-x-3">
                <button
                  onClick={handleStartRoute}
                  disabled={startVisit.isPending}
                  className="btn btn-primary flex-1"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {startVisit.isPending ? 'Starting...' : 'Start Route'}
                </button>
                <button
                  onClick={handleOpenNavigation}
                  className="btn btn-outline"
                >
                  <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {visit.status === 'in_progress' && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4">
              <div className="space-y-4">
                {/* Photo Capture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Photos
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <button
                      onClick={handleCapturePhoto}
                      disabled={isCapturing}
                      className="btn btn-outline btn-sm"
                    >
                      <Camera className="h-4 w-4 mr-1" />
                      {isCapturing ? 'Capturing...' : 'Take Photo'}
                    </button>
                  </div>
                  {capturedPhotos.length > 0 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {capturedPhotos.map((photo, index) => (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about the work completed..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleCompleteJob}
                    disabled={completeVisit.isPending}
                    className="btn btn-primary flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {completeVisit.isPending ? 'Completing...' : 'Complete Job'}
                  </button>
                  <button
                    onClick={handleCancelJob}
                    disabled={cancelVisit.isPending}
                    className="btn btn-outline"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    {cancelVisit.isPending ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {visit.status === 'completed' && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-medium text-gray-900">Job Completed</p>
                <p className="text-sm text-gray-600">
                  Completed on {visit.completed_at ? new Date(visit.completed_at).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
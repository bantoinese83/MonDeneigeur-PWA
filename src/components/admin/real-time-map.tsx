import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { useActiveEmployeesLocations } from '../../hooks/use-gps'
import { useAuthStore } from '../../stores/auth-store'
import { MapPin, User, Clock, Navigation } from 'lucide-react'
import { Spinner3D } from '../shared/3d-spinner'

// Fix for default markers in Leaflet with React
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface EmployeeLocation {
  id: string
  latitude: number
  longitude: number
  timestamp: string
  employee: {
    id: string
    profile: {
      full_name: string
      email: string
    }
  }
}

interface RealTimeMapProps {
  className?: string
  height?: string
}

export function RealTimeMap({ className = '', height = 'h-96' }: RealTimeMapProps) {
  const { user } = useAuthStore()
  const mapRef = useRef<any>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  
  const { data: employeeLocations, isLoading } = useActiveEmployeesLocations()

  // Default center (Montreal coordinates)
  const defaultCenter: LatLngExpression = [45.5017, -73.5673]

  useEffect(() => {
    if (mapRef.current && employeeLocations?.length) {
      const bounds = mapRef.current.getBounds()
      employeeLocations.forEach((location: EmployeeLocation) => {
        bounds.extend([location.latitude, location.longitude])
      })
      mapRef.current.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [employeeLocations])

  const getEmployeeIcon = (isActive: boolean) => {
    return new Icon({
      iconUrl: isActive 
        ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiMyMkM1NUYiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0iIzRBRDVGMyIvPgo8L3N2Zz4K'
        : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0iI0E1QTVBNSIvPgo8L3N2Zz4K',
      iconSize: [25, 25],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    })
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (isLoading) {
    return (
      <div className={`${className} ${height} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <Spinner3D size="md" />
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} ${height} bg-white rounded-lg shadow-sm overflow-hidden`}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Real-Time Employee Locations</h3>
        <p className="text-sm text-gray-600">
          {employeeLocations?.length || 0} active employees
        </p>
      </div>
      
      <div className="relative h-full">
        <MapContainer
          center={defaultCenter}
          zoom={10}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {employeeLocations?.map((location: EmployeeLocation) => {
            const isActive = new Date(location.timestamp).getTime() > Date.now() - 5 * 60 * 1000 // Active if within 5 minutes
            const isSelected = selectedEmployee === location.employee.id
            
            return (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={getEmployeeIcon(isActive)}
                eventHandlers={{
                  click: () => setSelectedEmployee(isSelected ? null : location.employee.id)
                }}
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">
                        {location.employee.profile.full_name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {getTimeAgo(location.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
          <div className="text-sm font-medium text-gray-900 mb-2">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Active (5min)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-xs text-gray-600">Inactive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
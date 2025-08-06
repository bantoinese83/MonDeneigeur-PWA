import { useState } from 'react'
import { RefreshCw, Info, MapPin, AlertCircle } from 'lucide-react'
import { useWeatherForLocation } from '../../../hooks/use-weather'
import { useGeolocation } from '../../../hooks/use-geolocation'
import { useReverseGeocoding } from '../../../hooks/use-reverse-geocoding'
import { WeatherCurrent } from './weather-current'
import { WeatherForecast } from './weather-forecast'
import { WeatherAlerts } from './weather-alerts'

interface WeatherWidgetProps {
  lat?: number
  lon?: number
  className?: string
  showForecast?: boolean
  showAlerts?: boolean
  refreshable?: boolean
  onRefresh?: () => void
  useUserLocation?: boolean
}

export function WeatherWidget({ 
  lat, 
  lon, 
  className = '', 
  showForecast = true, 
  showAlerts = true,
  refreshable = false,
  onRefresh,
  useUserLocation = true
}: WeatherWidgetProps) {
  const [showDetails, setShowDetails] = useState(false)
  
  // Get user location
  const { 
    latitude: userLat, 
    longitude: userLon, 
    error: locationError, 
    isLoading: locationLoading,
    requestLocation 
  } = useGeolocation()

  // Use user location if available, otherwise fall back to provided coordinates
  const finalLat = useUserLocation && userLat ? userLat : lat
  const finalLon = useUserLocation && userLon ? userLon : lon
  
  // Get location name from coordinates
  const { name: locationName, isLoading: locationNameLoading, error: locationNameError } = useReverseGeocoding(finalLat, finalLon)
  
  const { 
    currentWeather, 
    forecast, 
    alerts, 
    error, 
    shouldAdjustService, 
    serviceAdjustment
  } = useWeatherForLocation(finalLat || 45.5017, finalLon || -73.5673)

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      // Refetch is not available in the hook, so we'll just reload the page
      window.location.reload()
    }
  }

  const handleLocationRefresh = () => {
    requestLocation()
  }

  if (locationLoading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (locationError && useUserLocation) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle className="h-5 w-5" />
          <div>
            <div className="text-sm font-medium">Location Error</div>
            <div className="text-xs text-red-500">{locationError}</div>
          </div>
        </div>
        <button
          onClick={handleLocationRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center gap-2 text-red-600">
          <Info className="h-5 w-5" />
          <span className="text-sm">Failed to load weather data</span>
        </div>
      </div>
    )
  }

  if (!currentWeather) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Info className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Weather data unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">Weather</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
              <MapPin className="h-3 w-3" />
              <span>
                {locationNameLoading ? 'Loading location...' : 
                 locationNameError ? 'Location unavailable' :
                 locationName || 'Montreal, QC'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {refreshable && (
              <button
                onClick={handleRefresh}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh weather data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title={showDetails ? 'Hide details' : 'Show details'}
            >
              <Info className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <WeatherCurrent weather={currentWeather} />
        </div>
        
        {showDetails && (
          <div className="mt-6 space-y-6 pt-6 border-t border-gray-200">
            {showForecast && forecast && (
              <WeatherForecast forecast={forecast} />
            )}
            
            {showAlerts && alerts && alerts.length > 0 && (
              <WeatherAlerts alerts={alerts} />
            )}
            
            {shouldAdjustService && serviceAdjustment && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900">
                  Service Adjustment Recommended
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {typeof serviceAdjustment === 'string' ? serviceAdjustment : serviceAdjustment.reason}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 
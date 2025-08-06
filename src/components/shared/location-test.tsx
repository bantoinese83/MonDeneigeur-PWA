import React from 'react'
import { useGeolocation } from '../../hooks/use-geolocation'
import { LocationErrorBanner } from './location-error-banner'
import { MapPin, RefreshCw, AlertTriangle } from 'lucide-react'

export function LocationTest() {
  const {
    latitude,
    longitude,
    accuracy,
    error,
    isLoading,
    source,
    requestLocation,
    clearError
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
    enableIpFallback: true
  })

  const [isRequesting, setIsRequesting] = React.useState(false)
  const [requestTimeout, setRequestTimeout] = React.useState<NodeJS.Timeout | null>(null)

  const handleGetLocation = () => {
    console.log('User clicked get location button')
    setIsRequesting(true)
    clearError()
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Location request timeout')
      setIsRequesting(false)
    }, 15000) // 15 second timeout
    
    setRequestTimeout(timeout)
    
    requestLocation()
  }

  // Clear timeout when location is found or error occurs
  React.useEffect(() => {
    if ((latitude && longitude) || error) {
      if (requestTimeout) {
        clearTimeout(requestTimeout)
        setRequestTimeout(null)
      }
      setIsRequesting(false)
    }
  }, [latitude, longitude, error, requestTimeout])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (requestTimeout) {
        clearTimeout(requestTimeout)
      }
    }
  }, [requestTimeout])

  const isActuallyLoading = isLoading || isRequesting

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Location Test</h2>
      
      {/* Location Request Button */}
      <button
        onClick={handleGetLocation}
        disabled={isActuallyLoading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isActuallyLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        {isActuallyLoading ? 'Getting Location...' : 'Get My Location'}
      </button>

      {/* Loading State with Details */}
      {isActuallyLoading && !error && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Requesting location...</p>
              <p className="text-xs text-blue-600 mt-1">
                This may take a few seconds. If it takes too long, we'll try alternative methods.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <LocationErrorBanner
          error={error}
          source={source}
          onRetry={handleGetLocation}
          onClear={clearError}
        />
      )}

      {/* Location Display */}
      {latitude && longitude && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-medium text-green-800 mb-2">Location Found</h3>
          <div className="space-y-1 text-sm text-green-700">
            <p><strong>Source:</strong> {source}</p>
            <p><strong>Latitude:</strong> {latitude.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {longitude.toFixed(6)}</p>
            {accuracy && (
              <p><strong>Accuracy:</strong> {accuracy.toFixed(1)} meters</p>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note:</strong> Location requests must be triggered by user interaction to comply with browser security policies.</p>
        <p>Click the button above to request your location.</p>
        <p className="mt-2 text-xs text-gray-500">
          If the request seems stuck, try refreshing the page and clicking again.
        </p>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Loading: {isActuallyLoading ? 'true' : 'false'}</p>
            <p>Has Coordinates: {(latitude && longitude) ? 'true' : 'false'}</p>
            <p>Error: {error || 'none'}</p>
            <p>Source: {source || 'none'}</p>
          </div>
        </div>
      )}
    </div>
  )
} 
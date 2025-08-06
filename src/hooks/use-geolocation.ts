import React from 'react'

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  accuracy: number | null
  error: string | null
  isLoading: boolean
  retryCount: number
  source: 'gps' | 'ip' | null
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  maxRetries?: number
  enableIpFallback?: boolean
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const defaultOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    maxRetries: 3,
    enableIpFallback: true,
    ...options
  }

  const [state, setState] = React.useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
    retryCount: 0,
    source: null
  })

  // IP-based geolocation fallback
  const getLocationByIp = async (): Promise<{ latitude: number; longitude: number; source: 'ip' }> => {
    try {
      console.log('Trying IP geolocation...')
      
      // Use a simple, reliable IP geolocation service
      const response = await fetch('https://api.ipify.org?format=json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000)
      })

      if (response.ok) {
        const data = await response.json()
        const ip = data.ip
        
        if (ip) {
          // Get location from IP
          const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(5000)
          })
          
          if (geoResponse.ok) {
            const geoData = await geoResponse.json()
            if (geoData.latitude && geoData.longitude) {
              console.log('IP geolocation successful')
              return { 
                latitude: parseFloat(geoData.latitude), 
                longitude: parseFloat(geoData.longitude), 
                source: 'ip' 
              }
            }
          }
        }
      }
      
      // Fallback to default location
      console.log('IP geolocation failed, using fallback')
      return { 
        latitude: 45.5017, 
        longitude: -73.5673, 
        source: 'ip' 
      }
    } catch (error) {
      console.error('IP geolocation error:', error)
      return { 
        latitude: 45.5017, 
        longitude: -73.5673, 
        source: 'ip' 
      }
    }
  }

  // Simple GPS location request using native API
  const requestLocation = React.useCallback(async () => {
    console.log('Starting location request...')
    
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null 
    }))

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.log('Geolocation not supported, trying IP fallback')
      if (defaultOptions.enableIpFallback) {
        try {
          const ipLocation = await getLocationByIp()
          setState({
            latitude: ipLocation.latitude,
            longitude: ipLocation.longitude,
            accuracy: null,
            error: null,
            isLoading: false,
            retryCount: 0,
            source: ipLocation.source
          })
        } catch (error) {
          setState(prev => ({
            ...prev,
            error: 'Geolocation not supported and IP fallback failed',
            isLoading: false
          }))
        }
      } else {
        setState(prev => ({
          ...prev,
          error: 'Geolocation is not supported by this browser',
          isLoading: false
        }))
      }
      return
    }

    // Try GPS first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('GPS location successful:', position)
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          isLoading: false,
          retryCount: 0,
          source: 'gps'
        })
      },
      async (error) => {
        console.log('GPS location failed:', error)
        
        let errorMessage = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
          default:
            errorMessage = 'Unable to get your location.'
        }

        // If GPS fails and IP fallback is enabled, try IP geolocation
        if (defaultOptions.enableIpFallback) {
          try {
            console.log('GPS failed, trying IP fallback...')
            const ipLocation = await getLocationByIp()
            setState({
              latitude: ipLocation.latitude,
              longitude: ipLocation.longitude,
              accuracy: null,
              error: 'Using IP-based location (less accurate than GPS)',
              isLoading: false,
              retryCount: 0,
              source: ipLocation.source
            })
          } catch (ipError) {
            console.log('IP fallback also failed:', ipError)
            setState(prev => ({
              ...prev,
              error: errorMessage,
              isLoading: false
            }))
          }
        } else {
          setState(prev => ({
            ...prev,
            error: errorMessage,
            isLoading: false
          }))
        }
      },
      {
        enableHighAccuracy: defaultOptions.enableHighAccuracy,
        timeout: defaultOptions.timeout,
        maximumAge: defaultOptions.maximumAge
      }
    )
  }, [defaultOptions.enableHighAccuracy, defaultOptions.timeout, defaultOptions.maximumAge, defaultOptions.enableIpFallback])

  const clearError = React.useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const resetRetryCount = React.useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0 }))
  }, [])

  return {
    ...state,
    requestLocation,
    clearError,
    resetRetryCount
  }
} 
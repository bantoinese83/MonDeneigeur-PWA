import { useState, useEffect } from 'react'

interface LocationData {
  name: string | null
  isLoading: boolean
  error: string | null
}

export function useReverseGeocoding(lat: number | null, lon: number | null) {
  const [locationData, setLocationData] = useState<LocationData>({
    name: null,
    isLoading: false,
    error: null
  })

  useEffect(() => {
    if (!lat || !lon) {
      setLocationData({ name: null, isLoading: false, error: null })
      return
    }

    const getLocationName = async () => {
      setLocationData(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        console.log('🔍 Fetching location name for coordinates:', lat, lon)
        
        // Use OpenStreetMap Nominatim API for reverse geocoding (free, no API key required)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'MondeNeigeur-PWA/1.0'
            }
          }
        )

        if (!response.ok) {
          throw new Error(`Geocoding API error: ${response.status}`)
        }

        const data = await response.json()
        console.log('📍 Reverse geocoding response:', data)
        
        // Extract location name from the response
        let locationName = null
        
        if (data.address) {
          // Try to get the most specific location name
          locationName = data.address.city || 
                        data.address.town || 
                        data.address.village || 
                        data.address.suburb || 
                        data.address.county || 
                        data.address.state || 
                        data.address.country
        }

        // Fallback to display name if no specific address component
        if (!locationName && data.display_name) {
          const parts = data.display_name.split(', ')
          locationName = parts[0] // Use the first part (most specific)
        }

        console.log('🏷️  Extracted location name:', locationName)

        setLocationData({
          name: locationName,
          isLoading: false,
          error: null
        })
      } catch (error) {
        console.error('❌ Reverse geocoding error:', error)
        setLocationData({
          name: null,
          isLoading: false,
          error: 'Failed to get location name'
        })
      }
    }

    getLocationName()
  }, [lat, lon])

  return locationData
} 
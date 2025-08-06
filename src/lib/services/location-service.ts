import { BaseService } from './base-service'

export interface LocationResult {
  latitude: number
  longitude: number
  accuracy?: number | null
  source: 'gps' | 'ip' | 'mapbox' | 'google'
  city?: string
  country?: string
  timestamp: string
}

export interface LocationError {
  code: string
  message: string
  source: string
  timestamp: string
}

export class LocationService extends BaseService {
  private mapboxAccessToken?: string
  private googleApiKey?: string

  constructor() {
    super()
    // You can set these from environment variables
    this.mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
    this.googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }

  /**
   * Get location using multiple fallback methods
   */
  async getLocation(): Promise<LocationResult> {
    const methods = [
      () => this.getLocationByGPS(),
      () => this.getLocationByIP(),
      () => this.getLocationByMapbox(),
      () => this.getLocationByGoogle()
    ]

    for (const method of methods) {
      try {
        const result = await method()
        if (result) {
          return result
        }
      } catch (error) {
        console.warn(`Location method failed:`, error)
        continue
      }
    }

    throw new Error('All location methods failed')
  }

  /**
   * Get location using GPS (native browser API)
   */
  private async getLocationByGPS(): Promise<LocationResult | null> {
    if (!navigator.geolocation) {
      return null
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            source: 'gps',
            timestamp: new Date().toISOString()
          })
        },
        (error) => {
          reject(new Error(`GPS error: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  /**
   * Get location using IP-based geolocation
   */
  private async getLocationByIP(): Promise<LocationResult | null> {
    const services = [
      'https://ipinfo.io/json',
      'https://ipapi.co/json',
      'https://api.ipgeolocation.io/ipgeo?apiKey=free'
    ]

    for (const service of services) {
      try {
        const response = await fetch(service, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          
          let lat: number, lng: number
          
          if (data.loc) {
            // ipinfo.io format: "lat,lng"
            const [latStr, lngStr] = data.loc.split(',')
            lat = parseFloat(latStr)
            lng = parseFloat(lngStr)
          } else if (data.latitude && data.longitude) {
            // ipapi.co format
            lat = parseFloat(data.latitude)
            lng = parseFloat(data.longitude)
          } else {
            continue
          }

          if (!isNaN(lat) && !isNaN(lng)) {
            return {
              latitude: lat,
              longitude: lng,
              accuracy: null,
              source: 'ip',
              city: data.city,
              country: data.country,
              timestamp: new Date().toISOString()
            }
          }
        }
      } catch (error) {
        console.warn(`IP geolocation service failed: ${service}`, error)
        continue
      }
    }

    return null
  }

  /**
   * Get location using Mapbox Geocoding API
   */
  private async getLocationByMapbox(): Promise<LocationResult | null> {
    if (!this.mapboxAccessToken) {
      return null
    }

    try {
      // First get IP-based location as a starting point
      const ipLocation = await this.getLocationByIP()
      if (!ipLocation) {
        return null
      }

      // Use Mapbox to get more accurate location
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${ipLocation.longitude},${ipLocation.latitude}.json?access_token=${this.mapboxAccessToken}&types=place`
      )

      if (response.ok) {
        const data = await response.json()
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center
          return {
            latitude: lat,
            longitude: lng,
            accuracy: null,
            source: 'mapbox',
            city: data.features[0].text,
            country: data.features[0].context?.find((c: any) => c.id.startsWith('country'))?.text,
            timestamp: new Date().toISOString()
          }
        }
      }
    } catch (error) {
      console.warn('Mapbox geolocation failed:', error)
    }

    return null
  }

  /**
   * Get location using Google Maps Geocoding API
   */
  private async getLocationByGoogle(): Promise<LocationResult | null> {
    if (!this.googleApiKey) {
      return null
    }

    try {
      // First get IP-based location as a starting point
      const ipLocation = await this.getLocationByIP()
      if (!ipLocation) {
        return null
      }

      // Use Google to get more accurate location
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ipLocation.latitude},${ipLocation.longitude}&key=${this.googleApiKey}`
      )

      if (response.ok) {
        const data = await response.json()
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location
          const addressComponents = data.results[0].address_components
          
          const city = addressComponents.find((c: any) => 
            c.types.includes('locality')
          )?.long_name
          
          const country = addressComponents.find((c: any) => 
            c.types.includes('country')
          )?.long_name

          return {
            latitude: location.lat,
            longitude: location.lng,
            accuracy: null,
            source: 'google',
            city,
            country,
            timestamp: new Date().toISOString()
          }
        }
      }
    } catch (error) {
      console.warn('Google geolocation failed:', error)
    }

    return null
  }

  /**
   * Log location to database
   */
  async logLocation(location: LocationResult, employeeId: string): Promise<void> {
    try {
      await this.client
        .from('gps_logs')
        .insert({
          employee_id: employeeId,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: location.timestamp,
          source: location.source
        })
    } catch (error) {
      console.error('Failed to log location:', error)
    }
  }

  /**
   * Get location accuracy level
   */
  static getAccuracyLevel(accuracy: number | null, source: string): 'high' | 'medium' | 'low' | 'unknown' {
    if (source === 'ip') return 'low'
    if (source === 'mapbox' || source === 'google') return 'medium'
    if (!accuracy) return 'unknown'
    if (accuracy <= 10) return 'high'
    if (accuracy <= 50) return 'medium'
    return 'low'
  }

  /**
   * Format location error
   */
  static formatLocationError(error: Error, source: string): LocationError {
    return {
      code: 'LOCATION_ERROR',
      message: error.message,
      source,
      timestamp: new Date().toISOString()
    }
  }
}

export const locationService = new LocationService() 
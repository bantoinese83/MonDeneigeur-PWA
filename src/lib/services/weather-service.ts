import { BaseService } from './base-service'

export interface WeatherData {
  temperature: number
  feels_like: number
  condition: string
  description: string
  humidity: number
  wind_speed: number
  visibility: number
  precipitation: number
  forecast: WeatherForecast[]
}

export interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: string
  precipitation: number
}

export interface WeatherAlert {
  type: 'snow' | 'ice' | 'storm' | 'freeze'
  severity: 'low' | 'medium' | 'high'
  message: string
  startTime: string
  endTime: string
}

export class WeatherService extends BaseService {
  private readonly apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5'

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    if (!this.apiKey) {
      console.warn('OpenWeather API key is not configured, using fallback data')
      return this.getFallbackWeatherData(lat, lon)
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      )
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      return {
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        visibility: data.visibility,
        precipitation: data.rain?.['1h'] || 0,
        forecast: []
      }
    } catch (error) {
      console.error('Weather API error:', error)
      console.warn('Using fallback weather data due to API error')
      return this.getFallbackWeatherData(lat, lon)
    }
  }

  private getFallbackWeatherData(lat: number, lon: number): WeatherData {
    // Get current month to determine season
    const month = new Date().getMonth() + 1
    const isWinter = month >= 11 || month <= 3
    
    if (isWinter) {
      return {
        temperature: -8,
        feels_like: -12,
        condition: 'Snow',
        description: 'Light snow',
        humidity: 85,
        wind_speed: 12,
        visibility: 6,
        precipitation: 3,
        forecast: []
      }
    } else {
      // For non-winter months, show moderate temperatures
      return {
        temperature: 8,
        feels_like: 6,
        condition: 'Clouds',
        description: 'Partly cloudy',
        humidity: 70,
        wind_speed: 8,
        visibility: 9,
        precipitation: 0,
        forecast: []
      }
    }
  }

  async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
    if (!this.apiKey) {
      throw new Error('OpenWeather API key is not configured')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      )
      
      if (!response.ok) {
        throw new Error(`Forecast API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Group by day and get daily forecast
      const dailyForecasts = data.list.reduce((acc: any[], item: any) => {
        const date = new Date(item.dt * 1000).toDateString()
        const existing = acc.find(f => new Date(f.date).toDateString() === date)
        
        if (existing) {
          existing.high = Math.max(existing.high, item.main.temp_max)
          existing.low = Math.min(existing.low, item.main.temp_min)
        } else {
          acc.push({
            date: new Date(item.dt * 1000).toISOString().split('T')[0],
            high: item.main.temp_max,
            low: item.main.temp_min,
            condition: item.weather[0].main,
            precipitation: item.rain?.['3h'] || 0
          })
        }
        
        return acc
      }, [])
      
      return dailyForecasts.slice(0, 5) // Return 5-day forecast
    } catch (error) {
      console.error('Forecast API error:', error)
      throw new Error('Failed to fetch weather forecast data')
    }
  }

  async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    if (!this.apiKey) {
      throw new Error('OpenWeather API key is not configured')
    }

    try {
      // Use the free weather endpoint instead of the paid OneCall API
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
      )
      
      if (!response.ok) {
        console.warn('Weather alerts API not available with free tier')
        return []
      }
      
      const data = await response.json()
      
      // Since the free weather endpoint doesn't provide alerts,
      // we'll return an empty array for now
      // In a production app, you might want to use a different weather service
      // or upgrade to OpenWeather's paid plan for alerts
      return []
    } catch (error) {
      console.warn('Weather alerts API error:', error)
      return []
    }
  }

  private mapAlertType(event: string): WeatherAlert['type'] {
    if (event.includes('Snow')) return 'snow'
    if (event.includes('Ice')) return 'ice'
    if (event.includes('Storm')) return 'storm'
    return 'freeze'
  }

  private mapSeverity(severity: string): WeatherAlert['severity'] {
    switch (severity.toLowerCase()) {
      case 'extreme': return 'high'
      case 'severe': return 'high'
      case 'moderate': return 'medium'
      default: return 'low'
    }
  }

  shouldAdjustService(weatherData: WeatherData): boolean {
    return weatherData.temperature < -10 || 
           weatherData.precipitation > 10 || 
           weatherData.wind_speed > 30
  }

  getServiceAdjustment(weatherData: WeatherData): string {
    if (weatherData.temperature < -15) {
      return 'Extreme cold - Consider postponing non-essential services'
    }
    if (weatherData.precipitation > 15) {
      return 'Heavy precipitation - Expect delays and reduced efficiency'
    }
    if (weatherData.wind_speed > 25) {
      return 'High winds - Safety concerns, consider postponing'
    }
    return 'Normal conditions - Proceed with standard operations'
  }
}

export const weatherService = new WeatherService() 
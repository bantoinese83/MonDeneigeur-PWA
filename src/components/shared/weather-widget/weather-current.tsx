import { Thermometer, Droplets, Wind, Eye } from 'lucide-react'
import { WeatherIcon } from './weather-icon'

interface CurrentWeather {
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  visibility: number
  condition: string
  description: string
}

interface WeatherCurrentProps {
  weather: CurrentWeather
  className?: string
}

export function WeatherCurrent({ weather, className = '' }: WeatherCurrentProps) {
  // Ensure feels_like is a valid number, fallback to temperature if NaN or undefined
  const feelsLike = typeof weather.feels_like === 'number' && !isNaN(weather.feels_like) 
    ? weather.feels_like 
    : weather.temperature

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0">
            <WeatherIcon condition={weather.condition} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(weather.temperature)}°C
            </div>
            <div className="text-sm text-gray-500 capitalize truncate">
              {weather.description}
            </div>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0">
          <div className="text-sm text-gray-500">Feels like</div>
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(feelsLike)}°C
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {weather.humidity}%
            </div>
            <div className="text-xs text-gray-500">Humidity</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {weather.wind_speed} km/h
            </div>
            <div className="text-xs text-gray-500">Wind</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {weather.visibility} km
            </div>
            <div className="text-xs text-gray-500">Visibility</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-red-500 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {Math.round(weather.temperature)}°C
            </div>
            <div className="text-xs text-gray-500">Temperature</div>
          </div>
        </div>
      </div>
    </div>
  )
} 
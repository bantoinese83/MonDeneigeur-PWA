import { Calendar, Clock } from 'lucide-react'
import { WeatherIcon } from './weather-icon'

interface WeatherForecast {
  date: string
  time: string
  temperature: number
  condition: string
  description: string
}

interface WeatherForecastProps {
  forecast: WeatherForecast[]
  className?: string
}

export function WeatherForecast({ forecast, className = '' }: WeatherForecastProps) {
  if (!forecast || forecast.length === 0) return null

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
        <Calendar className="h-4 w-4" />
        <span>5-Day Forecast</span>
      </div>
      
      <div className="space-y-2">
        {forecast.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <WeatherIcon condition={item.condition} size="sm" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {item.time}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {Math.round(item.temperature)}°C
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
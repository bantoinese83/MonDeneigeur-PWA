import { useState, useRef, useEffect } from 'react'
import { useGeolocation } from '../../hooks/use-geolocation'
import { useWeatherForLocation } from '../../hooks/use-weather'
import { WeatherIcon } from './weather-widget/weather-icon'

export function CircularCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined)
  
  const {
    latitude,
    longitude
  } = useGeolocation()

  const {
    currentWeather,
    isLoading: weatherLoading
  } = useWeatherForLocation(latitude || 45.5017, longitude || -73.5673)

  useEffect(() => {
    // Update time every minute
    intervalRef.current = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left side - Time and Date */}
        <div className="flex items-center gap-6">
          {/* Time */}
          <div className="text-center">
            <div className="text-sm opacity-80 mb-1">Current Time</div>
            <div className="text-2xl font-bold">{formatTime(currentDate)}</div>
          </div>
          
          {/* Date */}
          <div className="text-center">
            <div className="text-sm opacity-80 mb-1">Today</div>
            <div className="text-lg font-semibold">{formatDate(currentDate)}</div>
          </div>
        </div>
        
        {/* Center - Weather Icon */}
        <div className="flex items-center justify-center">
          {!weatherLoading && currentWeather ? (
            <div className="text-center">
              <WeatherIcon 
                condition={currentWeather.condition} 
                size="lg" 
                className="text-white"
              />
              <div className="text-sm mt-2 opacity-90">Weather</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/60 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-sm mt-2 opacity-90">Loading...</div>
            </div>
          )}
        </div>
        
        {/* Right side - Temperature and Day breakdown */}
        <div className="flex items-center gap-6">
          {/* Temperature */}
          {!weatherLoading && currentWeather && (
            <div className="text-center">
              <div className="text-sm opacity-80 mb-1">Weather</div>
              <div className="text-2xl font-bold">{Math.round(currentWeather.temperature)}°C</div>
            </div>
          )}
          
          {/* Day breakdown */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-sm opacity-80">Day</div>
              <div className="text-lg font-semibold text-green-300">{currentDate.getDate()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Month</div>
              <div className="text-lg font-semibold text-blue-300">{currentDate.toLocaleDateString('en-US', { month: 'short' })}</div>
            </div>
            <div className="text-center">
              <div className="text-sm opacity-80">Year</div>
              <div className="text-lg font-semibold text-purple-300">{currentDate.getFullYear()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
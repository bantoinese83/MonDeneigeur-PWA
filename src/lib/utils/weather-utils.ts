export type WeatherIconType = 'hot' | 'cloudy' | 'stormy' | 'breezy' | 'night'

// Helper function to map weather conditions to icon types
export function getWeatherIconType(condition: string, isNight = false): WeatherIconType {
  const conditionLower = condition.toLowerCase()
  
  // Night conditions
  if (isNight) {
    return 'night'
  }
  
  // Clear sky conditions
  if (conditionLower === 'clear') {
    return 'hot'
  }
  
  // Partly cloudy conditions
  if (conditionLower === 'few clouds' || conditionLower === 'scattered clouds') {
    return 'cloudy'
  }
  
  // Cloudy conditions
  if (conditionLower === 'broken clouds' || conditionLower === 'overcast clouds' || conditionLower === 'clouds') {
    return 'cloudy'
  }
  
  // Rain conditions
  if (conditionLower === 'thunderstorm') {
    return 'stormy'
  }
  
  if (conditionLower === 'rain' || conditionLower === 'drizzle' || conditionLower === 'shower rain') {
    return 'breezy'
  }
  
  // Snow conditions
  if (conditionLower === 'snow' || conditionLower === 'sleet') {
    return 'stormy'
  }
  
  // Mist/fog conditions
  if (conditionLower === 'mist' || conditionLower === 'fog' || conditionLower === 'haze' || conditionLower === 'smoke' || conditionLower === 'dust' || conditionLower === 'sand' || conditionLower === 'ash' || conditionLower === 'squall' || conditionLower === 'tornado') {
    return 'cloudy'
  }
  
  // Default to sunny for unknown conditions
  return 'hot'
} 
import { AnimatedWeatherIcon } from '../animated-weather-icon'
import { getWeatherIconType } from '../../../lib/utils/weather-utils'

interface WeatherIconProps {
  condition: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function WeatherIcon({ condition, size = 'md', className = '' }: WeatherIconProps) {
  const iconType = getWeatherIconType(condition)
  
  return (
    <AnimatedWeatherIcon 
      type={iconType}
      size={size}
      className={className}
    />
  )
} 
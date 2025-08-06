import { useQuery } from '@tanstack/react-query'
import { weatherService } from '../lib/services/weather-service'




export const useCurrentWeather = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['weather', 'current', lat, lon],
    queryFn: () => weatherService.getCurrentWeather(lat, lon),
    enabled: !!lat && !!lon,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  })
}

export const useWeatherForecast = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['weather', 'forecast', lat, lon],
    queryFn: () => weatherService.getWeatherForecast(lat, lon),
    enabled: !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  })
}

export const useWeatherAlerts = (lat: number, lon: number) => {
  return useQuery({
    queryKey: ['weather', 'alerts', lat, lon],
    queryFn: () => weatherService.getWeatherAlerts(lat, lon),
    enabled: !!lat && !!lon,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 1, // Only retry once to avoid spam
    retryDelay: 5000, // Wait 5 seconds before retry
  })
}

export const useWeatherForLocation = (lat: number, lon: number) => {
  const currentWeather = useCurrentWeather(lat, lon)
  const forecast = useWeatherForecast(lat, lon)
  const alerts = useWeatherAlerts(lat, lon)

  return {
    currentWeather: currentWeather.data,
    forecast: forecast.data,
    alerts: alerts.data,
    isLoading: currentWeather.isLoading || forecast.isLoading || alerts.isLoading,
    error: currentWeather.error || forecast.error || alerts.error,
    shouldAdjustService: currentWeather.data ? weatherService.shouldAdjustService(currentWeather.data) : false,
    serviceAdjustment: currentWeather.data ? weatherService.getServiceAdjustment(currentWeather.data) : null
  }
} 
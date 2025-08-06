import { AlertTriangle, CloudSnow, CloudRain, Thermometer } from 'lucide-react'

interface WeatherAlert {
  id: string
  type: string
  severity: string
  title: string
  description: string
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[]
  className?: string
}

export function WeatherAlerts({ alerts, className = '' }: WeatherAlertsProps) {
  if (!alerts || alerts.length === 0) return null

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'snow':
        return <CloudSnow className="h-4 w-4 text-blue-500" />
      case 'ice':
        return <Thermometer className="h-4 w-4 text-blue-500" />
      case 'storm':
        return <CloudRain className="h-4 w-4 text-red-500" />
      case 'freeze':
        return <Thermometer className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-900">Weather Alerts</h4>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
        >
          {getAlertIcon(alert.type)}
          <div className="flex-1">
            <h5 className="text-sm font-medium">{alert.title}</h5>
            <p className="text-xs mt-1">{alert.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 
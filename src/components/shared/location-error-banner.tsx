import { AlertTriangle, MapPin, Wifi, RefreshCw, Globe, Info } from 'lucide-react'

interface LocationErrorBannerProps {
  error: string | null
  source?: 'gps' | 'ip' | null
  onRetry?: () => void
  onClear?: () => void
}

export function LocationErrorBanner({ error, source, onRetry, onClear }: LocationErrorBannerProps) {
  if (!error) return null

  const isCoreLocationError = error.includes('kCLErrorLocationUnknown') || 
                             error.includes('GPS signal') ||
                             error.includes('Location unavailable')

  const isIpLocation = source === 'ip'
  const isFallbackLocation = error.includes('fallback location') || error.includes('default location')

  const getErrorIcon = () => {
    if (isFallbackLocation) return <Info className="h-5 w-5" />
    if (isIpLocation) return <Globe className="h-5 w-5" />
    if (isCoreLocationError) return <MapPin className="h-5 w-5" />
    return <AlertTriangle className="h-5 w-5" />
  }

  const getErrorColor = () => {
    if (isFallbackLocation) return 'bg-blue-50 border-blue-200 text-blue-800'
    if (isIpLocation) return 'bg-blue-50 border-blue-200 text-blue-800'
    if (isCoreLocationError) return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-red-50 border-red-200 text-red-800'
  }

  const getSuggestions = () => {
    if (isFallbackLocation) {
      return [
        'Using approximate location based on your region',
        'Enable GPS for more precise location tracking',
        'Move to an open area for better GPS signal'
      ]
    }
    
    if (isIpLocation) {
      return [
        'Location determined from your IP address (less accurate)',
        'Enable GPS for more precise location tracking',
        'Move to an open area for better GPS signal'
      ]
    }
    
    if (isCoreLocationError) {
      return [
        'Move to an open area with clear sky view',
        'Check if GPS is enabled on your device',
        'Wait a few moments for GPS signal to improve',
        'Try refreshing the location'
      ]
    }
    
    if (error.includes('permission')) {
      return [
        'Enable location permissions in your browser',
        'Check your device location settings',
        'Refresh the page and try again'
      ]
    }

    return [
      'Check your internet connection',
      'Try refreshing the page',
      'Contact support if the issue persists'
    ]
  }

  const getTitle = () => {
    if (isFallbackLocation) return 'Location (Approximate)'
    if (isIpLocation) return 'Location (IP-based)'
    return 'Location Error'
  }

  const getMessage = () => {
    if (isFallbackLocation) {
      return 'Using approximate location. GPS location is preferred for accurate tracking.'
    }
    return error
  }

  return (
    <div className={`border rounded-lg p-4 mb-4 ${getErrorColor()}`}>
      <div className="flex items-start gap-3">
        {getErrorIcon()}
        <div className="flex-1">
          <h3 className="font-medium mb-2">{getTitle()}</h3>
          <p className="text-sm mb-3">{getMessage()}</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Suggestions:</h4>
            <ul className="text-sm space-y-1">
              {getSuggestions().map((suggestion, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-current rounded-full" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 mt-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}
            {onClear && (
              <button
                onClick={onClear}
                className="px-3 py-1.5 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
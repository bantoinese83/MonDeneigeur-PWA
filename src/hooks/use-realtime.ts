import { useEffect, useRef, useState, useCallback } from 'react'
import { useAuthStore } from '../stores/auth-store'
import { realtimeService, type RealtimeLocationUpdate } from '../lib/services/realtime-service'
import { useQueryClient } from '@tanstack/react-query'

interface UseRealtimeOptions {
  enableLocationUpdates?: boolean
  enableEmployeeStatus?: boolean
  enableServiceVisits?: boolean
  onLocationUpdate?: (update: RealtimeLocationUpdate) => void
  onEmployeeStatusChange?: (employeeId: string, isActive: boolean) => void
  onError?: (error: Error) => void
}

export function useRealtime(options: UseRealtimeOptions = {}) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [isConnected, setIsConnected] = useState(false)
  const [lastLocationUpdate, setLastLocationUpdate] = useState<RealtimeLocationUpdate | null>(null)
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([])
  const isInitialized = useRef(false)

  const {
    enableLocationUpdates = true,
    enableEmployeeStatus = true,
    enableServiceVisits = false,
    onLocationUpdate,
    onEmployeeStatusChange,
    onError
  } = options

  // Initialize real-time service with callbacks
  const initializeRealtime = useCallback(() => {
    if (isInitialized.current) return

    realtimeService.callbacks = {
      onLocationUpdate: (update) => {
        setLastLocationUpdate(update)
        onLocationUpdate?.(update)
        
        // Invalidate related queries to trigger refetch
        queryClient.invalidateQueries({ queryKey: ['gps-logs', 'active-employees'] })
        queryClient.invalidateQueries({ queryKey: ['gps-logs', 'current', update.employee_id] })
      },
      onEmployeeStatusChange: (employeeId, isActive) => {
        onEmployeeStatusChange?.(employeeId, isActive)
        
        // Invalidate employee-related queries
        queryClient.invalidateQueries({ queryKey: ['employees'] })
        queryClient.invalidateQueries({ queryKey: ['gps-logs', 'active-employees'] })
      },
      onError: (error) => {
        console.error('Real-time error:', error)
        onError?.(error)
      }
    }

    isInitialized.current = true
  }, [onLocationUpdate, onEmployeeStatusChange, onError, queryClient])

  // Subscribe to real-time updates
  const subscribe = useCallback(() => {
    if (!user?.companyId) return

    try {
      if (enableLocationUpdates) {
        realtimeService.subscribeToLocationUpdates(user.companyId)
      }
      
      if (enableEmployeeStatus) {
        realtimeService.subscribeToEmployeeStatus(user.companyId)
      }
      
      if (enableServiceVisits) {
        realtimeService.subscribeToServiceVisits(user.companyId)
      }

      setActiveSubscriptions(realtimeService.getActiveSubscriptions())
      setIsConnected(true)
    } catch (error) {
      console.error('Failed to subscribe to real-time updates:', error)
      setIsConnected(false)
    }
  }, [user?.companyId, enableLocationUpdates, enableEmployeeStatus, enableServiceVisits])

  // Unsubscribe from real-time updates
  const unsubscribe = useCallback(() => {
    realtimeService.unsubscribeAll()
    setActiveSubscriptions([])
    setIsConnected(false)
  }, [])

  // Subscribe to specific subscription
  const subscribeTo = useCallback((subscriptionKey: string) => {
    if (!user?.companyId) return

    try {
      switch (subscriptionKey) {
        case 'gps-logs':
          realtimeService.subscribeToLocationUpdates(user.companyId)
          break
        case 'employee-status':
          realtimeService.subscribeToEmployeeStatus(user.companyId)
          break
        case 'service-visits':
          realtimeService.subscribeToServiceVisits(user.companyId)
          break
        default:
          console.warn(`Unknown subscription key: ${subscriptionKey}`)
      }

      setActiveSubscriptions(realtimeService.getActiveSubscriptions())
    } catch (error) {
      console.error(`Failed to subscribe to ${subscriptionKey}:`, error)
    }
  }, [user?.companyId])

  // Unsubscribe from specific subscription
  const unsubscribeFrom = useCallback((subscriptionKey: string) => {
    realtimeService.unsubscribe(subscriptionKey)
    setActiveSubscriptions(realtimeService.getActiveSubscriptions())
  }, [])

  // Initialize and subscribe on mount
  useEffect(() => {
    if (!user?.companyId) return

    initializeRealtime()
    subscribe()

    return () => {
      unsubscribe()
    }
  }, [user?.companyId, initializeRealtime, subscribe, unsubscribe])

  // Re-subscribe when user changes
  useEffect(() => {
    if (user?.companyId && isInitialized.current) {
      unsubscribe()
      subscribe()
    }
  }, [user?.companyId, subscribe, unsubscribe])

  return {
    isConnected,
    lastLocationUpdate,
    activeSubscriptions,
    subscribe,
    unsubscribe,
    subscribeTo,
    unsubscribeFrom,
    getSubscriptionStatus: realtimeService.getSubscriptionStatus.bind(realtimeService)
  }
}

// Hook for real-time location updates only
export function useRealtimeLocations() {
  const { lastLocationUpdate, isConnected, activeSubscriptions } = useRealtime({
    enableLocationUpdates: true,
    enableEmployeeStatus: false,
    enableServiceVisits: false
  })

  return {
    lastLocationUpdate,
    isConnected,
    hasLocationSubscription: activeSubscriptions.includes('gps-logs')
  }
}

// Hook for real-time employee status only
export function useRealtimeEmployeeStatus() {
  const { isConnected, activeSubscriptions } = useRealtime({
    enableLocationUpdates: false,
    enableEmployeeStatus: true,
    enableServiceVisits: false
  })

  return {
    isConnected,
    hasEmployeeStatusSubscription: activeSubscriptions.includes('employee-status')
  }
} 
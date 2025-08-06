import { supabase } from '../supabase'
import type { GpsLog } from '../database.types'

export interface RealtimeLocationUpdate {
  id: string
  employee_id: string
  latitude: number
  longitude: number
  accuracy: number | null
  timestamp: string
  employee?: {
    id: string
    profile: {
      full_name: string
      email: string
    }
  }
}

export interface RealtimeServiceCallbacks {
  onLocationUpdate?: (update: RealtimeLocationUpdate) => void
  onEmployeeStatusChange?: (employeeId: string, isActive: boolean) => void
  onError?: (error: Error) => void
}

export class RealtimeService {
  private subscriptions: Map<string, any> = new Map()
  private callbacks: RealtimeServiceCallbacks = {}

  constructor(callbacks: RealtimeServiceCallbacks = {}) {
    this.callbacks = callbacks
  }

  // Subscribe to GPS logs for real-time location updates
  subscribeToLocationUpdates(companyId?: string) {
    const subscriptionKey = 'gps-logs'
    
    if (this.subscriptions.has(subscriptionKey)) {
      return // Already subscribed
    }

    const channel = supabase.channel('gps-logs-realtime')
    
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gps_logs'
        },
        (payload) => {
          this.handleLocationUpdate(payload.new as GpsLog)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'gps_logs'
        },
        (payload) => {
          this.handleLocationUpdate(payload.new as GpsLog)
        }
      )

    // If company ID is provided, filter by company employees
    if (companyId) {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees',
          filter: `company_id=eq.${companyId}`
        },
        (payload) => {
          this.handleEmployeeStatusChange(payload)
        }
      )
    }

    const subscription = channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Real-time GPS subscription active')
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Real-time GPS subscription error')
        this.callbacks.onError?.(new Error('Real-time subscription failed'))
      }
    })

    this.subscriptions.set(subscriptionKey, subscription)
  }

  // Subscribe to employee status changes
  subscribeToEmployeeStatus(companyId?: string) {
    const subscriptionKey = 'employee-status'
    
    if (this.subscriptions.has(subscriptionKey)) {
      return
    }

    const channel = supabase.channel('employee-status-realtime')
    
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'employees'
      },
      (payload) => {
        this.handleEmployeeStatusChange(payload)
      }
    )

    if (companyId) {
      channel.filter(`company_id=eq.${companyId}`)
    }

    const subscription = channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Real-time employee status subscription active')
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Real-time employee status subscription error')
        this.callbacks.onError?.(new Error('Employee status subscription failed'))
      }
    })

    this.subscriptions.set(subscriptionKey, subscription)
  }

  // Subscribe to service visit updates
  subscribeToServiceVisits(companyId?: string) {
    const subscriptionKey = 'service-visits'
    
    if (this.subscriptions.has(subscriptionKey)) {
      return
    }

    const channel = supabase.channel('service-visits-realtime')
    
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'service_visits'
      },
      (payload) => {
        this.handleServiceVisitUpdate(payload)
      }
    )

    if (companyId) {
      channel.filter(`company_id=eq.${companyId}`)
    }

    const subscription = channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Real-time service visits subscription active')
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Real-time service visits subscription error')
        this.callbacks.onError?.(new Error('Service visits subscription failed'))
      }
    })

    this.subscriptions.set(subscriptionKey, subscription)
  }

  private async handleLocationUpdate(gpsLog: GpsLog) {
    try {
      // Fetch employee details for the location update
      const { data: employee } = await supabase
        .from('employees')
        .select(`
          id,
          profile:profiles(
            full_name,
            email
          )
        `)
        .eq('id', gpsLog.employee_id)
        .single()

      const locationUpdate: RealtimeLocationUpdate = {
        id: gpsLog.id,
        employee_id: gpsLog.employee_id,
        latitude: gpsLog.latitude || 0,
        longitude: gpsLog.longitude || 0,
        accuracy: gpsLog.accuracy,
        timestamp: gpsLog.timestamp,
        employee: employee || undefined
      }

      this.callbacks.onLocationUpdate?.(locationUpdate)
    } catch (error) {
      console.error('Error handling location update:', error)
      this.callbacks.onError?.(error as Error)
    }
  }

  private handleEmployeeStatusChange(payload: any) {
    const employeeId = payload.new?.id
    const isActive = payload.new?.status === 'active'
    
    if (employeeId) {
      this.callbacks.onEmployeeStatusChange?.(employeeId, isActive)
    }
  }

  private handleServiceVisitUpdate(payload: any) {
    // Handle service visit updates (status changes, completions, etc.)
    console.log('Service visit update:', payload)
  }

  // Unsubscribe from all real-time subscriptions
  unsubscribeAll() {
    this.subscriptions.forEach((subscription, key) => {
      try {
        supabase.removeChannel(subscription)
        console.log(`Unsubscribed from ${key}`)
      } catch (error) {
        console.error(`Error unsubscribing from ${key}:`, error)
      }
    })
    this.subscriptions.clear()
  }

  // Unsubscribe from specific subscription
  unsubscribe(key: string) {
    const subscription = this.subscriptions.get(key)
    if (subscription) {
      try {
        supabase.removeChannel(subscription)
        this.subscriptions.delete(key)
        console.log(`Unsubscribed from ${key}`)
      } catch (error) {
        console.error(`Error unsubscribing from ${key}:`, error)
      }
    }
  }

  // Get active subscription status
  getSubscriptionStatus(key: string): boolean {
    return this.subscriptions.has(key)
  }

  // Get all active subscription keys
  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys())
  }
}

export const realtimeService = new RealtimeService() 
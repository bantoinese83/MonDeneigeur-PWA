import { BaseService } from './base-service'
import type { Database } from '../types'

type Notification = Database['public']['Tables']['notifications']['Row']
type ClientPreference = Database['public']['Tables']['client_preferences']['Row']
type ServiceVisit = Database['public']['Tables']['service_visits']['Row']
type Contract = Database['public']['Tables']['contracts']['Row']

interface CreateNotificationData {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  action_url?: string
  metadata?: Record<string, any>
}

interface ClientPreferenceData {
  email_notifications?: boolean
  push_notifications?: boolean
  sms_notifications?: boolean
  notification_types?: Record<string, boolean>
}

export class ClientPortalService extends BaseService {
  async getClientId(): Promise<string> {
    const profile = await this.getCurrentProfile()
    
    const { data: client, error } = await this.client
      .from('clients')
      .select('id')
      .eq('profile_id', profile.id)
      .maybeSingle()

    if (error) {
      throw new Error('Error fetching client profile')
    }

    if (!client) {
      throw new Error('Client profile not found')
    }

    return client.id
  }

  async getServiceStatus(): Promise<{
    nextVisit: ServiceVisit | null
    recentVisits: ServiceVisit[]
    activeContracts: Contract[]
    totalServices: number
    completedServices: number
  }> {
    const clientId = await this.getClientId()

    // Get next scheduled visit
    const { data: nextVisit } = await this.client
      .from('service_visits')
      .select(`
        *,
        employee:employees(
          profile:profiles(full_name, email)
        ),
        route:routes(route_name, description)
      `)
      .eq('client_id', clientId)
      .eq('status', 'pending')
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .limit(1)
      .maybeSingle()

    // Get recent visits (last 10)
    const { data: recentVisits } = await this.client
      .from('service_visits')
      .select(`
        *,
        employee:employees(
          profile:profiles(full_name, email)
        ),
        route:routes(route_name, description)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(10)

    // Get active contracts
    const { data: activeContracts } = await this.client
      .from('contracts')
      .select('*')
      .eq('client_id', clientId)
      .eq('status', 'active')

    // Get service statistics
    const { data: serviceStats } = await this.client
      .from('service_visits')
      .select('status')
      .eq('client_id', clientId)

    const totalServices = serviceStats?.length || 0
    const completedServices = serviceStats?.filter(s => s.status === 'completed').length || 0

    return {
      nextVisit: nextVisit || null,
      recentVisits: recentVisits || [],
      activeContracts: activeContracts || [],
      totalServices,
      completedServices
    }
  }

  async getNotifications(limit = 20): Promise<Notification[]> {
    const profile = await this.getCurrentProfile()

    const { data: notifications, error } = await this.client
      .from('notifications')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error('Failed to fetch notifications')
    }

    return notifications || []
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await this.client
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) {
      throw new Error('Failed to mark notification as read')
    }
  }

  async markAllNotificationsAsRead(): Promise<void> {
    const profile = await this.getCurrentProfile()

    const { error } = await this.client
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', profile.id)
      .eq('is_read', false)

    if (error) {
      throw new Error('Failed to mark notifications as read')
    }
  }

  async getUnreadNotificationCount(): Promise<number> {
    const profile = await this.getCurrentProfile()

    const { count, error } = await this.client
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('is_read', false)

    if (error) {
      throw new Error('Failed to get notification count')
    }

    return count || 0
  }

  async getClientPreferences(): Promise<ClientPreference | null> {
    const clientId = await this.getClientId()

    const { data: preferences, error } = await this.client
      .from('client_preferences')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle()

    if (error) {
      throw new Error('Failed to fetch client preferences')
    }

    return preferences
  }

  async updateClientPreferences(preferences: ClientPreferenceData): Promise<ClientPreference> {
    const clientId = await this.getClientId()

    const { data: existingPreferences } = await this.client
      .from('client_preferences')
      .select('*')
      .eq('client_id', clientId)
      .maybeSingle()

    if (existingPreferences) {
      // Update existing preferences
      const { data: updatedPreferences, error } = await this.client
        .from('client_preferences')
        .update({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .eq('client_id', clientId)
        .select()
        .single()

      if (error) {
        throw new Error('Failed to update client preferences')
      }

      return updatedPreferences
    } else {
      // Create new preferences
      const { data: newPreferences, error } = await this.client
        .from('client_preferences')
        .insert({
          client_id: clientId,
          ...preferences
        })
        .select()
        .single()

      if (error) {
        throw new Error('Failed to create client preferences')
      }

      return newPreferences
    }
  }

  async createNotification(data: CreateNotificationData): Promise<Notification> {
    const profile = await this.getCurrentProfile()

    const { data: notification, error } = await this.client
      .from('notifications')
      .insert({
        user_id: profile.id,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        action_url: data.action_url,
        metadata: data.metadata
      })
      .select()
      .single()

    if (error) {
      throw new Error('Failed to create notification')
    }

    return notification
  }
} 
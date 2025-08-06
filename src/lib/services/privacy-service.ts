import { supabase } from '../supabase'
import { BaseService } from './base-service'

export interface PrivacyConsent {
  id: string
  user_id: string
  consent_type: 'data_collection' | 'location_tracking' | 'communications' | 'analytics'
  granted: boolean
  granted_at: string | null
  revoked_at: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  updated_at: string
}

export interface DataAccessRequest {
  id: string
  user_id: string
  request_type: 'access' | 'correction' | 'deletion' | 'portability'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  description: string
  requested_data?: string[]
  completed_at: string | null
  response_data?: any
  created_at: string
  updated_at: string
}

export interface PrivacySettings {
  data_collection: boolean
  location_tracking: boolean
  communications: boolean
  analytics: boolean
  marketing_emails: boolean
  push_notifications: boolean
  sms_notifications: boolean
}

export class PrivacyService extends BaseService {
  // Get user's privacy consents
  async getUserConsents(userId: string): Promise<PrivacyConsent[]> {
    try {
      const { data, error } = await this.client
        .from('privacy_consents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) this.handleError(error)
      return data || []
    } catch (error) {
      console.error('Privacy get user consents error:', error)
      return []
    }
  }

  // Grant consent for a specific type
  async grantConsent(
    userId: string, 
    consentType: PrivacyConsent['consent_type'],
    ipAddress?: string,
    userAgent?: string
  ): Promise<PrivacyConsent> {
    try {
      const { data, error } = await this.client
        .from('privacy_consents')
        .upsert({
          user_id: userId,
          consent_type: consentType,
          granted: true,
          granted_at: new Date().toISOString(),
          revoked_at: null,
          ip_address: ipAddress || null,
          user_agent: userAgent || null
        })
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    } catch (error) {
      console.error('Privacy grant consent error:', error)
      throw new Error('Failed to grant consent')
    }
  }

  // Revoke consent for a specific type
  async revokeConsent(
    userId: string, 
    consentType: PrivacyConsent['consent_type']
  ): Promise<PrivacyConsent> {
    try {
      const { data, error } = await this.client
        .from('privacy_consents')
        .update({
          granted: false,
          revoked_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('consent_type', consentType)
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    } catch (error) {
      console.error('Privacy revoke consent error:', error)
      throw new Error('Failed to revoke consent')
    }
  }

  // Check if user has granted consent for a specific type
  async hasConsent(
    userId: string, 
    consentType: PrivacyConsent['consent_type']
  ): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from('privacy_consents')
        .select('granted')
        .eq('user_id', userId)
        .eq('consent_type', consentType)
        .eq('granted', true)
        .is('revoked_at', null)
        .single()

      if (error && error.code !== 'PGRST116') this.handleError(error)
      return !!data?.granted
    } catch (error) {
      console.error('Privacy check consent error:', error)
      return false
    }
  }

  // Create a data access request
  async createDataAccessRequest(
    userId: string,
    requestType: DataAccessRequest['request_type'],
    description: string,
    requestedData?: string[]
  ): Promise<DataAccessRequest> {
    try {
      const { data, error } = await this.client
        .from('data_access_requests')
        .insert({
          user_id: userId,
          request_type: requestType,
          status: 'pending',
          description,
          requested_data: requestedData || null
        })
        .select()
        .single()

      if (error) this.handleError(error)
      return data
    } catch (error) {
      console.error('Privacy create data access request error:', error)
      throw new Error('Failed to create data access request')
    }
  }

  // Get user's data access requests
  async getUserDataAccessRequests(userId: string): Promise<DataAccessRequest[]> {
    try {
      const { data, error } = await this.client
        .from('data_access_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) this.handleError(error)
      return data || []
    } catch (error) {
      console.error('Privacy get data access requests error:', error)
      return []
    }
  }

  // Export user data (for data portability)
  async exportUserData(userId: string): Promise<any> {
    try {
      // Get user profile
      const { data: profile } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      // Get user's consents
      const consents = await this.getUserConsents(userId)

      // Get user's data access requests
      const dataRequests = await this.getUserDataAccessRequests(userId)

      // Get GPS logs (if location consent is granted)
      let gpsLogs = []
      if (await this.hasConsent(userId, 'location_tracking')) {
        const { data: logs } = await this.client
          .from('gps_logs')
          .select('*')
          .eq('employee_id', userId)
          .order('timestamp', { ascending: false })
          .limit(1000) // Limit for export

        gpsLogs = logs || []
      }

      // Get service visits
      const { data: serviceVisits } = await this.client
        .from('service_visits')
        .select('*')
        .eq('employee_id', userId)
        .order('created_at', { ascending: false })

      return {
        profile,
        consents,
        data_access_requests: dataRequests,
        gps_logs: gpsLogs,
        service_visits: serviceVisits || [],
        export_date: new Date().toISOString(),
        export_format: 'json'
      }
    } catch (error) {
      console.error('Privacy export user data error:', error)
      throw new Error('Failed to export user data')
    }
  }

  // Delete user data (right to be forgotten)
  async deleteUserData(userId: string): Promise<void> {
    try {
      // Start a transaction to delete all user data
      const { error } = await this.client.rpc('delete_user_data', {
        user_id: userId
      })

      if (error) this.handleError(error)
    } catch (error) {
      console.error('Privacy delete user data error:', error)
      throw new Error('Failed to delete user data')
    }
  }

  // Get privacy settings for a user
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const consents = await this.getUserConsents(userId)
      
      const settings: PrivacySettings = {
        data_collection: await this.hasConsent(userId, 'data_collection'),
        location_tracking: await this.hasConsent(userId, 'location_tracking'),
        communications: await this.hasConsent(userId, 'communications'),
        analytics: await this.hasConsent(userId, 'analytics'),
        marketing_emails: false, // Default to false for marketing
        push_notifications: false, // Default to false for push
        sms_notifications: false // Default to false for SMS
      }

      return settings
    } catch (error) {
      console.error('Privacy get settings error:', error)
      // Return default settings on error
      return {
        data_collection: false,
        location_tracking: false,
        communications: false,
        analytics: false,
        marketing_emails: false,
        push_notifications: false,
        sms_notifications: false
      }
    }
  }

  // Update privacy settings
  async updatePrivacySettings(
    userId: string, 
    settings: Partial<PrivacySettings>
  ): Promise<void> {
    try {
      const consentTypes = [
        'data_collection',
        'location_tracking', 
        'communications',
        'analytics'
      ] as const

      for (const consentType of consentTypes) {
        if (settings[consentType] !== undefined) {
          if (settings[consentType]) {
            await this.grantConsent(userId, consentType)
          } else {
            await this.revokeConsent(userId, consentType)
          }
        }
      }
    } catch (error) {
      console.error('Privacy update settings error:', error)
      throw new Error('Failed to update privacy settings')
    }
  }

  // Check if location tracking is allowed
  async isLocationTrackingAllowed(userId: string): Promise<boolean> {
    return this.hasConsent(userId, 'location_tracking')
  }

  // Check if data collection is allowed
  async isDataCollectionAllowed(userId: string): Promise<boolean> {
    return this.hasConsent(userId, 'data_collection')
  }

  // Check if communications are allowed
  async isCommunicationsAllowed(userId: string): Promise<boolean> {
    return this.hasConsent(userId, 'communications')
  }

  // Check if analytics are allowed
  async isAnalyticsAllowed(userId: string): Promise<boolean> {
    return this.hasConsent(userId, 'analytics')
  }
}

export const privacyService = new PrivacyService() 
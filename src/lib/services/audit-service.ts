import { BaseService } from './base-service'
import type { AuditLog, Profile } from '../database.types'

export interface AuditLogWithUser extends AuditLog {
  profiles: Profile | null
}

export interface AuditFilters {
  action?: string
  table_name?: string
  user_id?: string
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}

export class AuditService extends BaseService {
  async getAuditLogs(filters: AuditFilters = {}): Promise<AuditLogWithUser[]> {
    try {
      const profile = await this.getCurrentProfile()
      
      if (profile.role !== 'superadmin' && profile.role !== 'admin') {
        throw new Error('Unauthorized: Only admins and superadmins can view audit logs')
      }

      console.log('Fetching audit logs with filters:', filters)

      // Build the base query
      let query = this.client
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.action) {
        query = query.eq('action', filters.action)
      }
      if (filters.table_name) {
        query = query.eq('table_name', filters.table_name)
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id)
      }
      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date)
      }
      if (filters.end_date) {
        query = query.lte('created_at', filters.end_date)
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1)
      }

      const { data: auditLogs, error } = await query

      if (error) {
        console.error('Audit service error:', error)
        this.handleError(error)
      }

      console.log('Audit logs fetched:', auditLogs?.length || 0)

      if (!auditLogs || auditLogs.length === 0) {
        return []
      }

      // Get unique user IDs from audit logs
      const userIds = [...new Set(auditLogs.map(log => log.user_id).filter(Boolean))]

      // Fetch profiles separately to avoid complex joins
      let profiles: Profile[] = []
      if (userIds.length > 0) {
        console.log('Fetching profiles for user IDs:', userIds)
        const { data: profilesData, error: profilesError } = await this.client
          .from('profiles')
          .select('*')
          .in('id', userIds)

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError)
        } else {
          profiles = profilesData || []
          console.log('Profiles fetched:', profiles.length)
        }
      }

      // Create a map for quick lookup
      const profilesMap = new Map(profiles.map(p => [p.id, p]))

      // Combine audit logs with profiles
      const auditLogsWithProfiles = auditLogs.map(log => ({
        ...log,
        profiles: log.user_id ? profilesMap.get(log.user_id) || null : null
      }))

      // For admins, filter results by company_id after fetching
      if (profile.role === 'admin') {
        const filteredLogs = auditLogsWithProfiles.filter(log => 
          !log.profiles || log.profiles.company_id === profile.company_id
        )
        console.log('Filtered logs for admin:', filteredLogs.length)
        return filteredLogs
      }
      
      return auditLogsWithProfiles
    } catch (error) {
      console.error('Audit service getAuditLogs error:', error)
      throw error
    }
  }

  async getAuditLogById(id: string): Promise<AuditLogWithUser> {
    try {
      const profile = await this.getCurrentProfile()
      
      if (profile.role !== 'superadmin' && profile.role !== 'admin') {
        throw new Error('Unauthorized: Only admins and superadmins can view audit logs')
      }

      const { data: auditLog, error } = await this.client
        .from('audit_logs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) this.handleError(error)
      if (!auditLog) throw new Error('Audit log not found')

      // Fetch profile separately
      let profileData: Profile | null = null
      if (auditLog.user_id) {
        const { data: profileResult, error: profileError } = await this.client
          .from('profiles')
          .select('*')
          .eq('id', auditLog.user_id)
          .maybeSingle()

        if (!profileError) {
          profileData = profileResult
        }
      }

      const result: AuditLogWithUser = {
        ...auditLog,
        profiles: profileData
      }

      // For admins, check if the log is from their company
      if (profile.role === 'admin' && result.profiles && result.profiles.company_id !== profile.company_id) {
        throw new Error('Unauthorized: Insufficient permissions')
      }

      return result
    } catch (error) {
      console.error('Audit service getAuditLogById error:', error)
      throw error
    }
  }

  async getAuditStats(): Promise<{
    totalActions: number
    activeUsers: number
    todayActions: number
    weekActions: number
  }> {
    try {
      const profile = await this.getCurrentProfile()
      
      if (profile.role !== 'superadmin' && profile.role !== 'admin') {
        throw new Error('Unauthorized: Only admins and superadmins can view audit stats')
      }

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

      // Use simple queries for stats
      const [totalResult, todayResult, weekResult] = await Promise.all([
        this.client.from('audit_logs').select('*', { count: 'exact' }),
        this.client.from('audit_logs').select('*', { count: 'exact' }).gte('created_at', today),
        this.client.from('audit_logs').select('*', { count: 'exact' }).gte('created_at', weekAgo)
      ])

      // Get unique users count
      const { data: uniqueUsers, error: usersError } = await this.client
        .from('audit_logs')
        .select('user_id')
        .not('user_id', 'is', null)

      if (usersError) this.handleError(usersError)

      const uniqueUserIds = [...new Set(uniqueUsers?.map(log => log.user_id) || [])]
      const activeUsers = uniqueUserIds.length

      return {
        totalActions: totalResult.count || 0,
        activeUsers,
        todayActions: todayResult.count || 0,
        weekActions: weekResult.count || 0
      }
    } catch (error) {
      console.error('Audit service getAuditStats error:', error)
      throw error
    }
  }
}

export const auditService = new AuditService() 
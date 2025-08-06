import { supabase } from '../supabase'
import { BaseService } from './base-service'
import type { GpsLog } from '../database.types'

export interface CreateGpsLogData {
  employee_id: string
  visit_id?: string
  latitude: number
  longitude: number
  accuracy?: number
  battery_level?: number
  tracking_mode?: 'active' | 'passive'
  speed?: number
}

export interface LocationError {
  code: string
  message: string
  timestamp: string
}

export class GpsService extends BaseService {
  async logLocation(data: CreateGpsLogData): Promise<GpsLog> {
    try {
      const { data: log, error } = await this.client
        .from('gps_logs')
        .insert({
          ...data,
          timestamp: new Date().toISOString()
        })
        .select()
        .single()

      if (error) this.handleError(error)
      return log
    } catch (error) {
      console.error('GPS log location error:', error)
      throw new Error('Failed to log location data')
    }
  }

  async logLocationError(employeeId: string, error: LocationError): Promise<void> {
    try {
      // Log location errors for debugging
      console.warn('Location error for employee:', employeeId, error)
      
      // You could also store location errors in a separate table for monitoring
      // await this.client.from('location_errors').insert({
      //   employee_id: employeeId,
      //   error_code: error.code,
      //   error_message: error.message,
      //   timestamp: error.timestamp
      // })
    } catch (logError) {
      console.error('Failed to log location error:', logError)
    }
  }

  async getEmployeeLocationHistory(
    employeeId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<GpsLog[]> {
    try {
      let query = this.client
        .from('gps_logs')
        .select('*')
        .eq('employee_id', employeeId)
        .order('timestamp', { ascending: false })

      if (startDate) {
        query = query.gte('timestamp', startDate)
      }
      if (endDate) {
        query = query.lte('timestamp', endDate)
      }

      const { data, error } = await query

      if (error) this.handleError(error)
      return data || []
    } catch (error) {
      console.error('GPS get location history error:', error)
      return []
    }
  }

  async getVisitLocationHistory(visitId: string): Promise<GpsLog[]> {
    try {
      const { data, error } = await this.client
        .from('gps_logs')
        .select('*')
        .eq('visit_id', visitId)
        .order('timestamp', { ascending: true })

      if (error) this.handleError(error)
      return data || []
    } catch (error) {
      console.error('GPS get visit location history error:', error)
      return []
    }
  }

  async getCurrentEmployeeLocation(employeeId: string): Promise<GpsLog | null> {
    try {
      const { data, error } = await this.client
        .from('gps_logs')
        .select('*')
        .eq('employee_id', employeeId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') this.handleError(error)
      return data
    } catch (error) {
      console.error('GPS get current location error:', error)
      return null
    }
  }

  async getActiveEmployeesLocations(): Promise<GpsLog[]> {
    try {
      // Get the latest location for each active employee
      // First, get all active employees
      const { data: employees, error: employeesError } = await this.client
        .from('employees')
        .select(`
          id,
          profile:profiles(*)
        `)
        .eq('status', 'active')

      if (employeesError) {
        console.error('Error fetching active employees:', employeesError)
        return []
      }

      if (!employees || employees.length === 0) {
        return []
      }

      // Get the latest location for each employee
      const employeeIds = employees.map(emp => emp.id)
      const { data, error } = await this.client
        .from('gps_logs')
        .select(`
          *,
          employee:employees(
            *,
            profile:profiles(*)
          )
        `)
        .in('employee_id', employeeIds)
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error fetching GPS logs:', error)
        return []
      }

      // Group by employee and get the latest location for each
      const locationMap = new Map<string, GpsLog>()
      
      if (data) {
        for (const log of data) {
          if (!locationMap.has(log.employee_id)) {
            locationMap.set(log.employee_id, log)
          }
        }
      }

      return Array.from(locationMap.values())
    } catch (error) {
      console.error('GPS get active employees locations error:', error)
      return []
    }
  }

  // Helper method to validate GPS coordinates
  static isValidLocation(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180 &&
      !isNaN(latitude) && !isNaN(longitude)
    )
  }

  // Helper method to get location accuracy level
  static getAccuracyLevel(accuracy: number | null): 'high' | 'medium' | 'low' | 'unknown' {
    if (!accuracy) return 'unknown'
    if (accuracy <= 10) return 'high'
    if (accuracy <= 50) return 'medium'
    return 'low'
  }

  // Helper method to format location error messages
  static formatLocationError(error: GeolocationPositionError): LocationError {
    let message = 'Unknown location error'
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Location permission denied'
        break
      case error.POSITION_UNAVAILABLE:
        message = 'Location unavailable - check GPS signal'
        break
      case error.TIMEOUT:
        message = 'Location request timed out'
        break
    }

    // Handle CoreLocation specific errors
    if (error.message?.includes('kCLErrorLocationUnknown')) {
      message = 'GPS signal weak or unavailable'
    }

    return {
      code: error.code.toString(),
      message,
      timestamp: new Date().toISOString()
    }
  }
}

export const gpsService = new GpsService() 
import { BaseService } from './base-service'
import type { Route, Employee } from '../database.types'

export interface CreateRouteData {
  company_id: string
  employee_id: string
  route_name?: string
  description?: string
  assigned_date?: string
  status?: 'pending' | 'in_progress' | 'completed'
}

export interface UpdateRouteData {
  route_name?: string
  description?: string
  assigned_date?: string
  status?: 'pending' | 'in_progress' | 'completed'
}

export interface RouteWithEmployee extends Route {
  employee: Employee
}

export class RouteService extends BaseService {
  async getRoutesByCompany(companyId: string): Promise<RouteWithEmployee[]> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== companyId)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data, error } = await this.client
      .from('routes')
      .select(`
        *,
        employee:employees(*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  async getRoutesByEmployee(employeeId: string): Promise<RouteWithEmployee[]> {
    const profile = await this.getCurrentProfile()
    
    // Check if user is the employee or has admin access
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== profile.company_id)) {
      // Check if user is the employee
      const { data: employee, error: employeeError } = await this.client
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .eq('profile_id', profile.id)
        .single()

      if (employeeError || !employee) {
        throw new Error('Unauthorized: Insufficient permissions')
      }
    }

    const { data, error } = await this.client
      .from('routes')
      .select(`
        *,
        employee:employees(*)
      `)
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  async getRouteById(id: string): Promise<RouteWithEmployee> {
    const profile = await this.getCurrentProfile()
    
    const { data, error } = await this.client
      .from('routes')
      .select(`
        *,
        employee:employees(*)
      `)
      .eq('id', id)
      .single()

    if (error) this.handleError(error)
    if (!data) throw new Error('Route not found')

    // Check permissions
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== data.company_id)) {
      // Check if user is the assigned employee
      if (data.employee.profile_id !== profile.id) {
        throw new Error('Unauthorized: Insufficient permissions')
      }
    }

    return data
  }

  async createRoute(data: CreateRouteData): Promise<Route> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== data.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data: route, error } = await this.client
      .from('routes')
      .insert(data)
      .select()
      .single()

    if (error) this.handleError(error)
    return route
  }

  async updateRoute(id: string, data: UpdateRouteData): Promise<Route> {
    const profile = await this.getCurrentProfile()
    
    // Get current route to check permissions
    const currentRoute = await this.getRouteById(id)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentRoute.company_id)) {
      // Check if user is the assigned employee
      if (currentRoute.employee.profile_id !== profile.id) {
        throw new Error('Unauthorized: Insufficient permissions')
      }
    }

    const { data: route, error } = await this.client
      .from('routes')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) this.handleError(error)
    if (!route) throw new Error('Route not found')
    return route
  }

  async deleteRoute(id: string): Promise<void> {
    const profile = await this.getCurrentProfile()
    
    // Get current route to check permissions
    const currentRoute = await this.getRouteById(id)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentRoute.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { error } = await this.client
      .from('routes')
      .delete()
      .eq('id', id)

    if (error) this.handleError(error)
  }
}

export const routeService = new RouteService() 
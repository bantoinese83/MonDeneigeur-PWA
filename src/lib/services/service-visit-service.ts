import { BaseService } from './base-service'
import type { ServiceVisit, Database } from '../types'

type ServiceVisitWithRelations = ServiceVisit & {
  route: Database['public']['Tables']['routes']['Row']
  client: Database['public']['Tables']['clients']['Row'] & {
    profile: Database['public']['Tables']['profiles']['Row']
  }
  employee: Database['public']['Tables']['employees']['Row'] & {
    profile: Database['public']['Tables']['profiles']['Row']
  }
}

export interface CreateServiceVisitData {
  route_id: string
  client_id: string
  employee_id: string
  scheduled_date?: string
  notes?: string
}

export interface UpdateServiceVisitData {
  scheduled_date?: string
  completed_at?: string
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  photos?: string[]
  gps_coordinates?: string
}

export class ServiceVisitService extends BaseService {
  async getServiceVisits(companyId: string): Promise<ServiceVisitWithRelations[]> {
    const profile = await this.getCurrentProfile()
    
    // Check if user has access to this company's data
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== companyId)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data, error } = await this.client
      .from('service_visits')
      .select(`
        *,
        route:routes(*),
        client:clients(
          *,
          profile:profiles(*)
        ),
        employee:employees(
          *,
          profile:profiles(*)
        )
      `)
      .eq('route.company_id', companyId)
      .order('scheduled_date', { ascending: true })

    if (error) this.handleError(error)
    return data || []
  }

  async getServiceVisitsByEmployee(employeeId: string): Promise<ServiceVisitWithRelations[]> {
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
      .from('service_visits')
      .select(`
        *,
        route:routes(*),
        client:clients(
          *,
          profile:profiles(*)
        ),
        employee:employees(
          *,
          profile:profiles(*)
        )
      `)
      .eq('employee_id', employeeId)
      .order('scheduled_date', { ascending: true })

    if (error) this.handleError(error)
    return data || []
  }

  async getServiceVisitsByRoute(routeId: string): Promise<ServiceVisitWithRelations[]> {
    const { data, error } = await this.client
      .from('service_visits')
      .select(`
        *,
        route:routes(*),
        client:clients(
          *,
          profile:profiles(*)
        ),
        employee:employees(
          *,
          profile:profiles(*)
        )
      `)
      .eq('route_id', routeId)
      .order('scheduled_date', { ascending: true })

    if (error) this.handleError(error)
    return data || []
  }

  async getServiceVisitById(id: string): Promise<ServiceVisitWithRelations> {
    const { data, error } = await this.client
      .from('service_visits')
      .select(`
        *,
        route:routes(*),
        client:clients(
          *,
          profile:profiles(*)
        ),
        employee:employees(
          *,
          profile:profiles(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) this.handleError(error)
    if (!data) throw new Error('Service visit not found')
    return data
  }

  async createServiceVisit(data: CreateServiceVisitData): Promise<ServiceVisit> {
    const { data: visit, error } = await this.client
      .from('service_visits')
      .insert({
        ...data,
        status: 'pending'
      })
      .select()
      .single()

    if (error) this.handleError(error)
    return visit
  }

  async updateServiceVisit(id: string, data: UpdateServiceVisitData): Promise<ServiceVisit> {
    const { data: visit, error } = await this.client
      .from('service_visits')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) this.handleError(error)
    return visit
  }

  async startServiceVisit(id: string): Promise<ServiceVisit> {
    return this.updateServiceVisit(id, {
      status: 'in_progress'
    })
  }

  async completeServiceVisit(id: string, photos?: string[], notes?: string): Promise<ServiceVisit> {
    return this.updateServiceVisit(id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      photos,
      notes
    })
  }

  async cancelServiceVisit(id: string, notes?: string): Promise<ServiceVisit> {
    return this.updateServiceVisit(id, {
      status: 'cancelled',
      notes
    })
  }

  async getPendingServiceVisits(employeeId: string): Promise<ServiceVisitWithRelations[]> {
    const { data, error } = await this.client
      .from('service_visits')
      .select(`
        *,
        route:routes(*),
        client:clients(
          *,
          profile:profiles(*)
        ),
        employee:employees(
          *,
          profile:profiles(*)
        )
      `)
      .eq('employee_id', employeeId)
      .eq('status', 'pending')
      .order('scheduled_date', { ascending: true })

    if (error) this.handleError(error)
    return data || []
  }

  async getTodayServiceVisits(employeeId: string): Promise<ServiceVisitWithRelations[]> {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await this.client
      .from('service_visits')
      .select(`
        *,
        route:routes(*),
        client:clients(
          *,
          profile:profiles(*)
        ),
        employee:employees(
          *,
          profile:profiles(*)
        )
      `)
      .eq('employee_id', employeeId)
      .eq('scheduled_date', today)
      .order('scheduled_date', { ascending: true })

    if (error) this.handleError(error)
    return data || []
  }

  async getServiceVisitsByClient(clientId: string): Promise<ServiceVisitWithRelations[]> {
    const profile = await this.getCurrentProfile()
    
    // Check if user is the client or has admin access
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== profile.company_id)) {
      // Check if user is the client
      const { data: client, error: clientError } = await this.client
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .eq('profile_id', profile.id)
        .single()

      if (clientError || !client) {
        throw new Error('Unauthorized: Insufficient permissions')
      }
    }

    const { data, error } = await this.client
      .from('service_visits')
      .select(`
        *,
        route:routes(*),
        client:clients(
          *,
          profile:profiles(*)
        ),
        employee:employees(
          *,
          profile:profiles(*)
        )
      `)
      .eq('client_id', clientId)
      .order('scheduled_date', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }
}

export const serviceVisitService = new ServiceVisitService()
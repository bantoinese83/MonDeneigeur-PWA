import { BaseService } from './base-service'
import type { Employee, Profile } from '../types'

export interface CreateEmployeeData {
  profile_id: string
  company_id: string
  position?: string
  hire_date?: string
  salary?: number
  status?: 'active' | 'inactive' | 'terminated'
}

export interface UpdateEmployeeData {
  position?: string
  hire_date?: string
  salary?: number
  status?: 'active' | 'inactive' | 'terminated'
}

export interface EmployeeWithProfile extends Employee {
  profile: Profile
}

export class EmployeeService extends BaseService {
  async getEmployeesByCompany(companyId: string): Promise<EmployeeWithProfile[]> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== companyId)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data, error } = await this.client
      .from('employees')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1000) // Prevent excessive data loading

    if (error) this.handleError(error)
    return data || []
  }

  async getEmployeeById(id: string): Promise<EmployeeWithProfile> {
    const profile = await this.getCurrentProfile()
    
    const { data, error } = await this.client
      .from('employees')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', id)
      .single()

    if (error) this.handleError(error)
    if (!data) throw new Error('Employee not found')

    // Check permissions
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== data.company_id) &&
        data.profile_id !== profile.id) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    return data
  }

  async createEmployee(data: CreateEmployeeData): Promise<Employee> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== data.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data: employee, error } = await this.client
      .from('employees')
      .insert(data)
      .select()
      .single()

    if (error) this.handleError(error)
    return employee
  }

  async updateEmployee(id: string, data: UpdateEmployeeData): Promise<Employee> {
    const profile = await this.getCurrentProfile()
    
    // Get current employee to check permissions
    const currentEmployee = await this.getEmployeeById(id)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentEmployee.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data: employee, error } = await this.client
      .from('employees')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) this.handleError(error)
    if (!employee) throw new Error('Employee not found')
    return employee
  }

  async deleteEmployee(id: string): Promise<void> {
    const profile = await this.getCurrentProfile()
    
    // Get current employee to check permissions
    const currentEmployee = await this.getEmployeeById(id)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentEmployee.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { error } = await this.client
      .from('employees')
      .delete()
      .eq('id', id)

    if (error) this.handleError(error)
  }
}

export const employeeService = new EmployeeService() 
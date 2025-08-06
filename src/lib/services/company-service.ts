import { BaseService } from './base-service'
import type { Company } from '../types'

export interface CreateCompanyData {
  name: string
  address?: string
  phone?: string
  email?: string
}

export interface UpdateCompanyData {
  name?: string
  address?: string
  phone?: string
  email?: string
}

export class CompanyService extends BaseService {
  async getAllCompanies(): Promise<Company[]> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin') {
      throw new Error('Unauthorized: Only superadmins can view all companies')
    }

    const { data, error } = await this.client
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  async getCompanyById(id: string): Promise<Company> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin') {
      throw new Error('Unauthorized: Only superadmins can view company details')
    }

    const { data, error } = await this.client
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) this.handleError(error)
    if (!data) throw new Error('Company not found')
    return data
  }

  async createCompany(data: CreateCompanyData): Promise<Company> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin') {
      throw new Error('Unauthorized: Only superadmins can create companies')
    }

    const { data: company, error } = await this.client
      .from('companies')
      .insert(data)
      .select()
      .single()

    if (error) this.handleError(error)
    return company
  }

  async updateCompany(id: string, data: UpdateCompanyData): Promise<Company> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin') {
      throw new Error('Unauthorized: Only superadmins can update companies')
    }

    const { data: company, error } = await this.client
      .from('companies')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) this.handleError(error)
    if (!company) throw new Error('Company not found')
    return company
  }

  async deleteCompany(id: string): Promise<void> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin') {
      throw new Error('Unauthorized: Only superadmins can delete companies')
    }

    const { error } = await this.client
      .from('companies')
      .delete()
      .eq('id', id)

    if (error) this.handleError(error)
  }
}

export const companyService = new CompanyService() 
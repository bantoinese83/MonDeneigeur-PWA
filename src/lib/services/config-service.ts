import { BaseService } from './base-service'

export interface CompanyConfig {
  id: string
  company_id: string
  contact_phone: string
  contact_email: string
  support_phone: string
  emergency_phone: string
  address: string
  business_hours: string
  website: string
  created_at: string
  updated_at: string
}

export interface CreateConfigData {
  company_id: string
  contact_phone?: string
  contact_email?: string
  support_phone?: string
  emergency_phone?: string
  address?: string
  business_hours?: string
  website?: string
}

export interface UpdateConfigData {
  contact_phone?: string
  contact_email?: string
  support_phone?: string
  emergency_phone?: string
  address?: string
  business_hours?: string
  website?: string
}

export class ConfigService extends BaseService {
  async getCompanyConfig(companyId: string): Promise<CompanyConfig | null> {
    try {
      const { data, error } = await this.client
        .from('company_configs')
        .select('*')
        .eq('company_id', companyId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No config found, return default
          return this.getDefaultConfig(companyId)
        }
        throw new Error(`Failed to fetch company config: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Config service error:', error)
      return this.getDefaultConfig(companyId)
    }
  }

  async createCompanyConfig(configData: CreateConfigData): Promise<CompanyConfig> {
    try {
      const { data, error } = await this.client
        .from('company_configs')
        .insert([configData])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create company config: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Config service error:', error)
      throw new Error('Failed to create company config')
    }
  }

  async updateCompanyConfig(companyId: string, configData: UpdateConfigData): Promise<CompanyConfig> {
    try {
      const { data, error } = await this.client
        .from('company_configs')
        .update({
          ...configData,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', companyId)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update company config: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Config service error:', error)
      throw new Error('Failed to update company config')
    }
  }

  private getDefaultConfig(companyId: string): CompanyConfig {
    return {
      id: 'default',
      company_id: companyId,
      contact_phone: '+1 (514) 555-0123',
      contact_email: 'contact@mondeneigeur.com',
      support_phone: '+1 (514) 555-0123',
      emergency_phone: '+1 (514) 555-0124',
      address: '123 Snow Street, Montréal, QC H1A 1A1',
      business_hours: 'Mon-Fri: 8AM-6PM EST',
      website: 'https://mondeneigeur.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
}

export const configService = new ConfigService() 
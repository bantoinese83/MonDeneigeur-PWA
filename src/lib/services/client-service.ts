import { BaseService } from './base-service'
import type { Client, Profile } from '../database.types'

export interface CreateClientData {
  profile_id: string
  company_id: string
  address?: string
  service_area?: string
  contact_preferences?: Record<string, any>
}

export interface UpdateClientData {
  address?: string
  service_area?: string
  contact_preferences?: Record<string, any>
}

export interface ClientWithProfile extends Client {
  profile: Profile
}

export class ClientService extends BaseService {
  async getClientsByCompany(companyId: string): Promise<ClientWithProfile[]> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== companyId)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data, error } = await this.client
      .from('clients')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  async getClientById(id: string): Promise<ClientWithProfile> {
    const profile = await this.getCurrentProfile()
    
    const { data, error } = await this.client
      .from('clients')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', id)
      .single()

    if (error) this.handleError(error)
    if (!data) throw new Error('Client not found')

    // Check permissions
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== data.company_id) &&
        data.profile_id !== profile.id) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    return data
  }

  async createClient(data: CreateClientData): Promise<Client> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== data.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data: client, error } = await this.client
      .from('clients')
      .insert(data)
      .select()
      .single()

    if (error) this.handleError(error)
    return client
  }

  async updateClient(id: string, data: UpdateClientData): Promise<Client> {
    const profile = await this.getCurrentProfile()
    
    // Get current client to check permissions
    const currentClient = await this.getClientById(id)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentClient.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data: client, error } = await this.client
      .from('clients')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) this.handleError(error)
    if (!client) throw new Error('Client not found')
    return client
  }

  async deleteClient(id: string): Promise<void> {
    const profile = await this.getCurrentProfile()
    
    // Get current client to check permissions
    const currentClient = await this.getClientById(id)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentClient.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { error } = await this.client
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) this.handleError(error)
  }

  async getCurrentUserClient(): Promise<ClientWithProfile | null> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'client') {
      throw new Error('Unauthorized: Only clients can access this method')
    }

    const { data, error } = await this.client
      .from('clients')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('profile_id', profile.id)
      .maybeSingle()

    if (error) this.handleError(error)
    return data
  }
}

export const clientService = new ClientService() 
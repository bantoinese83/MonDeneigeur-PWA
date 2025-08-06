import { BaseService } from './base-service'
import type { Contract, Client } from '../database.types'

export interface CreateContractData {
  company_id: string
  client_id: string
  contract_number?: string
  service_type?: string
  start_date?: string
  end_date?: string
  terms?: string
  pdf_url?: string
  status?: 'draft' | 'active' | 'completed' | 'cancelled'
}

export interface UpdateContractData {
  contract_number?: string
  service_type?: string
  start_date?: string
  end_date?: string
  terms?: string
  pdf_url?: string
  status?: 'draft' | 'active' | 'completed' | 'cancelled'
}

export interface ContractWithClient extends Contract {
  client: Client
}

export class ContractService extends BaseService {
  async getContractsByCompany(companyId: string): Promise<ContractWithClient[]> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== companyId)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data, error } = await this.client
      .from('contracts')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })

    if (error) this.handleError(error)
    return data || []
  }

  async getContractById(id: string): Promise<ContractWithClient> {
    const profile = await this.getCurrentProfile()
    
    const { data, error } = await this.client
      .from('contracts')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', id)
      .single()

    if (error) this.handleError(error)
    if (!data) throw new Error('Contract not found')

    // Check permissions
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== data.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    return data
  }

  async createContract(data: CreateContractData): Promise<Contract> {
    const profile = await this.getCurrentProfile()
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== data.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data: contract, error } = await this.client
      .from('contracts')
      .insert(data)
      .select()
      .single()

    if (error) this.handleError(error)
    return contract
  }

  async updateContract(id: string, data: UpdateContractData): Promise<Contract> {
    const profile = await this.getCurrentProfile()
    
    // Get current contract to check permissions
    const currentContract = await this.getContractById(id)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentContract.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { data: contract, error } = await this.client
      .from('contracts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) this.handleError(error)
    if (!contract) throw new Error('Contract not found')
    return contract
  }

  async deleteContract(id: string): Promise<void> {
    const profile = await this.getCurrentProfile()
    
    // Get current contract to check permissions
    const currentContract = await this.getContractById(id)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentContract.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    const { error } = await this.client
      .from('contracts')
      .delete()
      .eq('id', id)

    if (error) this.handleError(error)
  }

  async uploadPdf(file: File, contractId: string): Promise<string> {
    const profile = await this.getCurrentProfile()
    
    // Get current contract to check permissions
    const currentContract = await this.getContractById(contractId)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentContract.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      throw new Error('Only PDF files are allowed')
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB')
    }

    const fileName = `contracts/${contractId}/${file.name}`
    
    const { data, error } = await this.client.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) this.handleError(error)
    
    // Get public URL
    const { data: urlData } = this.client.storage
      .from('documents')
      .getPublicUrl(fileName)

    // Update contract with PDF URL
    await this.updateContract(contractId, { pdf_url: urlData.publicUrl })

    return urlData.publicUrl
  }

  async deletePdf(contractId: string): Promise<void> {
    const profile = await this.getCurrentProfile()
    
    // Get current contract to check permissions
    const currentContract = await this.getContractById(contractId)
    
    if (profile.role !== 'superadmin' && 
        (profile.role !== 'admin' || profile.company_id !== currentContract.company_id)) {
      throw new Error('Unauthorized: Insufficient permissions')
    }

    if (!currentContract.pdf_url) {
      throw new Error('No PDF file to delete')
    }

    // Extract file path from URL
    const urlParts = currentContract.pdf_url.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `contracts/${contractId}/${fileName}`

    const { error } = await this.client.storage
      .from('documents')
      .remove([filePath])

    if (error) this.handleError(error)

    // Update contract to remove PDF URL
    await this.updateContract(contractId, { pdf_url: null })
  }
}

export const contractService = new ContractService() 
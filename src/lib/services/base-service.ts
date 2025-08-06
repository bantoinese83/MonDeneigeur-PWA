import { supabase } from '../supabase'
import type { SupabaseClient } from '../supabase'

export class BaseService {
  protected client: SupabaseClient

  constructor() {
    this.client = supabase
  }

  protected handleError(error: any): never {
    console.error('Service error:', error)
    
    // Handle specific Supabase errors
    if (error?.code) {
      switch (error.code) {
        case 'PGRST116':
          throw new Error('Record not found')
        case '23505':
          throw new Error('Duplicate entry')
        case '23503':
          throw new Error('Referenced record not found')
        default:
          throw new Error(error.message || 'Database operation failed')
      }
    }
    
    throw new Error(error?.message || 'An unexpected error occurred')
  }

  protected async getCurrentUser() {
    const { data: { user }, error } = await this.client.auth.getUser()
    if (error || !user) {
      throw new Error('User not authenticated')
    }
    return user
  }

  protected async getCurrentProfile() {
    const user = await this.getCurrentUser()
    const { data: profile, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !profile) {
      throw new Error('Profile not found')
    }
    return profile
  }
} 
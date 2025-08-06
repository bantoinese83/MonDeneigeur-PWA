import { supabase } from './supabase'
import type { UserRole, Profile } from './database.types'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  fullName?: string
  companyId?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string
  role: UserRole
  companyId?: string
}

export class AuthService {
  static async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('Login failed')
    }

    const profile = await this.getProfile(data.user.id)
    return this.mapToAuthUser(data.user, profile)
  }

  static async register(credentials: RegisterCredentials): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.fullName,
          role: credentials.role,
          company_id: credentials.companyId
        }
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('Registration failed')
    }

    // Wait a moment for the trigger to complete, then try to get the profile
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const profile = await this.getProfile(data.user.id)
    return this.mapToAuthUser(data.user, profile)
  }

  static async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }

    const profile = await this.getProfileWithCache(user.id)
    return this.mapToAuthUser(user, profile)
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Unexpected error fetching profile:', error)
      return null
    }
  }

  // Cache for profile data to reduce database calls
  private static profileCache = new Map<string, Profile>()

  static async getProfileWithCache(userId: string): Promise<Profile | null> {
    // Check cache first
    if (this.profileCache.has(userId)) {
      return this.profileCache.get(userId) || null
    }

    const profile = await this.getProfile(userId)
    if (profile) {
      this.profileCache.set(userId, profile)
    }
    return profile
  }

  private static mapToAuthUser(user: { id: string; email: string | undefined }, profile: Profile | null): AuthUser {
    return {
      id: user.id,
      email: user.email || '',
      role: profile?.role || 'client',
      fullName: profile?.full_name || undefined,
      companyId: profile?.company_id || undefined
    }
  }
} 
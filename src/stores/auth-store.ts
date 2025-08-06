import { create } from 'zustand'
import { AuthService, type AuthUser } from '../lib/auth'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, role: AuthUser['role'], companyId?: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const user = await AuthService.login({ email, password })
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      set({ error: errorMessage, isLoading: false })
      throw error // Re-throw for component handling
    }
  },

  register: async (email: string, password: string, fullName: string, role: AuthUser['role'], companyId?: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const user = await AuthService.register({ 
        email, 
        password, 
        fullName, 
        role, 
        companyId 
      })
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      set({ error: errorMessage, isLoading: false })
      throw error // Re-throw for component handling
    }
  },

  logout: async () => {
    set({ isLoading: true })
    
    try {
      await AuthService.logout()
      set({ user: null, isAuthenticated: false, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Logout failed', 
        isLoading: false 
      })
    }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    
    try {
      const user = await AuthService.getCurrentUser()
      set({ 
        user, 
        isAuthenticated: !!user, 
        isLoading: false 
      })
    } catch {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      })
    }
  },

  clearError: () => set({ error: null })
})) 
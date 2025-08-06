import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/auth-store'
import { supabase } from '../lib/supabase'
import type { Employee } from '../lib/database.types'

export const useEmployeeId = () => {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['employee-id', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from('employees')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching employee ID:', error)
        return null
      }

      return data?.id || null
    },
    enabled: !!user?.id && user.role === 'employee',
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 
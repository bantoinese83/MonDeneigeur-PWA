import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/auth-store'
import { privacyService, type PrivacySettings, type DataAccessRequest } from '../lib/services/privacy-service'

export function usePrivacySettings() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['privacy', 'settings', user?.id],
    queryFn: () => privacyService.getPrivacySettings(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function usePrivacyConsents() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['privacy', 'consents', user?.id],
    queryFn: () => privacyService.getUserConsents(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useDataAccessRequests() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['privacy', 'data-requests', user?.id],
    queryFn: () => privacyService.getUserDataAccessRequests(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useGrantConsent() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ 
      consentType, 
      ipAddress, 
      userAgent 
    }: { 
      consentType: 'data_collection' | 'location_tracking' | 'communications' | 'analytics'
      ipAddress?: string
      userAgent?: string
    }) => {
      if (!user?.id) throw new Error('User not authenticated')
      return privacyService.grantConsent(user.id, consentType, ipAddress, userAgent)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy', 'settings', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['privacy', 'consents', user?.id] })
    }
  })
}

export function useRevokeConsent() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ consentType }: { 
      consentType: 'data_collection' | 'location_tracking' | 'communications' | 'analytics'
    }) => {
      if (!user?.id) throw new Error('User not authenticated')
      return privacyService.revokeConsent(user.id, consentType)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy', 'settings', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['privacy', 'consents', user?.id] })
    }
  })
}

export function useUpdatePrivacySettings() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async (settings: Partial<PrivacySettings>) => {
      if (!user?.id) throw new Error('User not authenticated')
      return privacyService.updatePrivacySettings(user.id, settings)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy', 'settings', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['privacy', 'consents', user?.id] })
    }
  })
}

export function useCreateDataAccessRequest() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async ({ 
      requestType, 
      description, 
      requestedData 
    }: { 
      requestType: DataAccessRequest['request_type']
      description: string
      requestedData?: string[]
    }) => {
      if (!user?.id) throw new Error('User not authenticated')
      return privacyService.createDataAccessRequest(user.id, requestType, description, requestedData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy', 'data-requests', user?.id] })
    }
  })
}

export function useExportUserData() {
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      return privacyService.exportUserData(user.id)
    }
  })
}

export function useDeleteUserData() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated')
      return privacyService.deleteUserData(user.id)
    },
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ['privacy'] })
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      queryClient.invalidateQueries({ queryKey: ['gps-logs'] })
      queryClient.invalidateQueries({ queryKey: ['service-visits'] })
    }
  })
}

// Convenience hooks for specific consent checks
export function useLocationTrackingConsent() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['privacy', 'location-consent', user?.id],
    queryFn: () => privacyService.isLocationTrackingAllowed(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useDataCollectionConsent() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['privacy', 'data-consent', user?.id],
    queryFn: () => privacyService.isDataCollectionAllowed(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useCommunicationsConsent() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['privacy', 'communications-consent', user?.id],
    queryFn: () => privacyService.isCommunicationsAllowed(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useAnalyticsConsent() {
  const { user } = useAuthStore()
  
  return useQuery({
    queryKey: ['privacy', 'analytics-consent', user?.id],
    queryFn: () => privacyService.isAnalyticsAllowed(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
} 
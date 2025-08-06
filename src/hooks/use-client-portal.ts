import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClientPortalService } from '../lib/services/client-portal-service'

const clientPortalService = new ClientPortalService()

export function useClientServiceStatus() {
  return useQuery({
    queryKey: ['client', 'service-status'],
    queryFn: () => clientPortalService.getServiceStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  })
}

export function useClientNotifications(limit = 20) {
  return useQuery({
    queryKey: ['client', 'notifications', limit],
    queryFn: () => clientPortalService.getNotifications(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2
  })
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['client', 'unread-notifications'],
    queryFn: () => clientPortalService.getUnreadNotificationCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => 
      clientPortalService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'notifications'] })
      queryClient.invalidateQueries({ queryKey: ['client', 'unread-notifications'] })
    }
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => clientPortalService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'notifications'] })
      queryClient.invalidateQueries({ queryKey: ['client', 'unread-notifications'] })
    }
  })
}

export function useClientPreferences() {
  return useQuery({
    queryKey: ['client', 'preferences'],
    queryFn: () => clientPortalService.getClientPreferences(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  })
}

export function useUpdateClientPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (preferences: {
      email_notifications?: boolean
      push_notifications?: boolean
      sms_notifications?: boolean
      notification_types?: Record<string, boolean>
    }) => clientPortalService.updateClientPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', 'preferences'] })
    }
  })
} 
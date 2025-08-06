import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService, type CreateClientData, type UpdateClientData } from '../lib/services/client-service'
import type { ClientWithProfile } from '../lib/services/client-service'

export const useClients = (companyId: string) => {
  return useQuery({
    queryKey: ['clients', companyId],
    queryFn: () => clientService.getClientsByCompany(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientService.getClientById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClientData) => clientService.createClient(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clients', variables.company_id] })
    },
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      clientService.updateClient(id, data),
    onSuccess: (updatedClient) => {
      queryClient.invalidateQueries({ queryKey: ['clients', updatedClient.company_id] })
      queryClient.invalidateQueries({ queryKey: ['clients', updatedClient.id] })
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: (_, id) => {
      // Invalidate all client queries since we don't know the company_id
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export const useCurrentUserClient = () => {
  return useQuery({
    queryKey: ['clients', 'current-user'],
    queryFn: () => clientService.getCurrentUserClient(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 
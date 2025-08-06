import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceVisitService, type CreateServiceVisitData, type UpdateServiceVisitData } from '../lib/services/service-visit-service'
import type { ServiceVisit } from '../lib/database.types'

export const useServiceVisits = (companyId: string) => {
  return useQuery({
    queryKey: ['service-visits', 'company', companyId],
    queryFn: () => serviceVisitService.getServiceVisits(companyId),
    enabled: !!companyId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useServiceVisitsByEmployee = (employeeId: string) => {
  return useQuery({
    queryKey: ['service-visits', 'employee', employeeId],
    queryFn: () => serviceVisitService.getServiceVisitsByEmployee(employeeId),
    enabled: !!employeeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useServiceVisitsByRoute = (routeId: string) => {
  return useQuery({
    queryKey: ['service-visits', 'route', routeId],
    queryFn: () => serviceVisitService.getServiceVisitsByRoute(routeId),
    enabled: !!routeId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const useServiceVisit = (id: string) => {
  return useQuery({
    queryKey: ['service-visits', id],
    queryFn: () => serviceVisitService.getServiceVisitById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const usePendingServiceVisits = (employeeId: string) => {
  return useQuery({
    queryKey: ['service-visits', 'pending', employeeId],
    queryFn: () => serviceVisitService.getPendingServiceVisits(employeeId),
    enabled: !!employeeId,
    staleTime: 1 * 60 * 1000, // 1 minute for pending visits
    gcTime: 2 * 60 * 1000,
  })
}

export const useTodayServiceVisits = (employeeId: string) => {
  return useQuery({
    queryKey: ['service-visits', 'today', employeeId],
    queryFn: () => serviceVisitService.getTodayServiceVisits(employeeId),
    enabled: !!employeeId,
    staleTime: 1 * 60 * 1000, // 1 minute for today's visits
    gcTime: 2 * 60 * 1000,
  })
}

export const useServiceVisitsByClient = (clientId: string) => {
  return useQuery({
    queryKey: ['service-visits', 'client', clientId],
    queryFn: () => serviceVisitService.getServiceVisitsByClient(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCreateServiceVisit = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateServiceVisitData) => serviceVisitService.createServiceVisit(data),
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'employee', variables.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'route', variables.route_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'pending', variables.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'today', variables.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'company'] })
    }
  })
}

export const useUpdateServiceVisit = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceVisitData }) => 
      serviceVisitService.updateServiceVisit(id, data),
    onSuccess: (updatedVisit) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'employee', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'route', updatedVisit.route_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'pending', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'today', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', updatedVisit.id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'company'] })
    }
  })
}

export const useStartServiceVisit = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => serviceVisitService.startServiceVisit(id),
    onSuccess: (updatedVisit) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'employee', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'route', updatedVisit.route_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'pending', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'today', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', updatedVisit.id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'company'] })
    }
  })
}

export const useCompleteServiceVisit = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, photos, notes }: { id: string; photos?: string[]; notes?: string }) => 
      serviceVisitService.completeServiceVisit(id, photos, notes),
    onSuccess: (updatedVisit) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'employee', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'route', updatedVisit.route_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'pending', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'today', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', updatedVisit.id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'company'] })
    }
  })
}

export const useCancelServiceVisit = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) => 
      serviceVisitService.cancelServiceVisit(id, notes),
    onSuccess: (updatedVisit) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'employee', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'route', updatedVisit.route_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'pending', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'today', updatedVisit.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', updatedVisit.id] })
      queryClient.invalidateQueries({ queryKey: ['service-visits', 'company'] })
    }
  })
} 
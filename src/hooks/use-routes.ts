import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routeService, type CreateRouteData, type UpdateRouteData } from '../lib/services/route-service'
import type { RouteWithEmployee } from '../lib/services/route-service'

export const useRoutes = (companyId: string) => {
  return useQuery({
    queryKey: ['routes', companyId],
    queryFn: () => routeService.getRoutesByCompany(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useRoutesByEmployee = (employeeId: string) => {
  return useQuery({
    queryKey: ['routes', 'employee', employeeId],
    queryFn: () => routeService.getRoutesByEmployee(employeeId),
    enabled: !!employeeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useRoute = (id: string) => {
  return useQuery({
    queryKey: ['routes', id],
    queryFn: () => routeService.getRouteById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useCreateRoute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRouteData) => routeService.createRoute(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['routes', variables.company_id] })
    },
  })
}

export const useUpdateRoute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRouteData }) =>
      routeService.updateRoute(id, data),
    onSuccess: (updatedRoute) => {
      queryClient.invalidateQueries({ queryKey: ['routes', updatedRoute.company_id] })
      queryClient.invalidateQueries({ queryKey: ['routes', updatedRoute.id] })
    },
  })
}

export const useDeleteRoute = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => routeService.deleteRoute(id),
    onSuccess: (_, id) => {
      // Invalidate all route queries since we don't know the company_id
      queryClient.invalidateQueries({ queryKey: ['routes'] })
    },
  })
} 
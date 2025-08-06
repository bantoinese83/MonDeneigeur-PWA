import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gpsService, type CreateGpsLogData } from '../lib/services/gps-service'
import type { GpsLog } from '../lib/database.types'

export const useEmployeeLocationHistory = (employeeId: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['gps-logs', 'employee', employeeId, startDate, endDate],
    queryFn: () => gpsService.getEmployeeLocationHistory(employeeId, startDate, endDate),
    enabled: !!employeeId,
    staleTime: 30 * 1000, // 30 seconds for GPS data
    gcTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useVisitLocationHistory = (visitId: string) => {
  return useQuery({
    queryKey: ['gps-logs', 'visit', visitId],
    queryFn: () => gpsService.getVisitLocationHistory(visitId),
    enabled: !!visitId,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  })
}

export const useCurrentEmployeeLocation = (employeeId: string) => {
  return useQuery({
    queryKey: ['gps-logs', 'current', employeeId],
    queryFn: () => gpsService.getCurrentEmployeeLocation(employeeId),
    enabled: !!employeeId,
    staleTime: 10 * 1000, // 10 seconds for current location
    gcTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

export const useActiveEmployeesLocations = () => {
  return useQuery({
    queryKey: ['gps-logs', 'active-employees'],
    queryFn: () => gpsService.getActiveEmployeesLocations(),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export const useLogLocation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateGpsLogData) => gpsService.logLocation(data),
    onSuccess: (log) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['gps-logs', 'employee', log.employee_id] })
      queryClient.invalidateQueries({ queryKey: ['gps-logs', 'current', log.employee_id] })
      if (log.visit_id) {
        queryClient.invalidateQueries({ queryKey: ['gps-logs', 'visit', log.visit_id] })
      }
      queryClient.invalidateQueries({ queryKey: ['gps-logs', 'active-employees'] })
    }
  })
} 
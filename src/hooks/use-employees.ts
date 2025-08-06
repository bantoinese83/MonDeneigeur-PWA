import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeService, type CreateEmployeeData, type UpdateEmployeeData } from '../lib/services/employee-service'
import type { EmployeeWithProfile } from '../lib/services/employee-service'

export const useEmployees = (companyId: string) => {
  return useQuery({
    queryKey: ['employees', companyId],
    queryFn: () => employeeService.getEmployeesByCompany(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useCreateEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateEmployeeData) => employeeService.createEmployee(data),
    onSuccess: (newEmployee, variables) => {
      // Optimistic update
      queryClient.setQueryData(
        ['employees', variables.company_id],
        (oldData: EmployeeWithProfile[] | undefined) => {
          if (!oldData) return [newEmployee]
          return [newEmployee, ...oldData]
        }
      )
      queryClient.invalidateQueries({ queryKey: ['employees', variables.company_id] })
    },
    onError: (error) => {
      console.error('Failed to create employee:', error)
    }
  })
}

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeData }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: (updatedEmployee) => {
      // Optimistic update
      queryClient.setQueryData(
        ['employees', updatedEmployee.id],
        updatedEmployee
      )
      queryClient.invalidateQueries({ queryKey: ['employees', updatedEmployee.company_id] })
      queryClient.invalidateQueries({ queryKey: ['employees', updatedEmployee.id] })
    },
    onError: (error) => {
      console.error('Failed to update employee:', error)
    }
  })
}

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: (_, id) => {
      // Invalidate all employee queries since we don't know the company_id
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })
} 
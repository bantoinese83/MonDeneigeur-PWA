import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companyService, type CreateCompanyData, type UpdateCompanyData } from '../lib/services/company-service'
import type { Company } from '../lib/database.types'

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => companyService.getAllCompanies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => companyService.getCompanyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCompanyData) => companyService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCompanyData }) =>
      companyService.updateCompany(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['companies', id] })
    },
  })
}

export const useDeleteCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => companyService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
} 
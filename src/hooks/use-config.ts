import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { configService, type CreateConfigData, type UpdateConfigData } from '../lib/services/config-service'
import type { CompanyConfig } from '../lib/services/config-service'

export const useCompanyConfig = (companyId: string) => {
  return useQuery({
    queryKey: ['company-config', companyId],
    queryFn: () => configService.getCompanyConfig(companyId),
    enabled: !!companyId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useCreateCompanyConfig = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (configData: CreateConfigData) => configService.createCompanyConfig(configData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['company-config', data.company_id] })
    },
  })
}

export const useUpdateCompanyConfig = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ companyId, configData }: { companyId: string; configData: UpdateConfigData }) =>
      configService.updateCompanyConfig(companyId, configData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['company-config', data.company_id] })
    },
  })
} 
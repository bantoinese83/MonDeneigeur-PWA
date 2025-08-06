import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contractService, type CreateContractData, type UpdateContractData } from '../lib/services/contract-service'
import type { ContractWithClient } from '../lib/services/contract-service'

export const useContracts = (companyId: string) => {
  return useQuery({
    queryKey: ['contracts', companyId],
    queryFn: () => contractService.getContractsByCompany(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useContract = (id: string) => {
  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () => contractService.getContractById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useCreateContract = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateContractData) => contractService.createContract(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.company_id] })
    },
  })
}

export const useUpdateContract = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContractData }) =>
      contractService.updateContract(id, data),
    onSuccess: (updatedContract) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', updatedContract.company_id] })
      queryClient.invalidateQueries({ queryKey: ['contracts', updatedContract.id] })
    },
  })
}

export const useDeleteContract = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => contractService.deleteContract(id),
    onSuccess: (_, id) => {
      // Invalidate all contract queries since we don't know the company_id
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export const useUploadPdf = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, contractId }: { file: File; contractId: string }) =>
      contractService.uploadPdf(file, contractId),
    onSuccess: (_, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', contractId] })
    },
  })
}

export const useDeletePdf = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contractId: string) => contractService.deletePdf(contractId),
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contracts', contractId] })
    },
  })
} 
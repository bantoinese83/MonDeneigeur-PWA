import { useQuery } from '@tanstack/react-query'
import { auditService, type AuditFilters } from '../lib/services/audit-service'
import type { AuditLogWithUser } from '../lib/services/audit-service'

export const useAuditLogs = (filters: AuditFilters = {}) => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => auditService.getAuditLogs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useAuditLog = (id: string) => {
  return useQuery({
    queryKey: ['audit-logs', id],
    queryFn: () => auditService.getAuditLogById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const useAuditStats = () => {
  return useQuery({
    queryKey: ['audit-stats'],
    queryFn: () => auditService.getAuditStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 
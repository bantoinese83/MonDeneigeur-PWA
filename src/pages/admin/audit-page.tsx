import { useState } from 'react'
import { Eye, Filter, Download, Calendar, User, Activity } from 'lucide-react'
import { useAuditLogs, useAuditStats } from '../../hooks/use-audit'
import { DataTable, type Column } from '../../components/shared/data-table'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Spinner3D } from '../../components/shared/3d-spinner'
import type { AuditLogWithUser } from '../../lib/services/audit-service'

interface AuditFilters {
  action?: string
  table_name?: string
  user_id?: string
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}

export function AuditPage() {
  const { user } = useAuthStore()
  const [filters, setFilters] = useState<AuditFilters>({
    limit: 50
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data: auditLogs, isLoading, error } = useAuditLogs(filters)
  const { data: stats } = useAuditStats()

  const columns: Column<AuditLogWithUser>[] = [
    {
      key: 'created_at',
      header: 'Timestamp',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 text-sm">
            {new Date(value).toLocaleString()}
          </span>
        </div>
      )
    },
    {
      key: 'profiles',
      header: 'User',
      sortable: true,
      render: (_, log) => (
        <div className="flex items-center gap-1">
          <User className="h-4 w-4 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">
              {log.profiles?.full_name || 'System'}
            </div>
            <div className="text-sm text-gray-500">
              {log.profiles?.email || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <Activity className="h-4 w-4 text-gray-400" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'INSERT' ? 'bg-green-100 text-green-800' :
            value === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
            value === 'DELETE' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'table_name',
      header: 'Table',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600 font-mono text-sm">{value || 'N/A'}</span>
      )
    },
    {
      key: 'record_id',
      header: 'Record ID',
      sortable: true,
      render: (value) => (
        <span className="text-gray-500 text-sm font-mono">{value || 'N/A'}</span>
      )
    },
    {
      key: 'old_values',
      header: 'Old Values',
      sortable: false,
      render: (value) => {
        if (!value) return <span className="text-gray-400 text-sm">N/A</span>
        try {
          const parsed = typeof value === 'string' ? JSON.parse(value) : value
          return (
            <div className="text-xs text-gray-600 max-w-xs truncate">
              {Object.keys(parsed).length > 0 ? 
                `${Object.keys(parsed).length} fields changed` : 
                'No changes'
              }
            </div>
          )
        } catch {
          return <span className="text-gray-400 text-sm">Invalid</span>
        }
      }
    },
    {
      key: 'new_values',
      header: 'New Values',
      sortable: false,
      render: (value) => {
        if (!value) return <span className="text-gray-400 text-sm">N/A</span>
        try {
          const parsed = typeof value === 'string' ? JSON.parse(value) : value
          return (
            <div className="text-xs text-gray-600 max-w-xs truncate">
              {Object.keys(parsed).length > 0 ? 
                `${Object.keys(parsed).length} fields` : 
                'No data'
              }
            </div>
          )
        } catch {
          return <span className="text-gray-400 text-sm">Invalid</span>
        }
      }
    },
    {
      key: 'ip_address',
      header: 'IP Address',
      sortable: true,
      render: (value) => (
        <span className="text-gray-500 text-sm font-mono">{value || 'N/A'}</span>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      width: '80px',
      render: (_, log) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDetails(log)}
            className="p-1 hover:bg-gray-100 rounded"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )
    }
  ]

  const handleViewDetails = (log: AuditLogWithUser) => {
    // TODO: Implement detailed view modal
    console.log('View audit log details:', log)
  }

  const handleFilterChange = (key: keyof AuditFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  const clearFilters = () => {
    setFilters({ limit: 50 })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner3D size="md" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading audit logs: {error.message}</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600">Track all system activities and changes</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              onClick={() => {/* TODO: Implement export */}}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Actions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalActions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Today's Actions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayActions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.weekActions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Audit Logs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Type
                </label>
                <select
                  value={filters.action || ''}
                  onChange={(e) => handleFilterChange('action', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Actions</option>
                  <option value="INSERT">INSERT</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Name
                </label>
                <select
                  value={filters.table_name || ''}
                  onChange={(e) => handleFilterChange('table_name', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Tables</option>
                  <option value="companies">Companies</option>
                  <option value="profiles">Profiles</option>
                  <option value="employees">Employees</option>
                  <option value="clients">Clients</option>
                  <option value="contracts">Contracts</option>
                  <option value="routes">Routes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={filters.user_id || ''}
                  onChange={(e) => handleFilterChange('user_id', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter user ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.start_date || ''}
                  onChange={(e) => handleFilterChange('start_date', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.end_date || ''}
                  onChange={(e) => handleFilterChange('end_date', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Limit
                </label>
                <select
                  value={filters.limit || 50}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={25}>25 records</option>
                  <option value={50}>50 records</option>
                  <option value={100}>100 records</option>
                  <option value={200}>200 records</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={auditLogs || []}
            columns={columns}
            searchable
            searchKeys={['action', 'table_name']}
            pagination
            pageSize={filters.limit || 50}
            emptyMessage={
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
                <p className="text-gray-500">No audit logs match your current filters.</p>
              </div>
            }
          />
        </div>
      </div>
    </DashboardLayout>
  )
} 
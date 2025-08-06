import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, MapPin, Calendar } from 'lucide-react'
import { useRoutes, useCreateRoute, useUpdateRoute, useDeleteRoute } from '../../hooks/use-routes'
import { DataTable, type Column } from '../../components/shared/data-table'
import { StatusBadge } from '../../components/shared/status-badge'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Spinner3D } from '../../components/shared/3d-spinner'
import type { RouteWithEmployee } from '../../lib/services/route-service'

interface RouteFormData {
  company_id: string
  employee_id: string
  route_name: string
  description: string
  assigned_date: string
  status: 'pending' | 'in_progress' | 'completed'
}

export function RoutesPage() {
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<RouteWithEmployee | null>(null)
  const [formData, setFormData] = useState<RouteFormData>({
    company_id: user?.companyId || '',
    employee_id: '',
    route_name: '',
    description: '',
    assigned_date: '',
    status: 'pending'
  })

  const { data: routes, isLoading, error } = useRoutes(user?.companyId || '')
  const createRoute = useCreateRoute()
  const updateRoute = useUpdateRoute()
  const deleteRoute = useDeleteRoute()

  const columns: Column<RouteWithEmployee>[] = [
    {
      key: 'route_name',
      header: 'Route Name',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value || 'N/A'}</span>
      )
    },
    {
      key: 'employee',
      header: 'Assigned Employee',
      sortable: true,
      render: (_, route) => (
        <div>
          <div className="font-medium text-gray-900">
            {route.employee.profile?.full_name || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {route.employee.profile?.email || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">
          {value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : 'N/A'}
        </span>
      )
    },
    {
      key: 'assigned_date',
      header: 'Assigned Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">
            {value ? new Date(value).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <StatusBadge status={value} />
      )
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (value) => (
        <span className="text-gray-500 text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'id',
      header: 'Actions',
      width: '120px',
      render: (_, route) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(route)}
            className="p-1 hover:bg-gray-100 rounded"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleEdit(route)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit Route"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDelete(route)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete Route"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ]

  const handleCreate = () => {
    setEditingRoute(null)
    setFormData({
      company_id: user?.companyId || '',
      employee_id: '',
      route_name: '',
      description: '',
      assigned_date: '',
      status: 'pending'
    })
    setIsModalOpen(true)
  }

  const handleEdit = (route: RouteWithEmployee) => {
    setEditingRoute(route)
    setFormData({
      company_id: route.company_id,
      employee_id: route.employee_id,
      route_name: route.route_name || '',
      description: route.description || '',
      assigned_date: route.assigned_date || '',
      status: route.status
    })
    setIsModalOpen(true)
  }

  const handleView = (route: RouteWithEmployee) => {
    // TODO: Implement view details modal with map visualization
    console.log('View route:', route)
  }

  const handleDelete = async (route: RouteWithEmployee) => {
    if (confirm(`Are you sure you want to delete route "${route.route_name}"?`)) {
      try {
        await deleteRoute.mutateAsync(route.id)
      } catch (error) {
        console.error('Failed to delete route:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingRoute) {
        await updateRoute.mutateAsync({
          id: editingRoute.id,
          data: {
            route_name: formData.route_name,
            description: formData.description,
            assigned_date: formData.assigned_date,
            status: formData.status
          }
        })
      } else {
        await createRoute.mutateAsync({
          company_id: formData.company_id,
          employee_id: formData.employee_id,
          route_name: formData.route_name,
          description: formData.description,
          assigned_date: formData.assigned_date,
          status: formData.status
        })
      }
      
      setIsModalOpen(false)
      setFormData({
        company_id: user?.companyId || '',
        employee_id: '',
        route_name: '',
        description: '',
        assigned_date: '',
        status: 'pending'
      })
    } catch (error) {
      console.error('Failed to save route:', error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Spinner3D size="md" />
            <p className="text-gray-600 mt-4">Loading routes...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading routes: {error.message}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Routes Management</h1>
            <p className="text-gray-600">Assign and manage snow removal routes</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Route
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={routes || []}
            columns={columns}
            searchable
            searchKeys={['route_name', 'employee.profile.full_name', 'description']}
            pagination
            pageSize={10}
            emptyMessage={
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No routes yet</h3>
                <p className="text-gray-500">Get started by creating your first route assignment.</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Route
                </button>
              </div>
            }
          />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingRoute ? 'Edit Route' : 'Add Route'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingRoute && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company ID *
                      </label>
                      <input
                        type="text"
                        value={formData.company_id}
                        onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee ID *
                      </label>
                      <input
                        type="text"
                        value={formData.employee_id}
                        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                        placeholder="Enter employee ID"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Name *
                  </label>
                  <input
                    type="text"
                    value={formData.route_name}
                    onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    placeholder="e.g., Downtown Route, North District"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Describe the route details, stops, and special instructions..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Date
                  </label>
                  <input
                    type="date"
                    value={formData.assigned_date}
                    onChange={(e) => setFormData({ ...formData, assigned_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createRoute.isPending || updateRoute.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {createRoute.isPending || updateRoute.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
} 
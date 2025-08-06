import { useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../../hooks/use-employees'
import { DataTable, type Column } from '../../components/shared/data-table'
import { StatusBadge } from '../../components/shared/status-badge'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Spinner3D } from '../../components/shared/3d-spinner'
import type { EmployeeWithProfile } from '../../lib/services/employee-service'

interface EmployeeFormData {
  profile_id: string
  company_id: string
  position: string
  hire_date: string
  salary: string
  status: 'active' | 'inactive' | 'terminated'
}

export function EmployeesPage() {
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<EmployeeWithProfile | null>(null)
  const [formData, setFormData] = useState<EmployeeFormData>({
    profile_id: '',
    company_id: user?.companyId || '',
    position: '',
    hire_date: '',
    salary: '',
    status: 'active'
  })

  const { data: employees, isLoading, error } = useEmployees(user?.companyId || '')
  const createEmployee = useCreateEmployee()
  const updateEmployee = useUpdateEmployee()
  const deleteEmployee = useDeleteEmployee()

  const columns: Column<EmployeeWithProfile>[] = [
    {
      key: 'profile',
      header: 'Employee',
      sortable: true,
      render: (_, employee) => (
        <div>
          <div className="font-medium text-gray-900">{employee.profile.full_name}</div>
          <div className="text-sm text-gray-500">{employee.profile.email}</div>
        </div>
      )
    },
    {
      key: 'position',
      header: 'Position',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{value || 'N/A'}</span>
      )
    },
    {
      key: 'hire_date',
      header: 'Hire Date',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      key: 'salary',
      header: 'Salary',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">
          {value ? `$${value.toLocaleString()}` : 'N/A'}
        </span>
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
      render: (_, employee) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(employee)}
            className="p-1 hover:bg-gray-100 rounded"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleEdit(employee)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit Employee"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDelete(employee)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete Employee"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ]

  const handleCreate = () => {
    setEditingEmployee(null)
    setFormData({
      profile_id: '',
      company_id: user?.companyId || '',
      position: '',
      hire_date: '',
      salary: '',
      status: 'active'
    })
    setIsModalOpen(true)
  }

  const handleEdit = (employee: EmployeeWithProfile) => {
    setEditingEmployee(employee)
    setFormData({
      profile_id: employee.profile_id,
      company_id: employee.company_id,
      position: employee.position || '',
      hire_date: employee.hire_date || '',
      salary: employee.salary?.toString() || '',
      status: employee.status
    })
    setIsModalOpen(true)
  }

  const handleView = (employee: EmployeeWithProfile) => {
    // TODO: Implement view details modal
    console.log('View employee:', employee)
  }

  const handleDelete = async (employee: EmployeeWithProfile) => {
    if (confirm(`Are you sure you want to delete ${employee.profile.full_name}?`)) {
      try {
        await deleteEmployee.mutateAsync(employee.id)
      } catch (error) {
        console.error('Failed to delete employee:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const data = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined
      }

      if (editingEmployee) {
        await updateEmployee.mutateAsync({
          id: editingEmployee.id,
          data: {
            position: data.position,
            hire_date: data.hire_date,
            salary: data.salary,
            status: data.status
          }
        })
      } else {
        await createEmployee.mutateAsync(data)
      }
      
      setIsModalOpen(false)
      setFormData({
        profile_id: '',
        company_id: user?.companyId || '',
        position: '',
        hire_date: '',
        salary: '',
        status: 'active'
      })
    } catch (error) {
      console.error('Failed to save employee:', error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Spinner3D size="md" />
            <p className="text-gray-600 mt-4">Loading employees...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading employees: {error.message}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Employees Management</h1>
            <p className="text-gray-600">Manage your company employees</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={employees || []}
            columns={columns}
            searchable
            searchKeys={['profile.full_name', 'profile.email', 'position']}
            pagination
            pageSize={10}
            emptyMessage={
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
                <p className="text-gray-500">Get started by adding your first employee to the team.</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Employee
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
                {editingEmployee ? 'Edit Employee' : 'Add Employee'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingEmployee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile ID *
                    </label>
                    <input
                      type="text"
                      value={formData.profile_id}
                      onChange={(e) => setFormData({ ...formData, profile_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      placeholder="Enter profile ID"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Snow Removal Specialist"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createEmployee.isPending || updateEmployee.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {createEmployee.isPending || updateEmployee.isPending ? 'Saving...' : 'Save'}
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
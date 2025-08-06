import { useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany } from '../../hooks/use-companies'
import { DataTable, type Column } from '../../components/shared/data-table'
import { StatusBadge } from '../../components/shared/status-badge'
import { Spinner3D } from '../../components/shared/3d-spinner'
import type { Company } from '../../lib/database.types'

interface CompanyFormData {
  name: string
  address: string
  phone: string
  email: string
}

export function CompaniesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    address: '',
    phone: '',
    email: ''
  })

  const { data: companies, isLoading, error } = useCompanies()
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const deleteCompany = useDeleteCompany()

  const columns: Column<Company>[] = [
    {
      key: 'name',
      header: 'Company Name',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    {
      key: 'address',
      header: 'Address',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{value || 'N/A'}</span>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{value || 'N/A'}</span>
      )
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{value || 'N/A'}</span>
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
      render: (_, company) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(company)}
            className="p-1 hover:bg-gray-100 rounded"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleEdit(company)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit Company"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDelete(company)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete Company"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ]

  const handleCreate = () => {
    setEditingCompany(null)
    setFormData({ name: '', address: '', phone: '', email: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || ''
    })
    setIsModalOpen(true)
  }

  const handleView = (company: Company) => {
    // TODO: Implement view details modal
    console.log('View company:', company)
  }

  const handleDelete = async (company: Company) => {
    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      try {
        await deleteCompany.mutateAsync(company.id)
      } catch (error) {
        console.error('Failed to delete company:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingCompany) {
        await updateCompany.mutateAsync({
          id: editingCompany.id,
          data: formData
        })
      } else {
        await createCompany.mutateAsync(formData)
      }
      
      setIsModalOpen(false)
      setFormData({ name: '', address: '', phone: '', email: '' })
    } catch (error) {
      console.error('Failed to save company:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Spinner3D size="md" />
          <p className="text-gray-600 mt-4">Loading companies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading companies: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies Management</h1>
          <p className="text-gray-600">Manage all companies in the system</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Company
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={companies || []}
          columns={columns}
          searchable
          searchKeys={['name', 'address', 'phone', 'email']}
          pagination
          pageSize={10}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCompany ? 'Edit Company' : 'Add Company'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createCompany.isPending || updateCompany.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createCompany.isPending || updateCompany.isPending ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 
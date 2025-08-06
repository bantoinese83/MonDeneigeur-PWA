import { useState } from 'react'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../../hooks/use-clients'
import { DataTable, type Column } from '../../components/shared/data-table'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Spinner3D } from '../../components/shared/3d-spinner'
import type { ClientWithProfile } from '../../lib/services/client-service'

interface ClientFormData {
  profile_id: string
  company_id: string
  address: string
  service_area: string
  contact_preferences: string
}

export function ClientsPage() {
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientWithProfile | null>(null)
  const [formData, setFormData] = useState<ClientFormData>({
    profile_id: '',
    company_id: user?.companyId || '',
    address: '',
    service_area: '',
    contact_preferences: ''
  })

  const { data: clients, isLoading, error } = useClients(user?.companyId || '')
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()

  const columns: Column<ClientWithProfile>[] = [
    {
      key: 'id', // Use id as the key since it's always a string
      header: 'Client',
      sortable: true,
      render: (_, client) => (
        <div>
          <div className="font-medium text-gray-900">
            {client.profile?.full_name || 'N/A'}
          </div>
          <div className="text-sm text-gray-500">
            {client.profile?.email || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'address',
      header: 'Address',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{String(value || 'N/A')}</span>
      )
    },
    {
      key: 'service_area',
      header: 'Service Area',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{String(value || 'N/A')}</span>
      )
    },
    {
      key: 'contact_preferences',
      header: 'Contact Preferences',
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-gray-500">N/A</span>
        
        // Handle Json type properly
        let prefs: Record<string, unknown>
        if (typeof value === 'string') {
          try {
            prefs = JSON.parse(value)
          } catch {
            return <span className="text-gray-600">{value}</span>
          }
        } else if (typeof value === 'object' && value !== null) {
          prefs = value as Record<string, unknown>
        } else {
          return <span className="text-gray-600">{String(value)}</span>
        }
        
        return (
          <div className="text-sm">
            {Object.entries(prefs).map(([key, val]) => (
              <div key={key} className="text-gray-600">
                {key}: {String(val)}
              </div>
            ))}
          </div>
        )
      }
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (value) => {
        // Ensure we have a valid date string
        let dateValue: string
        if (typeof value === 'string') {
          dateValue = value
        } else {
          dateValue = new Date().toISOString()
        }
        
        return (
          <span className="text-gray-500 text-sm">
            {new Date(dateValue).toLocaleDateString()}
          </span>
        )
      }
    },
    {
      key: 'id',
      header: 'Actions',
      width: '120px',
      render: (_, client) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(client)}
            className="p-1 hover:bg-gray-100 rounded"
            title="View Details"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleEdit(client)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit Client"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDelete(client)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Delete Client"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      )
    }
  ]

  const handleCreate = () => {
    setEditingClient(null)
    setFormData({
      profile_id: '',
      company_id: user?.companyId || '',
      address: '',
      service_area: '',
      contact_preferences: ''
    })
    setIsModalOpen(true)
  }

  const handleEdit = (client: ClientWithProfile) => {
    setEditingClient(client)
    setFormData({
      profile_id: client.profile_id,
      company_id: client.company_id,
      address: client.address || '',
      service_area: client.service_area || '',
      contact_preferences: client.contact_preferences ? JSON.stringify(client.contact_preferences, null, 2) : ''
    })
    setIsModalOpen(true)
  }

  const handleView = (client: ClientWithProfile) => {
    // TODO: Implement view details modal
    console.log('View client:', client)
  }

  const handleDelete = async (client: ClientWithProfile) => {
    if (confirm(`Are you sure you want to delete ${client.profile?.full_name || 'this client'}?`)) {
      try {
        await deleteClient.mutateAsync(client.id)
      } catch (error) {
        console.error('Failed to delete client:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let contactPrefs = null
      if (formData.contact_preferences.trim()) {
        try {
          contactPrefs = JSON.parse(formData.contact_preferences)
        } catch {
          alert('Invalid JSON format for contact preferences')
          return
        }
      }

      const data = {
        ...formData,
        contact_preferences: contactPrefs
      }

      if (editingClient) {
        await updateClient.mutateAsync({
          id: editingClient.id,
          data: {
            address: data.address,
            service_area: data.service_area,
            contact_preferences: data.contact_preferences
          }
        })
      } else {
        await createClient.mutateAsync(data)
      }
      
      setIsModalOpen(false)
      setFormData({
        profile_id: '',
        company_id: user?.companyId || '',
        address: '',
        service_area: '',
        contact_preferences: ''
      })
    } catch (error) {
      console.error('Failed to save client:', error)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Spinner3D size="md" />
            <p className="text-gray-600 mt-4">Loading clients...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading clients: {error.message}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Clients Management</h1>
            <p className="text-gray-600">Manage your company clients</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={clients || []}
            columns={columns}
            searchable
            searchKeys={['address', 'service_area']}
            pagination
            pageSize={10}
            emptyMessage={
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                <p className="text-gray-500">Get started by adding your first client to the system.</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
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
                {editingClient ? 'Edit Client' : 'Add Client'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editingClient && (
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
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Enter client address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Area
                  </label>
                  <input
                    type="text"
                    value={formData.service_area}
                    onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Downtown, North District"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Preferences (JSON)
                  </label>
                  <textarea
                    value={formData.contact_preferences}
                    onChange={(e) => setFormData({ ...formData, contact_preferences: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder='{"phone": "preferred", "email": "secondary", "sms": false}'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter JSON format for contact preferences
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createClient.isPending || updateClient.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {createClient.isPending || updateClient.isPending ? 'Saving...' : 'Save'}
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
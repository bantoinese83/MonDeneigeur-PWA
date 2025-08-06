import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useContracts, useCreateContract, useUpdateContract, useDeleteContract, useUploadPdf, useDeletePdf } from '../../hooks/use-contracts'
import { DataTable } from '../../components/shared/data-table'
import { getContractTableColumns } from '../../components/contracts/contract-table-columns'
import { useAuthStore } from '../../stores/auth-store'
import { DashboardLayout } from '../../components/layout/dashboard-layout'
import { Spinner3D } from '../../components/shared/3d-spinner'
import type { ContractWithClient } from '../../lib/services/contract-service'

interface ContractFormData {
  company_id: string
  client_id: string
  contract_number: string
  service_type: string
  start_date: string
  end_date: string
  terms: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
}

export function ContractsPage() {
  const { user } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<ContractWithClient | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<ContractFormData>({
    company_id: user?.companyId || '',
    client_id: '',
    contract_number: '',
    service_type: '',
    start_date: '',
    end_date: '',
    terms: '',
    status: 'draft'
  })

  const { data: contracts, isLoading, error } = useContracts(user?.companyId || '')
  const createContract = useCreateContract()
  const updateContract = useUpdateContract()
  const deleteContract = useDeleteContract()
  const uploadPdf = useUploadPdf()
  const deletePdf = useDeletePdf()

  const handleCreate = () => {
    setEditingContract(null)
    setFormData({
      company_id: user?.companyId || '',
      client_id: '',
      contract_number: '',
      service_type: '',
      start_date: '',
      end_date: '',
      terms: '',
      status: 'draft'
    })
    setIsModalOpen(true)
  }

  const handleEdit = (contract: ContractWithClient) => {
    setEditingContract(contract)
    setFormData({
      company_id: contract.company_id,
      client_id: contract.client_id,
      contract_number: contract.contract_number || '',
      service_type: contract.service_type || '',
      start_date: contract.start_date || '',
      end_date: contract.end_date || '',
      terms: contract.terms || '',
      status: contract.status
    })
    setIsModalOpen(true)
  }

  const handleView = (contract: ContractWithClient) => {
    // TODO: Implement view details modal
    console.log('View contract:', contract)
  }

  const handleDelete = async (contract: ContractWithClient) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      await deleteContract.mutateAsync(contract.id)
    }
  }

  const handleDeletePdf = async (contractId: string) => {
    if (confirm('Are you sure you want to delete the PDF?')) {
      await deletePdf.mutateAsync(contractId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingContract) {
        await updateContract.mutateAsync({
          id: editingContract.id,
          ...formData
        })
      } else {
        const newContract = await createContract.mutateAsync({
          company_id: formData.company_id,
          client_id: formData.client_id,
          contract_number: formData.contract_number,
          service_type: formData.service_type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          terms: formData.terms,
          status: formData.status
        })

        if (selectedFile && newContract) {
          await uploadPdf.mutateAsync({
            file: selectedFile,
            contractId: newContract.id
          })
        }
      }
      
      setIsModalOpen(false)
      setSelectedFile(null)
      setFormData({
        company_id: user?.companyId || '',
        client_id: '',
        contract_number: '',
        service_type: '',
        start_date: '',
        end_date: '',
        terms: '',
        status: 'draft'
      })
    } catch (error) {
      console.error('Failed to save contract:', error)
    }
  }

  const columns = getContractTableColumns(handleEdit, handleView, handleDelete, handleDeletePdf)

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Spinner3D size="md" />
            <p className="text-gray-600 mt-4">Loading contracts...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading contracts: {error.message}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Contracts Management</h1>
            <p className="text-gray-600">Manage your company contracts and PDF documents</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Contract
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <DataTable
            data={contracts || []}
            columns={columns}
            searchable
            searchKeys={['contract_number', 'client.profile.full_name', 'service_type']}
            pagination
            pageSize={10}
            emptyMessage={
              <div className="text-center py-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts yet</h3>
                <p className="text-gray-500">Get started by creating your first contract with a client.</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Contract
                </button>
              </div>
            }
          />
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingContract ? 'Edit Contract' : 'Add Contract'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!editingContract && (
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
                          Client ID *
                        </label>
                        <input
                          type="text"
                          value={formData.client_id}
                          onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                          placeholder="Enter client ID"
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contract Number
                    </label>
                    <input
                      type="text"
                      value={formData.contract_number}
                      onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., CON-2024-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <input
                      type="text"
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Snow Removal, Maintenance"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms
                  </label>
                  <textarea
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="Enter contract terms and conditions..."
                  />
                </div>
                
                {!editingContract && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PDF Document
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-700"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={createContract.isPending || updateContract.isPending || uploadPdf.isPending}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors duration-200"
                  >
                    {createContract.isPending || updateContract.isPending || uploadPdf.isPending ? 'Saving...' : 'Save'}
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
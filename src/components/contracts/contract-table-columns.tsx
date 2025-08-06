import { Plus, Edit, Trash2, Eye, Download, FileText } from 'lucide-react'
import { StatusBadge } from '../shared/status-badge'
import type { ContractWithClient } from '../../lib/services/contract-service'
import type { Column } from '../shared/data-table'

export function getContractTableColumns(
  onEdit: (contract: ContractWithClient) => void,
  onView: (contract: ContractWithClient) => void,
  onDelete: (contract: ContractWithClient) => void,
  onDeletePdf: (contractId: string) => void
): Column<ContractWithClient>[] {
  return [
    {
      key: 'contract_number',
      header: 'Contract #',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value || 'N/A'}</span>
      )
    },
    {
      key: 'client',
      header: 'Client',
      sortable: true,
      render: (_, contract) => (
        <div>
          <div className="font-medium text-gray-900">{contract.client.profile?.full_name || 'N/A'}</div>
          <div className="text-sm text-gray-500">{contract.client.profile?.email || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'service_type',
      header: 'Service Type',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">{value || 'N/A'}</span>
      )
    },
    {
      key: 'start_date',
      header: 'Start Date',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
    {
      key: 'end_date',
      header: 'End Date',
      sortable: true,
      render: (value) => (
        <span className="text-gray-600">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
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
      key: 'pdf_url',
      header: 'PDF',
      sortable: false,
      render: (value, contract) => (
        <div className="flex items-center space-x-2">
          {value ? (
            <>
              <button
                onClick={() => window.open(value, '_blank')}
                className="p-1 text-blue-600 hover:text-blue-800"
                title="View PDF"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = value
                  link.download = `contract-${contract.contract_number}.pdf`
                  link.click()
                }}
                className="p-1 text-green-600 hover:text-green-800"
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeletePdf(contract.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Delete PDF"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <span className="text-gray-400">
              <FileText className="h-4 w-4" />
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, contract) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(contract)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(contract)}
            className="p-1 text-green-600 hover:text-green-800"
            title="Edit Contract"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(contract)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Delete Contract"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ]
} 
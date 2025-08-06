import { useState, useMemo, useCallback } from 'react'
import { TableHeader } from './table-header'
import { TableBody } from './table-body'
import { TablePagination } from './table-pagination'
import { TableSortHeader } from './table-sort-header'

export interface Column<T> {
  key: keyof T
  header: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pagination?: boolean
  pageSize?: number
  className?: string
  onRowClick?: (row: T) => void
  isLoading?: boolean
  emptyMessage?: string | React.ReactNode
  showExport?: boolean
  onExport?: () => void
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchKeys = [],
  pagination = false,
  pageSize = 10,
  className,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No data available.',
  showExport = false,
  onExport
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm || searchKeys.length === 0) return data

    return data.filter(row =>
      searchKeys.some(key => {
        const value = row[key]
        if (value == null) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    )
  }, [data, searchTerm, searchKeys])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredData, sortKey, sortDirection])

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, pagination, currentPage, pageSize])

  const totalPages = Math.ceil(filteredData.length / pageSize)

  const handleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }, [sortKey, sortDirection])

  const handleRowClick = useCallback((row: T) => {
    if (onRowClick) {
      onRowClick(row)
    }
  }, [onRowClick])

  const handleExport = useCallback(() => {
    if (onExport) {
      onExport()
    }
  }, [onExport])

  return (
    <div className={`bg-white rounded-lg shadow ${className || ''}`}>
      <TableHeader
        searchable={searchable}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showExport={showExport}
        onExport={handleExport}
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <TableSortHeader
                  key={index}
                  column={column}
                  sortKey={sortKey}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              ))}
            </tr>
          </thead>
          
          <TableBody
            data={pagination ? paginatedData : sortedData}
            columns={columns}
            isLoading={isLoading}
            onRowClick={handleRowClick}
            emptyMessage={emptyMessage}
          />
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredData.length}
          pageSize={pageSize}
        />
      )}
    </div>
  )
} 
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TableSortHeaderProps<T> {
  column: {
    key: keyof T
    header: string
    sortable?: boolean
    width?: string
    align?: 'left' | 'center' | 'right'
  }
  sortKey: keyof T | null
  sortDirection: 'asc' | 'desc'
  onSort: (key: keyof T) => void
}

export function TableSortHeader<T extends Record<string, any>>({
  column,
  sortKey,
  sortDirection,
  onSort
}: TableSortHeaderProps<T>) {
  const isSorted = sortKey === column.key

  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
        column.align === 'center' ? 'text-center' :
        column.align === 'right' ? 'text-right' : 'text-left'
      } ${column.sortable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      style={column.width ? { width: column.width } : undefined}
      onClick={() => column.sortable && onSort(column.key)}
    >
      <div className={`flex items-center gap-1 ${column.sortable ? 'select-none' : ''}`}>
        <span>{column.header}</span>
        {column.sortable && isSorted && (
          sortDirection === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        )}
      </div>
    </th>
  )
} 
import { SkeletonLoader } from '../../routing/loading-spinner'

interface TableBodyProps<T> {
  data: T[]
  columns: Array<{
    key: keyof T
    header: string
    sortable?: boolean
    render?: (value: T[keyof T], row: T) => React.ReactNode
    width?: string
    align?: 'left' | 'center' | 'right'
  }>
  isLoading?: boolean
  onRowClick?: (row: T) => void
  emptyMessage?: string | React.ReactNode
}

export function TableBody<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  emptyMessage = 'No data available.'
}: TableBodyProps<T>) {
  if (isLoading) {
    return (
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index} className="border-b border-gray-200">
            {columns.map((column, colIndex) => (
              <td key={colIndex} className="px-6 py-4">
                <SkeletonLoader className="h-4 w-20" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    )
  }

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length} className="px-6 py-12">
            {typeof emptyMessage === 'string' ? (
              <div className="text-center text-gray-500">
                {emptyMessage}
              </div>
            ) : (
              emptyMessage
            )}
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <tbody>
      {data.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          onClick={() => onRowClick?.(row)}
          className={`border-b border-gray-200 ${
            onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
          }`}
        >
          {columns.map((column, colIndex) => (
            <td
              key={colIndex}
              className={`px-6 py-4 text-sm ${
                column.align === 'center' ? 'text-center' :
                column.align === 'right' ? 'text-right' : 'text-left'
              }`}
              style={column.width ? { width: column.width } : undefined}
            >
              {column.render
                ? column.render(row[column.key], row)
                : String(row[column.key] ?? '')
              }
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
} 
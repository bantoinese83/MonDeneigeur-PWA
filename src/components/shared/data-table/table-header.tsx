import { Search, Filter, Download } from 'lucide-react'

interface TableHeaderProps {
  searchable?: boolean
  searchTerm: string
  onSearchChange: (value: string) => void
  showExport?: boolean
  onExport?: () => void
  showFilters?: boolean
  onToggleFilters?: () => void
}

export function TableHeader({
  searchable = false,
  searchTerm,
  onSearchChange,
  showExport = false,
  onExport,
  showFilters = false,
  onToggleFilters
}: TableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border-b border-gray-200">
      {searchable && (
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
      
      <div className="flex gap-2">
        {showFilters && onToggleFilters && (
          <button
            onClick={onToggleFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        )}
        
        {showExport && onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        )}
      </div>
    </div>
  )
} 
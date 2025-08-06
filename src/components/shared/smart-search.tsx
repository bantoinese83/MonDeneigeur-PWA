import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  description?: string
  type: 'contract' | 'employee' | 'client' | 'route'
  url?: string
}

interface SmartSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>
  onResultSelect: (result: SearchResult) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function SmartSearch({
  onSearch,
  onResultSelect,
  placeholder = 'Search...',
  className = '',
  debounceMs = 300
}: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const searchResults = await onSearch(searchQuery)
      setResults(searchResults)
      setIsOpen(searchResults.length > 0)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value)
    }, debounceMs)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleResultSelect = (result: SearchResult) => {
    onResultSelect(result)
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true) }}
          onBlur={() => { setTimeout(() => setIsOpen(false), 150) }}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {isOpen && (
        <div
          ref={resultsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result, index) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleResultSelect(result)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                      index === selectedIndex ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">{result.title}</div>
                    {result.description && (
                      <div className="text-sm text-gray-500">{result.description}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : query && !isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  )
} 
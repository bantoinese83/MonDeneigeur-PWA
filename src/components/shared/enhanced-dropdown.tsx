import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface EnhancedDropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function EnhancedDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  size = 'md'
}: EnhancedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedOption = options.find(option => option.value === value)

  // Size configurations with optimal spacing
  const sizeConfig = {
    sm: {
      button: 'px-3 py-2 text-sm',
      menu: 'py-1',
      item: 'px-3 py-2 text-sm',
      itemSpacing: 'mb-1'
    },
    md: {
      button: 'px-4 py-2.5 text-sm',
      menu: 'py-1.5',
      item: 'px-4 py-2.5 text-sm',
      itemSpacing: 'mb-1.5'
    },
    lg: {
      button: 'px-5 py-3 text-base',
      menu: 'py-2',
      item: 'px-5 py-3 text-base',
      itemSpacing: 'mb-2'
    }
  }

  const config = sizeConfig[size]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          )
          break
        case 'Enter':
          event.preventDefault()
          if (highlightedIndex >= 0) {
            onChange(options[highlightedIndex].value)
            setIsOpen(false)
            setHighlightedIndex(-1)
          }
          break
        case 'Escape':
          setIsOpen(false)
          setHighlightedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, highlightedIndex, options, onChange])

  const handleOptionClick = (option: DropdownOption) => {
    onChange(option.value)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setHighlightedIndex(-1)
    }
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between
          ${config.button}
          border border-gray-300 rounded-md
          bg-white text-gray-900
          hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-all duration-200
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          {selectedOption?.icon && (
            <span className="mr-2 text-gray-500">{selectedOption.icon}</span>
          )}
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className={`${config.menu} max-h-60 overflow-auto`}>
            {options.map((option, index) => (
              <div
                key={option.value}
                className={`
                  ${config.item} ${config.itemSpacing}
                  flex items-center justify-between
                  cursor-pointer
                  ${highlightedIndex === index 
                    ? 'bg-blue-50 text-blue-900' 
                    : 'hover:bg-gray-50 text-gray-900'
                  }
                  transition-colors duration-150
                `}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={option.value === value}
              >
                <div className="flex items-center">
                  {option.icon && (
                    <span className="mr-2 text-gray-500">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                </div>
                {option.value === value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 
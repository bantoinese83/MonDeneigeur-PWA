import { useState, useRef, useEffect } from 'react'
import { ChevronRight, ChevronDown, Info } from 'lucide-react'

interface ProgressiveDisclosureProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  variant?: 'default' | 'card' | 'minimal'
  className?: string
  showIcon?: boolean
  icon?: React.ReactNode
}

export function ProgressiveDisclosure({
  title,
  children,
  defaultExpanded = false,
  variant = 'default',
  className = '',
  showIcon = true,
  icon
}: ProgressiveDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [isAnimating, setIsAnimating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? contentRef.current.scrollHeight : 0)
    }
  }, [isExpanded, children])

  const handleToggle = () => {
    setIsAnimating(true)
    setIsExpanded(!isExpanded)
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return {
          container: 'border border-gray-200 rounded-lg bg-white shadow-sm',
          header: 'px-4 py-3 border-b border-gray-100',
          content: 'px-4 py-3'
        }
      case 'minimal':
        return {
          container: '',
          header: 'py-2',
          content: 'pt-2'
        }
      default:
        return {
          container: 'border-b border-gray-200 pb-2',
          header: 'py-2',
          content: 'pt-2'
        }
    }
  }

  const classes = getVariantClasses()

  return (
    <div className={`${classes.container} ${className}`}>
      <button
        onClick={handleToggle}
        className={`
          w-full flex items-center justify-between
          ${classes.header}
          text-left transition-colors duration-200
          hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
          ${variant === 'card' ? 'rounded-t-lg' : ''}
        `}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-2">
          {showIcon && (
            <div className="flex items-center justify-center w-5 h-5">
              {icon || (
                <ChevronRight 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`} 
                />
              )}
            </div>
          )}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        
        {variant === 'card' && (
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`} 
          />
        )}
      </button>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${classes.content}
        `}
        style={{ height: isAnimating ? `${contentHeight}px` : (isExpanded ? 'auto' : '0px') }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Specialized components for common use cases
export function InfoDisclosure({ 
  title, 
  children, 
  ...props 
}: Omit<ProgressiveDisclosureProps, 'icon' | 'showIcon'>) {
  return (
    <ProgressiveDisclosure
      title={title}
      icon={<Info className="w-4 h-4 text-blue-500" />}
      variant="minimal"
      {...props}
    >
      {children}
    </ProgressiveDisclosure>
  )
}

export function CardDisclosure({ 
  title, 
  children, 
  ...props 
}: Omit<ProgressiveDisclosureProps, 'variant'>) {
  return (
    <ProgressiveDisclosure
      title={title}
      variant="card"
      {...props}
    >
      {children}
    </ProgressiveDisclosure>
  )
} 
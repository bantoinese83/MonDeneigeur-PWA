import type { LucideIcon } from 'lucide-react'
import { Spinner3D } from './3d-spinner'
import React from 'react'

interface EmptyStateProps {
  icon?: LucideIcon | React.ReactElement
  title: string
  description: string
  actionText?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="text-center">
        {icon ? (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
            {React.isValidElement(icon) ? (
              icon
            ) : (
              <div className="h-8 w-8 text-gray-400">
                {React.createElement(icon as LucideIcon, { className: 'h-8 w-8 text-gray-400' })}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Spinner3D size="md" />
          </div>
        )}
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
        
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  )
}

// Specialized empty state components
export function NoDataEmptyState({ 
  title = 'No data available',
  description = 'There are no items to display at the moment.',
  actionText,
  onAction,
  className = ''
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionText={actionText}
      onAction={onAction}
      className={className}
    />
  )
}

export function NoResultsEmptyState({ 
  searchTerm,
  actionText,
  onAction,
  className = ''
}: {
  searchTerm?: string
  actionText?: string
  onAction?: () => void
  className?: string
}) {
  return (
    <EmptyState
      title="No results found"
      description={searchTerm 
        ? `No results found for "${searchTerm}". Try adjusting your search terms.`
        : 'No results match your current filters.'
      }
      actionText={actionText}
      onAction={onAction}
      className={className}
    />
  )
}

export function ErrorEmptyState({ 
  title = 'Something went wrong',
  description = 'We encountered an error while loading the data.',
  actionText,
  onAction,
  className = ''
}: Omit<EmptyStateProps, 'icon'>) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionText={actionText}
      onAction={onAction}
      className={className}
    />
  )
}

export function LoadingEmptyState({ 
  title = 'Loading...',
  description = 'Please wait while we load your data.',
  className = ''
}: Omit<EmptyStateProps, 'icon' | 'actionText' | 'onAction'>) {
  return (
    <EmptyState
      title={title}
      description={description}
      className={className}
    />
  )
} 
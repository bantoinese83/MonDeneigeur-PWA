import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import clsx from 'clsx'

export interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  acceptedTypes?: string[]
  maxSize?: number // in bytes
  multiple?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
  selectedFile?: File | null
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  acceptedTypes = [],
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  disabled = false,
  className,
  placeholder = 'Drop files here or click to browse',
  selectedFile
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024))
      return `File size must be less than ${maxSizeMB}MB`
    }

    return null
  }, [acceptedTypes, maxSize])

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0] // Only handle first file for now
    const validationError = validateFile(file)

    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    onFileSelect(file)
  }, [validateFile, onFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return

    const files = e.dataTransfer.files
    handleFileSelect(files)
  }, [disabled, handleFileSelect])

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input value to allow selecting the same file again
    if (e.target) {
      e.target.value = ''
    }
  }, [handleFileSelect])

  const handleRemove = useCallback(() => {
    if (onFileRemove) {
      onFileRemove()
    }
  }, [onFileRemove])

  return (
    <div className={clsx('w-full', className)}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Area */}
      {!selectedFile ? (
        <div
          className={clsx(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            isDragOver && !disabled
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400',
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">{placeholder}</p>
          {acceptedTypes.length > 0 && (
            <p className="text-xs text-gray-500">
              Accepted types: {acceptedTypes.join(', ')}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Max size: {Math.round(maxSize / (1024 * 1024))}MB
          </p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="p-1 hover:bg-gray-100 rounded-full"
              disabled={disabled}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  )
} 
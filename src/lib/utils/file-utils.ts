import { formatFileSize } from './number-utils'

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const isImageFile = (file: File): boolean => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return imageTypes.includes(file.type)
}

export const isPdfFile = (file: File): boolean => {
  return file.type === 'application/pdf'
}

export const validateFile = (file: File, maxSize: number, acceptedTypes: string[]): string | null => {
  if (file.size > maxSize) {
    return `File size must be less than ${formatFileSize(maxSize)}`
  }
  
  if (!acceptedTypes.includes(file.type)) {
    return `File type must be one of: ${acceptedTypes.join(', ')}`
  }
  
  return null
} 
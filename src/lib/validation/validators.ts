import { z } from 'zod'

// Validation helper functions
export const validateFile = (file: File, maxSize: number, acceptedTypes: string[]): string | null => {
  if (file.size > maxSize) {
    return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`
  }
  
  if (!acceptedTypes.includes(file.type)) {
    return `File type must be one of: ${acceptedTypes.join(', ')}`
  }
  
  return null
}

export const validateDateRange = (startDate: string, endDate: string): string | null => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (start >= end) {
    return 'End date must be after start date'
  }
  
  return null
}

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`
  }
  return null
}

export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Invalid email address'
  }
  return null
}

export const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  if (!phoneRegex.test(phone)) {
    return 'Invalid phone number'
  }
  return null
}

// Form validation hook
export const useFormValidation = <T extends z.ZodType>(schema: T) => {
  const validate = (data: z.infer<T>): { isValid: boolean; errors: Record<string, string> } => {
    try {
      schema.parse(data)
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const field = err.path.join('.')
          errors[field] = err.message
        })
        return { isValid: false, errors }
      }
      return { isValid: false, errors: { general: 'Validation failed' } }
    }
  }

  return { validate }
} 
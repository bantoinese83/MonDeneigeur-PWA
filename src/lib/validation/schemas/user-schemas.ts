import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
export const phoneSchema = z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number')
export const dateSchema = z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date')

// User validation schemas
export const userProfileSchema = z.object({
  email: emailSchema,
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['superadmin', 'admin', 'employee', 'client']),
  company_id: z.string().uuid().optional()
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['superadmin', 'admin', 'employee', 'client']),
  company_id: z.string().uuid().optional()
}) 
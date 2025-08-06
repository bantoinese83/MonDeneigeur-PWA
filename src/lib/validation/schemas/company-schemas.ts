import { z } from 'zod'
import { emailSchema, phoneSchema } from './user-schemas'

// Company validation schemas
export const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  address: z.string().optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional()
}) 
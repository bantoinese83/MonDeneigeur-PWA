import { z } from 'zod'
import { dateSchema } from './user-schemas'

// Employee validation schemas
export const employeeSchema = z.object({
  profile_id: z.string().uuid('Invalid profile ID format'),
  company_id: z.string().uuid('Invalid company ID format'),
  position: z.string().min(1, 'Position is required').max(100, 'Position too long'),
  hire_date: dateSchema,
  salary: z.number().positive('Salary must be positive').optional(),
  status: z.enum(['active', 'inactive', 'terminated'], {
    errorMap: () => ({ message: 'Status must be active, inactive, or terminated' })
  })
}) 
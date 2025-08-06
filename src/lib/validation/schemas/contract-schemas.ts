import { z } from 'zod'
import { dateSchema } from './user-schemas'

// Contract validation schemas
export const contractSchema = z.object({
  company_id: z.string().uuid(),
  client_id: z.string().uuid(),
  contract_number: z.string().optional(),
  service_type: z.string().min(1, 'Service type is required'),
  start_date: dateSchema,
  end_date: dateSchema,
  terms: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled'])
}) 
import { z } from 'zod'
import { dateSchema } from './user-schemas'

// Route validation schemas
export const routeSchema = z.object({
  company_id: z.string().uuid(),
  employee_id: z.string().uuid(),
  route_name: z.string().min(1, 'Route name is required'),
  description: z.string().optional(),
  assigned_date: dateSchema,
  status: z.enum(['pending', 'in_progress', 'completed'])
}) 
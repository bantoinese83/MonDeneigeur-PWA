import { z } from 'zod'

// Client validation schemas
export const clientSchema = z.object({
  company_id: z.string().uuid(),
  profile_id: z.string().uuid(),
  address: z.string().min(1, 'Address is required'),
  service_area: z.string().optional(),
  contact_preferences: z.record(z.any()).optional()
}) 
import { z } from 'zod'
import { dateSchema } from './user-schemas'

// Service visit validation schemas
export const serviceVisitSchema = z.object({
  route_id: z.string().uuid(),
  client_id: z.string().uuid(),
  employee_id: z.string().uuid(),
  scheduled_date: dateSchema,
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
  gps_coordinates: z.object({
    latitude: z.number(),
    longitude: z.number()
  }).optional()
})

// GPS validation schemas
export const gpsLocationSchema = z.object({
  employee_id: z.string().uuid(),
  visit_id: z.string().uuid().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive().optional(),
  timestamp: z.string().optional()
}) 
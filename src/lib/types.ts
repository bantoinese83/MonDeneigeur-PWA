// Re-export database types for better module resolution
export type { Database } from './database.types'
export type { 
  UserRole, 
  Company, 
  Profile, 
  Employee, 
  Client, 
  Contract, 
  Route, 
  ServiceVisit, 
  GpsLog, 
  AuditLog 
} from './database.types'

// Re-export route types
export type { RouteConfig } from '../types/routes' 
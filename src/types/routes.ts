import { ComponentType } from 'react'
import type { UserRole } from '../lib/database.types'

export interface RouteConfig {
  path: string
  element?: ComponentType
  allowedRoles?: UserRole[]
  redirectIfAuthenticated?: string
  redirect?: string
} 
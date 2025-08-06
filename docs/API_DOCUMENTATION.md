# MonDeneigeur PWA - API Documentation

This document provides comprehensive API documentation for the MonDeneigeur PWA application, including Supabase integration, service layer, and external APIs.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Service Layer](#service-layer)
- [External APIs](#external-apis)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Security](#security)

## 🔐 Authentication

### Supabase Auth Integration

The application uses Supabase Auth for authentication with the following features:

#### User Registration
```typescript
// Registration with role assignment
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'employee'
    }
  }
})
```

#### User Login
```typescript
// Standard login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
})
```

#### Session Management
```typescript
// Get current session
const { data: { session } } = await supabase.auth.getSession()

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session)
})
```

#### Role-Based Access Control
```typescript
// Check user role
const userRole = session?.user?.user_metadata?.role

// Role validation
const allowedRoles = ['admin', 'employee']
const hasAccess = allowedRoles.includes(userRole)
```

## 🗄️ Database Schema

### Core Tables

#### Companies
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Profiles
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('superadmin', 'admin', 'employee', 'client')),
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Employees
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  position TEXT,
  hire_date DATE,
  salary DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Clients
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  address TEXT,
  service_area TEXT,
  contact_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Contracts
```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  contract_number TEXT UNIQUE,
  service_type TEXT,
  start_date DATE,
  end_date DATE,
  terms TEXT,
  pdf_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Routes
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  route_name TEXT,
  description TEXT,
  assigned_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Service Visits
```sql
CREATE TABLE service_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  scheduled_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  photos JSONB,
  gps_coordinates POINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### GPS Logs
```sql
CREATE TABLE gps_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES service_visits(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  accuracy DECIMAL(5,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Audit Logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Service Layer

### Base Service

All services extend the BaseService class for common CRUD operations:

```typescript
export abstract class BaseService {
  protected table: string
  protected supabase: SupabaseClient

  constructor(table: string) {
    this.table = table
    this.supabase = supabase
  }

  async getAll(filters?: Record<string, any>): Promise<any[]> {
    let query = this.supabase.from(this.table).select('*')
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }
    
    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data
  }

  async getById(id: string): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  async create(record: Record<string, any>): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert(record)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  async update(id: string, updates: Record<string, any>): Promise<any> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id)
    
    if (error) throw new Error(error.message)
  }
}
```

### Company Service

```typescript
export class CompanyService extends BaseService {
  constructor() {
    super('companies')
  }

  async getCompanyStats(companyId: string): Promise<CompanyStats> {
    const { data, error } = await this.supabase
      .rpc('get_company_stats', { company_id: companyId })
    
    if (error) throw new Error(error.message)
    return data
  }

  async getEmployees(companyId: string): Promise<Employee[]> {
    const { data, error } = await this.supabase
      .from('employees')
      .select(`
        *,
        profiles (*)
      `)
      .eq('company_id', companyId)
    
    if (error) throw new Error(error.message)
    return data
  }
}
```

### Employee Service

```typescript
export class EmployeeService extends BaseService {
  constructor() {
    super('employees')
  }

  async getEmployeeRoutes(employeeId: string): Promise<Route[]> {
    const { data, error } = await this.supabase
      .from('routes')
      .select(`
        *,
        service_visits (*)
      `)
      .eq('employee_id', employeeId)
    
    if (error) throw new Error(error.message)
    return data
  }

  async startRoute(routeId: string): Promise<void> {
    const { error } = await this.supabase
      .from('routes')
      .update({ status: 'in_progress' })
      .eq('id', routeId)
    
    if (error) throw new Error(error.message)
  }
}
```

### GPS Service

```typescript
export class GpsService extends BaseService {
  constructor() {
    super('gps_logs')
  }

  async logLocation(employeeId: string, visitId: string, coords: {
    latitude: number
    longitude: number
    accuracy: number
  }): Promise<void> {
    const { error } = await this.supabase
      .from('gps_logs')
      .insert({
        employee_id: employeeId,
        visit_id: visitId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy
      })
    
    if (error) throw new Error(error.message)
  }

  async getEmployeeLocation(employeeId: string): Promise<GpsLog | null> {
    const { data, error } = await this.supabase
      .from('gps_logs')
      .select('*')
      .eq('employee_id', employeeId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data
  }
}
```

## 🌐 External APIs

### OpenWeather API

```typescript
export class WeatherService {
  private apiKey: string
  private baseUrl = 'https://api.openweathermap.org/data/2.5'

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    return response.json()
  }

  async getWeatherForecast(lat: number, lon: number): Promise<WeatherForecast[]> {
    const response = await fetch(
      `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.list
  }
}
```

### Google Maps API

```typescript
export class MapsService {
  private apiKey: string

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }

  getDirectionsUrl(origin: string, destination: string): string {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`
  }

  async geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
    )
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }
    
    const data = await response.json()
    const location = data.results[0]?.geometry?.location
    
    if (!location) {
      throw new Error('Address not found')
    }
    
    return location
  }
}
```

## ❌ Error Handling

### Error Types

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, context)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'AUTHORIZATION_ERROR', 403)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404)
  }
}
```

### Error Handling in Services

```typescript
export class ServiceErrorHandler {
  static handle(error: any): never {
    if (error instanceof AppError) {
      throw error
    }
    
    if (error.code === 'PGRST116') {
      throw new NotFoundError('Resource')
    }
    
    if (error.code === 'PGRST301') {
      throw new ValidationError('Invalid data provided')
    }
    
    if (error.code === 'PGRST302') {
      throw new AuthorizationError()
    }
    
    // Log unexpected errors
    console.error('Unexpected error:', error)
    throw new AppError('An unexpected error occurred', 'INTERNAL_ERROR')
  }
}
```

## 🚦 Rate Limiting

### API Rate Limits

- **Supabase**: 1000 requests per minute per user
- **OpenWeather API**: 60 calls per minute
- **Google Maps API**: 1000 requests per day

### Implementation

```typescript
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private windowMs = 60000 // 1 minute
  private maxRequests = 100

  isAllowed(userId: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    
    // Remove old requests
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    )
    
    if (recentRequests.length >= this.maxRequests) {
      return false
    }
    
    recentRequests.push(now)
    this.requests.set(userId, recentRequests)
    return true
  }
}
```

## 🔒 Security

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for employees
CREATE POLICY "Employees can view own data" ON employees
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Admins can manage company employees" ON employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
      AND profiles.company_id = employees.company_id
    )
  );
```

### Input Validation

```typescript
import { z } from 'zod'

export const EmployeeSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  hire_date: z.date().optional(),
  salary: z.number().positive('Salary must be positive').optional(),
  status: z.enum(['active', 'inactive', 'terminated']).default('active')
})

export const ContractSchema = z.object({
  contract_number: z.string().min(1, 'Contract number is required'),
  service_type: z.string().min(1, 'Service type is required'),
  start_date: z.date(),
  end_date: z.date(),
  terms: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft')
})
```

### Data Sanitization

```typescript
export class DataSanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000) // Limit length
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\(\)\s]/g, '')
  }
}
```

## 📊 Monitoring & Analytics

### Performance Metrics

```typescript
export class PerformanceMonitor {
  static trackApiCall(endpoint: string, duration: number, status: number) {
    // Send to monitoring service
    if (import.meta.env.PROD) {
      // Track in Sentry or other monitoring service
    }
  }

  static trackUserAction(action: string, properties?: Record<string, any>) {
    // Track user interactions
    if (import.meta.env.PROD) {
      // Send to analytics service
    }
  }
}
```

### Audit Logging

```typescript
export class AuditLogger {
  static async logAction(
    userId: string,
    action: string,
    tableName: string,
    recordId: string,
    oldValues?: any,
    newValues?: any
  ) {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: 'client_ip', // Get from request
        user_agent: 'client_user_agent' // Get from request
      })
    
    if (error) {
      console.error('Audit logging failed:', error)
    }
  }
}
```

## 📝 API Response Format

### Standard Response

```typescript
interface ApiResponse<T> {
  data: T
  message?: string
  timestamp: string
  success: boolean
}

interface ApiError {
  error: string
  code: string
  statusCode: number
  timestamp: string
  details?: Record<string, any>
}
```

### Example Responses

#### Success Response
```json
{
  "data": {
    "id": "uuid",
    "name": "Employee Name",
    "position": "Driver",
    "status": "active"
  },
  "message": "Employee created successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "success": true
}
```

#### Error Response
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

---

**MonDeneigeur PWA** - Comprehensive API documentation for production-ready applications. 
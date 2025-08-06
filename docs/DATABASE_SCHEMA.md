# MonDeneigeur PWA - Database Schema Documentation

This document provides a comprehensive overview of the MonDeneigeur PWA database schema, including table structures, relationships, security policies, and data flow.

## 📋 Table of Contents

- [Overview](#overview)
- [Database Tables](#database-tables)
- [Relationships](#relationships)
- [Security Policies](#security-policies)
- [Indexes](#indexes)
- [Triggers](#triggers)
- [Functions](#functions)
- [Data Flow](#data-flow)
- [Migration Guide](#migration-guide)

## Overview

The MonDeneigeur PWA uses Supabase (PostgreSQL) as its database backend with the following key features:

- **Row Level Security (RLS)**: Database-level access control
- **Multi-tenant Architecture**: Company-based data isolation
- **Audit Logging**: Comprehensive operation tracking
- **Type Safety**: Full TypeScript integration
- **Real-time Features**: Live data synchronization

## Database Tables

### 1. Companies Table

**Purpose**: Stores company information for multi-tenant architecture

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `name`: Company name (required)
- `address`: Company address
- `phone`: Contact phone number
- `email`: Contact email address
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 2. Profiles Table

**Purpose**: User profiles with role-based access control

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

**Fields**:
- `id`: References Supabase auth.users (UUID)
- `email`: User email address (required)
- `full_name`: User's full name
- `avatar_url`: Profile picture URL
- `role`: User role (superadmin, admin, employee, client)
- `company_id`: Associated company (for multi-tenant)
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 3. Employees Table

**Purpose**: Employee records with company association

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

**Fields**:
- `id`: Unique identifier (UUID)
- `profile_id`: Associated user profile
- `company_id`: Associated company
- `position`: Job position/title
- `hire_date`: Employment start date
- `salary`: Annual salary (decimal)
- `status`: Employment status
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 4. Clients Table

**Purpose**: Client records with company association

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

**Fields**:
- `id`: Unique identifier (UUID)
- `company_id`: Associated company
- `profile_id`: Associated user profile
- `address`: Client address
- `service_area`: Service area description
- `contact_preferences`: JSON preferences for notifications
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 5. Contracts Table

**Purpose**: Service contracts with PDF storage

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

**Fields**:
- `id`: Unique identifier (UUID)
- `company_id`: Associated company
- `client_id`: Associated client
- `contract_number`: Unique contract number
- `service_type`: Type of service
- `start_date`: Contract start date
- `end_date`: Contract end date
- `terms`: Contract terms and conditions
- `pdf_url`: PDF contract file URL
- `status`: Contract status
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 6. Routes Table

**Purpose**: Route assignments for employees

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

**Fields**:
- `id`: Unique identifier (UUID)
- `company_id`: Associated company
- `employee_id`: Assigned employee
- `route_name`: Route name/identifier
- `description`: Route description
- `assigned_date`: Date route was assigned
- `status`: Route status
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 7. Service Visits Table

**Purpose**: Service visit tracking with GPS and photos

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

**Fields**:
- `id`: Unique identifier (UUID)
- `route_id`: Associated route
- `client_id`: Associated client
- `employee_id`: Assigned employee
- `scheduled_date`: Scheduled visit date
- `completed_at`: Completion timestamp
- `status`: Visit status
- `notes`: Visit notes/comments
- `photos`: JSON array of photo URLs
- `gps_coordinates`: GPS coordinates (PostgreSQL POINT)
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 8. GPS Logs Table

**Purpose**: GPS location tracking for employees

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

**Fields**:
- `id`: Unique identifier (UUID)
- `employee_id`: Associated employee
- `visit_id`: Associated service visit
- `latitude`: GPS latitude (decimal)
- `longitude`: GPS longitude (decimal)
- `accuracy`: GPS accuracy in meters
- `timestamp`: GPS reading timestamp
- `created_at`: Record creation timestamp

### 9. Notifications Table

**Purpose**: In-app notifications for users

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

**Fields**:
- `id`: Unique identifier (UUID)
- `user_id`: Associated user
- `title`: Notification title
- `message`: Notification message
- `type`: Notification type
- `is_read`: Read status
- `action_url`: Action URL (optional)
- `metadata`: Additional JSON data
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### 10. Audit Logs Table

**Purpose**: Comprehensive audit trail for all operations

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

**Fields**:
- `id`: Unique identifier (UUID)
- `user_id`: User who performed the action
- `action`: Action type (INSERT, UPDATE, DELETE)
- `table_name`: Affected table
- `record_id`: Affected record ID
- `old_values`: Previous values (JSON)
- `new_values`: New values (JSON)
- `ip_address`: User's IP address
- `user_agent`: User's browser/device
- `created_at`: Record creation timestamp

## Relationships

### Entity Relationship Diagram

```
companies (1) ←→ (N) profiles
companies (1) ←→ (N) employees
companies (1) ←→ (N) clients
companies (1) ←→ (N) contracts
companies (1) ←→ (N) routes

profiles (1) ←→ (1) employees
profiles (1) ←→ (1) clients

employees (1) ←→ (N) routes
employees (1) ←→ (N) service_visits
employees (1) ←→ (N) gps_logs

clients (1) ←→ (N) contracts
clients (1) ←→ (N) service_visits

routes (1) ←→ (N) service_visits

service_visits (1) ←→ (N) gps_logs

profiles (1) ←→ (N) notifications
profiles (1) ←→ (N) audit_logs
```

### Key Relationships

1. **Company-Centric**: All business data is associated with a company
2. **User-Profile**: Each user has one profile with role-based access
3. **Employee/Client**: Users can be either employees or clients
4. **Service Flow**: Routes → Service Visits → GPS Logs
5. **Audit Trail**: All operations are logged for compliance

## Security Policies

### Row Level Security (RLS)

All tables have RLS enabled with role-based policies:

#### Companies Policy
```sql
-- Superadmin can manage all companies
CREATE POLICY "Superadmin can manage companies" ON companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'superadmin'
    )
  );
```

#### Profiles Policy
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins can manage company profiles
CREATE POLICY "Admins can manage company profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'admin'
      AND p.company_id = profiles.company_id
    )
  );
```

#### Employees Policy
```sql
-- Employees can view own data
CREATE POLICY "Employees can view own data" ON employees
  FOR SELECT USING (auth.uid() = profile_id);

-- Admins can manage company employees
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

### Data Access Patterns

1. **Superadmin**: Access to all data across all companies
2. **Admin**: Access to company-specific data only
3. **Employee**: Access to own data and assigned routes/visits
4. **Client**: Access to own data and contracts

## Indexes

### Performance Indexes

```sql
-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_company_id ON profiles(company_id);

-- Employees indexes
CREATE INDEX idx_employees_profile_id ON employees(profile_id);
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_status ON employees(status);

-- Clients indexes
CREATE INDEX idx_clients_company_id ON clients(company_id);
CREATE INDEX idx_clients_profile_id ON clients(profile_id);

-- Contracts indexes
CREATE INDEX idx_contracts_company_id ON contracts(company_id);
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_status ON contracts(status);

-- Routes indexes
CREATE INDEX idx_routes_company_id ON routes(company_id);
CREATE INDEX idx_routes_employee_id ON routes(employee_id);
CREATE INDEX idx_routes_status ON routes(status);

-- Service visits indexes
CREATE INDEX idx_service_visits_route_id ON service_visits(route_id);
CREATE INDEX idx_service_visits_employee_id ON service_visits(employee_id);
CREATE INDEX idx_service_visits_status ON service_visits(status);
CREATE INDEX idx_service_visits_scheduled_date ON service_visits(scheduled_date);

-- GPS logs indexes
CREATE INDEX idx_gps_logs_employee_id ON gps_logs(employee_id);
CREATE INDEX idx_gps_logs_visit_id ON gps_logs(visit_id);
CREATE INDEX idx_gps_logs_timestamp ON gps_logs(timestamp);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## Triggers

### Audit Trigger

```sql
-- Function to handle audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to all tables
CREATE TRIGGER audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON companies
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### Updated At Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Functions

### Company Statistics Function

```sql
CREATE OR REPLACE FUNCTION get_company_stats(company_id UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_employees', (SELECT COUNT(*) FROM employees WHERE employees.company_id = $1),
    'active_employees', (SELECT COUNT(*) FROM employees WHERE employees.company_id = $1 AND employees.status = 'active'),
    'total_clients', (SELECT COUNT(*) FROM clients WHERE clients.company_id = $1),
    'active_contracts', (SELECT COUNT(*) FROM contracts WHERE contracts.company_id = $1 AND contracts.status = 'active'),
    'today_visits', (SELECT COUNT(*) FROM service_visits sv JOIN routes r ON sv.route_id = r.id WHERE r.company_id = $1 AND sv.scheduled_date = CURRENT_DATE),
    'completed_visits', (SELECT COUNT(*) FROM service_visits sv JOIN routes r ON sv.route_id = r.id WHERE r.company_id = $1 AND sv.status = 'completed')
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Employee Location Function

```sql
CREATE OR REPLACE FUNCTION get_employee_location(employee_id UUID)
RETURNS JSON AS $$
DECLARE
  location JSON;
BEGIN
  SELECT json_build_object(
    'latitude', gl.latitude,
    'longitude', gl.longitude,
    'accuracy', gl.accuracy,
    'timestamp', gl.timestamp
  ) INTO location
  FROM gps_logs gl
  WHERE gl.employee_id = $1
  ORDER BY gl.timestamp DESC
  LIMIT 1;
  
  RETURN location;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Data Flow

### 1. User Registration Flow

```
1. User registers → auth.users created
2. Profile trigger → profiles record created
3. Role assignment → company association
4. Employee/Client record → business entity created
```

### 2. Service Visit Flow

```
1. Admin creates route → routes record
2. Route assigned to employee → employee notification
3. Employee starts route → GPS tracking begins
4. Service visit completed → photos and notes added
5. GPS logs stored → location history maintained
```

### 3. Audit Flow

```
1. Any CRUD operation → audit trigger fired
2. Old/new values captured → audit_logs record
3. User context stored → IP, user agent, timestamp
4. Compliance reporting → audit trail available
```

## Migration Guide

### Adding New Tables

1. **Create table with RLS**:
```sql
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- other fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
```

2. **Add RLS policies**:
```sql
CREATE POLICY "Appropriate policy name" ON new_table
  FOR ALL USING (your_condition);
```

3. **Add audit trigger**:
```sql
CREATE TRIGGER audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON new_table
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

4. **Add updated_at trigger**:
```sql
CREATE TRIGGER update_new_table_updated_at
  BEFORE UPDATE ON new_table
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

5. **Add indexes**:
```sql
CREATE INDEX idx_new_table_relevant_field ON new_table(relevant_field);
```

### Database Migrations

Use Supabase migrations for schema changes:

```bash
# Create new migration
supabase migration new add_new_table

# Apply migrations
supabase db push

# Reset database (development only)
supabase db reset
```

---

**MonDeneigeur PWA** - Comprehensive database schema documentation for production-ready applications. 
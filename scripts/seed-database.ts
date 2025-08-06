import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/database.types'

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://erbzmoqoocmptkbflibr.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// Test data for seeding
const testUsers = [
  {
    email: 'admin@test.com',
    password: '123456789',
    full_name: 'Admin User',
    role: 'admin' as const
  },
  {
    email: 'client@test.com', 
    password: '123456789',
    full_name: 'Client User',
    role: 'client' as const
  },
  {
    email: 'employee@test.com',
    password: '123456789', 
    full_name: 'Employee User',
    role: 'employee' as const
  }
]

const testCompany = {
  name: 'Monde Neigeur Test Company',
  address: '123 Test Street, Montreal, QC',
  phone: '+1-514-555-0123',
  email: 'info@mondeneigeur-test.com'
}

const testEmployees = [
  {
    position: 'Snow Removal Specialist',
    hire_date: '2024-01-15',
    salary: 45000,
    status: 'active' as const
  },
  {
    position: 'Route Manager',
    hire_date: '2024-02-01', 
    salary: 55000,
    status: 'active' as const
  }
]

const testClients = [
  {
    address: '456 Client Street, Montreal, QC',
    service_area: 'Downtown Montreal',
    contact_preferences: { email: true, sms: false, phone: true }
  },
  {
    address: '789 Business Ave, Montreal, QC',
    service_area: 'West Island',
    contact_preferences: { email: true, sms: true, phone: false }
  }
]

const testContracts = [
  {
    contract_number: 'CON-2024-001',
    service_type: 'Residential Snow Removal',
    start_date: '2024-11-01',
    end_date: '2025-04-30',
    terms: 'Weekly snow removal service',
    status: 'active' as const
  },
  {
    contract_number: 'CON-2024-002', 
    service_type: 'Commercial Snow Removal',
    start_date: '2024-11-01',
    end_date: '2025-04-30',
    terms: 'Daily snow removal service',
    status: 'active' as const
  }
]

const testRoutes = [
  {
    route_name: 'Downtown Route A',
    description: 'Residential snow removal route in downtown area',
    assigned_date: '2024-11-01',
    status: 'pending' as const
  },
  {
    route_name: 'West Island Route B',
    description: 'Commercial snow removal route in west island',
    assigned_date: '2024-11-01', 
    status: 'in_progress' as const
  }
]

const testServiceVisits = [
  {
    scheduled_date: '2024-11-15T08:00:00Z',
    status: 'pending' as const,
    notes: 'Regular snow removal service',
    gps_coordinates: '45.5017,-73.5673'
  },
  {
    scheduled_date: '2024-11-16T09:00:00Z',
    status: 'completed' as const,
    notes: 'Snow removal completed successfully',
    gps_coordinates: '45.5017,-73.5673',
    completed_at: '2024-11-16T10:30:00Z'
  }
]

async function clearDatabase() {
  console.log('🗑️  Clearing database...')
  
  // Clear all tables in reverse dependency order
  const tables = [
    'gps_logs',
    'audit_logs', 
    'service_visits',
    'routes',
    'contracts',
    'clients',
    'employees',
    'profiles',
    'companies'
  ]
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Keep system records if any
      
      if (error) {
        console.error(`Error clearing ${table}:`, error)
      } else {
        console.log(`✅ Cleared ${table}`)
      }
    } catch (error) {
      console.error(`Error clearing ${table}:`, error)
    }
  }
}

async function createTestUsers() {
  console.log('👥 Creating test users...')
  
  const createdUsers = []
  
  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      })
      
      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError)
        continue
      }
      
      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        })
        .select()
        .single()
      
      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError)
        continue
      }
      
      createdUsers.push({ auth: authData.user, profile: profileData })
      console.log(`✅ Created user: ${user.email} (${user.role})`)
      
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error)
    }
  }
  
  return createdUsers
}

async function createTestCompany() {
  console.log('🏢 Creating test company...')
  
  const { data, error } = await supabase
    .from('companies')
    .insert(testCompany)
    .select()
    .single()
  
  if (error) {
    console.error('Error creating company:', error)
    throw error
  }
  
  console.log(`✅ Created company: ${data.name}`)
  return data
}

async function createTestEmployees(companyId: string, users: any[]) {
  console.log('👷 Creating test employees...')
  
  const employeeUsers = users.filter(u => u.profile.role === 'employee')
  const createdEmployees = []
  
  for (let i = 0; i < employeeUsers.length; i++) {
    const user = employeeUsers[i]
    const employeeData = testEmployees[i] || testEmployees[0]
    
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert({
          profile_id: user.profile.id,
          company_id: companyId,
          ...employeeData
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating employee for ${user.profile.email}:`, error)
        continue
      }
      
      createdEmployees.push(data)
      console.log(`✅ Created employee: ${user.profile.full_name}`)
      
    } catch (error) {
      console.error(`Error creating employee for ${user.profile.email}:`, error)
    }
  }
  
  return createdEmployees
}

async function createTestClients(companyId: string, users: any[]) {
  console.log('👤 Creating test clients...')
  
  const clientUsers = users.filter(u => u.profile.role === 'client')
  const createdClients = []
  
  for (let i = 0; i < clientUsers.length; i++) {
    const user = clientUsers[i]
    const clientData = testClients[i] || testClients[0]
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          profile_id: user.profile.id,
          company_id: companyId,
          ...clientData
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating client for ${user.profile.email}:`, error)
        continue
      }
      
      createdClients.push(data)
      console.log(`✅ Created client: ${user.profile.full_name}`)
      
    } catch (error) {
      console.error(`Error creating client for ${user.profile.email}:`, error)
    }
  }
  
  return createdClients
}

async function createTestContracts(companyId: string, clients: any[]) {
  console.log('📄 Creating test contracts...')
  
  const createdContracts = []
  
  for (let i = 0; i < clients.length; i++) {
    const client = clients[i]
    const contractData = testContracts[i] || testContracts[0]
    
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          company_id: companyId,
          client_id: client.id,
          ...contractData
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating contract for client ${client.id}:`, error)
        continue
      }
      
      createdContracts.push(data)
      console.log(`✅ Created contract: ${data.contract_number}`)
      
    } catch (error) {
      console.error(`Error creating contract for client ${client.id}:`, error)
    }
  }
  
  return createdContracts
}

async function createTestRoutes(companyId: string, employees: any[]) {
  console.log('🗺️  Creating test routes...')
  
  const createdRoutes = []
  
  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i]
    const routeData = testRoutes[i] || testRoutes[0]
    
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert({
          company_id: companyId,
          employee_id: employee.id,
          ...routeData
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating route for employee ${employee.id}:`, error)
        continue
      }
      
      createdRoutes.push(data)
      console.log(`✅ Created route: ${data.route_name}`)
      
    } catch (error) {
      console.error(`Error creating route for employee ${employee.id}:`, error)
    }
  }
  
  return createdRoutes
}

async function createTestServiceVisits(routes: any[], clients: any[], employees: any[]) {
  console.log('🔧 Creating test service visits...')
  
  const createdVisits = []
  
  for (let i = 0; i < Math.min(routes.length, clients.length); i++) {
    const route = routes[i]
    const client = clients[i]
    const employee = employees[i] || employees[0]
    const visitData = testServiceVisits[i] || testServiceVisits[0]
    
    try {
      const { data, error } = await supabase
        .from('service_visits')
        .insert({
          route_id: route.id,
          client_id: client.id,
          employee_id: employee.id,
          ...visitData
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating service visit:`, error)
        continue
      }
      
      createdVisits.push(data)
      console.log(`✅ Created service visit: ${data.id}`)
      
    } catch (error) {
      console.error(`Error creating service visit:`, error)
    }
  }
  
  return createdVisits
}

async function createTestGpsLogs(employees: any[], serviceVisits: any[]) {
  console.log('📍 Creating test GPS logs...')
  
  const createdLogs = []
  
  for (const employee of employees) {
    const visit = serviceVisits.find(v => v.employee_id === employee.id)
    
    try {
      const { data, error } = await supabase
        .from('gps_logs')
        .insert({
          employee_id: employee.id,
          visit_id: visit?.id || null,
          latitude: 45.5017,
          longitude: -73.5673,
          accuracy: 10,
          timestamp: new Date().toISOString()
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating GPS log for employee ${employee.id}:`, error)
        continue
      }
      
      createdLogs.push(data)
      console.log(`✅ Created GPS log for employee: ${employee.id}`)
      
    } catch (error) {
      console.error(`Error creating GPS log for employee ${employee.id}:`, error)
    }
  }
  
  return createdLogs
}

async function createTestAuditLogs(users: any[]) {
  console.log('📋 Creating test audit logs...')
  
  const createdLogs = []
  
  for (const user of users) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.profile.id,
          action: 'LOGIN',
          table_name: 'profiles',
          record_id: user.profile.id,
          old_values: null,
          new_values: { email: user.profile.email, role: user.profile.role },
          ip_address: '127.0.0.1',
          user_agent: 'Test Browser'
        })
        .select()
        .single()
      
      if (error) {
        console.error(`Error creating audit log for user ${user.profile.id}:`, error)
        continue
      }
      
      createdLogs.push(data)
      console.log(`✅ Created audit log for user: ${user.profile.email}`)
      
    } catch (error) {
      console.error(`Error creating audit log for user ${user.profile.id}:`, error)
    }
  }
  
  return createdLogs
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    
    // Clear existing data
    await clearDatabase()
    
    // Create test users
    const users = await createTestUsers()
    
    // Create test company
    const company = await createTestCompany()
    
    // Create test employees
    const employees = await createTestEmployees(company.id, users)
    
    // Create test clients
    const clients = await createTestClients(company.id, users)
    
    // Create test contracts
    const contracts = await createTestContracts(company.id, clients)
    
    // Create test routes
    const routes = await createTestRoutes(company.id, employees)
    
    // Create test service visits
    const serviceVisits = await createTestServiceVisits(routes, clients, employees)
    
    // Create test GPS logs
    const gpsLogs = await createTestGpsLogs(employees, serviceVisits)
    
    // Create test audit logs
    const auditLogs = await createTestAuditLogs(users)
    
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Users created: ${users.length}`)
    console.log(`- Company created: 1`)
    console.log(`- Employees created: ${employees.length}`)
    console.log(`- Clients created: ${clients.length}`)
    console.log(`- Contracts created: ${contracts.length}`)
    console.log(`- Routes created: ${routes.length}`)
    console.log(`- Service visits created: ${serviceVisits.length}`)
    console.log(`- GPS logs created: ${gpsLogs.length}`)
    console.log(`- Audit logs created: ${auditLogs.length}`)
    
    console.log('\n🔑 Test User Credentials:')
    testUsers.forEach(user => {
      console.log(`- ${user.role}: ${user.email} / ${user.password}`)
    })
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seeding
seedDatabase() 
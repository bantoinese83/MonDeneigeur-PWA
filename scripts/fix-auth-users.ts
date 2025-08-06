import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/database.types'
import { config } from 'dotenv'

// Load environment variables from .env file
config()

// Initialize Supabase client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://erbzmoqoocmptkbflibr.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// Test users with proper credentials
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

async function createUsersWithAuth() {
  console.log('🔧 Creating users with proper Supabase Auth...')
  
  const createdUsers = []
  
  for (const user of testUsers) {
    try {
      // Create user using Supabase Auth API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role
        }
      })
      
      if (authError) {
        console.error(`Error creating auth user ${user.email}:`, authError)
        continue
      }
      
      console.log(`✅ Created auth user: ${user.email}`)
      
      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          company_id: '49b99af5-8512-46f7-997d-9eaa895b5f3f' // Use existing company
        })
        .select()
        .single()
      
      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError)
        continue
      }
      
      createdUsers.push({ auth: authData.user, profile: profileData })
      console.log(`✅ Created profile for: ${user.email} (${user.role})`)
      
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error)
    }
  }
  
  return createdUsers
}

async function createRelatedData(users: any[]) {
  console.log('🔧 Creating related data...')
  
  const adminUser = users.find(u => u.profile.role === 'admin')
  const clientUser = users.find(u => u.profile.role === 'client')
  const employeeUser = users.find(u => u.profile.role === 'employee')
  
  if (!adminUser || !clientUser || !employeeUser) {
    console.error('Missing required users')
    return
  }
  
  try {
    // Create employee record
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .insert({
        profile_id: employeeUser.profile.id,
        company_id: '49b99af5-8512-46f7-997d-9eaa895b5f3f',
        position: 'Snow Removal Specialist',
        hire_date: '2024-01-15',
        salary: 45000,
        status: 'active'
      })
      .select()
      .single()
    
    if (employeeError) {
      console.error('Error creating employee:', employeeError)
    } else {
      console.log('✅ Created employee record')
    }
    
    // Create client record
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        profile_id: clientUser.profile.id,
        company_id: '49b99af5-8512-46f7-997d-9eaa895b5f3f',
        address: '456 Client Street, Montreal, QC',
        service_area: 'Downtown Montreal',
        contact_preferences: { email: true, sms: false, phone: true }
      })
      .select()
      .single()
    
    if (clientError) {
      console.error('Error creating client:', clientError)
    } else {
      console.log('✅ Created client record')
    }
    
    // Create audit logs
    for (const user of users) {
      await supabase
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
    }
    
    console.log('✅ Created audit logs')
    
    // Create notifications
    const notifications = [
      {
        user_id: adminUser.profile.id,
        title: 'Welcome to Monde Neigeur',
        message: 'Your admin account has been successfully created. You can now access all administrative features.',
        type: 'info',
        is_read: false,
        action_url: '/admin/dashboard'
      },
      {
        user_id: clientUser.profile.id,
        title: 'Service Scheduled',
        message: 'Your snow removal service has been scheduled for tomorrow at 8:00 AM.',
        type: 'success',
        is_read: false,
        action_url: '/client/dashboard'
      },
      {
        user_id: employeeUser.profile.id,
        title: 'New Route Assigned',
        message: 'You have been assigned to Downtown Route A. Please review the route details.',
        type: 'info',
        is_read: false,
        action_url: '/employee/routes'
      }
    ]
    
    for (const notification of notifications) {
      await supabase
        .from('notifications')
        .insert(notification)
    }
    
    console.log('✅ Created notifications')
    
  } catch (error) {
    console.error('Error creating related data:', error)
  }
}

async function testLogin() {
  console.log('🧪 Testing login functionality...')
  
  // Test login with admin user
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@test.com',
    password: '123456789'
  })
  
  if (authError) {
    console.error('❌ Login test failed:', authError)
  } else {
    console.log('✅ Login test successful for admin@test.com')
    console.log('User ID:', authData.user.id)
    console.log('Session:', !!authData.session)
  }
  
  // Sign out
  await supabase.auth.signOut()
}

async function main() {
  try {
    console.log('🚀 Starting user creation with proper Auth...')
    
    // Create users with proper Auth
    const users = await createUsersWithAuth()
    
    if (users.length === 0) {
      console.error('❌ No users were created')
      return
    }
    
    // Create related data
    await createRelatedData(users)
    
    // Test login
    await testLogin()
    
    console.log('\n🎉 User creation completed!')
    console.log('\n📊 Summary:')
    console.log(`- Users created: ${users.length}`)
    console.log('\n🔑 Test User Credentials:')
    testUsers.forEach(user => {
      console.log(`- ${user.role}: ${user.email} / ${user.password}`)
    })
    
    console.log('\n💡 Try logging in with these credentials now!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main() 
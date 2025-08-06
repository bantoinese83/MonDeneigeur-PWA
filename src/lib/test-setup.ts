import { supabase } from './supabase'

export async function createTestUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'b.antoine.se@gmail.com',
    password: '123456789',
    options: {
      data: {
        full_name: 'Antoine Test User',
        role: 'superadmin',
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      }
    }
  })

  if (error) {
    console.error('Error creating test user:', error)
    return null
  }

  console.log('Test user created successfully:', data.user?.email)
  return data.user
}

export async function signInTestUser() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'b.antoine.se@gmail.com',
    password: '123456789'
  })

  if (error) {
    console.error('Error signing in test user:', error)
    return null
  }

  console.log('Test user signed in successfully:', data.user?.email)
  return data.user
} 
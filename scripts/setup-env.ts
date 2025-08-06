import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const supabaseUrl = 'https://erbzmoqoocmptkbflibr.supabase.co'

console.log('🔧 Setting up environment for database seeding...')
console.log(`📡 Supabase URL: ${supabaseUrl}`)

// Check if .env file exists
const envPath = join(process.cwd(), '.env')
const envExists = existsSync(envPath)

if (!envExists) {
  console.log('📝 Creating .env file...')
  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Database Seeding (Service Role Key - Get this from Supabase Dashboard)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Instructions:
# 1. Get your Supabase anon key from: https://supabase.com/dashboard/project/[your-project-id]/settings/api
# 2. Get your service role key from: https://supabase.com/dashboard/project/[your-project-id]/settings/api
# 3. Replace the placeholder values above with your actual keys
# 4. Run: npm run seed:db
`
  writeFileSync(envPath, envContent)
  console.log('✅ Created .env file with template')
} else {
  console.log('✅ .env file already exists')
}

console.log('\n📋 Next steps:')
console.log('1. Get your Supabase service role key from: https://supabase.com/dashboard/project/[your-project-id]/settings/api')
console.log('2. Add it to your .env file as SUPABASE_SERVICE_ROLE_KEY')
console.log('3. Run: npm run seed:db')
console.log('\n⚠️  Note: The service role key has admin privileges. Keep it secure and never commit it to version control.') 
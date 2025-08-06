# Database Seeding Guide

This guide will help you clear your Supabase database and seed it with test data including 3 users (admin, client, employee) with easy passwords.

## 🚀 Quick Start

### Step 1: Get Your Supabase Service Role Key

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (the one with URL: `https://erbzmoqoocmptkbflibr.supabase.co`)
3. Navigate to **Settings** → **API**
4. Copy the **service_role** key (not the anon key)
5. Add it to your `.env` file:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### Step 2: Run the Seeding Script

```bash
npm run seed:db
```

## 📊 What Gets Created

### Test Users
| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | `admin@test.com` | `123456789` | Full admin dashboard |
| **Client** | `client@test.com` | `123456789` | Client portal |
| **Employee** | `employee@test.com` | `123456789` | Employee dashboard |

### Sample Data
- **1 Company**: Monde Neigeur Test Company
- **2 Employees**: Snow Removal Specialist & Route Manager
- **2 Clients**: Residential & Commercial clients
- **2 Contracts**: Active service contracts
- **2 Routes**: Assigned to employees
- **2 Service Visits**: Scheduled and completed visits
- **GPS Logs**: Location tracking data
- **Audit Logs**: User activity tracking

## 🔧 Scripts Available

```bash
# Set up environment variables
npm run setup:env

# Seed the database (clears all data first)
npm run seed:db
```

## 🗑️ Database Clearing

The script automatically clears all data from these tables in the correct order:

1. `gps_logs`
2. `audit_logs`
3. `service_visits`
4. `routes`
5. `contracts`
6. `clients`
7. `employees`
8. `profiles`
9. `companies`

## 🔐 Security Important Notes

⚠️ **CRITICAL**: The service role key has admin privileges and can bypass Row Level Security (RLS).

- **Never commit** the service role key to version control
- **Only use** for development and testing
- **Keep it secure** and rotate it regularly
- **Add `.env`** to your `.gitignore` file

## 🛠️ Troubleshooting

### Common Issues

1. **"Missing SUPABASE_SERVICE_ROLE_KEY"**
   - Make sure you've added the service role key to your `.env` file
   - Get it from your Supabase dashboard under Settings > API

2. **"Error creating auth user"**
   - Check that your Supabase URL is correct
   - Verify the service role key is valid
   - Ensure your Supabase project is active

3. **"Error clearing tables"**
   - This might be due to foreign key constraints
   - The script handles this by clearing tables in the correct order
   - If issues persist, check your database schema

### Manual Database Reset

If you need to completely reset your database manually:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run this SQL:
   ```sql
   TRUNCATE TABLE gps_logs, audit_logs, service_visits, routes, contracts, clients, employees, profiles, companies CASCADE;
   ```
4. Then run: `npm run seed:db`

## 📝 Customization

To modify the test data, edit the constants in `scripts/seed-database.ts`:

- `testUsers` - User accounts and roles
- `testCompany` - Company information
- `testEmployees` - Employee data
- `testClients` - Client information
- `testContracts` - Contract details
- `testRoutes` - Route assignments
- `testServiceVisits` - Service visit data

## 🎯 Expected Output

When the seeding script runs successfully, you should see:

```
🌱 Starting database seeding...
🗑️  Clearing database...
✅ Cleared gps_logs
✅ Cleared audit_logs
✅ Cleared service_visits
✅ Cleared routes
✅ Cleared contracts
✅ Cleared clients
✅ Cleared employees
✅ Cleared profiles
✅ Cleared companies

👥 Creating test users...
✅ Created user: admin@test.com (admin)
✅ Created user: client@test.com (client)
✅ Created user: employee@test.com (employee)

🏢 Creating test company...
✅ Created company: Monde Neigeur Test Company

👷 Creating test employees...
✅ Created employee: Employee User

👤 Creating test clients...
✅ Created client: Client User

📄 Creating test contracts...
✅ Created contract: CON-2024-001
✅ Created contract: CON-2024-002

🗺️  Creating test routes...
✅ Created route: Downtown Route A
✅ Created route: West Island Route B

🔧 Creating test service visits...
✅ Created service visit: [visit-id]

📍 Creating test GPS logs...
✅ Created GPS log for employee: [employee-id]

📋 Creating test audit logs...
✅ Created audit log for user: admin@test.com
✅ Created audit log for user: client@test.com
✅ Created audit log for user: employee@test.com

🎉 Database seeding completed successfully!

📊 Summary:
- Users created: 3
- Company created: 1
- Employees created: 1
- Clients created: 1
- Contracts created: 2
- Routes created: 2
- Service visits created: 2
- GPS logs created: 1
- Audit logs created: 3

🔑 Test User Credentials:
- admin: admin@test.com / 123456789
- client: client@test.com / 123456789
- employee: employee@test.com / 123456789
```

## 🚀 Ready to Test

Once seeding is complete, you can:

1. **Start the development server**: `npm run dev`
2. **Login with test credentials**:
   - Admin: `admin@test.com` / `123456789`
   - Client: `client@test.com` / `123456789`
   - Employee: `employee@test.com` / `123456789`
3. **Test all features** with the seeded data

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Documentation](docs/API_DOCUMENTATION.md) 
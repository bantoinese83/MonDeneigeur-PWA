# Database Seeding Scripts

This directory contains scripts for managing and seeding the Supabase database with test data.

## Files

- `seed-database.ts` - Main seeding script that clears all data and creates test users and sample data
- `setup-env.ts` - Helper script to set up environment variables
- `README.md` - This documentation file

## Quick Start

1. **Set up environment variables:**
   ```bash
   npm run setup:env
   ```

2. **Get your Supabase service role key:**
   - Go to your Supabase dashboard: https://supabase.com/dashboard
   - Navigate to Settings > API
   - Copy the "service_role" key (not the anon key)
   - Add it to your `.env` file as `SUPABASE_SERVICE_ROLE_KEY`

3. **Seed the database:**
   ```bash
   npm run seed:db
   ```

## Test Users Created

The seeding script creates 3 test users with easy-to-remember credentials:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | `admin@test.com` | `123456789` | Full admin access |
| Client | `client@test.com` | `123456789` | Client portal access |
| Employee | `employee@test.com` | `123456789` | Employee dashboard access |

## Data Created

The script creates comprehensive test data including:

- **1 Company** - Monde Neigeur Test Company
- **3 Users** - Admin, Client, and Employee profiles
- **2 Employees** - Snow Removal Specialist and Route Manager
- **2 Clients** - Residential and commercial clients
- **2 Contracts** - Active service contracts
- **2 Routes** - Assigned to employees
- **2 Service Visits** - Scheduled and completed visits
- **GPS Logs** - Location tracking data
- **Audit Logs** - User activity tracking

## Database Tables Cleared

The script clears all data from these tables (in order):

1. `gps_logs`
2. `audit_logs`
3. `service_visits`
4. `routes`
5. `contracts`
6. `clients`
7. `employees`
8. `profiles`
9. `companies`

## Security Notes

⚠️ **Important:** The service role key has admin privileges and can bypass Row Level Security (RLS). 

- Never commit the service role key to version control
- Only use it for development and testing
- Keep it secure and rotate it regularly
- The `.env` file should be in your `.gitignore`

## Troubleshooting

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

### Reset Database

If you need to completely reset your database:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run: `TRUNCATE TABLE gps_logs, audit_logs, service_visits, routes, contracts, clients, employees, profiles, companies CASCADE;`
4. Then run the seeding script again

## Customization

To modify the test data, edit the constants in `seed-database.ts`:

- `testUsers` - User accounts and roles
- `testCompany` - Company information
- `testEmployees` - Employee data
- `testClients` - Client information
- `testContracts` - Contract details
- `testRoutes` - Route assignments
- `testServiceVisits` - Service visit data 
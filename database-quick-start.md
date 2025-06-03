# Database Management Setup - Quick Start Guide

## Current Status
- ✅ Supabase CLI is installed and working (v2.23.4)
- ❌ Docker Desktop is not installed
- ✅ Database connection working
- ⚠️  Schema mismatches causing errors

## Immediate Solution (No Docker Required)

### Step 1: Apply the Schema Fix Migration

Run this command to apply the schema fix migration:

```powershell
# Apply the migration directly via Supabase
cd C:\Users\hp\BinnaCodes\binna
supabase db push
```

If that doesn't work, use the direct SQL approach:

```powershell
# Reset and push migrations
supabase db reset
```

### Step 2: Alternative - Direct Database Update

If Supabase commands don't work, you can apply the schema fixes directly via the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run this SQL to fix schema mismatches:

```sql
-- Fix schema mismatches
ALTER TABLE projects ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'SAR';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget DECIMAL(12,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS end_date DATE;

-- Copy data from old columns if they exist
UPDATE projects SET budget = budget_estimate WHERE budget IS NULL AND budget_estimate IS NOT NULL;
UPDATE projects SET address = location WHERE address IS NULL AND location IS NOT NULL;
UPDATE projects SET end_date = expected_completion_date WHERE end_date IS NULL AND expected_completion_date IS NOT NULL;
```

### Step 3: Test the Fix

Run your project creation test:

```powershell
cd C:\Users\hp\BinnaCodes\binna
node test-database-connection.js
```

## Long-term Solution Options

### Option A: Install Docker Desktop (Recommended)
1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Run: `supabase start` (this will create a local database)
4. Use local development environment

### Option B: Use Supabase Remote Database (Current Setup)
- Continue using your remote Supabase database
- Always use migrations for schema changes
- Test changes with the database management scripts

### Option C: Use PostgreSQL Locally
If you prefer a lightweight solution:
1. Install PostgreSQL directly
2. Create a local database
3. Use Supabase CLI to manage migrations

## Database Development Workflow

### Making Schema Changes
1. **Never edit the database directly**
2. **Always create migrations** for schema changes
3. **Test migrations** before applying to production

### Creating a New Migration
```powershell
# Create a new migration
supabase migration new add_new_feature

# Edit the migration file in supabase/migrations/
# Apply the migration
supabase db push
```

### Example Migration for Adding a New Field
```sql
-- File: supabase/migrations/XXXX_add_new_field.sql
ALTER TABLE projects ADD COLUMN new_field VARCHAR(255);
UPDATE projects SET new_field = 'default_value' WHERE new_field IS NULL;
```

## Quick Commands Reference

```powershell
# Check Supabase status
supabase status

# Apply migrations
supabase db push

# Reset database (careful!)
supabase db reset

# Create new migration
supabase migration new migration_name

# Start local development (requires Docker)
supabase start

# Stop local development
supabase stop
```

## Next Steps

1. Choose your preferred database setup option
2. Apply the schema fix migration
3. Test project creation
4. Set up proper migration workflow

## Need Help?

If you encounter any issues:
1. Check the Supabase dashboard for errors
2. Review the migration files
3. Test with the database management scripts
4. Contact me for further assistance

The most important thing is to establish a proper workflow where all database changes go through migrations, preventing future schema mismatches.

# Database Development Setup for Binna Project

## Current Issue
The project is experiencing schema mismatches between the code and actual database, leading to errors like "Could not find the 'currency' column" and field name inconsistencies.

## Solution Options

### Option 1: Docker Desktop + Supabase Local Development (Recommended)

#### Step 1: Install Docker Desktop
1. Download Docker Desktop for Windows from: https://www.docker.com/products/docker-desktop/
2. Install and start Docker Desktop
3. Ensure Docker is running in the system tray

#### Step 2: Start Supabase Local Development
```powershell
cd C:\Users\hp\BinnaCodes\binna
supabase start
```

This will:
- Start a local PostgreSQL database
- Start Supabase services (API, Auth, etc.)
- Apply all migrations automatically
- Provide a local development environment

#### Step 3: Update Environment Variables
Create `.env.local.development`:
```env
# Local Supabase (when using supabase start)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
```

### Option 2: Database Schema Synchronization (Current Setup)

#### Step 1: Create Migration for Current Schema
Generate a migration to fix the schema mismatches:

```sql
-- Migration: Fix schema mismatches
-- File: supabase/migrations/00008_fix_schema_mismatches.sql

-- Add missing currency column if it doesn't exist
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'SAR';

-- Ensure all expected columns exist with correct names
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS budget DECIMAL(12,2);

-- Update any existing budget_estimate data to budget column
UPDATE projects 
SET budget = budget_estimate 
WHERE budget IS NULL AND budget_estimate IS NOT NULL;

-- Add address column if missing
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add end_date column if missing  
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
```

#### Step 2: Schema Validation Script
Create a script to validate schema matches code expectations.

### Option 3: Reset Database Schema (Nuclear Option)

If you want a clean start:
1. Backup any important data
2. Reset the database schema
3. Run all migrations fresh

## Recommended Actions

1. **Install Docker Desktop** - This is the best long-term solution
2. **Use Supabase local development** - Allows you to develop with a local database
3. **Create proper migrations** - Any schema changes should be done via migrations
4. **Schema validation** - Automated checks to ensure code matches database

## Next Steps

Choose your preferred option and I'll help you implement it step by step.

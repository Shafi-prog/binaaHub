# =============================================================================
# DOCKER-BASED DATABASE MIGRATION SCRIPT
# =============================================================================
# This script will apply the database migration through Docker Desktop

Write-Host "🐳 DOCKER-BASED SUPABASE MIGRATION" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker Desktop is running
Write-Host "🔍 Checking Docker Desktop status..." -ForegroundColor Yellow

try {
    $dockerInfo = docker info 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Docker Desktop is running" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker Desktop is not running" -ForegroundColor Red
        Write-Host "💡 Please start Docker Desktop and wait for it to be ready" -ForegroundColor Yellow
        Write-Host "   Then run this script again" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Docker not found or not running" -ForegroundColor Red
    exit 1
}

# Check for Supabase containers
Write-Host "🔍 Checking for Supabase containers..." -ForegroundColor Yellow

$supabaseContainers = docker ps -a --filter "name=supabase" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>$null

if ($supabaseContainers) {
    Write-Host "📋 Found Supabase containers:" -ForegroundColor Green
    Write-Host $supabaseContainers
    Write-Host ""
} else {
    Write-Host "⚠️  No Supabase containers found" -ForegroundColor Yellow
    Write-Host "💡 Options:" -ForegroundColor Yellow
    Write-Host "   1. Start local Supabase: npx supabase start" -ForegroundColor Yellow
    Write-Host "   2. Use remote Supabase (apply migration via dashboard)" -ForegroundColor Yellow
    Write-Host ""
}

# Look for database container specifically
$dbContainer = docker ps --filter "name=supabase_db" --format "{{.Names}}" 2>$null

if ($dbContainer) {
    Write-Host "🗄️  Found database container: $dbContainer" -ForegroundColor Green
    
    # Apply the migration
    Write-Host "🚀 Applying database migration..." -ForegroundColor Yellow
    
    $migrationSQL = @"
-- Add missing columns to projects table
BEGIN;

-- Add missing location columns
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Saudi Arabia';

-- Add missing project management columns
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update existing records to have default values
UPDATE public.projects SET 
  country = 'Saudi Arabia' WHERE country IS NULL;
UPDATE public.projects SET 
  priority = 'medium' WHERE priority IS NULL;
UPDATE public.projects SET 
  is_active = true WHERE is_active IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_city ON public.projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_region ON public.projects(region);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON public.projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON public.projects(is_active);

COMMIT;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
"@
    
    # Save migration to temp file
    $tempFile = "$env:TEMP\supabase_migration.sql"
    $migrationSQL | Out-File -FilePath $tempFile -Encoding UTF8
      # Execute migration
    try {
        Write-Host "📤 Executing migration in container..." -ForegroundColor Yellow
        Get-Content $tempFile | docker exec -i $dbContainer psql -U postgres -d postgres
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migration applied successfully!" -ForegroundColor Green
            Write-Host "🎉 Database schema updated" -ForegroundColor Green
        } else {
            Write-Host "❌ Migration failed" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error executing migration: $_" -ForegroundColor Red
    } finally {
        # Clean up temp file
        Remove-Item -Path $tempFile -ErrorAction SilentlyContinue
    }
    
} else {
    Write-Host "❌ No Supabase database container found" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 ALTERNATIVE OPTIONS:" -ForegroundColor Yellow
    Write-Host "========================" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Option 1: Start Local Supabase" -ForegroundColor Cyan
    Write-Host "------------------------------" -ForegroundColor Cyan
    Write-Host "cd c:\Users\hp\BinnaCodes\binna\src\migrations\supabase" -ForegroundColor Gray
    Write-Host "npx supabase start" -ForegroundColor Gray
    Write-Host "npx supabase db reset" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Option 2: Remote Database Migration" -ForegroundColor Cyan
    Write-Host "-----------------------------------" -ForegroundColor Cyan
    Write-Host "1. Go to: https://lqhopwohuddhapkhhikf.supabase.co/project/lqhopwohuddhapkhhikf/sql" -ForegroundColor Gray
    Write-Host "2. Copy content from: URGENT_DATABASE_FIX.sql" -ForegroundColor Gray
    Write-Host "3. Paste and click 'Run'" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Option 3: Use Supabase CLI" -ForegroundColor Cyan
    Write-Host "--------------------------" -ForegroundColor Cyan
    Write-Host "npx supabase db push --linked" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow
Write-Host "1. After migration is applied, test project creation" -ForegroundColor Gray
Write-Host "2. Go to: http://localhost:3003/user/projects/new" -ForegroundColor Gray
Write-Host "3. Fill form and submit to verify fix" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 Expected result: No more 'Could not find column' errors" -ForegroundColor Green
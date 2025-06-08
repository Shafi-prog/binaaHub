#!/usr/bin/env pwsh
# Apply supervisor enhancements migration script to production

# Set environment variables for production
$env:PGHOST = "production-db-host"  # Replace with actual production host
$env:PGDATABASE = "binna_production"  # Replace with actual production database name
$env:PGUSER = "binna_admin"  # Replace with actual production db user
$env:PGPASSWORD = "your-secure-password"  # Replace with actual password

# Path to migration file
$migrationPath = ".\src\migrations\add_supervisor_enhancements.sql"

# Verify the migration file exists
if (-not (Test-Path $migrationPath)) {
    Write-Error "Migration file not found at: $migrationPath"
    exit 1
}

Write-Host "Preparing to apply supervisor enhancements to production database..."
Write-Host "Migration: $migrationPath"

# Ask for confirmation before proceeding
$confirmation = Read-Host "Are you sure you want to apply this migration to PRODUCTION? (y/N)"
if ($confirmation -ne "y") {
    Write-Host "Migration cancelled."
    exit 0
}

# Apply the migration
try {
    Write-Host "Applying migration..."
    psql -f $migrationPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migration successfully applied!" -ForegroundColor Green
    } else {
        Write-Error "Migration failed with exit code: $LASTEXITCODE"
        exit 1
    }
} catch {
    Write-Error "Error applying migration: $_"
    exit 1
}

# Update production schema cache if needed
Write-Host "Updating Supabase schema cache..."
npx supabase gen types typescript --project-id your-supabase-project-id --schema public > src/types/database.ts

Write-Host "Migration process completed!"

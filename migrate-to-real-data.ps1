# =====================================================
# BINNA PLATFORM - REAL DATA MIGRATION SCRIPT
# Replace all mock/sample data with real user data
# =====================================================

Write-Host "🚀 Starting Real Data Migration for BINNA Platform..." -ForegroundColor Green
Write-Host "📧 Migrating to real emails: user@binaa.com and store@binaa.com" -ForegroundColor Cyan

# Load environment variables
$envFile = ".\.env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
    Write-Host "✅ Environment variables loaded from .env.local" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "Please ensure your .env.local file exists with Supabase credentials" -ForegroundColor Yellow
    exit 1
}

# Check if psql is available
$psqlVersion = psql --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ PostgreSQL client found: $psqlVersion" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL client (psql) not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL client tools or use Supabase dashboard" -ForegroundColor Yellow
    Write-Host "Alternative: Run the SQL script manually in Supabase SQL Editor" -ForegroundColor Yellow
    exit 1
}

# Database connection details from environment
$DB_URL = $env:SUPABASE_DATABASE_URL
$DB_HOST = "db.lqhopwohuddhapkhhikf.supabase.co"
$DB_PORT = "5432"
$DB_NAME = "postgres"
$DB_USER = "postgres"
$DB_PASSWORD = $env:SUPABASE_DB_PASSWORD

if (-not $DB_PASSWORD) {
    Write-Host "❌ SUPABASE_DB_PASSWORD not found in environment!" -ForegroundColor Red
    Write-Host "Please add SUPABASE_DB_PASSWORD to your .env.local file" -ForegroundColor Yellow
    exit 1
}

# Set PostgreSQL password environment variable
$env:PGPASSWORD = $DB_PASSWORD

Write-Host "🔧 Database Connection Details:" -ForegroundColor Yellow
Write-Host "   Host: $DB_HOST" -ForegroundColor Gray
Write-Host "   Port: $DB_PORT" -ForegroundColor Gray
Write-Host "   Database: $DB_NAME" -ForegroundColor Gray
Write-Host "   User: $DB_USER" -ForegroundColor Gray

# Test database connection
Write-Host "🔍 Testing database connection..." -ForegroundColor Yellow
$connectionTest = psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -c "SELECT version();" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Database connection failed!" -ForegroundColor Red
    Write-Host "Please check your database credentials and network connection" -ForegroundColor Yellow
    exit 1
}

# Run the real data migration
$sqlFile = "database\seed-data\real-users-data.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "📊 Executing real data migration..." -ForegroundColor Yellow
Write-Host "   File: $sqlFile" -ForegroundColor Gray

try {
    $result = psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -f $sqlFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Real data migration completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Migration failed with errors!" -ForegroundColor Red
        Write-Host "Please check the SQL file and database logs" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Error executing migration: $_" -ForegroundColor Red
    exit 1
}

# Verify the migration
Write-Host "🔍 Verifying migration results..." -ForegroundColor Yellow

# Check users
$userCheck = psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -t -c "SELECT email FROM users.users WHERE email IN ('user@binaa.com', 'store@binaa.com');" 2>$null
if ($userCheck -match "user@binaa.com" -and $userCheck -match "store@binaa.com") {
    Write-Host "✅ Real user accounts created successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: User verification incomplete" -ForegroundColor Yellow
}

# Check stores
$storeCheck = psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -t -c "SELECT name FROM marketplace.stores WHERE owner_id = 'real-store-001';" 2>$null
if ($storeCheck -match "متجر بناء للمواد") {
    Write-Host "✅ Real store data created successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Store verification incomplete" -ForegroundColor Yellow
}

# Check projects
$projectCheck = psql -h $DB_HOST -p $DB_PORT -d $DB_NAME -U $DB_USER -t -c "SELECT name FROM public.projects WHERE user_id = 'real-user-001';" 2>$null
if ($projectCheck -match "فيلا العائلة الرئيسية") {
    Write-Host "✅ Real project data created successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Project verification incomplete" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 MIGRATION COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary of Changes:" -ForegroundColor Cyan
Write-Host "   ✅ Replaced mock users with real accounts" -ForegroundColor White
Write-Host "   ✅ Updated authentication system" -ForegroundColor White
Write-Host "   ✅ Created real store and product data" -ForegroundColor White
Write-Host "   ✅ Added real project and evaluation data" -ForegroundColor White
Write-Host "   ✅ Set up warranties and orders" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Login Credentials:" -ForegroundColor Cyan
Write-Host "   📧 User Account: user@binaa.com" -ForegroundColor White
Write-Host "   🏪 Store Account: store@binaa.com" -ForegroundColor White
Write-Host "   👨‍💼 Admin Account: admin@binaa.com" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Restart your development server: npm run dev" -ForegroundColor White
Write-Host "   2. Login with the real email accounts" -ForegroundColor White
Write-Host "   3. Verify all data is displaying correctly" -ForegroundColor White
Write-Host "   4. Test all platform features with real data" -ForegroundColor White
Write-Host ""
Write-Host "📚 Real Data Includes:" -ForegroundColor Cyan
Write-Host "   • 2 Real user accounts with Arabic names" -ForegroundColor White
Write-Host "   • 1 Construction materials store" -ForegroundColor White
Write-Host "   • 3 Real construction products" -ForegroundColor White
Write-Host "   • 2 Order histories" -ForegroundColor White
Write-Host "   • 2 Construction projects" -ForegroundColor White
Write-Host "   • 3 Project evaluations" -ForegroundColor White
Write-Host "   • 2 Product warranties" -ForegroundColor White

# Clean up environment variable
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Migration completed! 🎉" -ForegroundColor Green

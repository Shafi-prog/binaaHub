# Enhanced Database Migration Script for Windows
# This script will apply the complete database schema to your remote Supabase database

Write-Host "🚀 Starting Enhanced Store Features Database Migration..." -ForegroundColor Green

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
    exit 1
}

# Database connection details
$DB_HOST = "db.lqhopwohuddhapkhhikf.supabase.co"
$DB_PORT = "5432"
$DB_NAME = "postgres"
$DB_USER = "postgres"
$DB_PASSWORD = "SBq63O_ncbpDjDu"
$SQL_FILE = "COMPLETE_DATABASE_SETUP.sql"

Write-Host "📋 Database Connection Details:" -ForegroundColor Cyan
Write-Host "  Host: $DB_HOST" -ForegroundColor White
Write-Host "  Port: $DB_PORT" -ForegroundColor White
Write-Host "  Database: $DB_NAME" -ForegroundColor White
Write-Host "  User: $DB_USER" -ForegroundColor White

# Check if SQL file exists
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "❌ SQL file '$SQL_FILE' not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ SQL file found: $SQL_FILE" -ForegroundColor Green

# Method 1: Try using psql if available
Write-Host "🔍 Checking for PostgreSQL psql..." -ForegroundColor Yellow
try {
    $psqlVersion = psql --version 2>$null
    if ($psqlVersion) {
        Write-Host "✅ psql found: $psqlVersion" -ForegroundColor Green
        Write-Host "🏃 Running migration with psql..." -ForegroundColor Cyan
        
        $env:PGPASSWORD = $DB_PASSWORD
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $SQL_FILE
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "🎉 Database migration completed successfully with psql!" -ForegroundColor Green
            exit 0
        } else {
            Write-Host "⚠️ psql migration failed, trying alternative methods..." -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️ psql not found, trying alternative methods..." -ForegroundColor Yellow
}

# Method 2: Try using .NET SqlConnection with Npgsql
Write-Host "🔍 Trying .NET PostgreSQL connection..." -ForegroundColor Yellow

$sqlContent = Get-Content $SQL_FILE -Raw
$connectionString = "Host=$DB_HOST;Port=$DB_PORT;Database=$DB_NAME;Username=$DB_USER;Password=$DB_PASSWORD;SSL Mode=Require"

$psScript = @"
try {
    # Try to load Npgsql if available
    Add-Type -Path (Get-ChildItem -Path `$env:USERPROFILE\.nuget\packages\npgsql\*\lib\net*\Npgsql.dll | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName -ErrorAction SilentlyContinue
    
    `$connection = New-Object Npgsql.NpgsqlConnection('$connectionString')
    `$connection.Open()
    `$command = `$connection.CreateCommand()
    `$command.CommandText = @'
$sqlContent
'@
    `$result = `$command.ExecuteNonQuery()
    `$connection.Close()
    Write-Host "🎉 Database migration completed successfully with .NET!" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "⚠️ .NET method failed: `$(`$_.Exception.Message)" -ForegroundColor Yellow
}
"@

try {
    Invoke-Expression $psScript
} catch {
    Write-Host "⚠️ .NET PostgreSQL connection not available" -ForegroundColor Yellow
}

# Method 3: Instructions for manual execution
Write-Host "📝 Manual Execution Instructions:" -ForegroundColor Cyan
Write-Host "Since automated methods are not available, please follow these steps:" -ForegroundColor White
Write-Host ""
Write-Host "1. Open your Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "   https://supabase.com/dashboard/project/lqhopwohuddhapkhhikf" -ForegroundColor White
Write-Host ""
Write-Host "2. Go to the SQL Editor tab" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Copy and paste the contents of '$SQL_FILE' into the SQL editor" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Click 'Run' to execute the schema" -ForegroundColor Yellow
Write-Host ""
Write-Host "Alternatively, you can:" -ForegroundColor Yellow
Write-Host "- Install PostgreSQL client tools (psql)" -ForegroundColor White
Write-Host "- Use a GUI tool like pgAdmin or DBeaver" -ForegroundColor White
Write-Host "- Use the Supabase CLI with proper authentication" -ForegroundColor White

Write-Host ""
Write-Host "📄 The SQL file contains:" -ForegroundColor Cyan
Write-Host "• Enhanced products table with inventory features" -ForegroundColor White
Write-Host "• POS transactions table" -ForegroundColor White
Write-Host "• Stock movements for inventory tracking" -ForegroundColor White
Write-Host "• Inventory locations and suppliers" -ForegroundColor White
Write-Host "• Purchase orders system" -ForegroundColor White
Write-Host "• Performance indexes and security policies" -ForegroundColor White
Write-Host "• Triggers for automated functionality" -ForegroundColor White

Write-Host ""
Write-Host "🔒 Security Note: All tables include Row Level Security (RLS) policies" -ForegroundColor Green
Write-Host "Each store owner can only access their own data" -ForegroundColor White

# Check if user wants to open the SQL file
$openFile = Read-Host "Would you like to open the SQL file for copying? (y/n)"
if ($openFile -eq 'y' -or $openFile -eq 'Y') {
    try {
        Start-Process notepad.exe $SQL_FILE
        Write-Host "✅ SQL file opened in Notepad" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Could not open file automatically" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🚀 After running the SQL schema, your application will have:" -ForegroundColor Green
Write-Host "• Full POS system with user search" -ForegroundColor White
Write-Host "• Advanced inventory management" -ForegroundColor White
Write-Host "• Multi-location support" -ForegroundColor White
Write-Host "• Purchase order workflow" -ForegroundColor White
Write-Host "• Complete audit trail" -ForegroundColor White

Write-Host ""
Write-Host "Ready to revolutionize your store management! 🎉" -ForegroundColor Green

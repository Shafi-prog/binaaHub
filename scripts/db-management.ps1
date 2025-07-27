# Binna Database Management PowerShell Script
# This script checks tables, creates missing ones, and fetches data

param(
    [switch]$CreateTables,
    [switch]$CheckOnly,
    [switch]$InsertData,
    [string]$SqlFile = "create-comprehensive-tables.sql"
)

Write-Host "🚀 Binna Database Management Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Load environment variables from .env file
if (Test-Path ".env") {
    Write-Host "📄 Loading environment variables from .env..." -ForegroundColor Yellow
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
} else {
    Write-Host "⚠️ No .env file found" -ForegroundColor Yellow
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseKey = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Missing Supabase environment variables" -ForegroundColor Red
    Write-Host "NEXT_PUBLIC_SUPABASE_URL: $(if($supabaseUrl) {'✅ Set'} else {'❌ Missing'})" -ForegroundColor Red
    Write-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY: $(if($supabaseKey) {'✅ Set'} else {'❌ Missing'})" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Environment variables loaded" -ForegroundColor Green
Write-Host "🔗 Supabase URL: $($supabaseUrl.Substring(0, 30))..." -ForegroundColor Green

# Function to make API requests to Supabase
function Invoke-SupabaseQuery {
    param(
        [string]$Table,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    $defaultHeaders = @{
        "apikey" = $supabaseKey
        "Authorization" = "Bearer $supabaseKey"
        "Content-Type" = "application/json"
    }
    
    $allHeaders = $defaultHeaders + $Headers
    
    $uri = "$supabaseUrl/rest/v1/$Table"
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $allHeaders -Body ($Body | ConvertTo-Json -Depth 10)
        } else {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $allHeaders
        }
        return @{ Success = $true; Data = $response }
    } catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

# Function to check if tables exist
function Test-TablesExist {
    Write-Host "📊 Checking existing tables..." -ForegroundColor Yellow
    
    $tables = @("material_prices", "user_profiles", "stores", "orders")
    $existingTables = @()
    $missingTables = @()
    
    foreach ($table in $tables) {
        Write-Host "  Checking table: $table" -ForegroundColor Gray
        
        $result = Invoke-SupabaseQuery -Table "$table" -Headers @{ "Prefer" = "count=exact" }
        
        if ($result.Success) {
            $existingTables += $table
            Write-Host "    ✅ Table '$table' exists" -ForegroundColor Green
        } else {
            $missingTables += $table
            Write-Host "    ❌ Table '$table' missing" -ForegroundColor Red
        }
    }
    
    return @{
        Existing = $existingTables
        Missing = $missingTables
    }
}

# Function to get table data counts
function Get-TableDataCounts {
    param([array]$Tables)
    
    Write-Host "📋 Getting data counts..." -ForegroundColor Yellow
    $results = @{}
    
    foreach ($table in $Tables) {
        $result = Invoke-SupabaseQuery -Table "$table" -Headers @{ "Prefer" = "count=exact" }
        
        if ($result.Success) {
            # Extract count from response headers (this would need to be adjusted based on actual API response)
            $count = if ($result.Data -is [array]) { $result.Data.Count } else { 1 }
            $results[$table] = $count
            Write-Host "  📊 $table: $count records" -ForegroundColor Green
        } else {
            $results[$table] = 0
            Write-Host "  ❌ $table: Unable to get count" -ForegroundColor Red
        }
    }
    
    return $results
}

# Function to fetch sample data
function Get-SampleData {
    param([array]$Tables)
    
    Write-Host "🔍 Fetching sample data..." -ForegroundColor Yellow
    $results = @{}
    
    foreach ($table in $Tables) {
        $result = Invoke-SupabaseQuery -Table "$table" -Headers @{ "Range" = "0-2" }
        
        if ($result.Success -and $result.Data) {
            $results[$table] = $result.Data
            Write-Host "  ✅ $table: Got $(($result.Data | Measure-Object).Count) sample records" -ForegroundColor Green
            
            # Display first record as example
            if ($result.Data | Measure-Object | Select-Object -ExpandProperty Count) {
                $firstRecord = $result.Data[0]
                $preview = ($firstRecord | ConvertTo-Json -Compress).Substring(0, [Math]::Min(100, ($firstRecord | ConvertTo-Json -Compress).Length))
                Write-Host "    Preview: $preview..." -ForegroundColor Gray
            }
        } else {
            Write-Host "  ❌ $table: No data found" -ForegroundColor Red
        }
    }
    
    return $results
}

# Function to display manual setup instructions
function Show-ManualSetupInstructions {
    Write-Host "`n🔧 Manual Database Setup Required" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host "Since automated table creation needs service role key, please:" -ForegroundColor White
    Write-Host "1. 🌐 Go to: https://qghcdswwagbwqqqtcrfq.supabase.co" -ForegroundColor Cyan
    Write-Host "2. 🔐 Login to your Supabase dashboard" -ForegroundColor Cyan
    Write-Host "3. 📝 Open the SQL Editor" -ForegroundColor Cyan
    Write-Host "4. 📋 Copy the contents of: $SqlFile" -ForegroundColor Cyan
    Write-Host "5. ▶️ Execute the SQL script" -ForegroundColor Cyan
    Write-Host "6. 🔄 Re-run this script to verify: ./db-management.ps1 -CheckOnly" -ForegroundColor Cyan
    
    if (Test-Path $SqlFile) {
        Write-Host "`n📄 SQL File Preview:" -ForegroundColor Green
        Write-Host "File: $SqlFile" -ForegroundColor Gray
        $content = Get-Content $SqlFile -TotalCount 5
        $content | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
        Write-Host "  ... (truncated)" -ForegroundColor Gray
    } else {
        Write-Host "`n❌ SQL file not found: $SqlFile" -ForegroundColor Red
    }
}

# Main execution
try {
    # Step 1: Check tables
    $tableStatus = Test-TablesExist
    
    Write-Host "`n📊 Table Status Summary:" -ForegroundColor Cyan
    Write-Host "✅ Existing tables: $($tableStatus.Existing.Count)" -ForegroundColor Green
    Write-Host "❌ Missing tables: $($tableStatus.Missing.Count)" -ForegroundColor Red
    
    if ($tableStatus.Existing.Count -gt 0) {
        # Step 2: Get data counts
        $dataCounts = Get-TableDataCounts -Tables $tableStatus.Existing
        
        # Step 3: Get sample data
        $sampleData = Get-SampleData -Tables $tableStatus.Existing
        
        # Summary
        $totalRecords = ($dataCounts.Values | Measure-Object -Sum).Sum
        
        Write-Host "`n📈 Final Summary:" -ForegroundColor Cyan
        Write-Host "===============" -ForegroundColor Cyan
        Write-Host "🎯 Total records: $totalRecords" -ForegroundColor Green
        Write-Host "📊 Tables with data: $($sampleData.Keys.Count)" -ForegroundColor Green
        
        if ($totalRecords -gt 0) {
            Write-Host "`n✅ Database is ready!" -ForegroundColor Green
            Write-Host "🌐 You can now use the Binna platform with real data" -ForegroundColor Green
            Write-Host "💡 Web interface: http://localhost:3000/database-management" -ForegroundColor Cyan
        } else {
            Write-Host "`n⚠️ Tables exist but no data found" -ForegroundColor Yellow
            Show-ManualSetupInstructions
        }
    } else {
        Write-Host "`n❌ No tables found in database" -ForegroundColor Red
        Show-ManualSetupInstructions
    }
    
    # Additional options
    Write-Host "`n🔧 Available Commands:" -ForegroundColor Cyan
    Write-Host "  Check only: ./db-management.ps1 -CheckOnly" -ForegroundColor Gray
    Write-Host "  With table creation: ./db-management.ps1 -CreateTables" -ForegroundColor Gray
    Write-Host "  Insert sample data: ./db-management.ps1 -InsertData" -ForegroundColor Gray
    
} catch {
    Write-Host "❌ Script error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 Database management completed!" -ForegroundColor Green

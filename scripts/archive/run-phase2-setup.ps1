# Phase 2 Integration Database Setup Script
# This script sets up database tables for Payment Gateway, Shipping, and ERP integrations

Write-Host "🚀 Starting Phase 2 Integration Database Setup..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found. Please create .env file with Supabase credentials." -ForegroundColor Red
    exit 1
}

# Load environment variables
Get-Content ".env" | ForEach-Object {
    if ($_ -match "^\s*([^#][^=]*?)\s*=\s*(.*?)\s*$") {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
    }
}

$SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$SUPABASE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_KEY) {
    Write-Host "❌ Missing Supabase credentials in .env file" -ForegroundColor Red
    exit 1
}

Write-Host "📊 Setting up Phase 2 Integration tables..." -ForegroundColor Yellow

# Read the SQL file
$sqlContent = Get-Content "PHASE_2_INTEGRATION_TABLES.sql" -Raw

if (-not $sqlContent) {
    Write-Host "❌ Could not read PHASE_2_INTEGRATION_TABLES.sql file" -ForegroundColor Red
    exit 1
}

try {
    # Execute SQL using curl (PowerShell equivalent)
    $headers = @{
        'Authorization' = "Bearer $SUPABASE_KEY"
        'Content-Type' = 'application/json'
        'apikey' = $SUPABASE_KEY
    }

    $body = @{
        query = $sqlContent
    } | ConvertTo-Json -Depth 10

    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/execute_sql" -Method Post -Headers $headers -Body $body

    Write-Host "✅ Phase 2 Integration database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Created Tables:" -ForegroundColor Cyan
    Write-Host "  • payment_logs - Payment transaction logging" -ForegroundColor White
    Write-Host "  • shipping_logs - Shipping activity tracking" -ForegroundColor White
    Write-Host "  • shipping_labels - Shipping label management" -ForegroundColor White
    Write-Host "  • erp_sync_logs - ERP synchronization logs" -ForegroundColor White
    Write-Host "  • erp_activity_logs - ERP activity tracking" -ForegroundColor White
    Write-Host "  • erp_endpoints - Custom ERP endpoints" -ForegroundColor White
    Write-Host "  • erp_sync_schedules - Automated sync scheduling" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Security Features:" -ForegroundColor Cyan
    Write-Host "  • Row Level Security (RLS) enabled" -ForegroundColor White
    Write-Host "  • Store owner access policies" -ForegroundColor White
    Write-Host "  • Customer data protection" -ForegroundColor White
    Write-Host ""
    Write-Host "⚡ Performance Features:" -ForegroundColor Cyan
    Write-Host "  • Optimized indexes created" -ForegroundColor White
    Write-Host "  • Automated triggers for timestamps" -ForegroundColor White
    Write-Host "  • Sample data inserted for testing" -ForegroundColor White
    Write-Host ""
    Write-Host "🎉 Phase 2 Integration Features Ready!" -ForegroundColor Green
    Write-Host "  • Payment Gateway Integration (15+ providers)" -ForegroundColor White
    Write-Host "  • Shipping & Logistics APIs (20+ providers)" -ForegroundColor White
    Write-Host "  • ERP System Integrations (6 major systems)" -ForegroundColor White

} catch {
    Write-Host "❌ Error setting up database:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Try alternative method using direct SQL execution
    Write-Host "🔄 Trying alternative setup method..." -ForegroundColor Yellow
    
    try {
        # Split SQL into individual statements and execute them
        $statements = $sqlContent -split ";\s*\r?\n" | Where-Object { $_.Trim() -ne "" }
        
        foreach ($statement in $statements) {
            if ($statement.Trim()) {
                $stmtBody = @{
                    query = $statement.Trim() + ";"
                } | ConvertTo-Json -Depth 10
                
                Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/execute_sql" -Method Post -Headers $headers -Body $stmtBody | Out-Null
            }
        }
        
        Write-Host "✅ Alternative setup method succeeded!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Alternative method also failed:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Test the new integration pages in your browser" -ForegroundColor White
Write-Host "  2. Configure payment gateway credentials in .env" -ForegroundColor White
Write-Host "  3. Set up shipping provider API keys" -ForegroundColor White
Write-Host "  4. Configure ERP system connections" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access Integration Pages:" -ForegroundColor Cyan
Write-Host "  • Payment Gateway: http://localhost:3000/store/payments" -ForegroundColor White
Write-Host "  • Shipping & Logistics: http://localhost:3000/store/shipping" -ForegroundColor White
Write-Host "  • ERP Integration: http://localhost:3000/store/erp" -ForegroundColor White

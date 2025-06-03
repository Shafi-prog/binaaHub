#!/usr/bin/env pwsh
# Test script for supervisor system enhancements

Write-Host "Testing Supervisor System Enhancements" -ForegroundColor Cyan
Write-Host "======================================"

# Set environment variables for testing
$env:NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-local-supabase-key"

# 1. Run unit tests
Write-Host "`nRunning unit tests..." -ForegroundColor Yellow
npm test

if ($LASTEXITCODE -ne 0) {
    Write-Host "Unit tests failed. Please fix before continuing." -ForegroundColor Red
    exit 1
}

# 2. Start the development server
Write-Host "`nStarting development server for API testing..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -NoNewWindow

# Wait for server to start
Write-Host "Waiting for server to start..."
Start-Sleep -Seconds 10

# 3. Test API endpoints
Write-Host "`nTesting API endpoints..." -ForegroundColor Yellow

# Helper function to test API endpoint
function Test-Endpoint {
    param (
        [string]$Method,
        [string]$Endpoint,
        [string]$Body,
        [string]$Description
    )
    
    Write-Host "  Testing: $Description" -NoNewline
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $env:TEST_AUTH_TOKEN"  # Ensure you have this set or pass it
        }
        
        $params = @{
            Method = $Method
            Uri = "http://localhost:3000/api/$Endpoint"
            Headers = $headers
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        Write-Host " - Success" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host " - Failed: $_" -ForegroundColor Red
        return $null
    }
}

# Test authorization endpoint
$authorizationTest = Test-Endpoint -Method "POST" -Endpoint "authorizations" `
    -Body '{"action":"request_authorization","userId":"test-user-id","projectId":"test-project-id","amount":1000,"purpose":"Test materials purchase","authorizationType":"one_time"}' `
    -Description "Authorization request"

# Test balance endpoint - add funds
$balanceAddTest = Test-Endpoint -Method "POST" -Endpoint "balance" `
    -Body '{"action":"add_funds","amount":500,"paymentMethod":"credit_card","description":"Test deposit"}' `
    -Description "Add funds to balance"

# Test balance endpoint - transaction history
$transactionHistoryTest = Test-Endpoint -Method "GET" -Endpoint "balance?action=transaction_history" `
    -Description "Get transaction history"

# Test commissions endpoint
$commissionsTest = Test-Endpoint -Method "GET" -Endpoint "commissions" `
    -Description "Get commission records"

# Test warranty endpoint
$warrantiesTest = Test-Endpoint -Method "GET" -Endpoint "warranties?action=project_warranties" `
    -Description "Get project warranties"

# 4. Stop the development server
Write-Host "`nStopping development server..." -ForegroundColor Yellow
Stop-Process -Id $serverProcess.Id -Force

# 5. Test Arabic translations
Write-Host "`nVerifying Arabic translations..." -ForegroundColor Yellow
$translationFile = Get-Content "src/hooks/useTranslation.ts" -Raw
$requiredArabicTerms = @(
    "العمولة",
    "الرصيد",
    "التفويض",
    "الضمانات",
    "سحب أموال",
    "إيداع أموال",
    "تفويض الإنفاق",
    "تتبع العمولات",
    "سجل المعاملات"
)

$missingTerms = @()
foreach ($term in $requiredArabicTerms) {
    if (-not ($translationFile -match [regex]::Escape($term))) {
        $missingTerms += $term
    }
}

if ($missingTerms.Count -gt 0) {
    Write-Host "Missing Arabic translations for:" -ForegroundColor Red
    $missingTerms | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
} else {
    Write-Host "All required Arabic terms are present in translation file!" -ForegroundColor Green
}

# 6. Summary
Write-Host "`nTest Summary" -ForegroundColor Cyan
Write-Host "==========="

# Function to display test result
function Show-TestResult {
    param (
        [string]$Name,
        [bool]$Success
    )
    
    $icon = if ($Success) { "✓" } else { "✗" }
    $color = if ($Success) { "Green" } else { "Red" }
    Write-Host "$icon $Name" -ForegroundColor $color
}

Show-TestResult -Name "Unit Tests" -Success ($LASTEXITCODE -eq 0)
Show-TestResult -Name "Authorization API" -Success ($null -ne $authorizationTest)
Show-TestResult -Name "Balance API" -Success ($null -ne $balanceAddTest)
Show-TestResult -Name "Transaction History API" -Success ($null -ne $transactionHistoryTest)
Show-TestResult -Name "Commissions API" -Success ($null -ne $commissionsTest)
Show-TestResult -Name "Warranties API" -Success ($null -ne $warrantiesTest)
Show-TestResult -Name "Arabic Translations" -Success ($missingTerms.Count -eq 0)

Write-Host "`nTest completed!" -ForegroundColor Cyan

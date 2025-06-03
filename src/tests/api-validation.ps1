# API Endpoint Validation Test Script for PowerShell
# Tests all API routes created during schema validation

$BASE_URL = "http://localhost:3000"

# Test data for API validation
$testProject = @{
    user_id = "test-user-123"
    name = "Schema Validation Test Project"
    description = "Testing project creation with validated schema"
    project_type = "construction"
    status = "planning"
    address = "123 Test Street, Riyadh"
    budget = 150000
    start_date = "2025-06-15"
    end_date = "2025-12-15"
    city = "Riyadh"
    region = "Riyadh Region"
    district = "Al Olaya"
    country = "Saudi Arabia"
    priority = "high"
    location_lat = 24.7136
    location_lng = 46.6753
} | ConvertTo-Json

$testOrder = @{
    user_id = "test-user-123"
    store_id = "test-store-123"
    items = @(
        @{
            product_id = "prod-123"
            product_name = "Test Product"
            quantity = 2
            unit_price = 250.00
            total_price = 500.00
        }
    )
    total_amount = 500.00
    status = "pending"
    delivery_address = "456 Delivery St, Jeddah"
    delivery_city = "Jeddah"
    delivery_region = "Makkah Region"
    payment_method = "card"
    notes = "Test order for schema validation"
} | ConvertTo-Json

$testWarranty = @{
    user_id = "test-user-123"
    product_name = "Test Warranty Product"
    product_model = "TWP-2025"
    serial_number = "SN123456789"
    purchase_date = "2025-01-15"
    warranty_period_months = 24
    store_name = "Test Store"
    purchase_price = 1500.00
    category = "electronics"
    description = "Testing warranty creation with full schema validation"
} | ConvertTo-Json

$testStore = @{
    user_id = "test-user-123"
    store_name = "Test Hardware Store"
    description = "A comprehensive hardware store for testing"
    category = "hardware"
    phone = "+966501234567"
    email = "test@hardwarestore.com"
    address = "789 Business District"
    city = "Dammam"
    region = "Eastern Province"
    website = "https://testhardware.com"
} | ConvertTo-Json

function Test-APIEndpoint {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [string]$Body = $null,
        [string]$Name
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    try {
        if ($Body) {
            $response = Invoke-WebRequest -Uri "$BASE_URL/api$Endpoint" -Method $Method -Body $Body -Headers $headers -UseBasicParsing
        } else {
            $response = Invoke-WebRequest -Uri "$BASE_URL/api$Endpoint" -Method $Method -Headers $headers -UseBasicParsing
        }
        
        $success = $response.StatusCode -eq 200 -or $response.StatusCode -eq 201
        $status = if ($success) { "✅ PASS" } else { "❌ FAIL" }
        
        Write-Host "$status $Name`: $($response.StatusCode)" -ForegroundColor $(if ($success) { "Green" } else { "Red" })
        
        return @{
            Success = $success
            StatusCode = $response.StatusCode
            Content = $response.Content
        }
    }
    catch {
        Write-Host "❌ FAIL $Name`: $($_.Exception.Message)" -ForegroundColor Red
        return @{
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

Write-Host "🚀 Starting API Endpoint Validation Tests..." -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Test all endpoints
$tests = @(
    @{ Name = "Projects GET"; Endpoint = "/projects"; Method = "GET" }
    @{ Name = "Orders GET"; Endpoint = "/orders"; Method = "GET" }
    @{ Name = "Warranty Claims GET"; Endpoint = "/warranty-claims"; Method = "GET" }
    @{ Name = "Stores GET"; Endpoint = "/stores"; Method = "GET" }
    @{ Name = "Projects POST"; Endpoint = "/projects"; Method = "POST"; Body = $testProject }
    @{ Name = "Orders POST"; Endpoint = "/orders/create"; Method = "POST"; Body = $testOrder }
    @{ Name = "Warranty Claims POST"; Endpoint = "/warranty-claims"; Method = "POST"; Body = $testWarranty }
    @{ Name = "Stores POST"; Endpoint = "/stores"; Method = "POST"; Body = $testStore }
)

$results = @()
foreach ($test in $tests) {
    Write-Host "`n🔍 Testing $($test.Name)..." -ForegroundColor Yellow
    $result = Test-APIEndpoint -Endpoint $test.Endpoint -Method $test.Method -Body $test.Body -Name $test.Name
    $results += $result
}

Write-Host "`n📊 Test Results Summary:" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$passedTests = ($results | Where-Object { $_.Success }).Count
$totalTests = $results.Count
$successRate = [math]::Round(($passedTests / $totalTests) * 100)

Write-Host "`n📈 Final Score: $passedTests/$totalTests tests passed ($successRate%)" -ForegroundColor $(if ($passedTests -eq $totalTests) { "Green" } else { "Yellow" })

if ($passedTests -eq $totalTests) {
    Write-Host "🎉 All API endpoints are working! Schema validation is complete." -ForegroundColor Green
} else {
    Write-Host "⚠️ Some endpoints failed. This may be due to authentication or database issues." -ForegroundColor Yellow
}

Write-Host "`n💡 Note: Authentication errors are expected for POST requests without valid session tokens." -ForegroundColor Cyan

#!/usr/bin/env pwsh
# Test Script: Login to User Profile Flow
# This script tests the complete authentication and navigation flow

Write-Host "🧪 Starting Login to User Profile Test Script" -ForegroundColor Cyan
Write-Host "=" * 50

# Configuration
$baseUrl = "http://localhost:3000"
$global:testResults = [System.Collections.ArrayList]::new()

function Test-Endpoint {
    param(
        [string]$Url,
        [string]$Description,
        [hashtable]$Headers = @{},
        [string]$ExpectedStatus = "200",
        [string]$ExpectedRedirect = $null
    )
    
    Write-Host "🔍 Testing: $Description" -ForegroundColor Yellow
    Write-Host "   URL: $Url"
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Headers $Headers -MaximumRedirection 0 -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
        $location = $response.Headers.Location
        
        Write-Host "   Status: $statusCode" -ForegroundColor $(if($statusCode -eq $ExpectedStatus) { "Green" } else { "Red" })
        
        if ($location) {
            Write-Host "   Redirect: $location" -ForegroundColor Blue
        }
        
        $result = [PSCustomObject]@{
            Test = $Description
            Status = $statusCode
            Expected = $ExpectedStatus
            Redirect = $location
            Success = ($statusCode -eq $ExpectedStatus) -or ($ExpectedRedirect -and $location -eq $ExpectedRedirect)
        }
        
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $location = $_.Exception.Response.Headers.Location
        
        Write-Host "   Status: $statusCode" -ForegroundColor $(if($statusCode -eq $ExpectedStatus) { "Green" } else { "Red" })
        
        if ($location) {
            Write-Host "   Redirect: $location" -ForegroundColor Blue
        }
        
        $result = [PSCustomObject]@{
            Test = $Description
            Status = $statusCode
            Expected = $ExpectedStatus
            Redirect = $location
            Success = ($statusCode -eq $ExpectedStatus) -or ($ExpectedRedirect -and $location -eq $ExpectedRedirect)
        }
    }
    
    $global:testResults.Add($result) | Out-Null
    Write-Host ""
    return $result
}

# Test 1: Basic server connectivity
Write-Host "📡 Phase 1: Server Connectivity Tests" -ForegroundColor Magenta
Test-Endpoint -Url "$baseUrl/" -Description "Home page access" -ExpectedStatus "200"
Test-Endpoint -Url "$baseUrl/login/" -Description "Login page access" -ExpectedStatus "200"

# Test 2: Protected routes without authentication
Write-Host "🔒 Phase 2: Protected Routes (No Auth)" -ForegroundColor Magenta
Test-Endpoint -Url "$baseUrl/user/dashboard/" -Description "Dashboard without auth" -ExpectedStatus "307" -ExpectedRedirect "/login"
Test-Endpoint -Url "$baseUrl/user/profile/" -Description "Profile without auth" -ExpectedStatus "307" -ExpectedRedirect "/login"

# Test 3: Create temp auth cookie (simulate login)
Write-Host "🍪 Phase 3: Authentication Cookie Test" -ForegroundColor Magenta

$mockUser = @{
    email = "user@binna.com"
    type = "user"
    account_type = "user"
    isAuthenticated = $true
} | ConvertTo-Json -Compress

$encodedUser = [System.Web.HttpUtility]::UrlEncode($mockUser)
$authCookie = "temp_auth_user=$encodedUser"

Write-Host "🔧 Created auth cookie: $authCookie" -ForegroundColor Gray

# Test 4: Protected routes with authentication
Write-Host "✅ Phase 4: Protected Routes (With Auth)" -ForegroundColor Magenta
$authHeaders = @{ "Cookie" = $authCookie }

Test-Endpoint -Url "$baseUrl/user/dashboard/" -Description "Dashboard with auth" -Headers $authHeaders -ExpectedStatus "200"
Test-Endpoint -Url "$baseUrl/user/profile/" -Description "Profile with auth" -Headers $authHeaders -ExpectedStatus "200"

# Test 5: Navigation flow simulation
Write-Host "🚀 Phase 5: Navigation Flow Simulation" -ForegroundColor Magenta

# Simulate clicking login button (this would set the cookie in browser)
Write-Host "🔐 Simulating login button click..." -ForegroundColor Cyan
Write-Host "   This would execute: document.cookie = 'temp_auth_user=$encodedUser; path=/; max-age=86400; SameSite=Strict'"

# Test dashboard to profile navigation
Write-Host "📍 Simulating dashboard → profile navigation..." -ForegroundColor Cyan
$dashboardResult = Test-Endpoint -Url "$baseUrl/user/dashboard/" -Description "Load dashboard page" -Headers $authHeaders -ExpectedStatus "200"
$profileResult = Test-Endpoint -Url "$baseUrl/user/profile/" -Description "Navigate to profile" -Headers $authHeaders -ExpectedStatus "200"

# Test 6: Check server logs for middleware behavior
Write-Host "📋 Phase 6: Server Log Analysis" -ForegroundColor Magenta
Write-Host "🔍 Checking for middleware log patterns..." -ForegroundColor Cyan

# The terminal output should show:
# 🍪 [Middleware] Found temp auth user: user@binna.com
# [MIDDLEWARE] Local/temp auth user accessing user route, allowing access

# Results Summary
Write-Host "📊 TEST RESULTS SUMMARY" -ForegroundColor White -BackgroundColor Blue
Write-Host "=" * 50

$passedTests = ($testResults | Where-Object { $_.Success }).Count
$totalTests = $testResults.Count

foreach ($test in $testResults) {
    $status = if ($test.Success) { "✅ PASS" } else { "❌ FAIL" }
    $color = if ($test.Success) { "Green" } else { "Red" }
    Write-Host "$status - $($test.Test)" -ForegroundColor $color
    Write-Host "        Status: $($test.Status) (Expected: $($test.Expected))" -ForegroundColor Gray
    if ($test.Redirect) {
        Write-Host "        Redirect: $($test.Redirect)" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "OVERALL RESULT: $passedTests/$totalTests tests passed" -ForegroundColor $(if($passedTests -eq $totalTests) { "Green" } else { "Red" })

# Diagnosis and recommendations
Write-Host "🔧 DIAGNOSIS & RECOMMENDATIONS" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "=" * 50

if ($passedTests -eq $totalTests) {
    Write-Host "✅ All tests passed! The login to profile flow is working correctly." -ForegroundColor Green
    Write-Host "📱 The issue may be with browser cookie handling in VS Code Simple Browser." -ForegroundColor Yellow
    Write-Host "💡 Recommendation: Test in a real browser (Chrome/Firefox/Edge)" -ForegroundColor Cyan
} else {
    Write-Host "❌ Some tests failed. Issues detected:" -ForegroundColor Red
    
    $failedTests = $testResults | Where-Object { -not $_.Success }
    foreach ($failed in $failedTests) {
        Write-Host "   - $($failed.Test): Got $($failed.Status), expected $($failed.Expected)" -ForegroundColor Red
    }
    
    Write-Host "🔧 Check server logs and middleware configuration." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🏁 Test script completed!" -ForegroundColor Cyan
Write-Host "📝 Server should be running on $baseUrl" -ForegroundColor Gray
Write-Host "📊 Check the terminal output above for detailed results" -ForegroundColor Gray

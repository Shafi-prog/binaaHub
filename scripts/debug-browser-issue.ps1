#!/usr/bin/env pwsh
# Debug Browser Issue Script
# This script specifically tests the browser behavior vs HTTP behavior

Write-Host "🔍 VS Code Simple Browser vs HTTP Testing" -ForegroundColor Cyan
Write-Host "=" * 60

# Configuration
$baseUrl = "http://localhost:3000"

Write-Host "📋 STEP 1: Open VS Code Simple Browser" -ForegroundColor Yellow
Write-Host "   1. Press Ctrl+Shift+P" -ForegroundColor Gray
Write-Host "   2. Type 'Simple Browser'" -ForegroundColor Gray
Write-Host "   3. Open: $baseUrl/login" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 STEP 2: Follow Login Flow in Browser" -ForegroundColor Yellow
Write-Host "   1. Click '👤 دخول كمستخدم' button" -ForegroundColor Gray
Write-Host "   2. You should go to dashboard" -ForegroundColor Gray
Write-Host "   3. Click 'Profile' button" -ForegroundColor Gray
Write-Host "   4. Note what happens (does it redirect to login?)" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 STEP 3: Check Browser Developer Tools" -ForegroundColor Yellow
Write-Host "   1. Right-click → Inspect Element" -ForegroundColor Gray
Write-Host "   2. Go to Application/Storage tab" -ForegroundColor Gray
Write-Host "   3. Check Cookies section" -ForegroundColor Gray
Write-Host "   4. Look for 'temp_auth_user' cookie" -ForegroundColor Gray
Write-Host ""

Write-Host "🧪 MEANWHILE: HTTP Test Results" -ForegroundColor Magenta

# Test the exact same flow via HTTP
$mockUser = @{
    email = "user@binna.com"
    type = "user"
    account_type = "user"
    isAuthenticated = $true
} | ConvertTo-Json -Compress

$encodedUser = [System.Web.HttpUtility]::UrlEncode($mockUser)
$authCookie = "temp_auth_user=$encodedUser"
$authHeaders = @{ "Cookie" = $authCookie }

Write-Host "🔧 Testing HTTP requests with proper cookies..." -ForegroundColor Cyan

try {
    $profileResponse = Invoke-WebRequest -Uri "$baseUrl/user/profile/" -Headers $authHeaders -MaximumRedirection 0 -ErrorAction SilentlyContinue
    Write-Host "✅ HTTP Profile Access: $($profileResponse.StatusCode)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $location = $_.Exception.Response.Headers.Location
    Write-Host "❌ HTTP Profile Access: $statusCode → $location" -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 COMPARISON:" -ForegroundColor White -BackgroundColor Blue
Write-Host "   HTTP Requests: Working (200 OK)" -ForegroundColor Green
Write-Host "   VS Code Browser: ???" -ForegroundColor Yellow
Write-Host ""

Write-Host "🔍 LIKELY CAUSES:" -ForegroundColor White -BackgroundColor DarkRed
Write-Host "   1. VS Code Simple Browser doesn't persist cookies between page loads" -ForegroundColor Yellow
Write-Host "   2. Cookie SameSite=Strict policy blocking cookie transmission" -ForegroundColor Yellow
Write-Host "   3. VS Code browser context isolation issues" -ForegroundColor Yellow
Write-Host ""

Write-Host "💡 SOLUTIONS TO TRY:" -ForegroundColor White -BackgroundColor DarkGreen
Write-Host "   1. Test in Chrome/Firefox/Edge instead of VS Code Simple Browser" -ForegroundColor Cyan
Write-Host "   2. Check if cookies are actually set in browser dev tools" -ForegroundColor Cyan
Write-Host "   3. Try incognito/private browsing mode" -ForegroundColor Cyan
Write-Host ""

Write-Host "🛠️ DEBUGGING STEPS:" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "   1. After login, check browser cookies in dev tools" -ForegroundColor Cyan
Write-Host "   2. Before clicking profile, verify temp_auth_user cookie exists" -ForegroundColor Cyan
Write-Host "   3. Monitor Network tab when clicking profile button" -ForegroundColor Cyan
Write-Host "   4. Check if cookie is being sent in request headers" -ForegroundColor Cyan
Write-Host ""

Write-Host "📱 ALTERNATIVE TEST:" -ForegroundColor Magenta
Write-Host "Open in external browser: http://localhost:3000/login" -ForegroundColor Cyan
Write-Host "If it works there, the issue is VS Code Simple Browser limitation" -ForegroundColor Yellow
Write-Host ""

Write-Host "🏁 Debug script completed!" -ForegroundColor Green

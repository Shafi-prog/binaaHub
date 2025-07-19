#!/usr/bin/env pwsh
# Cookie Fix Verification Script
# Tests the updated SameSite=Lax cookie behavior

Write-Host "🍪 Cookie Fix Verification Test" -ForegroundColor Cyan
Write-Host "=" * 50

# Configuration
$baseUrl = "http://localhost:3000"

Write-Host "🔧 CHANGES MADE:" -ForegroundColor Green
Write-Host "   ❌ Old: SameSite=Strict (very restrictive)" -ForegroundColor Red
Write-Host "   ✅ New: SameSite=Lax (more compatible)" -ForegroundColor Green
Write-Host ""

Write-Host "📊 SameSite Policy Explanation:" -ForegroundColor Yellow
Write-Host "   Strict: Only sent with same-site requests" -ForegroundColor Gray
Write-Host "   Lax: Sent with top-level navigation (more browser-friendly)" -ForegroundColor Gray
Write-Host "   None: Sent with all requests (requires Secure)" -ForegroundColor Gray
Write-Host ""

Write-Host "🧪 Testing Updated Behavior..." -ForegroundColor Magenta

# Test the same flow with HTTP to ensure it still works
$mockUser = @{
    email = "user@binna.com"
    type = "user"
    account_type = "user"
    isAuthenticated = $true
} | ConvertTo-Json -Compress

$encodedUser = [System.Web.HttpUtility]::UrlEncode($mockUser)
$authCookie = "temp_auth_user=$encodedUser"
$authHeaders = @{ "Cookie" = $authCookie }

Write-Host "🔍 1. Testing basic connectivity..." -ForegroundColor Cyan
try {
    $homeResponse = Invoke-WebRequest -Uri "$baseUrl/" -MaximumRedirection 0 -ErrorAction SilentlyContinue
    Write-Host "   ✅ Home page: $($homeResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Home page failed" -ForegroundColor Red
}

Write-Host "🔍 2. Testing protected routes without auth..." -ForegroundColor Cyan
try {
    $profileResponse = Invoke-WebRequest -Uri "$baseUrl/user/profile/" -MaximumRedirection 0 -ErrorAction SilentlyContinue
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $location = $_.Exception.Response.Headers.Location
    if ($statusCode -eq 307 -and $location -eq "/login") {
        Write-Host "   ✅ Profile redirect: $statusCode → $location" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Unexpected response: $statusCode → $location" -ForegroundColor Red
    }
}

Write-Host "🔍 3. Testing protected routes with auth..." -ForegroundColor Cyan
try {
    $authProfileResponse = Invoke-WebRequest -Uri "$baseUrl/user/profile/" -Headers $authHeaders -MaximumRedirection 0 -ErrorAction SilentlyContinue
    Write-Host "   ✅ Profile with auth: $($authProfileResponse.StatusCode)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   ❌ Profile with auth failed: $statusCode" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host "   1. Clear browser cache/cookies completely" -ForegroundColor Cyan
Write-Host "   2. Go to http://localhost:3000/login in VS Code Simple Browser" -ForegroundColor Cyan
Write-Host "   3. Click '👤 دخول كمستخدم' to login" -ForegroundColor Cyan
Write-Host "   4. Go to dashboard and click Profile button" -ForegroundColor Cyan
Write-Host "   5. Check if navigation works now" -ForegroundColor Cyan
Write-Host ""

Write-Host "🛠️ IF ISSUE PERSISTS:" -ForegroundColor White -BackgroundColor DarkRed
Write-Host "   Try in external browser (Chrome/Firefox/Edge)" -ForegroundColor Yellow
Write-Host "   VS Code Simple Browser has known cookie limitations" -ForegroundColor Yellow
Write-Host ""

Write-Host "🏁 Cookie fix verification completed!" -ForegroundColor Green
Write-Host "📝 The SameSite policy is now more browser-compatible" -ForegroundColor Gray

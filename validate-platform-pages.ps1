# Platform Pages Validator - PowerShell Script
# Validates all platform pages and checks their status

param(
    [switch]$Http,      # Check HTTP status of pages
    [switch]$Save,      # Save detailed report to file
    [switch]$Fix,       # Attempt to auto-fix common issues
    [string]$BaseUrl = "http://localhost:3000"
)

Write-Host "🔧 Platform Pages Validator" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
if ($BaseUrl -ne "http://localhost:3000") {
    $env:VERCEL_URL = $BaseUrl.Replace("https://", "").Replace("http://", "")
}

if ($Http) {
    $env:CHECK_HTTP = "true"
}

# Build command arguments
$args = @()
if ($Http) { $args += "--http" }
if ($Save) { $args += "--save" }

try {
    # Check if Node.js is available
    $nodeVersion = node --version 2>$null
    if (-not $nodeVersion) {
        throw "Node.js not found. Please install Node.js to run the validator."
    }
    
    Write-Host "📦 Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host ""
    
    # Run the validator
    if ($args.Count -gt 0) {
        node platform-pages-validator.js @args
    } else {
        node platform-pages-validator.js
    }
    
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "🎉 All checks passed!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  Some issues found. Check the report above." -ForegroundColor Yellow
    }
    
    # Auto-fix option
    if ($Fix -and $exitCode -ne 0) {
        Write-Host ""
        Write-Host "🔧 Attempting auto-fixes..." -ForegroundColor Yellow
        
        # Auto-fix common issues
        ./auto-fix-platform-pages.ps1
    }
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Usage examples
Write-Host ""
Write-Host "💡 Usage Examples:" -ForegroundColor Cyan
Write-Host "  .\validate-platform-pages.ps1                    # Basic validation"
Write-Host "  .\validate-platform-pages.ps1 -Http              # Include HTTP checks"
Write-Host "  .\validate-platform-pages.ps1 -Save              # Save report to file"
Write-Host "  .\validate-platform-pages.ps1 -Http -Save        # Full validation with report"
Write-Host "  .\validate-platform-pages.ps1 -Fix               # Auto-fix common issues"
Write-Host "  .\validate-platform-pages.ps1 -BaseUrl 'https://your-app.vercel.app'"

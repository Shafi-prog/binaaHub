# Quick Fix for Platform Pages
param(
    [switch]$DryRun
)

Write-Host "🔧 Quick Platform Pages Fix" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$fixedCount = 0
$pageFiles = Get-ChildItem -Path ".\src\app" -Recurse -Name "page.tsx"

foreach ($file in $pageFiles) {
    $fullPath = Join-Path ".\src\app" $file
    $content = Get-Content $fullPath -Raw
    $modified = $false
    
    # Remove @ts-nocheck
    if ($content -contains "@ts-nocheck") {
        Write-Host "Fixing: $file - Removing @ts-nocheck" -ForegroundColor Yellow
        $content = $content -replace "// @ts-nocheck", ""
        $content = $content -replace "/\* @ts-nocheck \*/", ""
        $modified = $true
    }
    
    # Add dynamic export if missing
    if ($content -match "'use client'" -and $content -notmatch "export const dynamic") {
        Write-Host "Fixing: $file - Adding dynamic export" -ForegroundColor Yellow
        $content = $content -replace "'use client';", "'use client';`n`nexport const dynamic = 'force-dynamic';"
        $modified = $true
    }
    
    if ($modified -and -not $DryRun) {
        Set-Content $fullPath $content -NoNewline
        $fixedCount++
        Write-Host "Fixed: $file" -ForegroundColor Green
    } elseif ($modified) {
        Write-Host "Would fix: $file" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Files processed: $($pageFiles.Count)" -ForegroundColor White
Write-Host "Files fixed: $fixedCount" -ForegroundColor Green

if ($DryRun) {
    Write-Host "Run without -DryRun to apply fixes" -ForegroundColor Yellow
}

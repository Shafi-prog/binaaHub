# Phase 1 Validation Script
# Validates TypeScript error reduction after import path fixes

Write-Host "🔍 PHASE 1 VALIDATION - Import Path Standardization" -ForegroundColor Green
Write-Host ("=" * 60) -ForegroundColor Gray

# Count current TypeScript errors
Write-Host "📊 Counting TypeScript errors..." -ForegroundColor Cyan

try {
    $errorOutput = & npx tsc --noEmit 2>&1
    $errorLines = $errorOutput | Where-Object { $_ -match "error TS" }
    $errorCount = $errorLines.Count
} catch {
    Write-Host "❌ Error running TypeScript check" -ForegroundColor Red
    $errorCount = 0
}

Write-Host "Current TypeScript errors: $errorCount" -ForegroundColor Yellow

# Expected targets
$originalErrors = 8514
$phase1Target = 5500
$expectedReduction = $originalErrors - $phase1Target

Write-Host ""
Write-Host "📈 PHASE 1 TARGETS:" -ForegroundColor White
Write-Host "  Original errors: $originalErrors" -ForegroundColor Gray
Write-Host "  Target after Phase 1: $phase1Target" -ForegroundColor Gray
Write-Host "  Expected reduction: $expectedReduction" -ForegroundColor Gray

# Calculate success
$actualReduction = $originalErrors - $errorCount
$successPercentage = [math]::Round(($actualReduction / $expectedReduction) * 100, 1)

Write-Host ""
Write-Host "🎯 PHASE 1 RESULTS:" -ForegroundColor White
Write-Host "  Actual reduction: $actualReduction" -ForegroundColor Green
if ($successPercentage -ge 80) {
    Write-Host "  Success rate: $successPercentage%" -ForegroundColor Green
} elseif ($successPercentage -ge 50) {
    Write-Host "  Success rate: $successPercentage%" -ForegroundColor Yellow
} else {
    Write-Host "  Success rate: $successPercentage%" -ForegroundColor Red
}

# Status assessment
if ($errorCount -le $phase1Target) {
    Write-Host "✅ PHASE 1 SUCCESS - Target achieved!" -ForegroundColor Green
    Write-Host "🚀 Ready to proceed to Phase 2" -ForegroundColor Cyan
} elseif ($actualReduction -ge ($expectedReduction * 0.5)) {
    Write-Host "⚠️  PHASE 1 PARTIAL SUCCESS" -ForegroundColor Yellow
    Write-Host "📝 Some improvement achieved, review and proceed" -ForegroundColor Yellow
} else {
    Write-Host "❌ PHASE 1 NEEDS ATTENTION" -ForegroundColor Red
    Write-Host "🔧 Check import patterns and path mappings" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 ERROR BREAKDOWN (Top 10):" -ForegroundColor White
if ($errorLines.Count -gt 0) {
    $errorBreakdown = $errorLines | Group-Object { ($_ -split ":")[0] } | Sort-Object Count -Descending | Select-Object -First 10
    foreach ($group in $errorBreakdown) {
        $fileName = [System.IO.Path]::GetFileName($group.Name)
        Write-Host "  $($group.Count) errors in $fileName" -ForegroundColor Gray
    }
} else {
    Write-Host "  No errors found!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor White
Write-Host "1. If successful: Run Phase 2 (Type declarations)" -ForegroundColor Gray
Write-Host "2. If partial: Review import patterns manually" -ForegroundColor Gray  
Write-Host "3. If failed: Check tsconfig.json path mappings" -ForegroundColor Gray

Write-Host ""
Write-Host "⚡ QUICK COMMANDS:" -ForegroundColor White
Write-Host "  Check errors: npm run type-check" -ForegroundColor Gray
Write-Host "  Count errors: npm run type-check-count" -ForegroundColor Gray
Write-Host "  Proceed Phase 2: powershell ./scripts/setup-types.ps1" -ForegroundColor Gray
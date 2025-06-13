# BinnaHub Cleanup Script - Before Git Commit
# This script removes unnecessary files and directories before committing to main branch

Write-Host "🧹 Starting BinnaHub Cleanup Process..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Change to the project directory
Set-Location "c:\Users\hp\BinnaCodes\binna"

# Documentation files to delete (development progress reports)
$docsToDelete = @(
    "ALL_ISSUES_RESOLVED.md",
    "AUTHENTICATION_SYSTEM_COMPLETE.md", 
    "BARCODE_SCANNER_TESTING_GUIDE.md",
    "BUILD_SUCCESS_REPORT.md",
    "CLEANUP_SUCCESS_REPORT.md",
    "COMPLETE_REDIRECT_LOOP_SOLUTION.md",
    "COMPLETE_STORE_ERP_UNIFICATION_FINAL.md",
    "DASHBOARD_BEST_PRACTICES_IMPLEMENTATION.md",
    "DASHBOARD_ERROR_FIXED.md",
    "DUPLICATE_EMAIL_FIXED.md",
    "ENHANCED_CUSTOMER_SEARCH_COMPLETE.md",
    "ERP_SYSTEM_NAVIGATION_FIXED.md",
    "FOREIGN_KEY_FINAL_FIX.md",
    "FOREIGN_KEY_ISSUE_FIXED.md",
    "INVITATION_CARD_STYLING_UPDATED.md",
    "IS_ACTIVE_COLUMN_FIXED.md",
    "LATEST_DEVELOPMENT_PROGRESS.md",
    "LOGIN_ISSUE_RESOLVED.md",
    "MEDUSA_AUTH_COMPLETION_REPORT.md",
    "MEDUSA_STORE_API_ALIGNMENT_COMPLETE.md",
    "MEDUSA_STORE_API_URLS.md",
    "MEDUSA_STORE_URLS_GUIDE.md",
    "MOBILE_RESPONSIVENESS_REPORT.md",
    "NAVBAR_RESTORATION_COMPLETE.md",
    "PRODUCTION_DATABASE_CONFIG_COMPLETE.md",
    "PRODUCTION_USERS_CREATED_SUCCESS.md",
    "RADICAL_DASHBOARD_SIMPLIFICATION_COMPLETE.md",
    "READY_TO_TEST.md",
    "REDIRECT_ISSUE_ANALYSIS.md",
    "REDIRECT_LOOP_FINAL_RESOLUTION.md",
    "REDIRECT_LOOP_FIX_COMPLETE.md",
    "SIGNUP_ACCOUNT_TYPES_COMPLETE.md",
    "STORES_API_TESTING_GUIDE.md",
    "STORE_DASHBOARD_IMPROVEMENTS.md",
    "STORE_DASHBOARD_REFACTORING_COMPLETE.md",
    "STORE_DASHBOARD_UNIFICATION_COMPLETE.md",
    "STORE_ERP_ANALYSIS.md",
    "STORE_ERP_UNIFICATION_PHASE1_COMPLETE.md",
    "UNIFIED_ARCHITECTURE.md",
    "USER_MANAGEMENT_COMPLETE.md"
)

# Debug/Test scripts to delete
$scriptsToDelete = @(
    "analyze-dashboard-duplication.js",
    "analyze-store-erp-duplications.js",
    "change-user-passwords.js",
    "cleanup-and-create-users.js",
    "dashboard-layout-summary.js",
    "demo-barcode-implementation.js",
    "erp-status-check.js",
    "find-key-table.js",
    "generate-jwt-tokens.js",
    "get-publishable-key.js",
    "get-service-role-key-help.js",
    "get-service-role-key.js",
    "reset-passwords.js",
    "server.js",
    "validate-erp.js",
    "validate-service-role-key.js",
    "test-barcode-scanner.md",
    "setup-construction-materials.sh",
    "final-cleanup.ps1",
    "cleanup-debug-files.ps1",
    "cleanup-temp-files.ps1"
)

# SQL test files to delete  
$sqlFilesToDelete = @(
    "complete-test-setup.sql",
    "erp-enhanced-schema.sql", 
    "final-safe-test-data.sql",
    "MANUAL_MIGRATION_SUPABASE.sql",
    "safe-index-creation.sql",
    "SAFE_MIGRATION_FIX.sql",
    "setup-invoice-test-data-fixed.sql",
    "setup-invoice-test-data.sql",
    "simple-test-data-setup.sql",
    "simplified-store-migration.sql",
    "STEP_BY_STEP_MIGRATION_FIX.sql",
    "ultra-simple-test-data.sql",
    "VERIFY_MIGRATION.sql",
    "working-test-setup.sql",
    "check-user-role-enum.sql"
)

# Directories to delete (duplicates/unused)
$directoriesToDelete = @(
    "binnahub",
    "binnahub-storefront",
    "medusa", 
    "medusa-backend",
    "medusa-backend-storefront",
    "tests",
    "tsconfig"
)

# Delete documentation files
Write-Host "📄 Cleaning up documentation files..." -ForegroundColor Yellow
$docsDeleted = 0
foreach ($file in $docsToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "   ✅ Deleted: $file" -ForegroundColor Green
        $docsDeleted++
    }
}
Write-Host "   📊 Deleted $docsDeleted documentation files" -ForegroundColor Cyan

# Delete test/debug scripts
Write-Host "🔧 Cleaning up test and debug scripts..." -ForegroundColor Yellow
$scriptsDeleted = 0
foreach ($file in $scriptsToDelete) {
    if (Test-Path $file) {  
        Remove-Item $file -Force
        Write-Host "   ✅ Deleted: $file" -ForegroundColor Green
        $scriptsDeleted++
    }
}
Write-Host "   📊 Deleted $scriptsDeleted script files" -ForegroundColor Cyan

# Delete SQL test files
Write-Host "🗄️ Cleaning up SQL test files..." -ForegroundColor Yellow
$sqlDeleted = 0
foreach ($file in $sqlFilesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "   ✅ Deleted: $file" -ForegroundColor Green
        $sqlDeleted++
    }
}
Write-Host "   📊 Deleted $sqlDeleted SQL files" -ForegroundColor Cyan

# Delete unused directories
Write-Host "📁 Cleaning up unused directories..." -ForegroundColor Yellow
$dirsDeleted = 0
foreach ($dir in $directoriesToDelete) {
    if (Test-Path $dir) {
        $size = (Get-ChildItem $dir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Remove-Item $dir -Recurse -Force
        Write-Host "   ✅ Deleted directory: $dir (~$([math]::Round($size, 1))MB)" -ForegroundColor Green
        $dirsDeleted++
    }
}
Write-Host "   📊 Deleted $dirsDeleted directories" -ForegroundColor Cyan

# Final summary
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "🎉 Cleanup Complete!" -ForegroundColor Green
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   • Documentation files: $docsDeleted" -ForegroundColor White
Write-Host "   • Script files: $scriptsDeleted" -ForegroundColor White  
Write-Host "   • SQL files: $sqlDeleted" -ForegroundColor White
Write-Host "   • Directories: $dirsDeleted" -ForegroundColor White
Write-Host "   • Total files cleaned: $($docsDeleted + $scriptsDeleted + $sqlDeleted)" -ForegroundColor White

Write-Host ""
Write-Host "✅ Repository is now clean and ready for git commit!" -ForegroundColor Green
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "   1. git add ." -ForegroundColor White
Write-Host "   2. git commit -m 'Refactor store dashboard and cleanup repository'" -ForegroundColor White
Write-Host "   3. git push origin main" -ForegroundColor White

/**
 * BINNA FOLDER ORGANIZATION SCRIPT
 * Moves all scripts, docs, and other files into organized folders
 */

const fs = require('fs');
const path = require('path');

console.log('🗂️  ORGANIZING BINNA FOLDER STRUCTURE');
console.log('Moving files into organized directories...\n');

// Define the organization structure
const ORGANIZATION_STRUCTURE = {
    // JavaScript and PowerShell scripts
    'scripts/': [
        'advanced-page-validator.js',
        'analyze-ecommerce-flow.js',
        'analyze-store-data.js',
        'analyze-store-features.js',
        'auto-fix-buttons.js',
        'auto-fix-pages.js',
        'auto-fix-platform-pages.ps1',
        'auto-fix-user-dashboard.js',
        'check-all-buttons-clickability.js',
        'check-all-users-improved.js',
        'check-all-users.js',
        'check-database-contents.js',
        'check-mock-data-detailed.js',
        'check-supabase-tables.js',
        'check-user-pages-connectivity.js',
        'check-user-pages-integration.js',
        'clean-remaining-mock-data.js',
        'cleanup-remaining-v1.js',
        'compare-medusa.ps1',
        'complete-cleanup.js',
        'comprehensive-db-setup.js',
        'comprehensive-store-checker.js',
        'content-similarity-checker.js',
        'convert-store-data.js',
        'core-marketplace-duplicate-checker.js',
        'create-clean-templates.js',
        'create-supabase-schema.js',
        'critical-functional-cleanup.js',
        'database-management.js',
        'db-management.ps1',
        'debug-browser-issue.ps1',
        'deep-redundancy-cleanup.js',
        'deep-redundancy-search.js',
        'deep-similarity-analyzer.js',
        'detailed-investigation.js',
        'diagnose-blank-pages.js',
        'diagnose-pos.js',
        'eliminate-all-versions.js',
        'enforce-english-numerals.js',
        'final-mock-data-check.js',
        'final-platform-fix.js',
        'final-use-data-table-fix.js',
        'final-version-cleanup.js',
        'fix-all-imports.js',
        'fix-all-typography-variants.js',
        'fix-arabic-translations.js',
        'fix-broken-imports.js',
        'fix-final-typescript-errors.js',
        'fix-final-typescript.js',
        'fix-loading-spinner-imports.js',
        'fix-malformed-imports.js',
        'fix-missing-imports.js',
        'fix-remaining-userdata.js',
        'fix-store-errors.js',
        'fix-store-pages.js',
        'fix-tolocalestring.js',
        'fix-typescript-errors.js',
        'fix-typography-errors.js',
        'fix-user-data-imports.js',
        'focused-hook-duplicate-checker.js',
        'investigate-data-mismatch.js',
        'medusa-safety-check.js',
        'migrate-to-real-data.ps1',
        'next-commit-prep.js',
        'node-auto-fix.js',
        'platform-pages-validator.js',
        'quick-connectivity-test.js',
        'quick-fix.ps1',
        'quick-import-fix.js',
        'remove-all-mock-data.js',
        'remove-construction-products.js',
        'remove-mock-data-comprehensive.js',
        'remove-mock-data-precise.js',
        'remove-redundancy.js',
        'rename-files-clean.js',
        'reorganize-docs.js',
        'replace-broken-files.js',
        'run-create-tables.js',
        'safe-medusa-aware-cleanup.js',
        'safe-redundancy-cleanup.js',
        'seed-supabase-data.js',
        'setup-real-data.ps1',
        'simple-auto-fix.ps1',
        'simple-test.js',
        'store-validation-summary.js',
        'targeted-hook-cleanup.js',
        'test-complete-implementation.js',
        'test-database-connectivity.js',
        'test-db-simple.js',
        'test-db.js',
        'test-formatting.js',
        'test-login-credentials.js',
        'test-sidebar-navigation.js',
        'test-supabase-connection.js',
        'test-supabase-data.js',
        'undo-button-fixes.js',
        'update-documentation-urls.js',
        'update-loading-imports.ps1',
        'validate-page-navigation.js',
        'validate-platform-pages.ps1',
        'validate-store-connections.js',
        'validate-store-pages.js',
        'validate-user-dashboard.js',
        'validate-user-pages-final.js',
        'verify-deployment.js',
        'verify-english-numerals.js',
        'verify-login-buttons.js',
        'verify-pages-vs-old-commits.js',
        'verify-real-data-integration.js'
    ],

    // SQL files and database scripts
    'database/': [
        'add-missing-users.sql',
        'analyze-rls-recursion.sql',
        'complete-multi-user-reset.sql',
        'complete-rls-reset.sql',
        'create-comprehensive-tables.sql',
        'create-rls-policies.sql',
        'create-tables.sql',
        'diagnose-rls-policies.sql',
        'fix-function-search-path.sql',
        'fix-rls-policies.sql',
        'fix-security-definer-views.sql',
        'quick-rls-check.sql',
        'safe-multi-user-policies.sql',
        'safe-rls-policies.sql',
        'supabase-schema.sql'
    ],

    // Documentation and reports
    'docs/reports/': [
        'ADMIN_DEMO_LOGIN_COMPLETE.md',
        'AI_CONSTRUCTION_JOURNEY_ENHANCEMENT_PROMPT.md',
        'AI_FEATURES_ANALYSIS_REPORT.md',
        'AI_UNIFICATION_REPORT.md',
        'AUTHENTICATION_FIXES_SUMMARY.md',
        'AUTH_FOLDER_ORGANIZATION_COMPLETE.md',
        'AUTH_STRUCTURE_ANALYSIS.md',
        'CLEANUP_COMPLETION_REPORT.md',
        'CLEAN_URL_STRUCTURE_COMPLETE.md',
        'COMPLETE_REDUNDANCY_CLEANUP_SUCCESS_REPORT.md',
        'COMPREHENSIVE_DATABASE_COMPLETION_REPORT.md',
        'COMPREHENSIVE_DATA_REPORT.md',
        'COMPREHENSIVE_DEVELOPMENT_PLAN.md',
        'CONSTRUCTION_PRODUCTS_REMOVAL_REPORT.md',
        'CORE_MARKETPLACE_DUPLICATE_ANALYSIS_REPORT.md',
        'CREATE_PAGES_INTEGRATION_SUCCESS_REPORT.md',
        'CUSTOMER_MANAGEMENT_ENHANCEMENT_COMPLETION_REPORT.md',
        'DASHBOARD_INTEGRATION_REPORT.md',
        'DATABASE_SETUP_INSTRUCTIONS.md',
        'DEEP_CLEANUP_REPORT.md',
        'DETAILED_MOCK_DATA_REPORT.md',
        'ENGLISH_NUMERALS_IMPLEMENTATION_REPORT.md',
        'ENV_CONFIGURATION.md',
        'ENV_UNIFICATION_REPORT.md',
        'ERP_CONSOLIDATION_ANALYSIS.md',
        'ERP_FEATURE_ANALYSIS_RAWAA_COMPARISON.md',
        'ERP_INTEGRATION_COMPLETION_REPORT.md',
        'ERP_SYSTEMS_COMPREHENSIVE_COMPARISON.md',
        'ERP_SYSTEMS_INTEGRATION_COMPLETION_REPORT.md',
        'FINAL_CLEAN_STRUCTURE.txt',
        'FINAL_CONSOLIDATION_IMPLEMENTATION_PLAN.md',
        'IMPLEMENTATION_ACTION_PLAN.md',
        'IMPLEMENTATION_STATUS_REPORT.md',
        'LEGACY_AI_CLEANUP_PLAN.md',
        'LOGIN_BUTTONS_CONFIRMATION.md',
        'MEDUSA_BINNA_STORE_FEATURES_ANALYSIS.md',
        'MEDUSA_INTEGRATION_PHASE1_COMPLETION_REPORT.md',
        'MEDUSA_SAFE_CLEANUP_COMPLETION_REPORT.md',
        'MIGRATION_SUCCESS_REPORT.md',
        'MOCK_DATA_REMOVAL_REPORT.md',
        'PAGE_VALIDATION_SUCCESS_REPORT.md',
        'platform-cleanup-action-plan.md',
        'PLATFORM_CLEANUP_SUCCESS_REPORT.md',
        'PLATFORM_DIRECTORY_STRUCTURE.md',
        'PLATFORM_PAGES_DOCUMENTATION.md',
        'PLATFORM_TREE_CLEAN.md',
        'PLATFORM_VALIDATION_GUIDE.md',
        'POST_CLEANUP_PLATFORM_TREE.txt',
        'POST_CLEANUP_STRUCTURE.md',
        'POS_SETUP_GUIDE.md',
        'profile-fix-complete.md',
        'PURCHASE_ORDER_SUPPLIER_MANAGEMENT_COMPLETION_REPORT.md',
        'QUICK_PAGE_NAVIGATOR.md',
        'REAL_CONNECTIONS_IMPLEMENTATION.md',
        'REAL_DATA_INTEGRATION_COMPLETE.md',
        'REAL_DATA_MIGRATION_COMPLETE.md',
        'REDUNDANCY_CLEANUP_COMPLETE_REPORT.md',
        'ROUTING_REORGANIZATION_PLAN.md',
        'SCRIPTS_COMPLETION_REPORT.md',
        'SECURITY_FIXES_INSTRUCTIONS.md',
        'SIDEBAR_ERP_COMPARISON_ANALYSIS.md',
        'STEP_1_COMPLETION_REPORT.md',
        'STEP_4_AUTH_CLEANUP_COMPLETION_REPORT.md',
        'STORE_CONNECTION_VALIDATION.md',
        'STORE_DATA_CONVERSION_LOG.md',
        'STORE_INTEGRATION_FINAL_CONFIRMATION.md',
        'STORE_PAGES_DATA_ANALYSIS.md',
        'STORE_PAGES_ENHANCEMENT_PLAN.md',
        'STORE_PAGES_FINAL_REPORT.md',
        'SUPABASE_AUTHENTICATION_FIX_REPORT.md',
        'SUPABASE_INTEGRATION_GUIDE.md',
        'SUPABASE_SCHEMA_VERIFICATION.md',
        'TYPESCRIPT_ERRORS_FIXED_REPORT.md',
        'TYPESCRIPT_ERRORS_RESOLUTION_COMPLETION_REPORT.md',
        'TYPESCRIPT_FIXES_PROGRESS_REPORT.md',
        'USER_PAGES_CONNECTIVITY_SUCCESS_REPORT.md'
    ],

    // JSON reports and analysis files
    'reports/json/': [
        'arabic-translation-fixes-report.json',
        'button-auto-fix-report.json',
        'button-clickability-report.json',
        'deployment-verification.json',
        'store-pages-comprehensive-report.json',
        'store-validation-report.json',
        'user-pages-connection-report.json'
    ],

    // Text files and lists
    'docs/lists/': [
        'binna-unique-files.txt',
        'directory_structure.txt',
        'platform_tree_verification.txt'
    ],

    // Backup folders (move to backup directory)
    'backup/': [
        'button-fixes-backup/',
        'redundancy-cleanup-backup/'
    ],

    // HTML and other misc files
    'docs/misc/': [
        'setup-auth.html'
    ]
};

// Create directories if they don't exist
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dirPath}`);
    }
}

// Move file to target directory
function moveFile(sourceFile, targetDir) {
    const sourcePath = path.resolve(sourceFile);
    const targetPath = path.resolve(targetDir, path.basename(sourceFile));
    
    if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  Source file not found: ${sourceFile}`);
        return false;
    }
    
    try {
        // Ensure target directory exists
        ensureDirectoryExists(targetDir);
        
        // Move the file
        fs.renameSync(sourcePath, targetPath);
        console.log(`   ✅ Moved: ${sourceFile} → ${targetDir}`);
        return true;
    } catch (error) {
        console.log(`   ❌ Failed to move ${sourceFile}: ${error.message}`);
        return false;
    }
}

// Execute the organization
let totalMoved = 0;
let totalFailed = 0;

console.log('📂 CREATING DIRECTORY STRUCTURE...');
for (const directory in ORGANIZATION_STRUCTURE) {
    ensureDirectoryExists(directory);
}

console.log('\n📦 MOVING FILES...');
for (const [targetDir, files] of Object.entries(ORGANIZATION_STRUCTURE)) {
    console.log(`\n📁 Moving files to ${targetDir}:`);
    
    for (const file of files) {
        if (moveFile(file, targetDir)) {
            totalMoved++;
        } else {
            totalFailed++;
        }
    }
}

console.log('\n📊 ORGANIZATION SUMMARY:');
console.log(`   ✅ Files moved successfully: ${totalMoved}`);
console.log(`   ❌ Files failed to move: ${totalFailed}`);
console.log(`   📁 Directories created: ${Object.keys(ORGANIZATION_STRUCTURE).length}`);

console.log('\n🎯 NEW FOLDER STRUCTURE:');
console.log('   📁 scripts/ - All automation and utility scripts');
console.log('   📁 database/ - SQL files and database management');
console.log('   📁 docs/reports/ - Documentation and completion reports');
console.log('   📁 reports/json/ - JSON analysis and report files');
console.log('   📁 docs/lists/ - Text files and directory listings');
console.log('   📁 backup/ - Backup folders and archived files');
console.log('   📁 docs/misc/ - HTML files and miscellaneous docs');

console.log('\n🎉 BINNA FOLDER ORGANIZATION COMPLETE!');
console.log('Your workspace is now clean and organized! 🗂️✨');

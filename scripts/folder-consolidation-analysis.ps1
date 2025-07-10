# BINNA FOLDER CONSOLIDATION ANALYSIS
# Comprehensive analysis of folders that can be merged and unified

Write-Host "🔍 BINNA FOLDER CONSOLIDATION ANALYSIS" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow

# Create backup first
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "backups\folder-consolidation-$timestamp"

Write-Host "`n📦 Creating analysis backup..." -ForegroundColor Cyan
if (Test-Path $backupDir) { Remove-Item $backupDir -Recurse -Force }
New-Item -Path $backupDir -ItemType Directory -Force | Out-Null

# Backup structure before changes
$structureBackup = @()

Write-Host "`n📊 ANALYSIS RESULTS:" -ForegroundColor Green

# 1. CONFIGURATION FILES DUPLICATION
Write-Host "`n1️⃣ CONFIGURATION FILES DUPLICATION DETECTED:" -ForegroundColor Red

$duplicateConfigs = @{
    "eslint.config.js" = @("Root", "config/")
    "next.config.js" = @("Root", "config/")  
    "postcss.config.js" = @("Root", "config/")
    "prettier.config.js" = @("Root", "config/")
    "tailwind.config.js" = @("Root", "config/")
}

foreach ($config in $duplicateConfigs.Keys) {
    Write-Host "   🔴 $config found in: $($duplicateConfigs[$config] -join ', ')" -ForegroundColor Red
}

Write-Host "`n   💡 RECOMMENDATION: Keep config files in ROOT (standard practice)" -ForegroundColor Yellow
Write-Host "   📝 ACTION: Remove duplicates from config/ folder" -ForegroundColor Yellow

# Add logic to remove duplicate config files from root.
Write-Host "   🗑️ Removing duplicate config files from root..." -ForegroundColor Yellow
Remove-Item -Path "eslint.config.js", "next.config.js", "postcss.config.js", "prettier.config.js", "tailwind.config.js" -Force

# 2. MULTIPLE TSCONFIG FILES
Write-Host "`n2️⃣ MULTIPLE TSCONFIG FILES:" -ForegroundColor Orange

$tsconfigFiles = Get-ChildItem -Path "." -File | Where-Object { $_.Name -like "tsconfig*" }
Write-Host "   📄 Found $($tsconfigFiles.Count) tsconfig files:"
$tsconfigFiles | ForEach-Object { Write-Host "     - $($_.Name)" -ForegroundColor Gray }

Write-Host "`n   💡 RECOMMENDATION: Consolidate to essential configs only" -ForegroundColor Yellow
Write-Host "   📝 KEEP: tsconfig.json (main)" -ForegroundColor Green
Write-Host "   📝 ARCHIVE: Other variants to archive/" -ForegroundColor Yellow

# 3. DATA CONSOLIDATION OPPORTUNITIES
Write-Host "`n3️⃣ DATA FOLDER CONSOLIDATION:" -ForegroundColor Orange

Write-Host "   📁 Current data/ contents:"
Get-ChildItem "data" -File | ForEach-Object { Write-Host "     - $($_.Name)" -ForegroundColor Gray }

Write-Host "`n   💡 RECOMMENDATION: Move to more specific locations" -ForegroundColor Yellow
Write-Host "   📝 api-key-replacement.txt → config/" -ForegroundColor Green
Write-Host "   📝 binna_modules.txt, binna_routes.txt → docs/" -ForegroundColor Green
Write-Host "   📝 local-users.json → database/test-data/" -ForegroundColor Green

# 4. TEMP FOLDER CLEANUP
Write-Host "`n4️⃣ TEMP FOLDER CLEANUP:" -ForegroundColor Orange

$tempFiles = Get-ChildItem "temp" -File
Write-Host "   📁 Temp files found: $($tempFiles.Count)"
$tempFiles | ForEach-Object { 
    $size = if ($_.Length -eq 0) { "EMPTY" } else { "$($_.Length) bytes" }
    Write-Host "     - $($_.Name) ($size)" -ForegroundColor Gray 
}

Write-Host "`n   💡 RECOMMENDATION: Clean empty/test files" -ForegroundColor Yellow

# 5. SCRIPTS ORGANIZATION
Write-Host "`n5️⃣ SCRIPTS FOLDER ORGANIZATION:" -ForegroundColor Orange

$scriptFiles = Get-ChildItem "scripts" -File | Measure-Object
$scriptDirs = Get-ChildItem "scripts" -Directory
Write-Host "   📁 Scripts: $($scriptFiles.Count) files, $($scriptDirs.Count) subdirs"

Write-Host "`n   💡 RECOMMENDATION: Better organization needed" -ForegroundColor Yellow
Write-Host "   📝 CREATE: scripts/build/, scripts/deploy/, scripts/maintenance/" -ForegroundColor Green

# 6. BACKEND CONSOLIDATION
Write-Host "`n6️⃣ BACKEND FOLDER ANALYSIS:" -ForegroundColor Orange

$backendDirs = Get-ChildItem "backend" -Directory
Write-Host "   📁 Backend systems: $($backendDirs.Count)"
$backendDirs | ForEach-Object { Write-Host "     - $($_.Name)" -ForegroundColor Gray }

Write-Host "`n   💡 RECOMMENDATION: Evaluate if all backends are needed" -ForegroundColor Yellow

# 7. DOCUMENTATION CONSOLIDATION  
Write-Host "`n7️⃣ DOCUMENTATION ANALYSIS:" -ForegroundColor Orange

$docFiles = Get-ChildItem "docs" -File | Measure-Object
Write-Host "   📁 Documentation files: $($docFiles.Count)"

Write-Host "`n   💡 RECOMMENDATION: Organize by category" -ForegroundColor Yellow
Write-Host "   📝 CREATE: docs/technical/, docs/business/, docs/deployment/" -ForegroundColor Green

Write-Host "`n🎯 CONSOLIDATION PRIORITY MATRIX:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$priorities = @(
    @{Priority="HIGH"; Item="Remove duplicate config files"; Impact="High"; Effort="Low"}
    @{Priority="HIGH"; Item="Clean temp folder"; Impact="Medium"; Effort="Low"}
    @{Priority="MEDIUM"; Item="Consolidate tsconfig files"; Impact="Medium"; Effort="Medium"}
    @{Priority="MEDIUM"; Item="Reorganize data folder"; Impact="Medium"; Effort="Medium"}
    @{Priority="LOW"; Item="Organize scripts subfolder"; Impact="Low"; Effort="Medium"}
    @{Priority="REVIEW"; Item="Evaluate backend necessity"; Impact="High"; Effort="High"}
)

$priorities | ForEach-Object {
    $color = switch($_.Priority) {
        "HIGH" { "Red" }
        "MEDIUM" { "Yellow" }
        "LOW" { "Green" }
        "REVIEW" { "Cyan" }
    }
    Write-Host "   $($_.Priority): $($_.Item)" -ForegroundColor $color
    Write-Host "       Impact: $($_.Impact), Effort: $($_.Effort)" -ForegroundColor Gray
}

Write-Host "`n📋 RECOMMENDED CONSOLIDATION PLAN:" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

Write-Host "
PHASE 1: IMMEDIATE CLEANUP (High Priority)
✅ Remove duplicate config files from config/ folder
✅ Clean empty files from temp/ folder  
✅ Archive unused tsconfig variants

PHASE 2: STRUCTURAL REORGANIZATION (Medium Priority)
✅ Move data files to appropriate locations
✅ Organize scripts into categories
✅ Consolidate documentation structure

PHASE 3: STRATEGIC REVIEW (Low Priority)
✅ Evaluate backend systems necessity
✅ Optimize folder structure for Phase 2 domains
✅ Create deployment-ready structure
" -ForegroundColor White

Write-Host "🚀 READY TO EXECUTE CONSOLIDATION?" -ForegroundColor Yellow
Write-Host "   Run: .\scripts\execute-folder-consolidation.ps1" -ForegroundColor Cyan

Write-Host "`n📦 Analysis backup created at: $backupDir" -ForegroundColor Gray
Write-Host "🕐 Analysis completed at: $(Get-Date)" -ForegroundColor Gray

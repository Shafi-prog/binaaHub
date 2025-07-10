# BINNA FOLDER CONSOLIDATION SCRIPT
# Executes the folder consolidation plan to unify and merge folders

Write-Host "🚀 BINNA FOLDER CONSOLIDATION EXECUTION" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

# Create comprehensive backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "backups\pre-consolidation-$timestamp"

Write-Host "`n📦 Creating comprehensive backup..." -ForegroundColor Cyan
if (Test-Path $backupDir) { Remove-Item $backupDir -Recurse -Force }
New-Item -Path $backupDir -ItemType Directory -Force | Out-Null

# Backup affected folders
$foldersToBackup = @("config", "data", "temp", "docs", "scripts", ".")
foreach ($folder in $foldersToBackup) {
    if ($folder -eq ".") {
        # Backup root config files only
        Get-ChildItem -Path "." -File | Where-Object { $_.Name -match "(config|tsconfig)" } | ForEach-Object {
            Copy-Item $_.FullName -Destination "$backupDir\root-$($_.Name)" -Force
        }
    } else {
        if (Test-Path $folder) {
            $destPath = Join-Path $backupDir $folder
            New-Item -Path (Split-Path $destPath -Parent) -ItemType Directory -Force | Out-Null
            Copy-Item $folder -Destination $destPath -Recurse -Force
            Write-Host "  ✅ Backed up: $folder" -ForegroundColor Green
        }
    }
}

Write-Host "`n🎯 EXECUTING CONSOLIDATION PLAN..." -ForegroundColor Yellow

# PHASE 1: REMOVE DUPLICATE CONFIG FILES
Write-Host "`n1️⃣ REMOVING DUPLICATE CONFIG FILES..." -ForegroundColor Red

$duplicateConfigs = @(
    "config\eslint.config.js",
    "config\next.config.js", 
    "config\postcss.config.js",
    "config\prettier.config.js",
    "config\tailwind.config.js"
)

foreach ($config in $duplicateConfigs) {
    if (Test-Path $config) {
        Remove-Item $config -Force
        Write-Host "  🗑️ Removed duplicate: $config" -ForegroundColor Red
    }
}

# PHASE 2: CONSOLIDATE TSCONFIG FILES
Write-Host "`n2️⃣ CONSOLIDATING TSCONFIG FILES..." -ForegroundColor DarkYellow

# Create archive directory for old tsconfigs
$archiveDir = "config\archive"
if (!(Test-Path $archiveDir)) {
    New-Item -Path $archiveDir -ItemType Directory -Force | Out-Null
}

$tsconfigsToArchive = @(
    "tsconfig.backup.json",
    "tsconfig.full.json", 
    "tsconfig.unified.json"
)

foreach ($tsconfig in $tsconfigsToArchive) {
    if (Test-Path $tsconfig) {
        Move-Item $tsconfig -Destination "$archiveDir\$tsconfig" -Force
        Write-Host "  📦 Archived: $tsconfig → config/archive/" -ForegroundColor Yellow
    }
}

# PHASE 3: REORGANIZE DATA FOLDER
Write-Host "`n3️⃣ REORGANIZING DATA FOLDER..." -ForegroundColor DarkYellow

# Move API replacement to config
if (Test-Path "data\api-key-replacement.txt") {
    Move-Item "data\api-key-replacement.txt" -Destination "config\api-key-replacement.txt" -Force
    Write-Host "  📁 Moved: data/api-key-replacement.txt → config/" -ForegroundColor Green
}

# Move documentation files to docs
$docsToMove = @("binna_modules.txt", "binna_routes.txt")
foreach ($doc in $docsToMove) {
    if (Test-Path "data\$doc") {
        Move-Item "data\$doc" -Destination "docs\$doc" -Force
        Write-Host "  📁 Moved: data/$doc → docs/" -ForegroundColor Green
    }
}

# Create test-data directory and move user data
$testDataDir = "database\test-data"
if (!(Test-Path $testDataDir)) {
    New-Item -Path $testDataDir -ItemType Directory -Force | Out-Null
}

if (Test-Path "data\local-users.json") {
    Move-Item "data\local-users.json" -Destination "$testDataDir\local-users.json" -Force
    Write-Host "  📁 Moved: data/local-users.json → database/test-data/" -ForegroundColor Green
}

# Remove empty data folder if it's empty
$dataContents = Get-ChildItem "data" -ErrorAction SilentlyContinue
if ($dataContents.Count -eq 0) {
    Remove-Item "data" -Force
    Write-Host "  🗑️ Removed empty data folder" -ForegroundColor Red
}

# PHASE 4: CLEAN TEMP FOLDER
Write-Host "`n4️⃣ CLEANING TEMP FOLDER..." -ForegroundColor DarkYellow

$tempFiles = Get-ChildItem "temp" -File
$removedTempFiles = 0

foreach ($file in $tempFiles) {
    if ($file.Length -eq 0 -or $file.Name -like "*test*" -or $file.Name -like "*temp*") {
        Remove-Item $file.FullName -Force
        Write-Host "  🗑️ Removed: temp/$($file.Name)" -ForegroundColor Red
        $removedTempFiles++
    }
}

# Keep only essential temp files
$essentialFiles = Get-ChildItem "temp" -File | Where-Object { $_.Length -gt 0 -and $_.Name -notlike "*test*" }
if ($essentialFiles.Count -eq 0) {
    Remove-Item "temp" -Force
    Write-Host "  🗑️ Removed empty temp folder" -ForegroundColor Red
} else {
    Write-Host "  ℹ️ Kept $($essentialFiles.Count) essential temp files" -ForegroundColor Blue
}

# PHASE 5: ORGANIZE SCRIPTS FOLDER
Write-Host "`n5️⃣ ORGANIZING SCRIPTS FOLDER..." -ForegroundColor DarkYellow

# Create script categories
$scriptCategories = @("build", "deploy", "maintenance", "analysis")
foreach ($category in $scriptCategories) {
    $categoryDir = "scripts\$category"
    if (!(Test-Path $categoryDir)) {
        New-Item -Path $categoryDir -ItemType Directory -Force | Out-Null
        Write-Host "  📁 Created: scripts/$category/" -ForegroundColor Green
    }
}

# Move phase scripts to analysis
$phaseScripts = Get-ChildItem "scripts" -File | Where-Object { $_.Name -like "phase*" }
foreach ($script in $phaseScripts) {
    Move-Item $script.FullName -Destination "scripts\analysis\$($script.Name)" -Force
    Write-Host "  📁 Moved: $($script.Name) → scripts/analysis/" -ForegroundColor Green
}

# Move build-related scripts
$buildScripts = Get-ChildItem "scripts" -File | Where-Object { $_.Name -like "*build*" -or $_.Name -like "*create*" -or $_.Name -like "*fix*" }
foreach ($script in $buildScripts) {
    if (Test-Path $script.FullName) {
        Move-Item $script.FullName -Destination "scripts\build\$($script.Name)" -Force
        Write-Host "  📁 Moved: $($script.Name) → scripts/build/" -ForegroundColor Green
    }
}

# Move deployment scripts
$deployScripts = Get-ChildItem "scripts" -File | Where-Object { $_.Name -like "*deploy*" -or $_.Name -like "*launch*" -or $_.Name -like "*security*" -or $_.Name -like "*test*" }
foreach ($script in $deployScripts) {
    if (Test-Path $script.FullName) {
        Move-Item $script.FullName -Destination "scripts\deploy\$($script.Name)" -Force
        Write-Host "  📁 Moved: $($script.Name) → scripts/deploy/" -ForegroundColor Green
    }
}

# PHASE 6: ORGANIZE DOCUMENTATION
Write-Host "`n6️⃣ ORGANIZING DOCUMENTATION..." -ForegroundColor DarkYellow

# Create doc categories
$docCategories = @("technical", "business", "deployment")
foreach ($category in $docCategories) {
    $categoryDir = "docs\$category"
    if (!(Test-Path $categoryDir)) {
        New-Item -Path $categoryDir -ItemType Directory -Force | Out-Null
        Write-Host "  📁 Created: docs/$category/" -ForegroundColor Green
    }
}

# Move technical docs
$technicalDocs = @("api-documentation.md", "DDD_STRUCTURE_DOCUMENTATION.md", "TECHNICAL_DOCUMENTATION.md", "STANDALONE_PRODUCTS_ARCHITECTURE.md")
foreach ($doc in $technicalDocs) {
    if (Test-Path "docs\$doc") {
        Move-Item "docs\$doc" -Destination "docs\technical\$doc" -Force
        Write-Host "  📁 Moved: $doc → docs/technical/" -ForegroundColor Green
    }
}

# Move business docs  
$businessDocs = @("innovation-lab.md", "store-features-separation-plan.md", "training-materials.md", "UNIFIED_PLATFORM_PLAN.md")
foreach ($doc in $businessDocs) {
    if (Test-Path "docs\$doc") {
        Move-Item "docs\$doc" -Destination "docs\business\$doc" -Force
        Write-Host "  📁 Moved: $doc → docs/business/" -ForegroundColor Green
    }
}

# Move deployment docs
$deploymentDocs = @("deployment-checklist.md", "supervisor-guide.md", "beta-user-recruitment.md")
foreach ($doc in $deploymentDocs) {
    if (Test-Path "docs\$doc") {
        Move-Item "docs\$doc" -Destination "docs\deployment\$doc" -Force
        Write-Host "  📁 Moved: $doc → docs/deployment/" -ForegroundColor Green
    }
}

# PHASE 7: FINAL CLEANUP
Write-Host "`n7️⃣ FINAL CLEANUP..." -ForegroundColor DarkYellow

# Remove any remaining empty folders
function Remove-EmptyFolders {
    param([string]$Path)
    
    $removed = 0
    do {
        $emptyFolders = Get-ChildItem $Path -Recurse -Directory | 
            Where-Object { (Get-ChildItem $_.FullName -Force | Measure-Object).Count -eq 0 } |
            Sort-Object FullName -Descending
        
        foreach ($folder in $emptyFolders) {
            try {
                Remove-Item $folder.FullName -Force
                Write-Host "  🗑️ Removed empty: $($folder.FullName)" -ForegroundColor Red
                $removed++
            } catch {
                Write-Host "  ⚠️ Could not remove: $($folder.FullName)" -ForegroundColor Yellow
            }
        }
    } while ($emptyFolders.Count -gt 0 -and $removed -lt 50)
    
    return $removed
}

$removedEmpty = Remove-EmptyFolders "."
Write-Host "  ✅ Removed $removedEmpty empty folders" -ForegroundColor Green

# PHASE 8: VERIFICATION
Write-Host "`n📊 CONSOLIDATION VERIFICATION..." -ForegroundColor Yellow

function Count-Items {
    param([string]$Path, [string]$Type)
    
    if (Test-Path $Path) {
        if ($Type -eq "files") {
            return (Get-ChildItem $Path -File -Recurse | Measure-Object).Count
        } else {
            return (Get-ChildItem $Path -Directory -Recurse | Measure-Object).Count
        }
    }
    return 0
}

Write-Host "`n🎯 FINAL STRUCTURE:" -ForegroundColor Green
Write-Host "  📁 config/: $(Count-Items 'config' 'files') files, $(Count-Items 'config' 'dirs') subdirs" -ForegroundColor White
Write-Host "  📁 docs/: $(Count-Items 'docs' 'files') files, $(Count-Items 'docs' 'dirs') subdirs" -ForegroundColor White  
Write-Host "  📁 scripts/: $(Count-Items 'scripts' 'files') files, $(Count-Items 'scripts' 'dirs') subdirs" -ForegroundColor White
Write-Host "  📁 database/: $(Count-Items 'database' 'files') files, $(Count-Items 'database' 'dirs') subdirs" -ForegroundColor White

# Check for duplicate configs
$duplicatesFound = 0
$configsToCheck = @("eslint.config.js", "next.config.js", "postcss.config.js", "prettier.config.js", "tailwind.config.js")
foreach ($config in $configsToCheck) {
    if ((Test-Path $config) -and (Test-Path "config\$config")) {
        $duplicatesFound++
    }
}

Write-Host "`n🏆 CONSOLIDATION RESULTS:" -ForegroundColor Green
Write-Host "  ✅ Duplicate configs removed: $(5 - $duplicatesFound)/5" -ForegroundColor $(if ($duplicatesFound -eq 0) { "Green" } else { "Red" })
Write-Host "  ✅ Temp files cleaned: $removedTempFiles files removed" -ForegroundColor Green
Write-Host "  ✅ Documentation organized: 3 categories created" -ForegroundColor Green
Write-Host "  ✅ Scripts organized: 4 categories created" -ForegroundColor Green
Write-Host "  ✅ Empty folders removed: $removedEmpty folders cleaned" -ForegroundColor Green

$consolidationScore = [math]::Round((5 - $duplicatesFound) / 5 * 100, 1)

Write-Host "`n🎉 CONSOLIDATION SUCCESS RATE: $consolidationScore%" -ForegroundColor $(if ($consolidationScore -ge 90) { "Green" } else { "Yellow" })

if ($consolidationScore -ge 90) {
    Write-Host "`n🚀 FOLDER CONSOLIDATION COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "✅ Project structure optimized and ready for Phase 2" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ CONSOLIDATION PARTIALLY COMPLETED" -ForegroundColor Yellow
    Write-Host "📋 Review remaining issues manually" -ForegroundColor Yellow
}

Write-Host "`n📦 Backup created at: $backupDir" -ForegroundColor Cyan
Write-Host "🕐 Consolidation completed at: $(Get-Date)" -ForegroundColor Gray

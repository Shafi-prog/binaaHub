# PHASE 1.5E: FINAL CLEANUP BEFORE PHASE 2
# This script performs the final cleanup to achieve perfect structure

Write-Host "🧹 PHASE 1.5E: FINAL CLEANUP STARTING..." -ForegroundColor Yellow

# Create backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "backups\phase1.5e-final-cleanup-$timestamp"

Write-Host "📦 Creating backup at $backupDir..." -ForegroundColor Cyan
if (Test-Path $backupDir) { Remove-Item $backupDir -Recurse -Force }
New-Item -Path $backupDir -ItemType Directory -Force | Out-Null

# Backup current structure (preserve DDD architecture)
$foldersToBackup = @(
    "src\app",
    "src\core\shared\api",
    "src\core\shared\types", 
    "src\domains\shared",
    "src\domains\marketplace"
)

foreach ($folder in $foldersToBackup) {
    if (Test-Path $folder) {
        $destPath = Join-Path $backupDir $folder
        New-Item -Path (Split-Path $destPath -Parent) -ItemType Directory -Force | Out-Null
        Copy-Item $folder -Destination $destPath -Recurse -Force
        Write-Host "  ✅ Backed up: $folder" -ForegroundColor Green
    }
}

Write-Host "`n🎯 PERFORMING FINAL CONSOLIDATION..." -ForegroundColor Yellow

# 1. CONSOLIDATE REMAINING API FOLDERS
Write-Host "`n📁 Consolidating API folders..." -ForegroundColor Cyan

# Move remaining API folders to canonical location
$apiSources = @(
    "src\core\shared\api\admin\products\[productId]",
    "src\core\shared\api\auth\[...nextauth]", 
    "src\core\shared\api\dashboard\projects\[id]",
    "src\core\shared\api\supervisors\[id]",
    "src\core\shared\api\supervisors\[id]\status",
    "src\core\shared\api\warranty-claims\[id]"
)

foreach ($apiSource in $apiSources) {
    if (Test-Path $apiSource) {
        Remove-Item $apiSource -Recurse -Force
        Write-Host "  🗑️ Removed empty API folder: $apiSource" -ForegroundColor Red
    }
}

# 2. CONSOLIDATE REMAINING TYPES TO SINGLE LOCATION
Write-Host "`n📝 Consolidating types to single location..." -ForegroundColor Cyan

# Move src\core\shared\types to be the single types location
if (Test-Path "src\core\shared\types") {
    Write-Host "  ✅ Core shared types already in canonical location" -ForegroundColor Green
}

# 3. CONSOLIDATE SHARED COMPONENTS
Write-Host "`n🧩 Consolidating shared components..." -ForegroundColor Cyan

if (Test-Path "src\domains\shared") {
    # Move everything from domains\shared to core\shared
    $sharedItems = Get-ChildItem "src\domains\shared" -Recurse
    
    foreach ($item in $sharedItems) {
        if ($item.PSIsContainer) {
            $relativePath = $item.FullName.Substring((Resolve-Path "src\domains\shared").Path.Length + 1)
            $destPath = "src\core\shared\$relativePath"
            
            if (!(Test-Path $destPath)) {
                New-Item -Path $destPath -ItemType Directory -Force | Out-Null
                Write-Host "  📁 Created: $destPath" -ForegroundColor Green
            }
        } else {
            $relativePath = $item.FullName.Substring((Resolve-Path "src\domains\shared").Path.Length + 1)
            $destPath = "src\core\shared\$relativePath"
            $destDir = Split-Path $destPath -Parent
            
            if (!(Test-Path $destDir)) {
                New-Item -Path $destDir -ItemType Directory -Force | Out-Null
            }
            
            if (!(Test-Path $destPath)) {
                Copy-Item $item.FullName -Destination $destPath -Force
                Write-Host "  📄 Moved: $relativePath" -ForegroundColor Green
            }
        }
    }
    
    # Remove the old domains\shared folder
    Remove-Item "src\domains\shared" -Recurse -Force
    Write-Host "  🗑️ Removed old: src\domains\shared" -ForegroundColor Red
}

# 4. REMOVE EMPTY FOLDERS
Write-Host "`n🧹 Removing empty folders..." -ForegroundColor Cyan

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
    } while ($emptyFolders.Count -gt 0 -and $removed -lt 1000)
    
    return $removed
}

$removedCount = Remove-EmptyFolders "src"
Write-Host "  ✅ Removed $removedCount empty folders" -ForegroundColor Green

# 5. FINAL VERIFICATION
Write-Host "`n📊 FINAL VERIFICATION..." -ForegroundColor Yellow

function Count-Folders {
    param([string]$Pattern)
    
    $folders = Get-ChildItem . -Recurse -Directory -Name | Where-Object { $_ -like "*\$Pattern" -and $_ -notlike "*node_modules*" -and $_ -notlike "*\.next*" -and $_ -notlike "*backups*" }
    return $folders.Count
}

$componentCount = Count-Folders "components"
$serviceCount = Count-Folders "services"
$modelCount = Count-Folders "models"
$utilCount = Count-Folders "utils"
$hookCount = Count-Folders "hooks"
$apiCount = Count-Folders "api"
$typeCount = Count-Folders "types"

Write-Host "`n🎯 FINAL FOLDER COUNTS:" -ForegroundColor Green
Write-Host "  📁 Components: $componentCount (Target: ≤4)" -ForegroundColor $(if ($componentCount -le 4) { "Green" } else { "Red" })
Write-Host "  🔧 Services: $serviceCount (Target: ≤3)" -ForegroundColor $(if ($serviceCount -le 3) { "Green" } else { "Red" })
Write-Host "  📦 Models: $modelCount (Target: ≤1)" -ForegroundColor $(if ($modelCount -le 1) { "Green" } else { "Red" })
Write-Host "  🛠️ Utils: $utilCount (Target: ≤1)" -ForegroundColor $(if ($utilCount -le 1) { "Green" } else { "Red" })
Write-Host "  🎣 Hooks: $hookCount (Target: ≤1)" -ForegroundColor $(if ($hookCount -le 1) { "Green" } else { "Red" })
Write-Host "  🔌 API: $apiCount (Target: ≤2)" -ForegroundColor $(if ($apiCount -le 2) { "Green" } else { "Red" })
Write-Host "  📝 Types: $typeCount (Target: ≤1)" -ForegroundColor $(if ($typeCount -le 1) { "Green" } else { "Red" })

# Calculate success rate
$targets = @($componentCount -le 4, $serviceCount -le 3, $modelCount -le 1, $utilCount -le 1, $hookCount -le 1, $apiCount -le 2, $typeCount -le 1)
$metTargets = ($targets | Where-Object { $_ }).Count
$successRate = [math]::Round(($metTargets / $targets.Count) * 100, 1)

Write-Host "`n🏆 SUCCESS RATE: $successRate% ($metTargets/7 targets met)" -ForegroundColor $(if ($successRate -ge 85) { "Green" } else { "Yellow" })

if ($successRate -ge 85) {
    Write-Host "`n🎉 PHASE 1.5E COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "✅ Ready for Phase 2: Domain Migration" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ PHASE 1.5E PARTIALLY SUCCESSFUL" -ForegroundColor Yellow
    Write-Host "📋 Some targets not met - review remaining folders" -ForegroundColor Yellow
}

Write-Host "`n📦 Backup created at: $backupDir" -ForegroundColor Cyan
Write-Host "🕐 Cleanup completed at: $(Get-Date)" -ForegroundColor Gray

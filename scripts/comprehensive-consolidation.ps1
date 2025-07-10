# COMPREHENSIVE BINNA FOLDER CONSOLIDATION SCRIPT
# This script addresses ALL remaining duplications and issues

Write-Host "🧹 COMPREHENSIVE BINNA CONSOLIDATION STARTING..." -ForegroundColor Yellow

# Create backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "backups\comprehensive-consolidation-$timestamp"

Write-Host "📦 Creating comprehensive backup at $backupDir..." -ForegroundColor Cyan
if (Test-Path $backupDir) { Remove-Item $backupDir -Recurse -Force }
New-Item -Path $backupDir -ItemType Directory -Force | Out-Null

# Backup entire src folder before major changes
Copy-Item "src" -Destination "$backupDir\src" -Recurse -Force
Write-Host "  ✅ Backed up entire src folder" -ForegroundColor Green

Write-Host "`n🚨 STEP 1: REMOVING AWKWARD FILENAME..." -ForegroundColor Red

# Remove the awkward {}' file
if (Test-Path "{})'") {
    Remove-Item "{})" -Force
    Write-Host "  🗑️ Removed awkward file: {})" -ForegroundColor Green
} else {
    Write-Host "  ✅ Awkward file not found (already cleaned)" -ForegroundColor Yellow
}

Write-Host "`n🔄 STEP 2: MAJOR FOLDER CONSOLIDATIONS..." -ForegroundColor Yellow

# 2A. Consolidate src/shared → src/core/shared
Write-Host "`n📁 Consolidating src/shared → src/core/shared..." -ForegroundColor Cyan
if (Test-Path "src\shared") {
    # Ensure core/shared exists
    if (!(Test-Path "src\core\shared")) {
        New-Item -Path "src\core\shared" -ItemType Directory -Force | Out-Null
    }
    
    # Move all content from src/shared to src/core/shared
    $sharedItems = Get-ChildItem "src\shared" -Recurse
    $movedCount = 0
    
    foreach ($item in $sharedItems) {
        $relativePath = $item.FullName.Substring((Resolve-Path "src\shared").Path.Length + 1)
        $destPath = "src\core\shared\$relativePath"
        
        if ($item.PSIsContainer) {
            if (!(Test-Path $destPath)) {
                New-Item -Path $destPath -ItemType Directory -Force | Out-Null
                Write-Host "    📁 Created: $destPath" -ForegroundColor Green
            }
        } else {
            $destDir = Split-Path $destPath -Parent
            if (!(Test-Path $destDir)) {
                New-Item -Path $destDir -ItemType Directory -Force | Out-Null
            }
            
            if (!(Test-Path $destPath)) {
                Copy-Item $item.FullName -Destination $destPath -Force
                Write-Host "    📄 Moved: $relativePath" -ForegroundColor Green
                $movedCount++
            } else {
                Write-Host "    ⚠️ Skipped (exists): $relativePath" -ForegroundColor Yellow
            }
        }
    }
    
    # Remove old src/shared folder
    Remove-Item "src\shared" -Recurse -Force
    Write-Host "  🗑️ Removed old: src\shared ($movedCount files moved)" -ForegroundColor Red
} else {
    Write-Host "  ✅ src\shared not found (already consolidated)" -ForegroundColor Green
}

# 2B. Consolidate src/standalone → src/products  
Write-Host "`n📁 Consolidating src/standalone → src/products..." -ForegroundColor Cyan
if (Test-Path "src\standalone") {
    # Ensure products exists
    if (!(Test-Path "src\products")) {
        New-Item -Path "src\products" -ItemType Directory -Force | Out-Null
    }
    
    # Move all content from src/standalone to src/products
    $standaloneItems = Get-ChildItem "src\standalone" -Recurse
    $movedCount = 0
    
    foreach ($item in $standaloneItems) {
        $relativePath = $item.FullName.Substring((Resolve-Path "src\standalone").Path.Length + 1)
        $destPath = "src\products\$relativePath"
        
        if ($item.PSIsContainer) {
            if (!(Test-Path $destPath)) {
                New-Item -Path $destPath -ItemType Directory -Force | Out-Null
                Write-Host "    📁 Created: $destPath" -ForegroundColor Green
            }
        } else {
            $destDir = Split-Path $destPath -Parent
            if (!(Test-Path $destDir)) {
                New-Item -Path $destDir -ItemType Directory -Force | Out-Null
            }
            
            if (!(Test-Path $destPath)) {
                Copy-Item $item.FullName -Destination $destPath -Force
                Write-Host "    📄 Moved: $relativePath" -ForegroundColor Green
                $movedCount++
            } else {
                Write-Host "    ⚠️ Skipped (exists): $relativePath" -ForegroundColor Yellow
            }
        }
    }
    
    # Remove old src/standalone folder
    Remove-Item "src\standalone" -Recurse -Force
    Write-Host "  🗑️ Removed old: src\standalone ($movedCount files moved)" -ForegroundColor Red
} else {
    Write-Host "  ✅ src\standalone not found (already consolidated)" -ForegroundColor Green
}

# 2C. Consolidate any remaining src/domains/shared → src/core/shared
Write-Host "`n📁 Final consolidation of domains/shared → core/shared..." -ForegroundColor Cyan
if (Test-Path "src\domains\shared") {
    $domainSharedItems = Get-ChildItem "src\domains\shared" -Recurse
    $movedCount = 0
    
    foreach ($item in $domainSharedItems) {
        $relativePath = $item.FullName.Substring((Resolve-Path "src\domains\shared").Path.Length + 1)
        $destPath = "src\core\shared\$relativePath"
        
        if ($item.PSIsContainer) {
            if (!(Test-Path $destPath)) {
                New-Item -Path $destPath -ItemType Directory -Force | Out-Null
                Write-Host "    📁 Created: $destPath" -ForegroundColor Green
            }
        } else {
            $destDir = Split-Path $destPath -Parent
            if (!(Test-Path $destDir)) {
                New-Item -Path $destDir -ItemType Directory -Force | Out-Null
            }
            
            if (!(Test-Path $destPath)) {
                Copy-Item $item.FullName -Destination $destPath -Force
                Write-Host "    📄 Moved: $relativePath" -ForegroundColor Green
                $movedCount++
            } else {
                Write-Host "    ⚠️ Skipped (exists): $relativePath" -ForegroundColor Yellow
            }
        }
    }
    
    # Remove old domains/shared folder
    Remove-Item "src\domains\shared" -Recurse -Force
    Write-Host "  🗑️ Removed old: src\domains\shared ($movedCount files moved)" -ForegroundColor Red
} else {
    Write-Host "  ✅ src\domains\shared not found (already consolidated)" -ForegroundColor Green
}

Write-Host "`n🧹 STEP 3: REMOVING EMPTY FOLDERS..." -ForegroundColor Cyan

function Remove-EmptyFolders {
    param([string]$Path)
    
    $removed = 0
    $iterations = 0
    do {
        $emptyFolders = Get-ChildItem $Path -Recurse -Directory | 
            Where-Object { (Get-ChildItem $_.FullName -Force | Measure-Object).Count -eq 0 } |
            Sort-Object FullName -Descending
        
        foreach ($folder in $emptyFolders) {
            try {
                Remove-Item $folder.FullName -Force
                Write-Host "    🗑️ Removed empty: $($folder.FullName)" -ForegroundColor Red
                $removed++
            } catch {
                Write-Host "    ⚠️ Could not remove: $($folder.FullName)" -ForegroundColor Yellow
            }
        }
        $iterations++
    } while ($emptyFolders.Count -gt 0 -and $iterations -lt 5)
    
    return $removed
}

$removedCount = Remove-EmptyFolders "src"
Write-Host "  ✅ Removed $removedCount empty folders" -ForegroundColor Green

Write-Host "`n📊 STEP 4: FINAL STRUCTURE VERIFICATION..." -ForegroundColor Yellow

# Count remaining target folders
function Count-TargetFolders {
    param([string]$Pattern)
    
    $folders = Get-ChildItem "src" -Recurse -Directory | Where-Object { 
        $_.Name -eq $Pattern -and 
        $_.FullName -notlike "*node_modules*" -and 
        $_.FullName -notlike "*\.next*" -and 
        $_.FullName -notlike "*backups*" 
    }
    return $folders.Count
}

$componentCount = Count-TargetFolders "components"
$serviceCount = Count-TargetFolders "services"
$modelCount = Count-TargetFolders "models"
$utilCount = Count-TargetFolders "utils"
$hookCount = Count-TargetFolders "hooks"
$apiCount = Count-TargetFolders "api"
$typeCount = Count-TargetFolders "types"

Write-Host "`n🎯 FINAL FOLDER COUNTS AFTER CONSOLIDATION:" -ForegroundColor Green
Write-Host "  📁 Components: $componentCount (Target: ≤4)" -ForegroundColor $(if ($componentCount -le 4) { "Green" } else { "Red" })
Write-Host "  🔧 Services: $serviceCount (Target: ≤3)" -ForegroundColor $(if ($serviceCount -le 3) { "Green" } else { "Red" })
Write-Host "  📦 Models: $modelCount (Target: ≤1)" -ForegroundColor $(if ($modelCount -le 1) { "Green" } else { "Red" })
Write-Host "  🛠️ Utils: $utilCount (Target: ≤1)" -ForegroundColor $(if ($utilCount -le 1) { "Green" } else { "Red" })
Write-Host "  🎣 Hooks: $hookCount (Target: ≤1)" -ForegroundColor $(if ($hookCount -le 1) { "Green" } else { "Red" })
Write-Host "  🔌 API: $apiCount (Target: ≤2)" -ForegroundColor $(if ($apiCount -le 2) { "Green" } else { "Red" })
Write-Host "  📝 Types: $typeCount (Target: ≤1)" -ForegroundColor $(if ($typeCount -le 1) { "Green" } else { "Red" })

# Show final src structure
Write-Host "`n📂 FINAL SRC STRUCTURE:" -ForegroundColor Cyan
Get-ChildItem "src" -Directory | Sort-Object Name | ForEach-Object {
    Write-Host "  📁 $($_.Name)" -ForegroundColor White
}

# Calculate success rate
$targets = @($componentCount -le 4, $serviceCount -le 3, $modelCount -le 1, $utilCount -le 1, $hookCount -le 1, $apiCount -le 2, $typeCount -le 1)
$metTargets = ($targets | Where-Object { $_ }).Count
$successRate = [math]::Round(($metTargets / $targets.Count) * 100, 1)

Write-Host "`n🏆 CONSOLIDATION SUCCESS RATE: $successRate% ($metTargets/7 targets met)" -ForegroundColor $(if ($successRate -ge 85) { "Green" } else { "Yellow" })

if ($successRate -ge 85) {
    Write-Host "`n🎉 COMPREHENSIVE CONSOLIDATION COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "✅ Ready for Phase 2: Domain Migration" -ForegroundColor Green
    Write-Host "✅ Clean folder structure achieved" -ForegroundColor Green
    Write-Host "✅ No more duplicate shared/standalone folders" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ CONSOLIDATION PARTIALLY SUCCESSFUL" -ForegroundColor Yellow
    Write-Host "📋 Some targets not met - may need manual review" -ForegroundColor Yellow
}

Write-Host "`n📦 Backup created at: $backupDir" -ForegroundColor Cyan
Write-Host "🕐 Consolidation completed at: $(Get-Date)" -ForegroundColor Gray
Write-Host "`n📋 NEXT: Review import paths and update if needed" -ForegroundColor Yellow

# COMPREHENSIVE FINAL CLEANUP - PHASE 1.5F
# Complete elimination of all duplicate folders and files

Write-Host "🧹 COMPREHENSIVE FINAL CLEANUP STARTING..." -ForegroundColor Yellow

# Create backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "backups\comprehensive-final-cleanup-$timestamp"

Write-Host "📦 Creating comprehensive backup..." -ForegroundColor Cyan
if (Test-Path $backupDir) { Remove-Item $backupDir -Recurse -Force }
New-Item -Path $backupDir -ItemType Directory -Force | Out-Null

# Backup critical folders
$criticalFolders = @(
    "components",
    "src\components", 
    "src\shared",
    "src\standalone",
    "src\domains\shared"
)

foreach ($folder in $criticalFolders) {
    if (Test-Path $folder) {
        $destPath = Join-Path $backupDir $folder
        New-Item -Path (Split-Path $destPath -Parent) -ItemType Directory -Force | Out-Null
        Copy-Item $folder -Destination $destPath -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Backed up: $folder" -ForegroundColor Green
    }
}

Write-Host "`n🎯 PHASE 1: CONSOLIDATE ROOT COMPONENTS TO SRC\CORE\SHARED\COMPONENTS" -ForegroundColor Yellow

# Move root components to src\core\shared\components
if (Test-Path "components") {
    $rootComponents = Get-ChildItem "components" -Recurse -File
    foreach ($component in $rootComponents) {
        $relativePath = $component.FullName.Substring((Resolve-Path "components").Path.Length + 1)
        $destPath = "src\core\shared\components\$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (!(Test-Path $destDir)) {
            New-Item -Path $destDir -ItemType Directory -Force | Out-Null
        }
        
        if (!(Test-Path $destPath)) {
            Copy-Item $component.FullName -Destination $destPath -Force
            Write-Host "  📄 Moved: $relativePath" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ Skipped (exists): $relativePath" -ForegroundColor Yellow
        }
    }
    
    # Remove root components folder
    Remove-Item "components" -Recurse -Force
    Write-Host "  🗑️ Removed: root components folder" -ForegroundColor Red
}

Write-Host "`n🎯 PHASE 2: CONSOLIDATE SRC\COMPONENTS TO SRC\CORE\SHARED\COMPONENTS" -ForegroundColor Yellow

# Move src\components to src\core\shared\components
if (Test-Path "src\components") {
    $srcComponents = Get-ChildItem "src\components" -Recurse -File
    foreach ($component in $srcComponents) {
        $relativePath = $component.FullName.Substring((Resolve-Path "src\components").Path.Length + 1)
        $destPath = "src\core\shared\components\$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (!(Test-Path $destDir)) {
            New-Item -Path $destDir -ItemType Directory -Force | Out-Null
        }
        
        if (!(Test-Path $destPath)) {
            Copy-Item $component.FullName -Destination $destPath -Force
            Write-Host "  📄 Moved: $relativePath" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ Skipped (exists): $relativePath" -ForegroundColor Yellow
        }
    }
    
    # Remove src\components folder
    Remove-Item "src\components" -Recurse -Force
    Write-Host "  🗑️ Removed: src\components folder" -ForegroundColor Red
}

Write-Host "`n🎯 PHASE 3: CONSOLIDATE SRC\SHARED TO SRC\CORE\SHARED" -ForegroundColor Yellow

# Move src\shared to src\core\shared
if (Test-Path "src\shared") {
    $sharedItems = Get-ChildItem "src\shared" -Recurse -File
    foreach ($item in $sharedItems) {
        $relativePath = $item.FullName.Substring((Resolve-Path "src\shared").Path.Length + 1)
        $destPath = "src\core\shared\$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (!(Test-Path $destDir)) {
            New-Item -Path $destDir -ItemType Directory -Force | Out-Null
        }
        
        if (!(Test-Path $destPath)) {
            Copy-Item $item.FullName -Destination $destPath -Force
            Write-Host "  📄 Moved: $relativePath" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ Skipped (exists): $relativePath" -ForegroundColor Yellow
        }
    }
    
    # Remove src\shared folder
    Remove-Item "src\shared" -Recurse -Force
    Write-Host "  🗑️ Removed: src\shared folder" -ForegroundColor Red
}

Write-Host "`n🎯 PHASE 4: CONSOLIDATE SRC\STANDALONE TO SRC\PRODUCTS" -ForegroundColor Yellow

# Move src\standalone to src\products
if (Test-Path "src\standalone") {
    $standaloneItems = Get-ChildItem "src\standalone" -Recurse -File
    foreach ($item in $standaloneItems) {
        $relativePath = $item.FullName.Substring((Resolve-Path "src\standalone").Path.Length + 1)
        $destPath = "src\products\$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (!(Test-Path $destDir)) {
            New-Item -Path $destDir -ItemType Directory -Force | Out-Null
        }
        
        if (!(Test-Path $destPath)) {
            Copy-Item $item.FullName -Destination $destPath -Force
            Write-Host "  📄 Moved: $relativePath" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ Skipped (exists): $relativePath" -ForegroundColor Yellow
        }
    }
    
    # Remove src\standalone folder
    Remove-Item "src\standalone" -Recurse -Force
    Write-Host "  🗑️ Removed: src\standalone folder" -ForegroundColor Red
}

Write-Host "`n🎯 PHASE 5: CONSOLIDATE SRC\DOMAINS\SHARED TO SRC\CORE\SHARED" -ForegroundColor Yellow

# Move src\domains\shared to src\core\shared
if (Test-Path "src\domains\shared") {
    $domainSharedItems = Get-ChildItem "src\domains\shared" -Recurse -File
    foreach ($item in $domainSharedItems) {
        $relativePath = $item.FullName.Substring((Resolve-Path "src\domains\shared").Path.Length + 1)
        $destPath = "src\core\shared\$relativePath"
        $destDir = Split-Path $destPath -Parent
        
        if (!(Test-Path $destDir)) {
            New-Item -Path $destDir -ItemType Directory -Force | Out-Null
        }
        
        if (!(Test-Path $destPath)) {
            Copy-Item $item.FullName -Destination $destPath -Force
            Write-Host "  📄 Moved: $relativePath" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ Skipped (exists): $relativePath" -ForegroundColor Yellow
        }
    }
    
    # Remove src\domains\shared folder
    Remove-Item "src\domains\shared" -Recurse -Force
    Write-Host "  🗑️ Removed: src\domains\shared folder" -ForegroundColor Red
}

Write-Host "`n🎯 PHASE 6: CLEAN UP JUNK FILES" -ForegroundColor Yellow

# Remove awkward files
$junkFiles = @(
    "{})'",
    "fix-imports.js"
)

foreach ($file in $junkFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  🗑️ Removed junk file: $file" -ForegroundColor Red
    }
}

Write-Host "`n🎯 PHASE 7: REMOVE EMPTY FOLDERS" -ForegroundColor Yellow

function Remove-EmptyFolders {
    param([string]$Path)
    
    $removed = 0
    do {
        $emptyFolders = Get-ChildItem $Path -Recurse -Directory | 
            Where-Object { 
                (Get-ChildItem $_.FullName -Force -ErrorAction SilentlyContinue | Measure-Object).Count -eq 0 
            } | 
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
    } while ($emptyFolders.Count -gt 0 -and $removed -lt 2000)
    
    return $removed
}

$removedCount = Remove-EmptyFolders "src"
Write-Host "  ✅ Removed $removedCount empty folders" -ForegroundColor Green

Write-Host "`n🎯 PHASE 8: FINAL VERIFICATION" -ForegroundColor Yellow

# Count remaining target folders
$remainingFolders = Get-ChildItem -Path "." -Recurse -Directory | Where-Object {
    ($_.Name -match "^(components|services|models|utils|hooks|api|types)$") -and
    ($_.FullName -notlike "*node_modules*") -and
    ($_.FullName -notlike "*\.next*") -and  
    ($_.FullName -notlike "*backups*")
}

Write-Host "`n📊 FINAL FOLDER COUNTS:" -ForegroundColor Green
$byType = $remainingFolders | Group-Object Name
$byType | ForEach-Object {
    $color = if ($_.Count -le 2) { "Green" } else { "Red" }
    Write-Host "  $($_.Name): $($_.Count)" -ForegroundColor $color
}

Write-Host "`n📁 REMAINING FOLDERS:" -ForegroundColor Cyan
$remainingFolders | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path, ".")
    Write-Host "  - $relativePath" -ForegroundColor White
}

# Calculate success rate
$targetCounts = @{
    "components" = 4
    "services" = 3
    "models" = 1
    "utils" = 1
    "hooks" = 1
    "api" = 2
    "types" = 1
}

$targets = @()
foreach ($type in $targetCounts.Keys) {
    $currentCount = ($byType | Where-Object Name -eq $type).Count
    if ($currentCount -eq $null) { $currentCount = 0 }
    $targets += ($currentCount -le $targetCounts[$type])
    Write-Host "  $type`: $currentCount / $($targetCounts[$type]) $(if ($currentCount -le $targetCounts[$type]) { '✅' } else { '❌' })" -ForegroundColor $(if ($currentCount -le $targetCounts[$type]) { "Green" } else { "Red" })
}

$metTargets = ($targets | Where-Object { $_ }).Count
$successRate = [math]::Round(($metTargets / $targets.Count) * 100, 1)

Write-Host "`n🏆 SUCCESS RATE: $successRate% ($metTargets/7 targets met)" -ForegroundColor $(if ($successRate -ge 85) { "Green" } else { "Yellow" })

if ($successRate -ge 85) {
    Write-Host "`n🎉 COMPREHENSIVE CLEANUP COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "✅ Platform ready for Phase 2: Domain Migration" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ CLEANUP PARTIALLY SUCCESSFUL" -ForegroundColor Yellow
    Write-Host "📋 Some targets not met - review remaining folders" -ForegroundColor Yellow
}

Write-Host "`n📦 Backup created at: $backupDir" -ForegroundColor Cyan
Write-Host "🕐 Cleanup completed at: $(Get-Date)" -ForegroundColor Gray

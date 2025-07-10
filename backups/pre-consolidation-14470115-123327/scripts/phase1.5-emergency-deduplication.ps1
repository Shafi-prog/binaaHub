# Phase 1.5: Emergency Deduplication Protocol
# CRITICAL: Reduce 583 components folders to 15, 248 services to 8, 165 models to 8

Write-Host "🆘 PHASE 1.5: EMERGENCY DEDUPLICATION PROTOCOL STARTING..." -ForegroundColor Red
Write-Host "⚠️  CRITICAL: This will aggressively consolidate duplicate folders" -ForegroundColor Yellow

# Step 1: Create Emergency Backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "backups/emergency-deduplication-backup-$timestamp"

Write-Host "📦 Creating emergency backup..." -ForegroundColor Cyan
Copy-Item "src" $backupPath -Recurse -Force
Write-Host "✅ Backup created: $backupPath" -ForegroundColor Green

# Step 2: Assess Current Duplication
Write-Host "📊 Assessing current duplication crisis..." -ForegroundColor Cyan

$duplicateAnalysis = Get-ChildItem -Recurse -Directory | Where-Object { 
    $_.Name -match "^(components|services|models|api|types|utils|hooks)$" 
} | Group-Object Name | Where-Object { $_.Count -gt 1 } | Sort-Object Count -Descending

Write-Host "🔍 CURRENT DUPLICATION STATUS:" -ForegroundColor Red
foreach ($group in $duplicateAnalysis) {
    Write-Host "  $($group.Name): $($group.Count) folders" -ForegroundColor Yellow
}

# Step 3: Define Approved Folder Locations
$approvedLocations = @(
    "src\core\shared\components",
    "src\core\shared\services", 
    "src\core\shared\models",
    "src\core\shared\types",
    "src\core\shared\utils",
    "src\core\shared\hooks",
    "src\domains\marketplace\components",
    "src\domains\marketplace\services",
    "src\domains\marketplace\models",
    "src\domains\stores\components",
    "src\domains\stores\services", 
    "src\domains\stores\models",
    "src\domains\inventory\components",
    "src\domains\inventory\services",
    "src\domains\inventory\models",
    "src\domains\payments\components",
    "src\domains\payments\services",
    "src\domains\payments\models",
    "src\domains\orders\components",
    "src\domains\orders\services",
    "src\domains\orders\models",
    "src\domains\users\components",
    "src\domains\users\services",
    "src\domains\users\models",
    "src\domains\analytics\components",
    "src\domains\analytics\services",
    "src\domains\analytics\models",
    "src\domains\logistics\components",
    "src\domains\logistics\services",
    "src\domains\logistics\models",
    "src\products\binna-pos\components",
    "src\products\binna-pos\services",
    "src\products\binna-stock\components",
    "src\products\binna-stock\services",
    "src\products\binna-books\components",
    "src\products\binna-books\services",
    "src\products\binna-pay\components",
    "src\products\binna-pay\services",
    "src\products\binna-crm\components",
    "src\products\binna-crm\services",
    "src\products\binna-analytics\components",
    "src\products\binna-analytics\services"
)

Write-Host "✅ Approved locations defined: $($approvedLocations.Count)" -ForegroundColor Green

# Step 4: Ensure Approved Locations Exist
Write-Host "📁 Creating approved folder structure..." -ForegroundColor Cyan
foreach ($location in $approvedLocations) {
    if (!(Test-Path $location)) {
        New-Item -Path $location -ItemType Directory -Force | Out-Null
        Write-Host "  Created: $location" -ForegroundColor Green
    }
}

# Step 5: Identify Folders to Remove
Write-Host "🔍 Identifying duplicate folders for removal..." -ForegroundColor Cyan

$foldersToRemove = @()
$folderTypes = @("components", "services", "models", "api", "types", "utils", "hooks")

foreach ($folderType in $folderTypes) {
    $allFolders = Get-ChildItem -Recurse -Directory -Name $folderType | ForEach-Object {
        Join-Path (Get-Location) $_
    }
    
    foreach ($folder in $allFolders) {
        $relativePath = $folder -replace [regex]::Escape((Get-Location).Path + "\"), ""
        
        # Check if this folder is in our approved list
        $isApproved = $false
        foreach ($approved in $approvedLocations) {
            if ($relativePath -eq $approved) {
                $isApproved = $true
                break
            }
        }
        
        if (!$isApproved -and (Test-Path $folder)) {
            $foldersToRemove += $folder
        }
    }
}

Write-Host "🗑️  Found $($foldersToRemove.Count) duplicate folders to remove" -ForegroundColor Yellow

# Step 6: Backup Content Before Removal
Write-Host "💾 Backing up content from duplicate folders..." -ForegroundColor Cyan
$contentBackupPath = "backups/duplicate-content-backup-$timestamp"
New-Item -Path $contentBackupPath -ItemType Directory -Force | Out-Null

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        $relativePath = $folder -replace [regex]::Escape((Get-Location).Path + "\"), ""
        $backupTarget = Join-Path $contentBackupPath $relativePath
        $backupTargetDir = Split-Path $backupTarget -Parent
        
        if (!(Test-Path $backupTargetDir)) {
            New-Item -Path $backupTargetDir -ItemType Directory -Force | Out-Null
        }
        
        try {
            Copy-Item $folder $backupTarget -Recurse -Force
        } catch {
            Write-Host "  ⚠️  Could not backup: $folder" -ForegroundColor Yellow
        }
    }
}

# Step 7: Remove Duplicate Folders
Write-Host "🧹 Removing duplicate folders..." -ForegroundColor Red
$removedCount = 0

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        try {
            # Check if folder is empty or contains only common files
            $items = Get-ChildItem $folder -Recurse
            if ($items.Count -eq 0 -or ($items | Where-Object { $_.Name -notmatch "\.git|node_modules|\.next|dist|build" }).Count -le 3) {
                Remove-Item $folder -Recurse -Force
                $removedCount++
                Write-Host "  ✅ Removed: $folder" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  Skipped (contains content): $folder" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ❌ Failed to remove: $folder" -ForegroundColor Red
        }
    }
}

Write-Host "🗑️  Removed $removedCount duplicate folders" -ForegroundColor Green

# Step 8: Clean Up Empty Parent Directories
Write-Host "🧽 Cleaning up empty parent directories..." -ForegroundColor Cyan
$emptyDirs = Get-ChildItem -Recurse -Directory | Where-Object { 
    (Get-ChildItem $_.FullName -Recurse | Measure-Object).Count -eq 0 
}

foreach ($dir in $emptyDirs) {
    try {
        Remove-Item $dir.FullName -Force
        Write-Host "  ✅ Removed empty: $($dir.FullName)" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠️  Could not remove: $($dir.FullName)" -ForegroundColor Yellow
    }
}

# Step 9: Final Verification
Write-Host "🎯 PHASE 1.5 VERIFICATION..." -ForegroundColor Cyan

$finalAnalysis = Get-ChildItem -Recurse -Directory | Where-Object { 
    $_.Name -match "^(components|services|models|api)$" 
} | Group-Object Name | Sort-Object Count -Descending

Write-Host "📊 FINAL DUPLICATION STATUS:" -ForegroundColor Cyan
$success = $true

foreach ($group in $finalAnalysis) {
    $target = switch ($group.Name) {
        "components" { 15 }
        "services" { 8 }
        "models" { 8 }
        "api" { 8 }
        default { 5 }
    }
    
    $status = if ($group.Count -le $target) { "✅" } else { "❌"; $success = $false }
    Write-Host "  $status $($group.Name): $($group.Count) folders (TARGET: ≤$target)" -ForegroundColor $(if ($group.Count -le $target) { "Green" } else { "Red" })
}

# Step 10: Generate Report
$reportPath = "reports/phase1.5-deduplication-report-$timestamp.txt"
New-Item -Path (Split-Path $reportPath -Parent) -ItemType Directory -Force | Out-Null

@"
PHASE 1.5: EMERGENCY DEDUPLICATION REPORT
Generated: $(Get-Date)

BEFORE:
- Components folders: $($duplicateAnalysis | Where-Object { $_.Name -eq "components" } | Select-Object -ExpandProperty Count)
- Services folders: $($duplicateAnalysis | Where-Object { $_.Name -eq "services" } | Select-Object -ExpandProperty Count)
- Models folders: $($duplicateAnalysis | Where-Object { $_.Name -eq "models" } | Select-Object -ExpandProperty Count)

AFTER:
$(foreach ($group in $finalAnalysis) { "- $($group.Name) folders: $($group.Count)" })

ACTIONS TAKEN:
- Created backup: $backupPath
- Created content backup: $contentBackupPath
- Removed $removedCount duplicate folders
- Cleaned up empty directories

STATUS: $(if ($success) { "✅ PHASE 1.5 SUCCESSFUL" } else { "❌ PHASE 1.5 INCOMPLETE - MANUAL REVIEW NEEDED" })
"@ | Out-File $reportPath

Write-Host "📋 Report saved: $reportPath" -ForegroundColor Cyan

if ($success) {
    Write-Host "🎉 PHASE 1.5 COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "✅ Deduplication targets achieved!" -ForegroundColor Green
} else {
    Write-Host "⚠️  PHASE 1.5 INCOMPLETE - Manual review required" -ForegroundColor Yellow
    Write-Host "📝 Check remaining duplicates and consolidate manually" -ForegroundColor Yellow
}

Write-Host "🔄 Ready for Phase 2: Domain Migration" -ForegroundColor Cyan

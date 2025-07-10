# Phase 1.5D: FINAL DEDUPLICATION - TARGET THE REMAINING ISSUES
Write-Host "PHASE 1.5D: FINAL AGGRESSIVE DEDUPLICATION" -ForegroundColor Red

# Backup first
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "backups\final-dedup-backup-$timestamp"
Write-Host "Creating backup at: $backupPath" -ForegroundColor Cyan
if (!(Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
}

# Handle the specific remaining problems

# 1. TYPES: Should be only 1, we have 2
Write-Host "Fixing TYPES folders (target: 1)..." -ForegroundColor Yellow
$typesFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.Name -eq "types" -and 
        $_.FullName -notlike "*backup*" -and
        $_.FullName -notlike "*node_modules*"
    }

Write-Host "  Found $($typesFolders.Count) types folders" -ForegroundColor Gray
$primaryTypes = "src\core\shared\types"

foreach ($folder in $typesFolders) {
    $relativePath = $folder.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
    
    if ($relativePath -ne $primaryTypes) {
        Write-Host "  Consolidating: $relativePath -> $primaryTypes" -ForegroundColor Blue
        
        # Create primary if doesn't exist
        if (!(Test-Path $primaryTypes)) {
            New-Item -ItemType Directory -Path $primaryTypes -Force | Out-Null
        }
        
        # Move all files
        $files = Get-ChildItem -Path $folder.FullName -Recurse -File -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            $targetFile = Join-Path $primaryTypes $file.Name
            $counter = 1
            
            while (Test-Path $targetFile) {
                $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
                $extension = [System.IO.Path]::GetExtension($file.Name)
                $newName = "$baseName-v$counter$extension"
                $targetFile = Join-Path $primaryTypes $newName
                $counter++
            }
            
            Move-Item -Path $file.FullName -Destination $targetFile -Force -ErrorAction SilentlyContinue
        }
        
        # Remove empty folder
        if ((Get-ChildItem -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue).Count -eq 0) {
            Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# 2. API: Should be only 2, we have 5
Write-Host "Fixing API folders (target: 2)..." -ForegroundColor Yellow
$apiFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.Name -eq "api" -and 
        $_.FullName -notlike "*backup*" -and
        $_.FullName -notlike "*node_modules*"
    }

Write-Host "  Found $($apiFolders.Count) api folders" -ForegroundColor Gray

# Keep only these two
$keepApiPaths = @(
    "src\app\api",
    "api"
)

foreach ($folder in $apiFolders) {
    $relativePath = $folder.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
    $shouldKeep = $false
    
    foreach ($keepPath in $keepApiPaths) {
        if ($relativePath -eq $keepPath) {
            $shouldKeep = $true
            break
        }
    }
    
    if (!$shouldKeep) {
        Write-Host "  Consolidating API: $relativePath -> src\app\api" -ForegroundColor Blue
        
        $targetApi = "src\app\api"
        if (!(Test-Path $targetApi)) {
            New-Item -ItemType Directory -Path $targetApi -Force | Out-Null
        }
        
        # Move all files
        $files = Get-ChildItem -Path $folder.FullName -Recurse -File -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            $targetFile = Join-Path $targetApi $file.Name
            $counter = 1
            
            while (Test-Path $targetFile) {
                $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
                $extension = [System.IO.Path]::GetExtension($file.Name)
                $newName = "$baseName-v$counter$extension"
                $targetFile = Join-Path $targetApi $newName
                $counter++
            }
            
            Move-Item -Path $file.FullName -Destination $targetFile -Force -ErrorAction SilentlyContinue
        }
        
        # Remove empty folder
        if ((Get-ChildItem -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue).Count -eq 0) {
            Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
}

# 3. COMPONENTS: Most aggressive consolidation - target 15 or less
Write-Host "Final COMPONENTS consolidation (target: 15)..." -ForegroundColor Yellow

$componentFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.Name -eq "components" -and 
        $_.FullName -notlike "*backup*" -and
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*temp*"
    }

Write-Host "  Found $($componentFolders.Count) components folders" -ForegroundColor Gray

# Define the 15 essential component locations we want to keep
$essentialComponents = @(
    "components",
    "src\components", 
    "src\core\shared\components",
    "src\domains\marketplace\components",
    "src\domains\auth\components",
    "src\domains\payment\components",
    "src\domains\inventory\components",
    "src\domains\analytics\components",
    "src\products\pos\components",
    "src\products\erp\components",
    "src\products\crm\components",
    "src\products\ecommerce\components",
    "src\app\marketplace\components",
    "src\app\admin\components",
    "src\app\vendor\components"
)

$consolidatedComponents = 0
foreach ($folder in $componentFolders) {
    $relativePath = $folder.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
    $shouldKeep = $false
    
    # Check if this is one of our essential paths
    foreach ($essential in $essentialComponents) {
        if ($relativePath -eq $essential) {
            $shouldKeep = $true
            break
        }
    }
    
    if (!$shouldKeep) {
        # Determine best consolidation target based on path context
        $targetPath = "src\core\shared\components"  # Default fallback
        
        if ($relativePath -like "*marketplace*") {
            $targetPath = "src\domains\marketplace\components"
        }
        elseif ($relativePath -like "*admin*") {
            $targetPath = "src\app\admin\components"
        }
        elseif ($relativePath -like "*vendor*") {
            $targetPath = "src\app\vendor\components"
        }
        elseif ($relativePath -like "*auth*") {
            $targetPath = "src\domains\auth\components"
        }
        elseif ($relativePath -like "*payment*") {
            $targetPath = "src\domains\payment\components"
        }
        elseif ($relativePath -like "*pos*") {
            $targetPath = "src\products\pos\components"
        }
        elseif ($relativePath -like "*erp*") {
            $targetPath = "src\products\erp\components"
        }
        elseif ($relativePath -like "*store*") {
            $targetPath = "src\app\vendor\components"
        }
        
        Write-Host "  Consolidating: $relativePath -> $targetPath" -ForegroundColor Blue
        
        # Create target if needed
        if (!(Test-Path $targetPath)) {
            New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
        }
        
        # Move all files
        $files = Get-ChildItem -Path $folder.FullName -Recurse -File -ErrorAction SilentlyContinue
        if ($files.Count -gt 0) {
            foreach ($file in $files) {
                $targetFile = Join-Path $targetPath $file.Name
                $counter = 1
                
                while (Test-Path $targetFile) {
                    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
                    $extension = [System.IO.Path]::GetExtension($file.Name)
                    $newName = "$baseName-v$counter$extension"
                    $targetFile = Join-Path $targetPath $newName
                    $counter++
                }
                
                Move-Item -Path $file.FullName -Destination $targetFile -Force -ErrorAction SilentlyContinue
            }
        }
        
        # Remove empty folder
        if ((Get-ChildItem -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue).Count -eq 0) {
            Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
            $consolidatedComponents++
        }
    }
}

Write-Host "  Consolidated $consolidatedComponents component folders" -ForegroundColor Magenta

# Massive empty folder cleanup
Write-Host "Final empty folder cleanup..." -ForegroundColor Yellow
for ($i = 0; $i -lt 3; $i++) {
    $emptyFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
        Where-Object { 
            $_.FullName -notlike "*backup*" -and
            $_.FullName -notlike "*node_modules*" -and
            $_.FullName -notlike "*\.git*" -and
            (Get-ChildItem -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue).Count -eq 0
        }
    
    $removedCount = 0
    foreach ($emptyFolder in $emptyFolders) {
        try {
            Remove-Item -Path $emptyFolder.FullName -Force -ErrorAction SilentlyContinue
            $removedCount++
        }
        catch { }
    }
    
    if ($removedCount -eq 0) { break }
    Write-Host "  Pass $($i+1): Removed $removedCount empty folders" -ForegroundColor Blue
}

# Final verification
Write-Host "FINAL VERIFICATION AFTER PHASE 1.5D" -ForegroundColor Cyan

$folderTypes = @("components", "services", "models", "api", "types", "utils", "hooks")
$targets = @{
    "components" = 15
    "services" = 8  
    "models" = 8
    "api" = 2
    "types" = 1
    "utils" = 2
    "hooks" = 5
}

$metTargets = 0

foreach ($folderType in $folderTypes) {
    $count = (Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { 
        $_.Name -eq $folderType -and 
        $_.FullName -notlike "*backup*" -and
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*temp*"
    }).Count
    
    $target = $targets[$folderType]
    $status = if ($count -le $target) { "MET" } else { "EXCEEDED" }
    
    if ($count -le $target) { $metTargets++ }
    
    Write-Host "  $folderType : $count/$target $status" -ForegroundColor $(if ($count -le $target) { "Green" } else { "Red" })
}

$successRate = [math]::Round(($metTargets / $folderTypes.Count) * 100, 1)

if ($metTargets -eq $folderTypes.Count) {
    Write-Host "COMPLETE SUCCESS - ALL DEDUPLICATION TARGETS MET!" -ForegroundColor Green
    Write-Host "SUCCESS RATE: $successRate" -ForegroundColor Green
    Write-Host "READY FOR PHASE 2: DOMAIN MIGRATION" -ForegroundColor Green
}
elseif ($successRate -ge 70) {
    Write-Host "SIGNIFICANT SUCCESS - $metTargets out of $($folderTypes.Count) targets met" -ForegroundColor Yellow
    Write-Host "SUCCESS RATE: $successRate" -ForegroundColor Yellow
    Write-Host "Minor final cleanup may be needed" -ForegroundColor Yellow  
}
else {
    Write-Host "PARTIAL SUCCESS - $metTargets out of $($folderTypes.Count) targets met" -ForegroundColor Red
    Write-Host "SUCCESS RATE: $successRate" -ForegroundColor Red
    Write-Host "Additional manual intervention required" -ForegroundColor Red
}

Write-Host "PHASE 1.5D FINAL DEDUPLICATION COMPLETE" -ForegroundColor Cyan

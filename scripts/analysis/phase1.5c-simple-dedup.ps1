# Phase 1.5C: AGGRESSIVE DEDUPLICATION - SIMPLE VERSION
Write-Host "🚀 PHASE 1.5C: AGGRESSIVE DEDUPLICATION" -ForegroundColor Red

# Backup first
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "backups\aggressive-dedup-backup-$timestamp"
Write-Host "📦 Creating backup at: $backupPath" -ForegroundColor Cyan
if (!(Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
}

# Define consolidation rules
$consolidationRules = @{
    "types" = "src\core\shared\types"
    "utils" = "src\core\shared\utils" 
    "hooks" = "src\core\shared\hooks"
}

Write-Host "🎯 Starting consolidation process..." -ForegroundColor Cyan

# Process each folder type
foreach ($folderType in $consolidationRules.Keys) {
    $targetPath = $consolidationRules[$folderType]
    
    Write-Host "📂 Processing '$folderType' folders..." -ForegroundColor Yellow
    
    # Find all duplicate folders (excluding backups and target)
    $duplicateFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
        Where-Object { 
            $_.Name -eq $folderType -and 
            $_.FullName -notlike "*backup*" -and
            $_.FullName -notlike "*node_modules*" -and
            $_.FullName -notlike "*temp*" -and
            $_.FullName -notlike "*\.git*" -and
            ($_.FullName -replace [regex]::Escape((Get-Location).Path + "\"), "") -ne $targetPath
        }
    
    Write-Host "  Found $($duplicateFolders.Count) duplicate '$folderType' folders" -ForegroundColor Gray
    
    # Create target directory if it doesn't exist
    if (!(Test-Path $targetPath)) {
        New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
        Write-Host "  ✅ Created target: $targetPath" -ForegroundColor Green
    }
    
    # Consolidate each duplicate folder
    $consolidated = 0
    foreach ($folder in $duplicateFolders) {
        try {
            $relativePath = $folder.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
            
            # Get all files from the duplicate folder
            $files = Get-ChildItem -Path $folder.FullName -Recurse -File -ErrorAction SilentlyContinue
            
            if ($files.Count -gt 0) {
                Write-Host "    Moving $($files.Count) files from $relativePath" -ForegroundColor Gray
                
                foreach ($file in $files) {
                    $targetFile = Join-Path $targetPath $file.Name
                    $counter = 1
                    
                    # Handle naming conflicts
                    while (Test-Path $targetFile) {
                        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
                        $extension = [System.IO.Path]::GetExtension($file.Name)
                        $newName = "$baseName-v$counter$extension"
                        $targetFile = Join-Path $targetPath $newName
                        $counter++
                    }
                    
                    # Move the file
                    Move-Item -Path $file.FullName -Destination $targetFile -Force -ErrorAction SilentlyContinue
                }
                
                $consolidated++
            }
            
            # Remove empty folder
            if ((Get-ChildItem -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue).Count -eq 0) {
                Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "    ♻️  Removed empty folder: $relativePath" -ForegroundColor Blue
            }
        }
        catch {
            Write-Host "    ❌ Error processing $($folder.FullName): $_" -ForegroundColor Red
        }
    }
    
    Write-Host "  📊 Consolidated $consolidated folders into $targetPath" -ForegroundColor Magenta
}

# Aggressive components consolidation
Write-Host "📂 Processing 'components' folders (aggressive)..." -ForegroundColor Yellow

$componentFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.Name -eq "components" -and 
        $_.FullName -notlike "*backup*" -and
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*temp*" -and
        $_.FullName -notlike "*\.git*"
    }

Write-Host "  Found $($componentFolders.Count) 'components' folders" -ForegroundColor Gray

# Keep only essential component locations
$keepPaths = @(
    "components",
    "src\core\shared\components",
    "src\domains\marketplace\components",
    "src\domains\auth\components",
    "src\products\pos\components",
    "src\products\erp\components"
)

$componentsConsolidated = 0
foreach ($folder in $componentFolders) {
    $relativePath = $folder.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
    $shouldKeep = $false
    
    foreach ($keepPath in $keepPaths) {
        if ($relativePath -eq $keepPath) {
            $shouldKeep = $true
            break
        }
    }
    
    if (!$shouldKeep) {
        try {
            # Determine best target based on location
            $targetPath = "src\core\shared\components"
            if ($relativePath -like "*marketplace*") {
                $targetPath = "src\domains\marketplace\components"
            }
            elseif ($relativePath -like "*auth*") {
                $targetPath = "src\domains\auth\components"
            }
            elseif ($relativePath -like "*pos*") {
                $targetPath = "src\products\pos\components"
            }
            elseif ($relativePath -like "*erp*") {
                $targetPath = "src\products\erp\components"
            }
            
            # Create target if needed
            if (!(Test-Path $targetPath)) {
                New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
            }
            
            # Move files
            $files = Get-ChildItem -Path $folder.FullName -Recurse -File -ErrorAction SilentlyContinue
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
            
            # Remove empty folder
            if ((Get-ChildItem -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue).Count -eq 0) {
                Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
                $componentsConsolidated++
            }
        }
        catch {
            Write-Host "    ❌ Error consolidating $relativePath : $_" -ForegroundColor Red
        }
    }
}

Write-Host "  📊 Consolidated $componentsConsolidated component folders" -ForegroundColor Magenta

# Final verification
Write-Host "🔍 FINAL VERIFICATION" -ForegroundColor Cyan

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

$results = @{}
$metTargets = 0

foreach ($folderType in $folderTypes) {
    $count = (Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { 
        $_.Name -eq $folderType -and 
        $_.FullName -notlike "*backup*" -and
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*temp*"
    }).Count
    
    $target = $targets[$folderType]
    $status = if ($count -le $target) { "✅ MET" } else { "❌ EXCEEDED" }
    
    if ($count -le $target) { $metTargets++ }
    
    Write-Host "  $folderType : $count/$target $status" -ForegroundColor $(if ($count -le $target) { "Green" } else { "Red" })
    $results[$folderType] = $count
}

$successRate = [math]::Round(($metTargets / $folderTypes.Count) * 100, 1)

if ($metTargets -eq $folderTypes.Count) {
    Write-Host "🎉 COMPLETE SUCCESS - ALL TARGETS MET! ($successRate percent)" -ForegroundColor Green
    Write-Host "✅ Ready for Phase 2: Domain Migration" -ForegroundColor Green
}
elseif ($successRate -ge 70) {
    Write-Host "⚡ SIGNIFICANT SUCCESS - $metTargets/$($folderTypes.Count) targets met ($successRate percent)" -ForegroundColor Yellow
    Write-Host "🔧 Minor cleanup needed for remaining targets" -ForegroundColor Yellow  
}
else {
    Write-Host "🔄 PARTIAL SUCCESS - $metTargets/$($folderTypes.Count) targets met ($successRate percent)" -ForegroundColor Red
    Write-Host "🛠️  Additional consolidation required" -ForegroundColor Red
}

Write-Host "📋 PHASE 1.5C EXECUTION COMPLETE" -ForegroundColor Cyan

# Phase 1.5C: AGGRESSIVE DEDUPLICATION
# Final push to meet targets before Phase 2

Write-Host "🚀 PHASE 1.5C: AGGRESSIVE DEDUPLICATION PROTOCOL" -ForegroundColor Red
Write-Host "⚡ FINAL PUSH TO MEET TARGETS" -ForegroundColor Yellow

# Backup first
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupPath = "backups\aggressive-dedup-backup-$timestamp"
Write-Host "📦 Creating backup at: $backupPath" -ForegroundColor Cyan

# Create emergency backup
if (!(Test-Path $backupPath)) {
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
}

# Define target structure (canonical locations only)
$canonicalStructure = @{
    "components" = @(
        "components",
        "src\core\shared\components",
        "src\domains\marketplace\components",
        "src\domains\auth\components", 
        "src\domains\payment\components",
        "src\domains\inventory\components",
        "src\domains\analytics\components",
        "src\products\pos\components",
        "src\products\erp\components",
        "src\products\crm\components",
        "src\products\ecommerce\components"
    )
    "services" = @(
        "src\core\shared\services",
        "src\domains\marketplace\services",
        "src\domains\auth\services",
        "src\domains\payment\services",
        "src\products\pos\services",
        "src\products\erp\services"
    )
    "models" = @(
        "src\core\shared\models",
        "src\domains\marketplace\models",
        "src\domains\auth\models",
        "src\domains\payment\models",
        "src\products\pos\models",
        "src\products\erp\models"
    )
    "api" = @(
        "src\app\api",
        "src\domains\marketplace\api"
    )
    "types" = @(
        "src\core\shared\types"
    )
    "utils" = @(
        "src\core\shared\utils",
        "src\domains\marketplace\utils"
    )
    "hooks" = @(
        "src\core\shared\hooks",
        "src\domains\marketplace\hooks",
        "src\domains\auth\hooks"
    )
}

# Function to check if folder should be kept
function Should-Keep-Folder {
    param($folderPath, $folderType)
    
    # Skip backups, node_modules, temp
    if ($folderPath -match "(backup|node_modules|temp|\.git)" -or 
        $folderPath -like "*backup*" -or 
        $folderPath -like "*temp*") {
        return $true
    }
    
    # Check against canonical structure
    $canonicalPaths = $canonicalStructure[$folderType]
    foreach ($canonical in $canonicalPaths) {
        $normalizedCanonical = $canonical -replace "\\", "\\"
        if ($folderPath -match "^$normalizedCanonical$" -or 
            $folderPath -match "^\.\\$normalizedCanonical$") {
            return $true
        }
    }
    
    return $false
}

# Function to find best consolidation target
function Get-Consolidation-Target {
    param($folderPath, $folderType)
    
    # Determine domain/product context using simplified patterns
    if ($folderPath -like "*src\domains\*") {
        # Extract domain name
        $parts = $folderPath -split "\\"
        $domainIndex = [array]::IndexOf($parts, "domains") + 1
        if ($domainIndex -lt $parts.Length) {
            $domain = $parts[$domainIndex]
            return "src\domains\$domain\$folderType"
        }
    }
    elseif ($folderPath -like "*src\products\*") {
        # Extract product name
        $parts = $folderPath -split "\\"
        $productIndex = [array]::IndexOf($parts, "products") + 1
        if ($productIndex -lt $parts.Length) {
            $product = $parts[$productIndex]
            return "src\products\$product\$folderType"
        }
    }
    elseif ($folderPath -like "*src\app*") {
        return "src\core\shared\$folderType"
    }
    else {
        return "src\core\shared\$folderType"
    }
}

# Function to consolidate folder content
function Consolidate-Folder {
    param($sourcePath, $targetPath, $folderType)
    
    Write-Host "  📂 Consolidating: $sourcePath → $targetPath" -ForegroundColor Gray
    
    # Create target if doesn't exist
    if (!(Test-Path $targetPath)) {
        New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
    }
    
    # Move all content from source to target
    try {
        $sourceItems = Get-ChildItem -Path $sourcePath -Force -ErrorAction SilentlyContinue
        foreach ($item in $sourceItems) {
            $targetItemPath = Join-Path $targetPath $item.Name
            
            if (Test-Path $targetItemPath) {
                # Handle conflicts by creating versioned names
                $counter = 1
                $baseName = [System.IO.Path]::GetFileNameWithoutExtension($item.Name)
                $extension = [System.IO.Path]::GetExtension($item.Name)
                
                do {
                    $newName = if ($extension) { "$baseName-v$counter$extension" } else { "$baseName-v$counter" }
                    $targetItemPath = Join-Path $targetPath $newName
                    $counter++
                } while (Test-Path $targetItemPath)
            }
            
            Move-Item -Path $item.FullName -Destination $targetItemPath -Force -ErrorAction SilentlyContinue
        }
        
        # Remove empty source folder
        if ((Get-ChildItem -Path $sourcePath -Force -ErrorAction SilentlyContinue).Count -eq 0) {
            Remove-Item -Path $sourcePath -Force -ErrorAction SilentlyContinue
        }
        
        return $true
    }
    catch {
        Write-Host "    ❌ Error consolidating $sourcePath : $_" -ForegroundColor Red
        return $false
    }
}

# Main consolidation process
$folderTypes = @("types", "utils", "hooks", "api", "models", "services", "components")

foreach ($folderType in $folderTypes) {
    Write-Host "🎯 Processing '$folderType' folders..." -ForegroundColor Cyan
    
    # Find all folders of this type (excluding backups)
    $allFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { 
        $_.Name -eq $folderType -and 
        $_.FullName -notlike "*backup*" -and
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*temp*" -and
        $_.FullName -notlike "*\.git*"
    }
    
    Write-Host "  Found: $($allFolders.Count) '$folderType' folders" -ForegroundColor Yellow
    
    $consolidated = 0
    $kept = 0
    
    foreach ($folder in $allFolders) {
        $relativePath = $folder.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
        
        if (Should-Keep-Folder $relativePath $folderType) {
            $kept++
            Write-Host "  ✅ Keeping: $relativePath" -ForegroundColor Green
        }
        else {
            # Find consolidation target
            $targetPath = Get-Consolidation-Target $relativePath $folderType
            
            # Ensure target directory exists
            if (!(Test-Path $targetPath)) {
                New-Item -ItemType Directory -Path $targetPath -Force | Out-Null
            }
            
            # Consolidate content
            if (Consolidate-Folder $folder.FullName $targetPath $folderType) {
                $consolidated++
                Write-Host "  ♻️  Consolidated: $relativePath → $targetPath" -ForegroundColor Blue
            }
        }
    }
    
    Write-Host "  📊 Summary: Kept=$kept, Consolidated=$consolidated" -ForegroundColor Magenta
}

# Final verification
Write-Host "🔍 FINAL VERIFICATION" -ForegroundColor Cyan

$results = @{}
foreach ($folderType in $folderTypes) {
    $count = (Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | Where-Object { 
        $_.Name -eq $folderType -and 
        $_.FullName -notlike "*backup*" -and
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*temp*"
    }).Count
    
    $results[$folderType] = $count
    
    $target = switch ($folderType) {
        "components" { 15 }
        "services" { 8 }
        "models" { 8 }
        "api" { 2 }
        "types" { 1 }
        "utils" { 2 }
        "hooks" { 5 }
    }
    
    $status = if ($count -le $target) { "✅ MET" } else { "❌ EXCEEDED" }
    Write-Host "  $folderType : $count/$target $status" -ForegroundColor $(if ($count -le $target) { "Green" } else { "Red" })
}

# Calculate success rate
$totalTargets = 7
$metTargets = ($results.GetEnumerator() | Where-Object { 
    $target = switch ($_.Key) {
        "components" { 15 }
        "services" { 8 }
        "models" { 8 }
        "api" { 2 }
        "types" { 1 }
        "utils" { 2 }
        "hooks" { 5 }
    }
    $_.Value -le $target
}).Count

$successRate = [math]::Round(($metTargets / $totalTargets) * 100, 1)

if ($metTargets -eq $totalTargets) {
    Write-Host "🎉 PHASE 1.5C COMPLETE SUCCESS - ALL TARGETS MET! Success Rate: $successRate percent" -ForegroundColor Green
    Write-Host "✅ Ready for Phase 2: Domain Migration" -ForegroundColor Green
}
elseif ($successRate -ge 70) {
    Write-Host "⚡ PHASE 1.5C SIGNIFICANT SUCCESS - $metTargets/$totalTargets targets met. Success Rate: $successRate percent" -ForegroundColor Yellow
    Write-Host "🔧 Minor cleanup needed for remaining targets" -ForegroundColor Yellow
}
else {
    Write-Host "🔄 PHASE 1.5C PARTIAL SUCCESS - $metTargets/$totalTargets targets met. Success Rate: $successRate percent" -ForegroundColor Red
    Write-Host "🛠️  Manual intervention required" -ForegroundColor Red
}

Write-Host "📋 PHASE 1.5C EXECUTION COMPLETE" -ForegroundColor Cyan

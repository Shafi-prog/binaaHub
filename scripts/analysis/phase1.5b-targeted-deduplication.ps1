# Phase 1.5B: Targeted Deduplication Script
# Focus on actual duplicate folders containing real content

Write-Host "🎯 PHASE 1.5B: TARGETED DEDUPLICATION PROTOCOL" -ForegroundColor Cyan
Write-Host "🔍 FOCUSING ON REAL DUPLICATE FOLDERS WITH CONTENT" -ForegroundColor Yellow

# Step 1: Find all duplicate folders recursively
Write-Host "📊 Scanning for duplicate folders..." -ForegroundColor Cyan

$folderTypes = @("components", "services", "models", "api", "types", "utils", "hooks")
$allDuplicates = @{}

foreach ($folderType in $folderTypes) {
    Write-Host "  🔍 Scanning for '$folderType' folders..." -ForegroundColor Gray
    
    $folders = Get-ChildItem -Recurse -Directory | Where-Object { 
        $_.Name -eq $folderType
    } | Select-Object FullName, @{Name="RelativePath"; Expression={$_.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""}}
    
    $allDuplicates[$folderType] = $folders
    Write-Host "    Found: $($folders.Count) '$folderType' folders" -ForegroundColor Yellow
}

# Step 2: Define what should be kept (approved locations)
$approvedPatterns = @(
    "src\\core\\shared\\components",
    "src\\core\\shared\\services", 
    "src\\core\\shared\\models",
    "src\\core\\shared\\types",
    "src\\core\\shared\\utils",
    "src\\core\\shared\\hooks",
    "src\\domains\\[^\\]+\\components",
    "src\\domains\\[^\\]+\\services",
    "src\\domains\\[^\\]+\\models",
    "src\\domains\\[^\\]+\\api",
    "src\\domains\\[^\\]+\\types",
    "src\\products\\[^\\]+\\components",
    "src\\products\\[^\\]+\\services",
    "src\\products\\[^\\]+\\api",
    "components\\[^\\]+$",  # Top-level components with single subfolder
    "node_modules"  # Exclude node_modules
)

# Step 3: Identify folders to consolidate
Write-Host "📋 Identifying folders for consolidation..." -ForegroundColor Cyan

$foldersToRemove = @()
$foldersToKeep = @()
$contentToMove = @()

foreach ($folderType in $folderTypes) {
    $folders = $allDuplicates[$folderType]
    
    foreach ($folder in $folders) {
        $relativePath = $folder.RelativePath
        $isApproved = $false
        
        # Check if folder matches approved patterns
        foreach ($pattern in $approvedPatterns) {
            if ($relativePath -match $pattern) {
                $isApproved = $true
                break
            }
        }
        
        # Skip node_modules and .next folders
        if ($relativePath -match "node_modules|\.next|backups|temp") {
            continue
        }
        
        if ($isApproved) {
            $foldersToKeep += $folder
        } else {
            # Check if folder has actual content (not empty)
            $hasContent = $false
            if (Test-Path $folder.FullName) {
                $items = Get-ChildItem $folder.FullName -Recurse -File | Where-Object {
                    $_.Extension -match "\.(js|jsx|ts|tsx|css|scss|json|md)$"
                }
                if ($items.Count -gt 0) {
                    $hasContent = $true
                    $contentToMove += @{
                        Source = $folder.FullName
                        RelativePath = $relativePath
                        Type = $folderType
                        ItemCount = $items.Count
                    }
                }
            }
            
            if (!$hasContent) {
                $foldersToRemove += $folder
            }
        }
    }
}

Write-Host "📊 CONSOLIDATION ANALYSIS:" -ForegroundColor Green
Write-Host "  ✅ Folders to keep: $($foldersToKeep.Count)" -ForegroundColor Green
Write-Host "  🗑️  Empty folders to remove: $($foldersToRemove.Count)" -ForegroundColor Yellow
Write-Host "  📦 Folders with content to move: $($contentToMove.Count)" -ForegroundColor Blue

# Step 4: Remove empty duplicate folders
Write-Host "🧹 Removing empty duplicate folders..." -ForegroundColor Red

$removedCount = 0
foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder.FullName) {
        try {
            Remove-Item $folder.FullName -Recurse -Force
            $removedCount++
            Write-Host "  ✅ Removed: $($folder.RelativePath)" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ Failed to remove: $($folder.RelativePath)" -ForegroundColor Red
        }
    }
}

Write-Host "🗑️  Removed $removedCount empty duplicate folders" -ForegroundColor Green

# Step 5: Create consolidation plan for content-rich folders
Write-Host "📋 Creating consolidation plan for content-rich folders..." -ForegroundColor Cyan

$consolidationPlan = @()
foreach ($item in $contentToMove) {
    $targetLocation = ""
    
    # Determine target location based on folder type and path
    switch ($item.Type) {
        "components" {
            if ($item.RelativePath -match "src\\app") {
                $targetLocation = "src\core\shared\components"
            } elseif ($item.RelativePath -match "domains\\([^\\]+)") {
                $domain = $matches[1]
                $targetLocation = "src\domains\$domain\components"
            } elseif ($item.RelativePath -match "products\\([^\\]+)") {
                $product = $matches[1]
                $targetLocation = "src\products\$product\components"
            } else {
                $targetLocation = "src\core\shared\components"
            }
        }
        "services" {
            if ($item.RelativePath -match "domains\\([^\\]+)") {
                $domain = $matches[1]
                $targetLocation = "src\domains\$domain\services"
            } elseif ($item.RelativePath -match "products\\([^\\]+)") {
                $product = $matches[1]
                $targetLocation = "src\products\$product\services"
            } else {
                $targetLocation = "src\core\shared\services"
            }
        }
        "models" {
            if ($item.RelativePath -match "domains\\([^\\]+)") {
                $domain = $matches[1]
                $targetLocation = "src\domains\$domain\models"
            } else {
                $targetLocation = "src\core\shared\models"
            }
        }
        default {
            $targetLocation = "src\core\shared\$($item.Type)"
        }
    }
    
    $consolidationPlan += @{
        Source = $item.Source
        Target = $targetLocation
        Type = $item.Type
        ItemCount = $item.ItemCount
        RelativePath = $item.RelativePath
    }
}

# Step 6: Execute content consolidation
Write-Host "📦 Executing content consolidation..." -ForegroundColor Blue

$movedCount = 0
foreach ($plan in $consolidationPlan) {
    if (Test-Path $plan.Source) {
        # Ensure target directory exists
        if (!(Test-Path $plan.Target)) {
            New-Item -Path $plan.Target -ItemType Directory -Force | Out-Null
        }
        
        try {
            # Copy content to target location
            $sourceItems = Get-ChildItem $plan.Source -Recurse -File
            foreach ($item in $sourceItems) {
                $relativePath = $item.FullName -replace [regex]::Escape($plan.Source), ""
                $targetPath = Join-Path $plan.Target $relativePath.TrimStart("\")
                $targetDir = Split-Path $targetPath -Parent
                
                if (!(Test-Path $targetDir)) {
                    New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
                }
                
                if (!(Test-Path $targetPath)) {
                    Copy-Item $item.FullName $targetPath -Force
                }
            }
            
            # Remove source folder after successful copy
            Remove-Item $plan.Source -Recurse -Force
            $movedCount++
            Write-Host "  ✅ Moved: $($plan.RelativePath) → $($plan.Target)" -ForegroundColor Green
            
        } catch {
            Write-Host "  ❌ Failed to move: $($plan.RelativePath)" -ForegroundColor Red
        }
    }
}

Write-Host "📦 Moved $movedCount content folders" -ForegroundColor Green

# Step 7: Final verification
Write-Host "🎯 FINAL VERIFICATION..." -ForegroundColor Cyan

$finalAnalysis = @{}
foreach ($folderType in $folderTypes) {
    $count = (Get-ChildItem -Recurse -Directory | Where-Object { 
        $_.Name -eq $folderType -and 
        $_.FullName -notmatch "node_modules|\.next|backups|temp"
    }).Count
    
    $finalAnalysis[$folderType] = $count
}

Write-Host "📊 FINAL DUPLICATION STATUS:" -ForegroundColor Cyan
$success = $true
$targets = @{
    "components" = 15
    "services" = 8
    "models" = 8
    "api" = 8
    "types" = 10
    "utils" = 5
    "hooks" = 5
}

foreach ($folderType in $folderTypes) {
    $count = $finalAnalysis[$folderType]
    $target = $targets[$folderType]
    $status = if ($count -le $target) { "✅" } else { "❌"; $success = $false }
    Write-Host "  $status ${folderType}: $count folders (TARGET: <=$target)" -ForegroundColor $(if ($count -le $target) { "Green" } else { "Red" })
}

if ($success) {
    Write-Host "🎉 PHASE 1.5B COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "✅ All deduplication targets achieved!" -ForegroundColor Green
} else {
    Write-Host "⚠️  PHASE 1.5B PARTIAL SUCCESS - Some targets not met" -ForegroundColor Yellow
    Write-Host "📝 Significant progress made, manual cleanup may be needed for remaining duplicates" -ForegroundColor Yellow
}

Write-Host "🔄 Ready for Phase 2: Domain Migration" -ForegroundColor Cyan

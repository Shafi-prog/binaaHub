# Phase 1.5E: FINAL CLEANUP ANALYSIS
Write-Host "PHASE 1.5E: COMPREHENSIVE FOLDER CONTENT ANALYSIS" -ForegroundColor Red

# Exclude build artifacts and backups
$excludePatterns = @("*backup*", "*node_modules*", "*temp*", "*.next*", "*.git*")

Write-Host "=== DETAILED FOLDER ANALYSIS ===" -ForegroundColor Cyan

# Analyze each folder type
$folderTypes = @("components", "services", "models", "api", "types", "utils", "hooks")

foreach ($folderType in $folderTypes) {
    Write-Host "`n$folderType FOLDERS:" -ForegroundColor Yellow
    
    $folders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
        Where-Object { 
            $_.Name -eq $folderType -and 
            ($excludePatterns | ForEach-Object { $_.FullName -notlike $_ }) -notcontains $false
        }
    
    foreach ($folder in $folders) {
        $relativePath = $folder.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
        $fileCount = (Get-ChildItem -Path $folder.FullName -Recurse -File -ErrorAction SilentlyContinue).Count
        $dirCount = (Get-ChildItem -Path $folder.FullName -Recurse -Directory -ErrorAction SilentlyContinue).Count
        
        if ($fileCount -eq 0 -and $dirCount -eq 0) {
            Write-Host "  [EMPTY] $relativePath" -ForegroundColor Red
        }
        elseif ($fileCount -eq 0) {
            Write-Host "  [NO FILES] $relativePath ($dirCount subdirs)" -ForegroundColor Yellow
        }
        else {
            Write-Host "  [CONTENT] $relativePath ($fileCount files, $dirCount subdirs)" -ForegroundColor Green
        }
    }
}

Write-Host "`n=== CLEANUP RECOMMENDATIONS ===" -ForegroundColor Cyan

# Check for empty folders that can be removed
Write-Host "`nEMPTY FOLDERS TO REMOVE:" -ForegroundColor Red
$emptyFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
    Where-Object { 
        ($excludePatterns | ForEach-Object { $_.FullName -notlike $_ }) -notcontains $false -and
        (Get-ChildItem -Path $_.FullName -Recurse -Force -ErrorAction SilentlyContinue).Count -eq 0
    }

foreach ($empty in $emptyFolders) {
    $relativePath = $empty.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
    Write-Host "  - $relativePath" -ForegroundColor Red
}

Write-Host "Total empty folders to remove: $($emptyFolders.Count)" -ForegroundColor Red

# Check for folders with only subdirectories but no files
Write-Host "`nFOLDERS WITH NO FILES (only subdirs):" -ForegroundColor Yellow
$noFilesFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
    Where-Object { 
        ($excludePatterns | ForEach-Object { $_.FullName -notlike $_ }) -notcontains $false -and
        (Get-ChildItem -Path $_.FullName -Recurse -File -ErrorAction SilentlyContinue).Count -eq 0 -and
        (Get-ChildItem -Path $_.FullName -Recurse -Directory -ErrorAction SilentlyContinue).Count -gt 0
    }

foreach ($noFiles in $noFilesFolders) {
    $relativePath = $noFiles.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
    $subdirCount = (Get-ChildItem -Path $noFiles.FullName -Recurse -Directory -ErrorAction SilentlyContinue).Count
    Write-Host "  - $relativePath ($subdirCount subdirs)" -ForegroundColor Yellow
}

Write-Host "`n=== CONSOLIDATION OPPORTUNITIES ===" -ForegroundColor Cyan

# Check for shared domain folders that could be moved
Write-Host "`nSHARED DOMAIN FOLDERS TO CONSOLIDATE:" -ForegroundColor Blue
$sharedFolders = Get-ChildItem -Recurse -Directory -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.FullName -like "*domains\shared*" -and
        ($excludePatterns | ForEach-Object { $_.FullName -notlike $_ }) -notcontains $false
    }

foreach ($shared in $sharedFolders) {
    $relativePath = $shared.FullName -replace [regex]::Escape((Get-Location).Path + "\"), ""
    $fileCount = (Get-ChildItem -Path $shared.FullName -Recurse -File -ErrorAction SilentlyContinue).Count
    
    if ($fileCount -gt 0) {
        Write-Host "  - $relativePath ($fileCount files) -> MOVE TO src\core\shared\" -ForegroundColor Blue
    }
}

Write-Host "`nANALYSIS COMPLETE" -ForegroundColor Cyan

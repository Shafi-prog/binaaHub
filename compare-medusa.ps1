# Compare Medusa directories script
param(
    [string]$MedusaPath = "C:\Users\hp\Documents\medusa-develop",
    [string]$BinnaPath = "src\domains\marketplace\storefront\store"
)

Write-Host "🔍 Comparing Medusa directories..." -ForegroundColor Yellow
Write-Host "Medusa Source: $MedusaPath" -ForegroundColor Cyan
Write-Host "BINNA Store: $BinnaPath" -ForegroundColor Cyan
Write-Host ""

# Check if Medusa directory exists
if (-not (Test-Path $MedusaPath)) {
    Write-Host "❌ Medusa directory not found: $MedusaPath" -ForegroundColor Red
    Write-Host "Please check the path and try again." -ForegroundColor Yellow
    exit 1
}

# Get BINNA files
Write-Host "📁 Getting BINNA storefront files..." -ForegroundColor Green
$binnaFiles = Get-ChildItem $BinnaPath -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace((Resolve-Path $BinnaPath).Path + "\", "")
    [PSCustomObject]@{
        Name = $_.Name
        RelativePath = $relativePath
        Size = $_.Length
        FullPath = $_.FullName
    }
} | Sort-Object RelativePath

Write-Host "Found $($binnaFiles.Count) files in BINNA storefront" -ForegroundColor Green

# Try to find corresponding Medusa files
Write-Host ""
Write-Host "🔍 Searching for potential Medusa source locations..." -ForegroundColor Yellow

# Common Medusa admin/storefront locations to check
$medusaSearchPaths = @(
    "packages/admin",
    "packages/admin-next", 
    "packages/admin-ui",
    "packages/storefront",
    "packages/medusa-admin",
    "packages/admin/dashboard",
    "packages/admin/ui",
    "www/admin",
    "admin",
    "dashboard"
)

$foundMedusaPaths = @()
foreach ($searchPath in $medusaSearchPaths) {
    $fullSearchPath = Join-Path $MedusaPath $searchPath
    if (Test-Path $fullSearchPath) {
        $foundMedusaPaths += $fullSearchPath
        Write-Host "✅ Found: $fullSearchPath" -ForegroundColor Green
    }
}

if ($foundMedusaPaths.Count -eq 0) {
    Write-Host "❌ No admin/storefront directories found in Medusa" -ForegroundColor Red
    Write-Host "Please check the Medusa directory structure manually." -ForegroundColor Yellow
    
    # List top-level directories in Medusa for manual inspection
    Write-Host ""
    Write-Host "📂 Top-level directories in Medusa:" -ForegroundColor Cyan
    Get-ChildItem $MedusaPath -Directory | Select-Object Name | Format-Table -AutoSize
    exit 1
}

# Compare with each found path
foreach ($medusaPath in $foundMedusaPaths) {
    Write-Host ""
    Write-Host "🔄 Comparing with: $medusaPath" -ForegroundColor Cyan
    
    $medusaFiles = Get-ChildItem $medusaPath -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Replace((Resolve-Path $medusaPath).Path + "\", "")
        [PSCustomObject]@{
            Name = $_.Name
            RelativePath = $relativePath
            Size = $_.Length
            FullPath = $_.FullPath
        }
    } | Sort-Object RelativePath
    
    Write-Host "Found $($medusaFiles.Count) files in Medusa path" -ForegroundColor Green
    
    # Find files unique to BINNA (not in Medusa)
    $uniqueToBinna = $binnaFiles | Where-Object { 
        $binnaFile = $_
        -not ($medusaFiles | Where-Object { $_.Name -eq $binnaFile.Name })
    }
    
    if ($uniqueToBinna.Count -gt 0) {
        Write-Host ""
        Write-Host "🆕 Files unique to BINNA ($($uniqueToBinna.Count) files):" -ForegroundColor Yellow
        $uniqueToBinna | Select-Object Name, RelativePath, Size | Format-Table -AutoSize
        
        # Save to file for review
        $outputFile = "binna-unique-files.txt"
        $uniqueToBinna | Out-String | Set-Content $outputFile
        Write-Host "💾 Unique files list saved to: $outputFile" -ForegroundColor Green
    } else {
        Write-Host "✅ No files unique to BINNA found - all files exist in Medusa" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Comparison complete!" -ForegroundColor Green

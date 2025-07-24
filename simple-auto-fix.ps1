# Simple Auto-fix Platform Pages Script
# Automatically fixes common issues found in platform pages

param(
    [switch]$DryRun,    # Show what would be fixed without making changes
    [switch]$Backup     # Create backup files before fixing
)

Write-Host "🔧 Simple Auto-Fix Platform Pages" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$srcDir = ".\src\app"
$fixedCount = 0
$issuesFound = 0

function Write-FixLog {
    param($Message, $Color = "White")
    Write-Host "  $Message" -ForegroundColor $Color
}

function Fix-TypeScriptNoCheck {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    if ($content -match '@ts-nocheck') {
        $script:issuesFound++
        Write-FixLog "Found @ts-nocheck directive" -Color Yellow
        
        if (-not $DryRun) {
            if ($Backup) {
                Copy-Item $FilePath "$FilePath.backup"
            }
            
            # Remove @ts-nocheck
            $content = $content -replace '// @ts-nocheck\r?\n?', ''
            $content = $content -replace '/\*\s*@ts-nocheck\s*\*/', ''
            
            Set-Content $FilePath $content -NoNewline
            $script:fixedCount++
            Write-FixLog "Removed @ts-nocheck directive" -Color Green
        } else {
            Write-FixLog "Would remove @ts-nocheck directive" -Color Cyan
        }
    }
}

function Fix-MissingExports {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    if ($content -notmatch 'export default') {
        # Try to find a component function to export
        if ($content -match '(?:function|const)\s+(\w+).*(?:React\.FC|JSX\.Element|\(\)\s*=>)') {
            $componentName = $Matches[1]
            $script:issuesFound++
            Write-FixLog "Missing default export for component: $componentName" -Color Yellow
            
            if (-not $DryRun) {
                if ($Backup) {
                    Copy-Item $FilePath "$FilePath.backup"
                }
                
                $content += "`n`nexport default $componentName;"
                Set-Content $FilePath $content -NoNewline
                $script:fixedCount++
                Write-FixLog "Added default export for $componentName" -Color Green
            } else {
                Write-FixLog "Would add default export for $componentName" -Color Cyan
            }
        }
    }
}

function Fix-BasicSyntax {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    $originalContent = $content
    
    # Fix missing dynamic export
    if ($content -match "'use client'" -and $content -notmatch "export const dynamic") {
        $content = $content -replace "('use client';)", "`$1`n`nexport const dynamic = 'force-dynamic';"
        $script:issuesFound++
        Write-FixLog "Added missing dynamic export" -Color Yellow
    }
    
    if ($content -ne $originalContent) {
        if (-not $DryRun) {
            if ($Backup) {
                Copy-Item $FilePath "$FilePath.backup"
            }
            
            Set-Content $FilePath $content -NoNewline
            $script:fixedCount++
            Write-FixLog "Fixed basic syntax issues" -Color Green
        } else {
            Write-FixLog "Would fix basic syntax issues" -Color Cyan
        }
    }
}

function Process-PageFile {
    param($FilePath)
    
    $relativePath = $FilePath.Substring($PWD.Path.Length + 1)
    Write-Host "🔍 Checking: $relativePath" -ForegroundColor Blue
    
    if (-not (Test-Path $FilePath)) {
        Write-FixLog "File not found!" -Color Red
        return
    }
    
    $script:issuesFound = 0
    
    try {
        Fix-TypeScriptNoCheck $FilePath
        Fix-MissingExports $FilePath
        Fix-BasicSyntax $FilePath
        
        if ($script:issuesFound -eq 0) {
            Write-FixLog "No issues found" -Color Green
        }
    } catch {
        Write-FixLog "Error processing file: $($_.Exception.Message)" -Color Red
    }
    
    Write-Host ""
}

# Main execution
if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

if ($Backup) {
    Write-Host "💾 BACKUP MODE - Original files will be backed up" -ForegroundColor Green
    Write-Host ""
}

# Find all page.tsx files
Write-Host "🔍 Scanning for page.tsx files..." -ForegroundColor Cyan
$pageFiles = Get-ChildItem -Path $srcDir -Recurse -Name "page.tsx" | ForEach-Object { Join-Path $srcDir $_ }

Write-Host "Found $($pageFiles.Count) page files" -ForegroundColor Green
Write-Host ""

# Process each file
foreach ($file in $pageFiles) {
    Process-PageFile $file
}

# Summary
Write-Host "✅ Auto-fix completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 SUMMARY:" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host "Files processed: $($pageFiles.Count)"
Write-Host "Files fixed: $fixedCount"

if ($DryRun) {
    Write-Host ""
    Write-Host "💡 Run without -DryRun to apply fixes" -ForegroundColor Yellow
}

if ($Backup -and $fixedCount -gt 0) {
    Write-Host ""
    Write-Host "💾 Backup files created with .backup extension" -ForegroundColor Green
}

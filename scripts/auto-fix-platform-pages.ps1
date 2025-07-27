# Auto-fix Platform Pages Script
# Automatically fixes common issues found in platform pages

param(
    [switch]$DryRun,    # Show what would be fixed without making changes
    [switch]$Backup     # Create backup files before fixing
)

Write-Host "🔧 Auto-Fix Platform Pages" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
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
        $issuesFound++
        Write-FixLog "Found @ts-nocheck directive" -Color Yellow
        
        if (-not $DryRun) {
            if ($Backup) {
                Copy-Item $FilePath "$FilePath.backup"
            }
            
            # Remove @ts-nocheck and fix common issues
            $content = $content -replace '// @ts-nocheck\r?\n?', ''
            $content = $content -replace '/\*\s*@ts-nocheck\s*\*/', ''
            
            Set-Content $FilePath $content -NoNewline
            $fixedCount++
            Write-FixLog "Removed @ts-nocheck directive" -Color Green
        } else {
            Write-FixLog "Would remove @ts-nocheck directive" -Color Cyan
        }
    }
}

function Fix-MissingImports {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    $imports = @()
    $componentsUsed = @()
    
    # Check for common missing UI components
    $uiComponents = @(
        'Button', 'Card', 'CardContent', 'CardHeader', 'CardTitle', 
        'Badge', 'Input', 'Table', 'TableBody', 'TableCell', 
        'TableHead', 'TableHeader', 'TableRow'
    )
    
    foreach ($component in $uiComponents) {
        if ($content -match "<$component" -or $content -match "$component\s+") {
            $componentsUsed += $component
        }
    }
    
    # Check if imports are missing
    $missingImports = @()
    foreach ($component in $componentsUsed) {
        if ($content -notmatch "import.*$component.*from") {
            $missingImports += $component
        }
    }
    
    if ($missingImports.Count -gt 0) {
        $issuesFound++
        Write-FixLog "Missing imports: $($missingImports -join ', ')" -Color Yellow
        
        if (-not $DryRun) {
            if ($Backup) {
                Copy-Item $FilePath "$FilePath.backup"
            }
            
            # Add missing UI component imports
            $buttonImports = $missingImports | Where-Object { $_ -in @('Button') }
            $cardImports = $missingImports | Where-Object { $_ -in @('Card', 'CardContent', 'CardHeader', 'CardTitle') }
            $tableImports = $missingImports | Where-Object { $_ -in @('Table', 'TableBody', 'TableCell', 'TableHead', 'TableHeader', 'TableRow') }
            $otherImports = $missingImports | Where-Object { $_ -notin @('Button', 'Card', 'CardContent', 'CardHeader', 'CardTitle', 'Table', 'TableBody', 'TableCell', 'TableHead', 'TableHeader', 'TableRow') }
            
            $newImports = @()
            if ($buttonImports) { $newImports += 'import { Button } from ''@/core/shared/components/ui/button'';' }
            if ($cardImports) { $newImports += 'import { Card, CardContent, CardHeader, CardTitle } from ''@/core/shared/components/ui/card'';' }
            if ($tableImports) { $newImports += 'import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from ''@/core/shared/components/ui/table'';' }
            if ($otherImports -contains 'Badge') { $newImports += 'import { Badge } from ''@/core/shared/components/ui/badge'';' }
            if ($otherImports -contains 'Input') { $newImports += 'import { Input } from ''@/core/shared/components/ui/input'';' }
            
            if ($newImports.Count -gt 0) {
                # Find the best place to insert imports (after existing imports)
                $lines = $content -split '\r?\n'
                $lastImportIndex = -1
                
                for ($i = 0; $i -lt $lines.Count; $i++) {
                    if ($lines[$i] -match '^import\s+') {
                        $lastImportIndex = $i
                    }
                }
                
                if ($lastImportIndex -ge 0) {
                    # Insert after last import
                    $beforeImports = $lines[0..$lastImportIndex] -join "`n"
                    $afterImports = $lines[($lastImportIndex + 1)..($lines.Count - 1)] -join "`n"
                    $content = $beforeImports + "`n" + ($newImports -join "`n") + "`n" + $afterImports
                } else {
                    # Insert at the beginning after 'use client'
                    if ($content -match "'use client'") {
                        $content = $content -replace "('use client';)", "`$1`n`n$($newImports -join "`n")"
                    } else {
                        $content = ($newImports -join "`n") + "`n`n" + $content
                    }
                }
                
                Set-Content $FilePath $content -NoNewline
                $fixedCount++
                Write-FixLog "Added missing imports" -Color Green
            }
        } else {
            Write-FixLog "Would add missing imports: $($missingImports -join ', ')" -Color Cyan
        }
    }
}

function Fix-MissingExports {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    if ($content -notmatch 'export default') {
        # Try to find a component function to export
        $componentMatches = [regex]::Matches($content, '(?:function|const)\s+(\w+).*(?:React\.FC|JSX\.Element|\(\)\s*=>)')
        
        if ($componentMatches.Count -gt 0) {
            $componentName = $componentMatches[0].Groups[1].Value
            $issuesFound++
            Write-FixLog "Missing default export for component: $componentName" -Color Yellow
            
            if (-not $DryRun) {
                if ($Backup) {
                    Copy-Item $FilePath "$FilePath.backup"
                }
                
                $content += "`n`nexport default $componentName;"
                Set-Content $FilePath $content -NoNewline
                $fixedCount++
                Write-FixLog "Added default export for $componentName" -Color Green
            } else {
                Write-FixLog "Would add default export for $componentName" -Color Cyan
            }
        }
    }
}

function Fix-SyntaxErrors {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    $fixed = $false
    
    # Fix common syntax issues
    $originalContent = $content
    
    # Fix missing semicolons in imports
    $content = $content -replace "import\s+(.+)\s+from\s+['\"]([^'\"]+)['\"](?!;)", "import `$1 from '`$2';"
    
    # Fix missing dynamic export
    if ($content -match "'use client'" -and $content -notmatch "export const dynamic") {
        $content = $content -replace "('use client';)", "`$1`n`nexport const dynamic = 'force-dynamic';"
        $fixed = $true
    }
    
    if ($content -ne $originalContent) {
        $issuesFound++
        Write-FixLog "Found syntax issues" -Color Yellow
        
        if (-not $DryRun) {
            if ($Backup) {
                Copy-Item $FilePath "$FilePath.backup"
            }
            
            Set-Content $FilePath $content -NoNewline
            $fixedCount++
            Write-FixLog "Fixed syntax issues" -Color Green
        } else {
            Write-FixLog "Would fix syntax issues" -Color Cyan
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
    
    try {
        Fix-TypeScriptNoCheck $FilePath
        Fix-MissingImports $FilePath
        Fix-MissingExports $FilePath
        Fix-SyntaxErrors $FilePath
        
        if ($issuesFound -eq 0) {
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
    $issuesFound = 0
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
    Write-Host "To restore: Get-ChildItem -Recurse *.backup | ForEach-Object { Move-Item `$_.FullName (`$_.FullName -replace '\.backup$', '') -Force }"
}

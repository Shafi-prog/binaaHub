Write-Host "🔧 COMPREHENSIVE ERROR FIX - Search & Replace Strategy" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Yellow

# 1. Fix all relative imports to absolute imports
Write-Host "📝 Phase 1: Fixing relative imports..." -ForegroundColor Blue
Get-ChildItem -Path "src" -Recurse -Include "*.ts", "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        # Fix component imports
        $content = $content -replace 'from "\.\.\/\.\.\/components\/', 'from "@/components/'
        $content = $content -replace 'from "\.\.\/\.\.\/\.\.\/components\/', 'from "@/components/'
        $content = $content -replace 'from "\.\.\/\.\.\/\.\.\/\.\.\/components\/', 'from "@/components/'
        $content = $content -replace 'from "\.\.\/components\/', 'from "@/components/'
        $content = $content -replace 'from "\.\/\.\.\/components\/', 'from "@/components/'
        
        # Fix lib imports
        $content = $content -replace 'from "\.\.\/\.\.\/lib\/', 'from "@/lib/'
        $content = $content -replace 'from "\.\.\/\.\.\/\.\.\/lib\/', 'from "@/lib/'
        $content = $content -replace 'from "\.\.\/\.\.\/\.\.\/\.\.\/lib\/', 'from "@/lib/'
        $content = $content -replace 'from "\.\.\/lib\/', 'from "@/lib/'
        $content = $content -replace 'from "\.\/\.\.\/lib\/', 'from "@/lib/'
        
        # Fix utils imports
        $content = $content -replace 'from "\.\.\/\.\.\/utils\/', 'from "@/utils/'
        $content = $content -replace 'from "\.\.\/\.\.\/\.\.\/utils\/', 'from "@/utils/'
        $content = $content -replace 'from "\.\.\/utils\/', 'from "@/utils/'
        
        # Fix types imports
        $content = $content -replace 'from "\.\.\/\.\.\/types\/', 'from "@/types/'
        $content = $content -replace 'from "\.\.\/\.\.\/\.\.\/types\/', 'from "@/types/'
        $content = $content -replace 'from "\.\.\/types\/', 'from "@/types/'
        
        Set-Content -Path $_.FullName -Value $content -NoNewline
    }
}

# 2. Fix UI component import paths
Write-Host "📝 Phase 2: Fixing UI component imports..." -ForegroundColor Blue
Get-ChildItem -Path "src" -Recurse -Include "*.ts", "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        # Fix UI component imports
        $content = $content -replace 'from "\.\.\/\.\.\/components\/ui\/', 'from "@/components/ui/'
        $content = $content -replace 'from "\.\.\/\.\.\/\.\.\/components\/ui\/', 'from "@/components/ui/'
        $content = $content -replace 'from "\.\.\/components\/ui\/', 'from "@/components/ui/'
        $content = $content -replace 'from "\.\/\.\.\/components\/ui\/', 'from "@/components/ui/'
        
        Set-Content -Path $_.FullName -Value $content -NoNewline
    }
}

Write-Host "✅ Comprehensive fix complete!" -ForegroundColor Green

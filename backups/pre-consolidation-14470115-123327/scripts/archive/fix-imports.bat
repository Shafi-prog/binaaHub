@echo off
echo 🚀 Starting Phase 1: Import Path Standardization
echo Target: Reduce 8,514 TypeScript errors by ~3,000

echo.
echo 📦 Fixing import paths...

REM Use PowerShell for the actual replacements
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts', '*.tsx' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $content = $content -replace 'from \"../../lib/client\"', 'from \"@/lib/client\"'; $content = $content -replace 'from \"../../../lib/client\"', 'from \"@/lib/client\"'; $content = $content -replace 'from \"../../../../lib/client\"', 'from \"@/lib/client\"'; $content = $content -replace 'from \"../../lib/query-client\"', 'from \"@/lib/query-client\"'; $content = $content -replace 'from \"../../../lib/query-client\"', 'from \"@/lib/query-client\"'; $content = $content -replace 'from \"../../../../lib/query-client\"', 'from \"@/lib/query-client\"'; $content = $content -replace 'from \"../../lib/query-key-factory\"', 'from \"@/lib/query-key-factory\"'; $content = $content -replace 'from \"../../../lib/query-key-factory\"', 'from \"@/lib/query-key-factory\"'; $content = $content -replace 'from \"../../../../lib/query-key-factory\"', 'from \"@/lib/query-key-factory\"'; $content = $content -replace 'from \"../../../components/', 'from \"@/components/'; $content = $content -replace 'from \"../../components/', 'from \"@/components/'; $content = $content -replace 'from \"../components/', 'from \"@/components/'; $content = $content -replace 'from \"../../store/modules/', 'from \"@/store/modules/'; $content = $content -replace 'from \"../../../store/modules/', 'from \"@/store/modules/'; $content = $content -replace 'from \"../../../../store/modules/', 'from \"@/store/modules/'; $content = $content -replace 'from \"../../utils/', 'from \"@/utils/'; $content = $content -replace 'from \"../../../utils/', 'from \"@/utils/'; $content = $content -replace 'from \"../../../../utils/', 'from \"@/utils/'; $content = $content -replace 'from \"../../hooks/', 'from \"@/hooks/'; $content = $content -replace 'from \"../../../hooks/', 'from \"@/hooks/'; $content = $content -replace 'from \"../../../../hooks/', 'from \"@/hooks/'; $content = $content -replace 'from \"../../types/', 'from \"@/types/'; $content = $content -replace 'from \"../../../types/', 'from \"@/types/'; $content = $content -replace 'from \"../../../../types/', 'from \"@/types/'; Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"Fixed: $($_.Name)\" } }"

echo.
echo ✅ Phase 1 Complete: Import paths standardized
echo 🔍 Run 'npm run type-check' to check error reduction
echo 📊 Expected error reduction: ~3,000 errors

pause
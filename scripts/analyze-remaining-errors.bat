@echo off
echo 🔍 POST-PHASE ANALYSIS - Investigating Remaining Errors
echo ====================================================

echo.
echo 📊 Analyzing current TypeScript errors...

REM Get comprehensive error analysis
npx tsc --noEmit 2>temp_all_errors.txt

REM Count total errors
findstr /c:"error TS" temp_all_errors.txt > temp_error_count.txt 2>nul
for /f %%i in ('type temp_error_count.txt ^| find /c /v ""') do set TOTAL_ERRORS=%%i

echo   Total remaining errors: %TOTAL_ERRORS%

echo.
echo 🔍 ERROR CATEGORY ANALYSIS:

REM Module resolution errors
findstr /c:"Cannot find module" temp_all_errors.txt > temp_module_errors.txt 2>nul
for /f %%i in ('type temp_module_errors.txt ^| find /c /v ""') do set MODULE_ERRORS=%%i
echo   Cannot find module: %MODULE_ERRORS%

REM Property errors
findstr /c:"Property" temp_all_errors.txt > temp_property_errors.txt 2>nul
for /f %%i in ('type temp_property_errors.txt ^| find /c /v ""') do set PROPERTY_ERRORS=%%i
echo   Property errors: %PROPERTY_ERRORS%

REM Type errors
findstr /c:"Type '" temp_all_errors.txt > temp_type_errors.txt 2>nul
for /f %%i in ('type temp_type_errors.txt ^| find /c /v ""') do set TYPE_ERRORS=%%i
echo   Type assignment errors: %TYPE_ERRORS%

REM Import errors
findstr /c:"Module '\"" temp_all_errors.txt > temp_import_errors.txt 2>nul
for /f %%i in ('type temp_import_errors.txt ^| find /c /v ""') do set IMPORT_ERRORS=%%i
echo   Import/export errors: %IMPORT_ERRORS%

REM Decorator errors
findstr /c:"decorator" temp_all_errors.txt > temp_decorator_errors.txt 2>nul
for /f %%i in ('type temp_decorator_errors.txt ^| find /c /v ""') do set DECORATOR_ERRORS=%%i
echo   Decorator errors: %DECORATOR_ERRORS%

REM JSX/React errors
findstr /c:"JSX" temp_all_errors.txt > temp_jsx_errors.txt 2>nul
for /f %%i in ('type temp_jsx_errors.txt ^| find /c /v ""') do set JSX_ERRORS=%%i
echo   JSX/React errors: %JSX_ERRORS%

echo.
echo 📋 TOP 20 MOST FREQUENT ERRORS:
echo ================================

REM Extract error codes and show frequency
powershell -Command "Get-Content temp_all_errors.txt | Where-Object { $_ -match 'error TS(\d+):' } | ForEach-Object { $matches[1] } | Group-Object | Sort-Object Count -Descending | Select-Object -First 20 | ForEach-Object { Write-Host \"  TS$($_.Name): $($_.Count) occurrences\" }"

echo.
echo 📁 TOP 10 FILES WITH MOST ERRORS:
echo ==================================

REM Show files with most errors
powershell -Command "Get-Content temp_all_errors.txt | Where-Object { $_ -match 'error TS' } | ForEach-Object { ($_ -split ':')[0] } | Group-Object | Sort-Object Count -Descending | Select-Object -First 10 | ForEach-Object { $fileName = [System.IO.Path]::GetFileName($_.Name); Write-Host \"  $($_.Count) errors in $fileName\" }"

echo.
echo 🎯 SAMPLE ERRORS FOR ANALYSIS:
echo ==============================

echo   [Module Resolution Samples]
type temp_module_errors.txt 2>nul | head -3

echo.
echo   [Property Error Samples]  
type temp_property_errors.txt 2>nul | head -3

echo.
echo   [Type Error Samples]
type temp_type_errors.txt 2>nul | head -3

echo.
echo 💡 ANALYSIS SUMMARY:
echo ====================

if %MODULE_ERRORS% gtr 100 (
    echo   🔴 HIGH: Module resolution issues need attention
    echo      - Check tsconfig.json paths
    echo      - Verify @/* alias mappings
    echo      - Add missing module declarations
)

if %PROPERTY_ERRORS% gtr 200 (
    echo   🔴 HIGH: Property access issues
    echo      - Add interface declarations
    echo      - Fix object type definitions
    echo      - Update component prop types
)

if %TYPE_ERRORS% gtr 150 (
    echo   🔴 HIGH: Type assignment problems
    echo      - Fix type mismatches
    echo      - Add proper type annotations
    echo      - Update function signatures
)

if %IMPORT_ERRORS% gtr 50 (
    echo   ⚠️  MED: Import/export issues
    echo      - Check export statements
    echo      - Verify import paths
    echo      - Fix default vs named exports
)

echo.
echo 🚀 RECOMMENDED NEXT ACTIONS:
echo ============================

echo   1. Focus on highest frequency error types first
echo   2. Review top error files for manual fixes
echo   3. Create targeted type declarations for remaining modules
echo   4. Consider gradual migration approach for complex types

echo.
echo ⚡ QUICK COMMANDS:
echo   Manual review: code [filename with most errors]
echo   Specific fix: npx tsc --noEmit --listFiles
echo   Continue work: Focus on TS#### error codes above

REM Cleanup
del temp_all_errors.txt temp_error_count.txt temp_module_errors.txt temp_property_errors.txt temp_type_errors.txt temp_import_errors.txt temp_decorator_errors.txt temp_jsx_errors.txt 2>nul

pause
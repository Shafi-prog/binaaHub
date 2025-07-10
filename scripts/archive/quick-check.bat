@echo off
echo 🔍 QUICK ERROR COUNT CHECK
echo ========================

echo.
echo 📊 Running TypeScript check...
npx tsc --noEmit 2>temp_errors.txt

echo.
echo 📈 Counting errors...
findstr /c:"error TS" temp_errors.txt > temp_count.txt 2>nul
for /f %%i in ('type temp_count.txt ^| find /c /v ""') do set ERROR_COUNT=%%i

echo.
echo 📊 CURRENT STATUS:
echo   TypeScript errors: %ERROR_COUNT%
echo   Original errors: 8,514
echo   Phase 1 target: 5,500

set /a REDUCTION=8514-%ERROR_COUNT%
echo   Errors reduced: %REDUCTION%

if %ERROR_COUNT% leq 5500 (
    echo   ✅ Phase 1 TARGET ACHIEVED!
) else (
    if %REDUCTION% geq 1500 (
        echo   ⚠️ Good progress made
    ) else (
        echo   🔄 More work needed
    )
)

echo.
echo 🔍 Top error files:
findstr /c:"error TS" temp_errors.txt | findstr /v "node_modules" > temp_clean.txt 2>nul
for /f "tokens=1 delims=:" %%a in (temp_clean.txt) do echo   %%a >> temp_files.txt 2>nul
sort temp_files.txt | uniq -c | sort -nr | head -10 2>nul

echo.
echo 📋 Next actions based on count:
echo   - If ^<5,500: Proceed to Phase 2
echo   - If 5,500-7,000: Complete import fixes
echo   - If ^>7,000: Check configuration

REM Cleanup
del temp_errors.txt temp_count.txt temp_clean.txt temp_files.txt 2>nul
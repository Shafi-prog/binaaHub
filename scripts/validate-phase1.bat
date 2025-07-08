@echo off
echo 🔍 Counting TypeScript errors...

REM Run TypeScript check and count errors
npx tsc --noEmit 2>temp_errors.txt

REM Count the error lines
findstr /c:"error TS" temp_errors.txt > temp_count.txt 2>nul
for /f %%i in ('type temp_count.txt ^| find /c /v ""') do set ERROR_COUNT=%%i

echo.
echo 📊 Current TypeScript errors: %ERROR_COUNT%

REM Expected targets
set ORIGINAL_ERRORS=8514
set PHASE1_TARGET=5500
set /a EXPECTED_REDUCTION=%ORIGINAL_ERRORS%-%PHASE1_TARGET%
set /a ACTUAL_REDUCTION=%ORIGINAL_ERRORS%-%ERROR_COUNT%

echo.
echo 📈 PHASE 1 TARGETS:
echo   Original errors: %ORIGINAL_ERRORS%
echo   Target after Phase 1: %PHASE1_TARGET%
echo   Expected reduction: %EXPECTED_REDUCTION%

echo.
echo 🎯 PHASE 1 RESULTS:
echo   Actual reduction: %ACTUAL_REDUCTION%

REM Check if target achieved
if %ERROR_COUNT% leq %PHASE1_TARGET% (
    echo ✅ PHASE 1 SUCCESS - Target achieved!
    echo 🚀 Ready to proceed to Phase 2
) else (
    if %ACTUAL_REDUCTION% geq 1500 (
        echo ⚠️ PHASE 1 PARTIAL SUCCESS
        echo 📝 Some improvement achieved, review and proceed
    ) else (
        echo ❌ PHASE 1 NEEDS ATTENTION
        echo 🔧 Check import patterns and path mappings
    )
)

echo.
echo 📋 NEXT STEPS:
echo 1. If successful: Run Phase 2 (Type declarations)
echo 2. If partial: Review import patterns manually
echo 3. If failed: Check tsconfig.json path mappings

REM Cleanup temp files
del temp_errors.txt 2>nul
del temp_count.txt 2>nul

pause
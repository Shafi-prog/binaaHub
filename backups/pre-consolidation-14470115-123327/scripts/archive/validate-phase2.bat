@echo off
echo 🔍 PHASE 2 VALIDATION - Type Declaration Fixes
echo ==============================================

echo.
echo 📊 Counting TypeScript errors after Phase 2...

REM Count current errors
npx tsc --noEmit 2>temp_errors.txt
findstr /c:"error TS" temp_errors.txt > temp_count.txt 2>nul
for /f %%i in ('type temp_count.txt ^| find /c /v ""') do set ERROR_COUNT=%%i

echo.
echo 📈 PHASE 2 RESULTS:
echo   Current TypeScript errors: %ERROR_COUNT%

REM Phase targets
set PHASE1_RESULT=5500
set PHASE2_TARGET=3800
set /a PHASE2_REDUCTION=%PHASE1_RESULT%-%PHASE2_TARGET%
set /a ACTUAL_REDUCTION=%PHASE1_RESULT%-%ERROR_COUNT%

echo   Phase 1 result: %PHASE1_RESULT%
echo   Phase 2 target: %PHASE2_TARGET%
echo   Expected reduction: %PHASE2_REDUCTION%
echo   Actual reduction: %ACTUAL_REDUCTION%

REM Success assessment
if %ERROR_COUNT% leq %PHASE2_TARGET% (
    echo   ✅ PHASE 2 SUCCESS - Target achieved!
    echo   🚀 Ready to proceed to Phase 3
) else (
    if %ACTUAL_REDUCTION% geq 850 (
        echo   ⚠️ PHASE 2 PARTIAL SUCCESS
        echo   📝 Good progress made, review and proceed
    ) else (
        echo   ❌ PHASE 2 NEEDS ATTENTION
        echo   🔧 Check type declarations and dependencies
    )
)

echo.
echo 🔍 ERROR BREAKDOWN BY TYPE:
findstr /c:"Cannot find module" temp_errors.txt | find /c /v "" > temp_module_errors.txt 2>nul
for /f %%i in ('type temp_module_errors.txt ^| find /c /v ""') do set MODULE_ERRORS=%%i

findstr /c:"jest" temp_errors.txt | find /c /v "" > temp_jest_errors.txt 2>nul
for /f %%i in ('type temp_jest_errors.txt ^| find /c /v ""') do set JEST_ERRORS=%%i

findstr /c:"@mikro-orm" temp_errors.txt | find /c /v "" > temp_orm_errors.txt 2>nul
for /f %%i in ('type temp_orm_errors.txt ^| find /c /v ""') do set ORM_ERRORS=%%i

echo   Module resolution errors: %MODULE_ERRORS%
echo   Jest-related errors: %JEST_ERRORS%
echo   MikroORM errors: %ORM_ERRORS%

echo.
echo 📋 NEXT STEPS:
if %ERROR_COUNT% leq %PHASE2_TARGET% (
    echo   1. ✅ Proceed to Phase 3 ^(Decorator fixes^)
    echo   2. Run: npm run setup-phase3
) else (
    echo   1. Review type declaration files in src/types/
    echo   2. Check if dependencies installed correctly
    echo   3. Re-run: npm run setup-types
    echo   4. Validate: npm run validate-phase2
)

echo.
echo ⚡ QUICK COMMANDS:
echo   Check types: npm run type-check
echo   Proceed to Phase 3: npm run setup-phase3
echo   Re-run Phase 2: npm run setup-types

REM Cleanup
del temp_errors.txt temp_count.txt temp_module_errors.txt temp_jest_errors.txt temp_orm_errors.txt 2>nul

pause
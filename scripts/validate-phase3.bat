@echo off
echo 🔍 PHASE 3 VALIDATION - Decorator Pattern Fixes
echo =============================================

echo.
echo 📊 Counting TypeScript errors after Phase 3...

REM Count current errors
npx tsc --noEmit 2>temp_errors.txt
findstr /c:"error TS" temp_errors.txt > temp_count.txt 2>nul
for /f %%i in ('type temp_count.txt ^| find /c /v ""') do set ERROR_COUNT=%%i

echo.
echo 📈 PHASE 3 RESULTS:
echo   Current TypeScript errors: %ERROR_COUNT%

REM Phase targets
set PHASE2_RESULT=3800
set PHASE3_TARGET=1000
set /a PHASE3_REDUCTION=%PHASE2_RESULT%-%PHASE3_TARGET%
set /a ACTUAL_REDUCTION=%PHASE2_RESULT%-%ERROR_COUNT%

echo   Phase 2 result: %PHASE2_RESULT%
echo   Phase 3 target: %PHASE3_TARGET%
echo   Expected reduction: %PHASE3_REDUCTION%
echo   Actual reduction: %ACTUAL_REDUCTION%

REM Success assessment
if %ERROR_COUNT% leq %PHASE3_TARGET% (
    echo   ✅ PHASE 3 SUCCESS - FINAL TARGET ACHIEVED!
    echo   🎉 TypeScript error reduction project COMPLETE!
) else (
    if %ERROR_COUNT% leq 2000 (
        echo   ⚠️ PHASE 3 PARTIAL SUCCESS ^(1,000-2,000 errors^)
        echo   📝 Significant progress made, minor cleanup needed
    ) else (
        echo   🔄 PHASE 3 NEEDS ATTENTION ^(^>2,000 errors^)
        echo   🔧 Check decorator patterns and service configurations
    )
)

echo.
echo 🔍 ERROR BREAKDOWN BY TYPE:
findstr /c:"@InjectManager" temp_errors.txt | find /c /v "" > temp_inject_errors.txt 2>nul
for /f %%i in ('type temp_inject_errors.txt ^| find /c /v ""') do set INJECT_ERRORS=%%i

findstr /c:"@EmitEvents" temp_errors.txt | find /c /v "" > temp_emit_errors.txt 2>nul
for /f %%i in ('type temp_emit_errors.txt ^| find /c /v ""') do set EMIT_ERRORS=%%i

findstr /c:"decorator" temp_errors.txt | find /c /v "" > temp_decorator_errors.txt 2>nul
for /f %%i in ('type temp_decorator_errors.txt ^| find /c /v ""') do set DECORATOR_ERRORS=%%i

echo   InjectManager errors: %INJECT_ERRORS%
echo   EmitEvents errors: %EMIT_ERRORS%
echo   General decorator errors: %DECORATOR_ERRORS%

echo.
echo 🎯 FINAL PROJECT STATUS:
if %ERROR_COUNT% leq %PHASE3_TARGET% (
    echo   🎉 SUCCESS: TypeScript Error Reduction Project COMPLETE!
    echo   📊 Target achieved: %ERROR_COUNT% errors ^(≤1,000^)
    echo   🚀 Platform ready for production development
    echo.
    echo   📈 PROJECT SUMMARY:
    echo   - Original errors: 8,514
    echo   - Final errors: %ERROR_COUNT%
    set /a TOTAL_REDUCTION=8514-%ERROR_COUNT%
    echo   - Total reduction: !TOTAL_REDUCTION! errors
    set /a SUCCESS_RATE=!TOTAL_REDUCTION!*100/8514
    echo   - Success rate: !SUCCESS_RATE!%%
) else (
    echo   📋 NEXT STEPS FOR FINAL CLEANUP:
    echo   1. Review remaining decorator patterns
    echo   2. Check service injection configurations  
    echo   3. Validate event system implementations
    echo   4. Consider manual fixes for complex cases
)

echo.
echo ⚡ QUICK COMMANDS:
echo   Manual check: npm run type-check
echo   Build test: npm run build
echo   Start development: npm run dev

echo.
echo 📁 TYPE DECLARATION FILES CREATED:
if exist src\types\decorators.d.ts echo   ✅ src\types\decorators.d.ts
if exist src\types\injections.d.ts echo   ✅ src\types\injections.d.ts  
if exist src\types\events.d.ts echo   ✅ src\types\events.d.ts

REM Cleanup
del temp_errors.txt temp_count.txt temp_inject_errors.txt temp_emit_errors.txt temp_decorator_errors.txt 2>nul

pause
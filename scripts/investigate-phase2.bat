@echo off
echo 🔍 PHASE 2 STATUS INVESTIGATION
echo ==============================

echo.
echo 📊 Checking current TypeScript error count...
npx tsc --noEmit 2>temp_errors.txt
findstr /c:"error TS" temp_errors.txt > temp_count.txt 2>nul
for /f %%i in ('type temp_count.txt ^| find /c /v ""') do set ERROR_COUNT=%%i

echo   Current TypeScript errors: %ERROR_COUNT%

echo.
echo 🔍 Checking Phase 2 implementation status...

echo.
echo 📁 Type declarations check:
if exist src\types\global.d.ts (
    echo   ✅ src\types\global.d.ts exists
    dir src\types\global.d.ts | findstr /c:"global.d.ts"
) else (
    echo   ❌ src\types\global.d.ts missing - run: npm run setup-types
)

if exist src\types\mikro-orm.d.ts (
    echo   ✅ src\types\mikro-orm.d.ts exists
) else (
    echo   ❌ src\types\mikro-orm.d.ts missing - run: npm run fix-mikro-orm
)

if exist src\types\jest.d.ts (
    echo   ✅ src\types\jest.d.ts exists
) else (
    echo   ❌ src\types\jest.d.ts missing - run: npm run fix-jest-types
)

echo.
echo 📦 Dependency check:
npm list @types/jest 2>nul | findstr "@types/jest" && (
    echo   ✅ @types/jest installed
) || (
    echo   ❌ @types/jest missing
)

npm list @types/node 2>nul | findstr "@types/node" && (
    echo   ✅ @types/node installed
) || (
    echo   ❌ @types/node missing
)

echo.
echo 🧪 Jest configuration check:
if exist jest.config.js (
    echo   ✅ jest.config.js exists
) else (
    echo   ❌ jest.config.js missing
)

if exist src\setupTests.ts (
    echo   ✅ src\setupTests.ts exists
) else (
    echo   ❌ src\setupTests.ts missing
)

echo.
echo 📈 Error analysis by type:
findstr /c:"Cannot find module" temp_errors.txt | find /c /v "" > temp_module.txt 2>nul
for /f %%i in ('type temp_module.txt ^| find /c /v ""') do set MODULE_ERRORS=%%i

findstr /c:"jest" temp_errors.txt | find /c /v "" > temp_jest.txt 2>nul
for /f %%i in ('type temp_jest.txt ^| find /c /v ""') do set JEST_ERRORS=%%i

findstr /c:"@mikro-orm" temp_errors.txt | find /c /v "" > temp_orm.txt 2>nul
for /f %%i in ('type temp_orm.txt ^| find /c /v ""') do set ORM_ERRORS=%%i

echo   Module resolution errors: %MODULE_ERRORS%
echo   Jest-related errors: %JEST_ERRORS%
echo   MikroORM errors: %ORM_ERRORS%

echo.
echo 🎯 PHASE 2 ASSESSMENT:
if %ERROR_COUNT% leq 3800 (
    echo   ✅ PHASE 2 TARGET ACHIEVED! ^(≤3,800 errors^)
    echo   🚀 Ready for Phase 3 ^(Decorator fixes^)
) else (
    if %ERROR_COUNT% leq 4500 (
        echo   ⚠️ PHASE 2 PARTIAL SUCCESS ^(3,800-4,500 errors^)
        echo   📝 Some improvements made, continue with remaining fixes
    ) else (
        echo   🔄 PHASE 2 NEEDS COMPLETION ^(^>4,500 errors^)
        echo   📋 Run missing Phase 2 steps below
    )
)

echo.
echo 📋 RECOMMENDED ACTIONS:
if %ERROR_COUNT% leq 3800 (
    echo   1. ✅ Proceed to Phase 3: npm run setup-phase3
) else (
    echo   1. Complete missing Phase 2 steps:
    if not exist src\types\global.d.ts echo      - npm run setup-types
    if not exist src\types\mikro-orm.d.ts echo      - npm run fix-mikro-orm
    if not exist src\types\jest.d.ts echo      - npm run fix-jest-types
    echo   2. Validate results: npm run validate-phase2
)

echo.
echo ⚡ QUICK COMMANDS:
echo   Complete Phase 2: npm run setup-types ^&^& npm run fix-mikro-orm ^&^& npm run fix-jest-types
echo   Check progress: npm run validate-phase2
echo   Manual check: npm run type-check

REM Cleanup
del temp_errors.txt temp_count.txt temp_module.txt temp_jest.txt temp_orm.txt 2>nul

pause
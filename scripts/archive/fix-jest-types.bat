@echo off
echo 🧪 PHASE 2: Jest Type Configuration Fixes
echo ========================================

echo.
echo 📝 Fixing Jest import patterns...

REM Fix Jest import patterns
powershell -Command "Get-ChildItem -Path '.' -Recurse -Include '*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $content = $content -replace 'import { jest } from ''@jest/globals'';', '/// ^<reference types=\"jest\" /^>'; $content = $content -replace 'import jest from ''jest'';', '/// ^<reference types=\"jest\" /^>'; Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"Fixed: $($_.Name)\" } }"

echo.
echo 🔧 Creating Jest configuration...

REM Create jest.config.js if it doesn't exist
if not exist jest.config.js (
    (
    echo module.exports = {
    echo   testEnvironment: 'jsdom',
    echo   setupFilesAfterEnv: ['^<rootDir^>/src/setupTests.ts'],
    echo   moduleNameMapping: {
    echo     '^@/^(.*^)$': '^<rootDir^>/src/$1',
    echo   },
    echo   transform: {
    echo     '^.+\.\^(ts^|tsx^)$': 'ts-jest',
    echo   },
    echo   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    echo   collectCoverageFrom: [
    echo     'src/**/*.\^(ts^|tsx^)',
    echo     '!src/**/*.d.ts',
    echo   ],
    echo };
    ) > jest.config.js
    echo ✅ Jest configuration created
)

echo.
echo 📝 Creating test setup file...

REM Create setupTests.ts if it doesn't exist
if not exist src\setupTests.ts (
    powershell -Command "if (!(Test-Path 'src')) { New-Item -ItemType Directory -Path 'src' -Force }"
    (
    echo // Jest setup file
    echo import '@testing-library/jest-dom';
    echo.
    echo // Mock window.matchMedia
    echo Object.defineProperty^(window, 'matchMedia', {
    echo   writable: true,
    echo   value: jest.fn^(^).mockImplementation^(query =^> ^({
    echo     matches: false,
    echo     media: query,
    echo     onchange: null,
    echo     addListener: jest.fn^(^), // deprecated
    echo     removeListener: jest.fn^(^), // deprecated
    echo     addEventListener: jest.fn^(^),
    echo     removeEventListener: jest.fn^(^),
    echo     dispatchEvent: jest.fn^(^),
    echo   }^)^),
    echo }^);
    echo.
    echo // Mock IntersectionObserver
    echo global.IntersectionObserver = class IntersectionObserver {
    echo   constructor^(^) {}
    echo   observe^(^) { return null; }
    echo   disconnect^(^) { return null; }
    echo   unobserve^(^) { return null; }
    echo };
    ) > src\setupTests.ts
    echo ✅ Test setup file created
)

echo.
echo 📊 Creating Jest type declarations...

REM Create Jest specific types
(
echo // Jest and Testing Library Type Declarations
echo import '@testing-library/jest-dom';
echo.
echo declare global {
echo   namespace jest {
echo     interface Matchers^<R^> {
echo       toBeInTheDocument^(^): R;
echo       toHaveClass^(className: string^): R;
echo       toHaveStyle^(style: { [key: string]: any }^): R;
echo       toBeVisible^(^): R;
echo       toBeDisabled^(^): R;
echo       toHaveAttribute^(attr: string, value?: string^): R;
echo       toHaveTextContent^(text: string^): R;
echo     }
echo   }
echo }
echo.
echo // Mock function types
echo declare const jest: {
echo   fn^(^): jest.MockedFunction^<any^>;
echo   spyOn^(object: any, method: string^): jest.SpyInstance;
echo   mock^(moduleName: string^): any;
echo   clearAllMocks^(^): void;
echo   resetAllMocks^(^): void;
echo };
) > src\types\jest.d.ts

echo.
echo ✅ Jest type fixes complete
echo 📊 Expected error reduction: ~150-200 errors

pause
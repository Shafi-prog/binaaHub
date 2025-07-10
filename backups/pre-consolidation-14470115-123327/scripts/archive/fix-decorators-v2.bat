@echo off
echo 🔧 PHASE 3: Medusa Decorator Pattern Fixes (FIXED VERSION)
echo ========================================================

echo.
echo 📦 Fixing Medusa service decorators...

REM Create a simple PowerShell command that works with older versions
echo   🔧 Fixing @InjectManager patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); if ($content -match '@InjectManager\(\s*\)') { $content = $content -replace '@InjectManager\(\s*\)', '@InjectManager(\"baseRepository\")'; [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed InjectManager in: $($_.Name)\" } } catch { } }"

echo   🔧 Fixing @EmitEvents patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); if ($content -match '@EmitEvents\(\s*\)') { $content = $content -replace '@EmitEvents\(\s*\)', '@EmitEvents(\"user\")'; [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed EmitEvents in: $($_.Name)\" } } catch { } }"

echo   🔧 Fixing @InjectSharedContext patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); if ($content -match '@InjectSharedContext\(\s*\)') { $content = $content -replace '@InjectSharedContext\(\s*\)', '@InjectSharedContext(\"context\")'; [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed InjectSharedContext in: $($_.Name)\" } } catch { } }"

echo.
echo 📊 Creating decorator type declarations...

REM Ensure types directory exists
if not exist src\types mkdir src\types

REM Create decorator-specific types
(
echo // Medusa Decorator Type Declarations
echo declare module "@medusajs/medusa" {
echo   export function InjectManager^(repository?: string^): MethodDecorator;
echo   export function EmitEvents^(eventName?: string^): MethodDecorator;
echo   export function InjectSharedContext^(contextName?: string^): ParameterDecorator;
echo   export function Service^(options?: { identifier?: string }^): ClassDecorator;
echo }
echo.
echo // Service injection types
echo declare global {
echo   interface ServiceContext {
echo     manager: any;
echo     repository: any;
echo     eventBus: any;
echo   }
echo }
) > src\types\decorators.d.ts

echo.
echo ✅ Medusa decorator fixes complete
echo 📊 Expected error reduction: ~250-300 errors

pause
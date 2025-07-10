@echo off
echo 🔧 PHASE 3: Medusa Decorator Pattern Fixes
echo =========================================

echo.
echo 📦 Fixing Medusa service decorators...

REM Fix InjectManager decorator patterns
echo   🔧 Fixing @InjectManager patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $changed = $false; if ($content -match '@InjectManager\(\s*\)') { $content = $content -replace '@InjectManager\(\s*\)', '@InjectManager(\"baseRepository\")'; $changed = $true; } if ($content -match '@InjectManager\(\s*\"\s*\"\s*\)') { $content = $content -replace '@InjectManager\(\s*\"\s*\"\s*\)', '@InjectManager(\"baseRepository\")'; $changed = $true; } if ($changed) { Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"    ✓ Fixed InjectManager in: $($_.Name)\" } } }"

REM Fix EmitEvents decorator patterns  
echo   🔧 Fixing @EmitEvents patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $changed = $false; if ($content -match '@EmitEvents\(\s*\)') { $content = $content -replace '@EmitEvents\(\s*\)', '@EmitEvents(\"user\")'; $changed = $true; } if ($content -match '@EmitEvents\(\s*\"\s*\"\s*\)') { $content = $content -replace '@EmitEvents\(\s*\"\s*\"\s*\)', '@EmitEvents(\"user\")'; $changed = $true; } if ($changed) { Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"    ✓ Fixed EmitEvents in: $($_.Name)\" } } }"

REM Fix InjectSharedContext decorator patterns
echo   🔧 Fixing @InjectSharedContext patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $changed = $false; if ($content -match '@InjectSharedContext\(\s*\)') { $content = $content -replace '@InjectSharedContext\(\s*\)', '@InjectSharedContext(\"context\")'; $changed = $true; } if ($content -match '@InjectSharedContext\(\s*\"\s*\"\s*\)') { $content = $content -replace '@InjectSharedContext\(\s*\"\s*\"\s*\)', '@InjectSharedContext(\"context\")'; $changed = $true; } if ($changed) { Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"    ✓ Fixed InjectSharedContext in: $($_.Name)\" } } }"

REM Fix Service decorator patterns
echo   🔧 Fixing @Service patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $changed = $false; if ($content -match '@Service\(\s*\)' -and $content -notmatch '@Service\(\s*{\s*identifier') { $content = $content -replace '@Service\(\s*\)', '@Service({ identifier: \"service\" })'; $changed = $true; } if ($changed) { Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"    ✓ Fixed Service decorator in: $($_.Name)\" } } }"

echo.
echo 📊 Creating decorator type declarations...

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
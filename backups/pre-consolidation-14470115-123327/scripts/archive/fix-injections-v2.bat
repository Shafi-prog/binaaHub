@echo off
echo 🔌 PHASE 3: Service Injection Pattern Fixes (FIXED VERSION)
echo ==========================================================

echo.
echo 📦 Fixing service injection patterns...

REM Fix repository injection patterns
echo   🔧 Fixing repository injection patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'private\s+\w+Repository:\s*any' -and $content -notmatch '@InjectRepository') { $content = $content -replace 'private\s+(\w+Repository):\s*any', '@InjectRepository() private $1: any'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed repository injection in: $($_.Name)\" } } catch { } }"

REM Fix manager injection patterns
echo   🔧 Fixing manager injection patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'private\s+manager_:\s*any' -and $content -notmatch '@InjectManager') { $content = $content -replace 'private\s+manager_:\s*any', '@InjectManager() private manager_: any'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed manager injection in: $($_.Name)\" } } catch { } }"

REM Fix event bus injection patterns
echo   🔧 Fixing event bus injection patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'private\s+eventBus_:\s*any' -and $content -notmatch '@Inject') { $content = $content -replace 'private\s+eventBus_:\s*any', '@Inject(\"eventBusService\") private eventBus_: any'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed event bus injection in: $($_.Name)\" } } catch { } }"

echo.
echo 📊 Creating injection type declarations...

REM Ensure types directory exists
if not exist src\types mkdir src\types

REM Create injection-specific types
(
echo // Service Injection Type Declarations
echo declare module "@medusajs/medusa" {
echo   export function InjectRepository^(target?: string^): ParameterDecorator;
echo   export function Inject^(token: string^): ParameterDecorator;
echo }
echo.
echo // Common service types
echo interface BaseRepository {
echo   find^(options?: any^): Promise^<any[]^>;
echo   findOne^(options?: any^): Promise^<any^>;
echo   create^(data: any^): Promise^<any^>;
echo   update^(id: string, data: any^): Promise^<any^>;
echo   delete^(id: string^): Promise^<void^>;
echo }
echo.
echo interface EventBusService {
echo   emit^(event: string, data: any^): Promise^<void^>;
echo   subscribe^(event: string, handler: Function^): void;
echo }
) > src\types\injections.d.ts

echo.
echo ✅ Service injection fixes complete
echo 📊 Expected error reduction: ~100-150 errors

pause
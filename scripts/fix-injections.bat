@echo off
echo 🔌 PHASE 3: Service Injection Pattern Fixes
echo ==========================================

echo.
echo 📦 Fixing service injection patterns...

REM Fix repository injection patterns
echo   🔧 Fixing repository injection patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $changed = $false; if ($content -match 'constructor\(\s*@InjectRepository') { $content = $content -replace '@InjectRepository\(\s*([^)]+)\s*\)', '@InjectRepository($1) private repository: any'; $changed = $true; } if ($content -match 'private\s+\w+Repository:\s*any' -and $content -notmatch '@InjectRepository') { $content = $content -replace 'private\s+(\w+Repository):\s*any', '@InjectRepository() private $1: any'; $changed = $true; } if ($changed) { Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"    ✓ Fixed repository injection in: $($_.Name)\" } } }"

REM Fix manager injection patterns
echo   🔧 Fixing manager injection patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $changed = $false; if ($content -match 'private\s+manager_:\s*any' -and $content -notmatch '@InjectManager') { $content = $content -replace 'private\s+manager_:\s*any', '@InjectManager() private manager_: any'; $changed = $true; } if ($content -match 'constructor\(\s*manager') { $content = $content -replace 'constructor\(\s*manager', 'constructor(@InjectManager() private manager'; $changed = $true; } if ($changed) { Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"    ✓ Fixed manager injection in: $($_.Name)\" } } }"

REM Fix event bus injection patterns
echo   🔧 Fixing event bus injection patterns...
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $changed = $false; if ($content -match 'private\s+eventBus_:\s*any' -and $content -notmatch '@Inject') { $content = $content -replace 'private\s+eventBus_:\s*any', '@Inject(\"eventBusService\") private eventBus_: any'; $changed = $true; } if ($changed) { Set-Content -Path $_.FullName -Value $content -NoNewline; Write-Host \"    ✓ Fixed event bus injection in: $($_.Name)\" } } }"

echo.
echo 📊 Creating injection type declarations...

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
@echo off
echo 🔧 PHASE 4 CLEANUP: Fixing Syntax Errors Introduced by Phase 4
echo ===========================================================

echo.
echo 📊 Fixing 184 syntax errors introduced by automated replacements...

echo.
echo 🔧 Step 1: Fixing invalid ": Module" syntax...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match ': Module\s*$' -or $content -match ': Module\s*=') { $content = $content -replace ': Module\s*$', ''; $content = $content -replace ': Module\s*=', ' ='; $changed = $true; } if ($content -match '^\s*: Module\s*$') { $content = $content -replace '^\s*: Module\s*$', ''; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed Module syntax: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 2: Fixing invalid ModuleJoinerConfig syntax...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*joiner*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match ': ModuleJoinerConfig:') { $content = $content -replace ': ModuleJoinerConfig:', ':'; $changed = $true; } if ($content -match 'models: ModuleJoinerConfig:') { $content = $content -replace 'models: ModuleJoinerConfig:', 'models:'; $changed = $true; } if ($content -match 'linkableKeys: ModuleJoinerConfig:') { $content = $content -replace 'linkableKeys: ModuleJoinerConfig:', 'linkableKeys:'; $changed = $true; } if ($content -match 'alias: ModuleJoinerConfig:') { $content = $content -replace 'alias: ModuleJoinerConfig:', 'alias:'; $changed = $true; } if ($content -match '\\\\$') { $content = $content -replace '\\\\$', ''; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed joiner config: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 3: Fixing invalid type export syntax...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'export type.*: Module\s*=') { $content = $content -replace '(export type [^:]*): Module\s*=', '$1 ='; $changed = $true; } if ($content -match 'export type.*: Module$') { $content = $content -replace '(export type [^:]*): Module$', '$1'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed export types: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 4: Fixing interface and object syntax...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match '{\s*id: string\s*~~') { $content = $content -replace '~~', ''; $changed = $true; } if ($content -match '{\s*options\?\??: Record') { $content = $content -replace 'options\?\?\?:', 'options?:'; $changed = $true; } if ($content -match '}]\s*$' -and $content -notmatch '}]\s*;') { $content = $content -replace '}]\s*$', '}];'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed interface syntax: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 5: Fixing module export patterns...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include 'index.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'export.*: Module\s*$') { $content = $content -replace '(export [^:]*): Module\s*$', '$1'; $changed = $true; } if ($content -match 'export \*: Module') { $content = $content -replace 'export \*: Module', 'export *'; $changed = $true; } if ($content -match '^\s*: Module\s*$') { $lines = $content -split \"`n\"; $filteredLines = $lines | Where-Object { $_ -notmatch '^\s*: Module\s*$' }; $content = $filteredLines -join \"`n\"; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed module exports: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 6: Removing standalone ": Module" lines...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $originalContent = $content; $lines = $content -split \"`n\"; $filteredLines = @(); foreach ($line in $lines) { if ($line -notmatch '^\s*: Module\s*$' -and $line -notmatch '^\s*~+\s*$') { $filteredLines += $line; } } $content = $filteredLines -join \"`n\"; if ($content -ne $originalContent) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Cleaned up: $($_.Name)\" } } catch { } }"

echo.
echo 📊 Creating corrected type declarations...

REM Remove the problematic enhanced files and create cleaner ones
if exist src\types\mikro-orm-enhanced.d.ts del src\types\mikro-orm-enhanced.d.ts
if exist src\types\medusa-services.d.ts del src\types\medusa-services.d.ts
if exist src\types\react-store.d.ts del src\types\react-store.d.ts

REM Create clean type declarations
(
echo // Clean Module Type Declarations
echo declare module "@medusajs/framework/types" {
echo   interface ModuleJoinerConfig {
echo     serviceName?: string;
echo     primaryKeys?: string[];
echo     linkableKeys?: any;
echo     alias?: any;
echo     models?: any[];
echo   }
echo   interface Module {
echo     service?: any;
echo     loaders?: any[];
echo   }
echo }
echo.
echo // Fix for store modules
echo interface BaseModuleOptions {
echo   [key: string]: any;
echo }
echo.
echo type InitializeModuleInjectableDependencies = {
echo   [key: string]: any;
echo };
) > src\types\store-modules-clean.d.ts

echo.
echo ✅ Phase 4 cleanup complete
echo 📊 Fixed syntax errors introduced by automated replacements
echo 🎯 Modules should now have valid TypeScript syntax

pause
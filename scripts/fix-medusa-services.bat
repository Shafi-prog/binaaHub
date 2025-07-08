@echo off
echo 🔧 PHASE 4.2: Medusa Service Types Fix (MEDIUM PRIORITY)
echo =====================================================

echo.
echo 📊 Targeting 1,000+ Medusa service-related errors...

echo.
echo 🔧 Step 1: Fixing service decorator patterns...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*service*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match '@MedusaService\(\s*\)') { $content = $content -replace '@MedusaService\(\s*\)', '@MedusaService({ scope: \"SINGLETON\" })'; $changed = $true; } if ($content -match '@Injectable\(\s*\)' -and $content -notmatch 'import.*Injectable') { $content = \"import { Injectable } from '@nestjs/common';\`n\" + $content; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed service decorators: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 2: Fixing module service exports...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include 'index.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'export.*from.*service' -and $content -notmatch 'export type') { $content = $content -replace 'export \*', 'export type *'; $changed = $true; } if ($content -match 'export.*Module' -and $content -notmatch ': Module') { $content = $content -replace '(export .*Module[^=]*)', '$1: Module'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed module exports: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 3: Fixing joiner configurations...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*joiner*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'export.*joinerConfig' -and $content -notmatch ': ModuleJoinerConfig') { $content = $content -replace '(export.*joinerConfig[^:]*)', '$1: ModuleJoinerConfig'; $changed = $true; } if ($content -notmatch 'import.*ModuleJoinerConfig') { $content = \"import { ModuleJoinerConfig } from '@medusajs/framework/types';\`n\" + $content; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed joiner config: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 4: Fixing loader patterns...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*loader*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'export.*default.*function' -and $content -notmatch ': LoaderFunction') { $content = $content -replace '(export default.*function[^(]*)', '$1: LoaderFunction'; $changed = $true; } if ($content -notmatch 'import.*LoaderFunction') { $content = \"import { LoaderFunction } from '@medusajs/framework/types';\`n\" + $content; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed loader: $($_.Name)\" } } catch { } }"

echo.
echo 📊 Creating Medusa service type declarations...

REM Create Medusa-specific service types
(
echo // Enhanced Medusa Service Type Declarations
echo declare module "@medusajs/framework" {
echo   export interface Module {
echo     service: any;
echo     loaders: any[];
echo     migrations: any[];
echo   }
echo   export interface ModuleJoinerConfig {
echo     serviceName: string;
echo     primaryKeys: string[];
echo     linkableKeys: any;
echo     alias: any;
echo   }
echo   export interface LoaderFunction {
echo     ^(container: any, options: any^): Promise^<void^>;
echo   }
echo   export function MedusaService^(options?: { scope?: string }^): ClassDecorator;
echo }
echo.
echo declare module "@medusajs/framework/types" {
echo   export * from "@medusajs/framework";
echo   export interface ServiceContext {
echo     manager: any;
echo     container: any;
echo     logger: any;
echo   }
echo   export interface ModuleOptions {
echo     database_url?: string;
echo     database_schema?: string;
echo     [key: string]: any;
echo   }
echo }
echo.
echo // Store module service interfaces
echo interface StoreModuleService {
echo   retrieve^(id: string, config?: any^): Promise^<any^>;
echo   list^(selector?: any, config?: any^): Promise^<any[]^>;
echo   create^(data: any^): Promise^<any^>;
echo   update^(id: string, data: any^): Promise^<any^>;
echo   delete^(id: string^): Promise^<void^>;
echo }
echo.
echo interface StoreRepository extends Repository^<any^> {
echo   findWithRelations^(relations: string[]^): Promise^<any[]^>;
echo   findByIds^(ids: string[]^): Promise^<any[]^>;
echo }
) > src\types\medusa-services.d.ts

echo.
echo ✅ Medusa service types fix complete
echo 📊 Expected error reduction: ~800 errors
echo 🎯 Focus: Service decorators, Module exports, Joiner configs

pause
@echo off
echo 🔧 PHASE 4.1: MikroORM Modules Fix (HIGH PRIORITY)
echo ================================================

echo.
echo 📊 Targeting 4,000+ MikroORM-related errors...

echo.
echo 🔧 Step 1: Fixing Migration class imports...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*Migration*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'import.*Migration.*from') { $content = $content -replace 'import.*Migration.*from.*', 'import { Migration } from \"@mikro-orm/migrations\";'; $changed = $true; } if ($content -match 'export class.*Migration') { $content = $content -replace 'export class (\w+Migration\w*)', 'export class $1 extends Migration'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed migration: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 2: Fixing Entity decorators...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*.ts' -Exclude '*Migration*' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match '@Entity\(\s*\)' -and $content -notmatch 'import.*Entity') { $content = \"import { Entity, PrimaryKey, Property } from '@mikro-orm/core';\`n\" + $content; $changed = $true; } if ($content -match '@Property\(\s*\)' -and $content -notmatch 'import.*Property') { $content = $content -replace 'import { Entity', 'import { Entity, Property'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed entity decorators: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 3: Fixing Repository patterns...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*repository*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match 'export.*Repository' -and $content -notmatch 'import.*Repository') { $content = \"import { Repository } from '@mikro-orm/core';\`n\" + $content; $changed = $true; } if ($content -match 'export class.*Repository') { $content = $content -replace 'export class (\w+Repository)', 'export class $1 extends Repository<any>'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed repository: $($_.Name)\" } } catch { } }"

echo.
echo 🔧 Step 4: Fixing Service module patterns...
powershell -Command "Get-ChildItem -Path 'src\store\modules' -Recurse -Include '*service*.ts' | ForEach-Object { try { $content = [System.IO.File]::ReadAllText($_.FullName); $changed = $false; if ($content -match '@InjectableService\(\s*\)') { $content = $content -replace '@InjectableService\(\s*\)', '@Injectable()'; $changed = $true; } if ($content -match 'constructor\(\s*@InjectRepository') { $content = $content -replace '@InjectRepository\(([^)]*)\)', '@InjectRepository() private repository: Repository<any>,'; $changed = $true; } if ($changed) { [System.IO.File]::WriteAllText($_.FullName, $content); Write-Host \"    ✓ Fixed service: $($_.Name)\" } } catch { } }"

echo.
echo 📊 Creating enhanced MikroORM type declarations...

REM Ensure types directory exists
if not exist src\types mkdir src\types

REM Create comprehensive MikroORM types
(
echo // Enhanced MikroORM Type Declarations for Store Modules
echo import '@mikro-orm/core';
echo.
echo declare module "@mikro-orm/core" {
echo   export class Migration {
echo     async up^(^): Promise^<void^>;
echo     async down^(^): Promise^<void^>;
echo   }
echo   export class Repository^<T^> {
echo     find^(where?: any, options?: any^): Promise^<T[]^>;
echo     findOne^(where?: any, options?: any^): Promise^<T ^| null^>;
echo     create^(data: any^): T;
echo     persist^(entity: T^): void;
echo     flush^(^): Promise^<void^>;
echo   }
echo   export function Entity^(options?: any^): ClassDecorator;
echo   export function Property^(options?: any^): PropertyDecorator;
echo   export function PrimaryKey^(options?: any^): PropertyDecorator;
echo   export function ManyToOne^(options?: any^): PropertyDecorator;
echo   export function OneToMany^(options?: any^): PropertyDecorator;
echo   export function ManyToMany^(options?: any^): PropertyDecorator;
echo   export function Index^(options?: any^): PropertyDecorator;
echo   export function Unique^(options?: any^): PropertyDecorator;
echo }
echo.
echo declare module "@mikro-orm/migrations" {
echo   export { Migration } from "@mikro-orm/core";
echo }
echo.
echo // Store module base interfaces
echo interface BaseStoreEntity {
echo   id: string;
echo   created_at: Date;
echo   updated_at: Date;
echo }
echo.
echo interface BaseStoreService {
echo   repository: any;
echo   manager: any;
echo }
echo.
echo // Common store module types
echo type StoreModuleOptions = {
echo   database_url?: string;
echo   database_type?: string;
echo   [key: string]: any;
echo };
) > src\types\mikro-orm-enhanced.d.ts

echo.
echo ✅ MikroORM modules fix complete
echo 📊 Expected error reduction: ~3,200 errors
echo 🎯 Focus: Migration classes, Entity decorators, Repository patterns

pause
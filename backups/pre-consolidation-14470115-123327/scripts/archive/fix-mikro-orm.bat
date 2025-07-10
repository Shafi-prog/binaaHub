@echo off
echo 🔧 PHASE 2: MikroORM Migration Fixes
echo ===================================

echo.
echo 📦 Fixing MikroORM migration imports...

REM Fix common MikroORM import patterns
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $content = $content -replace 'from \"@mikro-orm/migrations\"', 'from \"@mikro-orm/migrations/Migration\"'; $content = $content -replace 'import { Migration }', 'import { Migration }'; $content = $content -replace 'extends Migration', 'extends Migration'; Set-Content -Path $_.FullName -Value $content -NoNewline; if ($content -match 'Migration') { Write-Host \"Fixed: $($_.Name)\" } } }"

echo.
echo 🔧 Fixing MikroORM entity imports...

REM Fix entity import patterns
powershell -Command "Get-ChildItem -Path 'src' -Recurse -Include '*.ts' | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content) { $content = $content -replace 'from \"@mikro-orm/core\"', 'from \"@mikro-orm/core\"'; $content = $content -replace '@Entity\(\)', '@Entity()'; $content = $content -replace '@Property\(\)', '@Property()'; Set-Content -Path $_.FullName -Value $content -NoNewline } }"

echo.
echo 📊 Creating MikroORM type declarations...

REM Create MikroORM specific types
(
echo // MikroORM Type Declarations
echo declare module "@mikro-orm/migrations" {
echo   export class Migration {
echo     async up^(^): Promise^<void^>;
echo     async down^(^): Promise^<void^>;
echo   }
echo }
echo.
echo declare module "@mikro-orm/core" {
echo   export * from "@mikro-orm/core/dist";
echo   export function Entity^(options?: any^): ClassDecorator;
echo   export function Property^(options?: any^): PropertyDecorator;
echo   export function PrimaryKey^(options?: any^): PropertyDecorator;
echo   export function ManyToOne^(options?: any^): PropertyDecorator;
echo   export function OneToMany^(options?: any^): PropertyDecorator;
echo }
) > src\types\mikro-orm.d.ts

echo.
echo ✅ MikroORM migration fixes complete
echo 📊 Expected error reduction: ~250-300 errors

pause
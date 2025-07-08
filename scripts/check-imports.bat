@echo off
echo 🔍 IMPORT PATTERN ANALYSIS
echo ==========================

echo.
echo 📂 Scanning for remaining relative imports...

echo.
echo 📊 PROVIDER IMPORTS (should be @/providers/):
findstr /s /c:"from \"../../../providers/" src\*.ts src\*.tsx 2>nul | find /c /v ""
findstr /s /c:"from \"../../providers/" src\*.ts src\*.tsx 2>nul | find /c /v ""

echo.
echo 📊 COMPONENT IMPORTS (should be @/components/):
findstr /s /c:"from \"../../../components/" src\*.ts src\*.tsx 2>nul | find /c /v ""
findstr /s /c:"from \"../../components/" src\*.ts src\*.tsx 2>nul | find /c /v ""

echo.
echo 📊 STORE IMPORTS (should be @/store/):
findstr /s /c:"from \"../../../store/" src\*.ts src\*.tsx 2>nul | find /c /v ""
findstr /s /c:"from \"../../store/" src\*.ts src\*.tsx 2>nul | find /c /v ""

echo.
echo 📊 UTILS IMPORTS (should be @/utils/):
findstr /s /c:"from \"../../../utils/" src\*.ts src\*.tsx 2>nul | find /c /v ""
findstr /s /c:"from \"../../utils/" src\*.ts src\*.tsx 2>nul | find /c /v ""

echo.
echo 📊 HOOKS IMPORTS (should be @/hooks/):
findstr /s /c:"from \"../../../hooks/" src\*.ts src\*.tsx 2>nul | find /c /v ""
findstr /s /c:"from \"../../hooks/" src\*.ts src\*.tsx 2>nul | find /c /v ""

echo.
echo 📊 LIB IMPORTS (should be @/lib/):
findstr /s /c:"from \"../../../lib/" src\*.ts src\*.tsx 2>nul | find /c /v ""
findstr /s /c:"from \"../../lib/" src\*.ts src\*.tsx 2>nul | find /c /v ""

echo.
echo 🎯 SUMMARY:
echo If any numbers above are ^>0, those import patterns still need fixing.
echo Run 'npm run fix-imports' to complete the standardization.

echo.
echo ✅ EXAMPLES OF GOOD IMPORTS:
findstr /s /c:"from \"@/" src\*.ts src\*.tsx 2>nul | findstr /v "node_modules" | head -5

pause
@echo off
REM Enhanced Protection for Critical Documentation Files
REM This script sets up multi-layer protection for important roadmap and documentation files

echo 🛡️ Setting up ENHANCED file protection for critical documentation...
echo 📋 Protection layers:
echo    1. Windows file attributes (read-only)
echo    2. Git pre-commit hooks (deletion prevention)
echo    3. File backup creation
echo    4. Hidden backup copies

REM Make critical files read-only in Windows
echo 🔒 Step 1: Setting file attributes...
attrib +R "PLATFORM_FEATURES_ROADMAP.md"
attrib +R "UNIFIED_PLATFORM_COMPLETE.md"
attrib +R "README.md"
attrib +R "package.json"
attrib +R "MEDUSA_COMPLETE_SUCCESS.md"
attrib +R "ERP_SYSTEM_STATUS.md"

REM Create backup directory if it doesn't exist
if not exist "backups" mkdir "backups"
if not exist "backups\.protected" mkdir "backups\.protected"

REM Create timestamped backups
echo 📁 Step 2: Creating backups...
set timestamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
copy "PLATFORM_FEATURES_ROADMAP.md" "backups\PLATFORM_FEATURES_ROADMAP_%timestamp%.md" >nul 2>&1
copy "UNIFIED_PLATFORM_COMPLETE.md" "backups\UNIFIED_PLATFORM_COMPLETE_%timestamp%.md" >nul 2>&1
copy "README.md" "backups\README_%timestamp%.md" >nul 2>&1

REM Create hidden backup copies
echo 🔐 Step 3: Creating hidden backups...
copy "PLATFORM_FEATURES_ROADMAP.md" "backups\.protected\.PLATFORM_FEATURES_ROADMAP.md" >nul 2>&1
copy "UNIFIED_PLATFORM_COMPLETE.md" "backups\.protected\.UNIFIED_PLATFORM_COMPLETE.md" >nul 2>&1
copy "README.md" "backups\.protected\.README.md" >nul 2>&1
attrib +H "backups\.protected"

REM Create git pre-commit hook
echo 🔗 Step 4: Setting up Git hooks...
if not exist ".git\hooks" mkdir ".git\hooks"

echo #!/bin/bash > ".git\hooks\pre-commit"
echo # Enhanced protection against deleting critical files >> ".git\hooks\pre-commit"
echo critical_files=^( >> ".git\hooks\pre-commit"
echo     "PLATFORM_FEATURES_ROADMAP.md" >> ".git\hooks\pre-commit"
echo     "UNIFIED_PLATFORM_COMPLETE.md" >> ".git\hooks\pre-commit"
echo     "README.md" >> ".git\hooks\pre-commit"
echo     "package.json" >> ".git\hooks\pre-commit"
echo     "MEDUSA_COMPLETE_SUCCESS.md" >> ".git\hooks\pre-commit"
echo     "ERP_SYSTEM_STATUS.md" >> ".git\hooks\pre-commit"
echo ^) >> ".git\hooks\pre-commit"
echo. >> ".git\hooks\pre-commit"
echo echo "🔍 Checking for critical file deletions..." >> ".git\hooks\pre-commit"
echo for file in "${critical_files[@]}"; do >> ".git\hooks\pre-commit"
echo     if git diff --cached --name-status ^| grep -q "^^D.*$file"; then >> ".git\hooks\pre-commit"
echo         echo "❌ CRITICAL ERROR: Attempting to delete protected file: $file" >> ".git\hooks\pre-commit"
echo         echo "🛡️  This file is protected from deletion!" >> ".git\hooks\pre-commit"
echo         echo "💡 If you absolutely must delete this file, use: git commit --no-verify" >> ".git\hooks\pre-commit"
echo         echo "⚠️  WARNING: Backup copies exist in backups/.protected/" >> ".git\hooks\pre-commit"
echo         exit 1 >> ".git\hooks\pre-commit"
echo     fi >> ".git\hooks\pre-commit"
echo done >> ".git\hooks\pre-commit"
echo. >> ".git\hooks\pre-commit"
echo echo "✅ No critical files being deleted - commit allowed" >> ".git\hooks\pre-commit"

REM Create recovery script
echo 🔄 Step 5: Creating recovery script...
echo @echo off > "recover-protected-files.bat"
echo REM Recovery script for protected files >> "recover-protected-files.bat"
echo echo 🚑 EMERGENCY FILE RECOVERY >> "recover-protected-files.bat"
echo echo Restoring protected files from backups... >> "recover-protected-files.bat"
echo if exist "backups\.protected\.PLATFORM_FEATURES_ROADMAP.md" ^( >> "recover-protected-files.bat"
echo     copy "backups\.protected\.PLATFORM_FEATURES_ROADMAP.md" "PLATFORM_FEATURES_ROADMAP.md" >> "recover-protected-files.bat"
echo     echo ✅ PLATFORM_FEATURES_ROADMAP.md restored >> "recover-protected-files.bat"
echo ^) else ^( >> "recover-protected-files.bat"
echo     echo ❌ Backup not found for PLATFORM_FEATURES_ROADMAP.md >> "recover-protected-files.bat"
echo ^) >> "recover-protected-files.bat"
echo if exist "backups\.protected\.UNIFIED_PLATFORM_COMPLETE.md" ^( >> "recover-protected-files.bat"
echo     copy "backups\.protected\.UNIFIED_PLATFORM_COMPLETE.md" "UNIFIED_PLATFORM_COMPLETE.md" >> "recover-protected-files.bat"
echo     echo ✅ UNIFIED_PLATFORM_COMPLETE.md restored >> "recover-protected-files.bat"
echo ^) >> "recover-protected-files.bat"
echo if exist "backups\.protected\.README.md" ^( >> "recover-protected-files.bat"
echo     copy "backups\.protected\.README.md" "README.md" >> "recover-protected-files.bat"
echo     echo ✅ README.md restored >> "recover-protected-files.bat"
echo ^) >> "recover-protected-files.bat"
echo pause >> "recover-protected-files.bat"

echo ✅ ENHANCED FILE PROTECTION SETUP COMPLETE!
echo.
echo 🛡️ Protection Summary:
echo ═══════════════════════════════════════════════════════════════
echo 📁 Protected files:
echo    ├─ PLATFORM_FEATURES_ROADMAP.md (read-only + git-protected)
echo    ├─ UNIFIED_PLATFORM_COMPLETE.md (read-only + git-protected)
echo    ├─ README.md (read-only + git-protected)
echo    ├─ package.json (read-only + git-protected)
echo    ├─ MEDUSA_COMPLETE_SUCCESS.md (read-only + git-protected)
echo    └─ ERP_SYSTEM_STATUS.md (read-only + git-protected)
echo.
echo 🔒 Protection Features:
echo    ├─ Read-only file attributes (Windows)
echo    ├─ Git pre-commit hooks (prevents deletion)
echo    ├─ Timestamped backups in /backups/
echo    ├─ Hidden backup copies in /backups/.protected/
echo    └─ Emergency recovery script: recover-protected-files.bat
echo.
echo 🚨 File Deletion Prevention:
echo    ├─ Attempting to delete protected files will be blocked
echo    ├─ Git commits that delete these files will be rejected
echo    └─ Use "git commit --no-verify" only if absolutely necessary
echo.
echo 🔄 Recovery Options:
echo    ├─ Run "recover-protected-files.bat" to restore from backups
echo    ├─ Check /backups/ folder for timestamped versions
echo    └─ Hidden backups available in /backups/.protected/
echo.
echo 💡 Tips:
echo    ├─ To edit protected files: attrib -R filename.md
echo    ├─ After editing: attrib +R filename.md
echo    └─ Run this script again to refresh backups
echo ═══════════════════════════════════════════════════════════════

pause

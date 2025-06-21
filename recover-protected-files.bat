@echo off 
REM Recovery script for protected files 
echo 🚑 EMERGENCY FILE RECOVERY 
echo Restoring protected files from backups... 
if exist "backups\.protected\.PLATFORM_FEATURES_ROADMAP.md" ( 
    copy "backups\.protected\.PLATFORM_FEATURES_ROADMAP.md" "PLATFORM_FEATURES_ROADMAP.md" 
    echo ✅ PLATFORM_FEATURES_ROADMAP.md restored 
) else ( 
    echo ❌ Backup not found for PLATFORM_FEATURES_ROADMAP.md 
) 
if exist "backups\.protected\.UNIFIED_PLATFORM_COMPLETE.md" ( 
    copy "backups\.protected\.UNIFIED_PLATFORM_COMPLETE.md" "UNIFIED_PLATFORM_COMPLETE.md" 
    echo ✅ UNIFIED_PLATFORM_COMPLETE.md restored 
) 
if exist "backups\.protected\.README.md" ( 
    copy "backups\.protected\.README.md" "README.md" 
    echo ✅ README.md restored 
) 
pause 

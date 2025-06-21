# Enhanced File Protection Script (PowerShell)
# Protects critical documentation files from accidental deletion

Write-Host "🛡️ Setting up ENHANCED file protection for critical documentation..." -ForegroundColor Green
Write-Host "📋 Protection layers:" -ForegroundColor Cyan
Write-Host "   1. Windows file attributes (read-only)" -ForegroundColor Yellow
Write-Host "   2. File backup creation" -ForegroundColor Yellow
Write-Host "   3. Hidden backup copies" -ForegroundColor Yellow
Write-Host "   4. Recovery script generation" -ForegroundColor Yellow

# Define critical files to protect
$criticalFiles = @(
    "PLATFORM_FEATURES_ROADMAP.md",
    "UNIFIED_PLATFORM_COMPLETE.md", 
    "README.md",
    "package.json",
    "MEDUSA_COMPLETE_SUCCESS.md",
    "ERP_SYSTEM_STATUS.md"
)

# Step 1: Make files read-only
Write-Host "`n🔒 Step 1: Setting file attributes..." -ForegroundColor Cyan
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Set-ItemProperty -Path $file -Name IsReadOnly -Value $true
        Write-Host "   ✅ $file → Read-only" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $file → Not found" -ForegroundColor Yellow
    }
}

# Step 2: Create backup directories
Write-Host "`n📁 Step 2: Creating backup directories..." -ForegroundColor Cyan
$backupDir = "backups"
$protectedDir = "backups\.protected"

New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
New-Item -ItemType Directory -Force -Path $protectedDir | Out-Null
Write-Host "   ✅ Backup directories created" -ForegroundColor Green

# Step 3: Create timestamped backups
Write-Host "`n📄 Step 3: Creating timestamped backups..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $backupName = "$($file.Split('.')[0])_$timestamp.$($file.Split('.')[1])"
        Copy-Item $file -Destination "$backupDir\$backupName"
        Write-Host "   ✅ $file → $backupName" -ForegroundColor Green
    }
}

# Step 4: Create hidden protected backups
Write-Host "`n🔐 Step 4: Creating hidden backups..." -ForegroundColor Cyan
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination "$protectedDir\.$file"
        Write-Host "   ✅ $file → Hidden backup" -ForegroundColor Green
    }
}

# Make protected directory hidden
$protectedFolder = Get-Item $protectedDir
$protectedFolder.Attributes = $protectedFolder.Attributes -bor [System.IO.FileAttributes]::Hidden

# Step 5: Create recovery script
Write-Host "`n🔄 Step 5: Creating recovery script..." -ForegroundColor Cyan
$recoveryScript = @'
# Emergency File Recovery Script
Write-Host "🚑 EMERGENCY FILE RECOVERY" -ForegroundColor Red
Write-Host "Restoring protected files from backups..." -ForegroundColor Yellow

$criticalFiles = @(
    "PLATFORM_FEATURES_ROADMAP.md",
    "UNIFIED_PLATFORM_COMPLETE.md", 
    "README.md"
)

foreach ($file in $criticalFiles) {
    $backupPath = "backups\.protected\.$file"
    if (Test-Path $backupPath) {
        Copy-Item $backupPath -Destination $file -Force
        Write-Host "✅ $file restored" -ForegroundColor Green
    } else {
        Write-Host "❌ Backup not found for $file" -ForegroundColor Red
    }
}

Write-Host "`nRecovery complete! Press any key to continue..." -ForegroundColor Cyan
Read-Host
'@

$recoveryScript | Out-File -FilePath "recover-protected-files.ps1" -Encoding UTF8
Write-Host "   ✅ Recovery script created: recover-protected-files.ps1" -ForegroundColor Green

# Step 6: Create Git pre-commit hook (if .git exists)
if (Test-Path ".git") {
    Write-Host "`n🔗 Step 6: Setting up Git hooks..." -ForegroundColor Cyan
    $hooksDir = ".git\hooks"
    if (!(Test-Path $hooksDir)) {
        New-Item -ItemType Directory -Path $hooksDir | Out-Null
    }
    
    $preCommitHook = @"
#!/bin/bash
# Enhanced protection against deleting critical files
critical_files=(
    "PLATFORM_FEATURES_ROADMAP.md"
    "UNIFIED_PLATFORM_COMPLETE.md"
    "README.md"
    "package.json"
    "MEDUSA_COMPLETE_SUCCESS.md"
    "ERP_SYSTEM_STATUS.md"
)

echo "🔍 Checking for critical file deletions..."
for file in "`${critical_files[@]}"; do
    if git diff --cached --name-status | grep -q "^D.*`$file"; then
        echo "❌ CRITICAL ERROR: Attempting to delete protected file: `$file"
        echo "🛡️  This file is protected from deletion!"
        echo "💡 If you absolutely must delete this file, use: git commit --no-verify"
        echo "⚠️  WARNING: Backup copies exist in backups/.protected/"
        exit 1
    fi
done

echo "✅ No critical files being deleted - commit allowed"
"@
    
    $preCommitHook | Out-File -FilePath "$hooksDir\pre-commit" -Encoding UTF8
    Write-Host "   ✅ Git pre-commit hook installed" -ForegroundColor Green
}

# Final summary
Write-Host "`n✅ ENHANCED FILE PROTECTION SETUP COMPLETE!" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host "`n🛡️ Protection Summary:" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════════════════════=" -ForegroundColor DarkGray
Write-Host "📁 Protected files:" -ForegroundColor Yellow
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   ├─ $file (read-only + backed up)" -ForegroundColor Green
    }
}

Write-Host "`n🔒 Protection Features:" -ForegroundColor Yellow
Write-Host "   ├─ Read-only file attributes (Windows)" -ForegroundColor White
Write-Host "   ├─ Timestamped backups in /backups/" -ForegroundColor White
Write-Host "   ├─ Hidden backup copies in /backups/.protected/" -ForegroundColor White
Write-Host "   └─ Emergency recovery script: recover-protected-files.ps1" -ForegroundColor White

if (Test-Path ".git") {
    Write-Host "   └─ Git pre-commit hooks (prevents deletion)" -ForegroundColor White
}

Write-Host "`n🔄 Recovery Options:" -ForegroundColor Yellow
Write-Host "   ├─ Run 'recover-protected-files.ps1' to restore from backups" -ForegroundColor White
Write-Host "   ├─ Check /backups/ folder for timestamped versions" -ForegroundColor White
Write-Host "   └─ Hidden backups available in /backups/.protected/" -ForegroundColor White

Write-Host "`n💡 Tips:" -ForegroundColor Yellow
Write-Host "   ├─ To edit protected files: Right-click Properties and uncheck Read-only" -ForegroundColor White
Write-Host "   ├─ After editing: Re-run this script to restore protection" -ForegroundColor White
Write-Host "   └─ Run this script periodically to refresh backups" -ForegroundColor White
Write-Host "══════════════════════════════════════════════════════════════=" -ForegroundColor DarkGray

Write-Host "`nPress any key to continue..." -ForegroundColor Cyan
Read-Host

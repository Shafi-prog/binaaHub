# Simple File Protection Script
Write-Host "🛡️ Setting up file protection..." -ForegroundColor Green

# Critical files to protect
$files = @(
    "PLATFORM_FEATURES_ROADMAP.md",
    "UNIFIED_PLATFORM_COMPLETE.md", 
    "README.md",
    "package.json"
)

# Create backup directory
New-Item -ItemType Directory -Force -Path "backups" | Out-Null
Write-Host "✅ Backup directory created" -ForegroundColor Green

# Process each file
foreach ($file in $files) {
    if (Test-Path $file) {
        # Make read-only
        Set-ItemProperty -Path $file -Name IsReadOnly -Value $true
        
        # Create backup
        $backupName = "$($file.Split('.')[0])_backup.$($file.Split('.')[1])"
        Copy-Item $file -Destination "backups\$backupName" -Force
        
        Write-Host "✅ Protected: $file" -ForegroundColor Green
    }
}

Write-Host "`n🛡️ File Protection Complete!" -ForegroundColor Green
Write-Host "📁 Files are now read-only and backed up in ./backups/" -ForegroundColor Cyan
Write-Host "💡 To edit: Right-click file, Properties, Uncheck Read-only" -ForegroundColor Yellow

Read-Host "`nPress Enter to continue"

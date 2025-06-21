# Emergency File Recovery Script
Write-Host "Emergency File Recovery" -ForegroundColor Red
Write-Host "Restoring files from backups..." -ForegroundColor Yellow

$files = @(
    "PLATFORM_FEATURES_ROADMAP.md",
    "UNIFIED_PLATFORM_COMPLETE.md",
    "README.md"
)

foreach ($file in $files) {
    $backupFile = "backups\$($file.Replace('.', '_backup.'))"
    if (Test-Path $backupFile) {
        # Remove read-only attribute first
        Set-ItemProperty -Path $file -Name IsReadOnly -Value $false -ErrorAction SilentlyContinue
        Copy-Item $backupFile -Destination $file -Force
        Write-Host "Restored: $file" -ForegroundColor Green
    } else {
        Write-Host "Backup not found for: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Recovery complete!" -ForegroundColor Green
Read-Host "Press Enter to continue"

# Simple File Protection Script
Write-Host "Setting up file protection..." -ForegroundColor Green

$files = @(
    "PLATFORM_FEATURES_ROADMAP.md",
    "UNIFIED_PLATFORM_COMPLETE.md", 
    "README.md",
    "package.json"
)

New-Item -ItemType Directory -Force -Path "backups" | Out-Null

foreach ($file in $files) {
    if (Test-Path $file) {
        Set-ItemProperty -Path $file -Name IsReadOnly -Value $true
        $backupName = $file.Replace(".", "_backup.")
        Copy-Item $file -Destination "backups\$backupName" -Force
        Write-Host "Protected: $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "File Protection Complete!" -ForegroundColor Green
Write-Host "Files are now read-only and backed up in backups folder" -ForegroundColor Cyan
Read-Host "Press Enter to continue"
